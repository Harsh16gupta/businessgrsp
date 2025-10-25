import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { sendWhatsAppMessage } from '@/lib/whatsapp';

// Service type mapping for different formats
const serviceTypeMapping: { [key: string]: string[] } = {
    "Hotel / Restaurant Staff": ["hotel-restaurant-staff", "hotel-restaurant", "restaurant-staff"],
    "Hospital Staff": ["hospital-staff", "healthcare-staff"],
    "Construction Workers": ["construction-workers", "construction-staff"],
    "Event Staff": ["event-staff", "event-workers"],
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const workerId = searchParams.get('workerId');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Acceptance token is required' },
        { status: 400 }
      );
    }

    const booking = await prisma.businessBooking.findUnique({
      where: { 
        acceptToken: token,
        status: 'PENDING'
      },
      include: {
        business: {
          select: {
            name: true,
            phone: true,
            email: true,
            companyName: true,
            location: true
          }
        }
      }
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found or already processed' },
        { status: 404 }
      );
    }

    // Check if booking expired
    if (booking.expiresAt && new Date() > booking.expiresAt) {
      await prisma.businessBooking.update({
        where: { id: booking.id },
        data: { status: 'EXPIRED' }
      });
      
      return NextResponse.json(
        { success: false, error: 'This booking has expired' },
        { status: 400 }
      );
    }

    // If workerId is provided, check if worker can accept this booking
    if (workerId) {
      const worker = await prisma.worker.findUnique({
        where: { id: workerId }
      });

      if (worker) {
        // Check service compatibility
        const serviceVariations = serviceTypeMapping[booking.serviceType] || [booking.serviceType.toLowerCase()];
        const slugVersion = booking.serviceType.toLowerCase().replace(/[\/\s]+/g, '-');
        if (!serviceVariations.includes(slugVersion)) {
          serviceVariations.push(slugVersion);
        }

        const canAccept = serviceVariations.some(service => 
          worker.services.includes(service)
        );

        if (!canAccept) {
          return NextResponse.json({
            success: false,
            error: `You cannot accept this booking. Your services: ${worker.services.join(', ')}, required: ${booking.serviceType}`
          }, { status: 400 });
        }
      }

      return await acceptBooking(token, workerId);
    }

    // If no workerId, return booking details
    return NextResponse.json({
      success: true,
      data: booking,
      message: 'Booking found. Please provide workerId to accept.'
    });

  } catch (error) {
    console.error('Error accepting booking:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to accept booking',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST - Accept booking with worker authentication
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, workerId } = body;

    if (!token || !workerId) {
      return NextResponse.json(
        { success: false, error: 'Token and worker ID are required' },
        { status: 400 }
      );
    }

    return await acceptBooking(token, workerId);

  } catch (error) {
    console.error('Error accepting booking:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to accept booking',
        message: errorMessage
      },
      { status: 400 }
    );
  }
}

// Common function to accept booking
async function acceptBooking(token: string, workerId: string) {
  console.log('🔧 Starting booking acceptance:', { token, workerId });

  // Verify worker exists
  const worker = await prisma.worker.findUnique({
    where: { 
      id: workerId,
      isActive: true
    }
  });

  console.log('🔧 Worker found:', worker);

  if (!worker) {
    console.log('❌ Worker not found or inactive');
    return NextResponse.json(
      { success: false, error: 'Worker not found or inactive' },
      { status: 404 }
    );
  }

  try {
    // Use a transaction to prevent race conditions
    const result = await prisma.$transaction(async (tx) => {
      console.log('🔧 Looking for booking with token:', token);
      
      const booking = await tx.businessBooking.findUnique({
        where: { 
          acceptToken: token,
          status: 'PENDING'
        },
        include: {
          business: {
            select: {
              name: true,
              phone: true,
              email: true,
              companyName: true,
              location: true
            }
          }
        }
      });

      console.log('🔧 Booking found:', booking);

      if (!booking) {
        throw new Error('Booking not found or already accepted');
      }

      // Check if booking expired
      if (booking.expiresAt && new Date() > booking.expiresAt) {
        console.log('❌ Booking expired');
        await tx.businessBooking.update({
          where: { id: booking.id },
          data: { status: 'EXPIRED' }
        });
        throw new Error('Booking has expired');
      }

      // ✅ FIXED: Use service type mapping for matching
      const serviceVariations = serviceTypeMapping[booking.serviceType] || [booking.serviceType.toLowerCase()];
      const slugVersion = booking.serviceType.toLowerCase().replace(/[\/\s]+/g, '-');
      if (!serviceVariations.includes(slugVersion)) {
        serviceVariations.push(slugVersion);
      }

      console.log('🔧 Checking worker services with variations:', {
        workerServices: worker.services,
        serviceType: booking.serviceType,
        serviceVariations: serviceVariations,
        providesService: serviceVariations.some(service => worker.services.includes(service))
      });

      // Check if worker provides any of the service variations
      const providesService = serviceVariations.some(service => 
        worker.services.includes(service)
      );

      if (!providesService) {
        throw new Error(`Worker does not provide this service. Worker has: ${worker.services.join(', ')}, required: ${booking.serviceType}`);
      }

      console.log('🔧 Creating booking assignment');

      // Create a booking assignment
      const assignment = await tx.businessBookingAssignment.create({
        data: {
          bookingId: booking.id,
          workerId: worker.id,
          status: 'ACCEPTED'
        },
        include: {
          booking: {
            include: {
              business: true
            }
          },
          worker: true
        }
      });

      // Check if all needed workers are assigned
      const assignmentsCount = await tx.businessBookingAssignment.count({
        where: {
          bookingId: booking.id,
          status: 'ACCEPTED'
        }
      });

      console.log(`🔧 Assignments count: ${assignmentsCount}, Workers needed: ${booking.workersNeeded}`);

      // If enough workers accepted, update booking status to ASSIGNED
      if (assignmentsCount >= booking.workersNeeded) {
        await tx.businessBooking.update({
          where: { id: booking.id },
          data: { status: 'ASSIGNED' }
        });
        console.log('✅ Booking status updated to ASSIGNED');
      }

      console.log('✅ Booking assignment created successfully:', assignment);
      return assignment;
    });

    // Send confirmation message to business
    await sendBusinessConfirmation(result);

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Booking accepted successfully! Business has been notified.'
    });

  } catch (error: any) {
    console.error('❌ Transaction error:', error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'You have already accepted this booking',
          message: 'This booking has already been accepted by you'
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to accept booking',
        message: error.message
      },
      { status: 400 }
    );
  }
}

// Send confirmation to business
async function sendBusinessConfirmation(assignment: any) {
  try {
    const businessMessage = `
✅ *Your Booking Has Been Accepted!*

*Service:* ${assignment.booking.serviceType}
*Worker:* ${assignment.worker.name}
*Worker Phone:* ${assignment.worker.phone}
${assignment.worker.rating ? `*Rating:* ${assignment.worker.rating} ⭐` : ''}

The worker will contact you shortly.

*Booking Details:*
- Date: ${new Date(assignment.booking.createdAt).toLocaleString('en-IN')}
- Location: ${assignment.booking.location}
- Workers Needed: ${assignment.booking.workersNeeded}
- Duration: ${assignment.booking.duration}

Thank you for choosing our service! 🛠️
    `.trim();

    await sendWhatsAppMessage(assignment.booking.business.phone, businessMessage);
    console.log(`✅ Business confirmation sent to: ${assignment.booking.business.phone}`);
  } catch (error) {
    console.error('❌ Failed to send business confirmation:', error);
  }
}