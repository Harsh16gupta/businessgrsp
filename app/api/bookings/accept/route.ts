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
        OR: [
          { status: 'PENDING' },
          { status: 'ASSIGNED' }
        ]
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
        },
        assignments: {
          where: {
            status: 'ACCEPTED'
          },
          include: {
            worker: {
              select: {
                name: true,
                phone: true
              }
            }
          }
        }
      }
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found or no longer available' },
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

    // Check if worker has already accepted this booking
    if (workerId) {
      const existingAssignment = await prisma.businessBookingAssignment.findFirst({
        where: {
          bookingId: booking.id,
          workerId: workerId,
          status: 'ACCEPTED'
        }
      });

      if (existingAssignment) {
        return NextResponse.json({
          success: false,
          error: 'You have already accepted this booking',
          alreadyAccepted: true
        }, { status: 400 });
      }

      // Check available spots
      const acceptedAssignmentsCount = booking.assignments.length;
      const availableSpots = booking.workersNeeded - acceptedAssignmentsCount;

      if (availableSpots <= 0) {
        return NextResponse.json({
          success: false,
          error: 'All spots for this booking have been filled',
          spotsFilled: true
        }, { status: 400 });
      }

      return await acceptBooking(token, workerId);
    }

    // If no workerId, return booking details with available spots info
    const acceptedAssignmentsCount = booking.assignments.length;
    const availableSpots = booking.workersNeeded - acceptedAssignmentsCount;

    return NextResponse.json({
      success: true,
      data: {
        ...booking,
        availableSpots,
        acceptedWorkers: booking.assignments.length
      },
      message: availableSpots > 0 
        ? `Booking found. ${availableSpots} spot(s) available.` 
        : 'Booking found but all spots are filled.'
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
          OR: [
            { status: 'PENDING' },
            { status: 'ASSIGNED' }
          ]
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
          },
          assignments: {
            where: {
              status: 'ACCEPTED'
            }
          }
        }
      });

      console.log('🔧 Booking found:', booking);

      if (!booking) {
        throw new Error('Booking not found or no longer available');
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

      // Check if worker has already accepted this booking
      const existingAssignment = await tx.businessBookingAssignment.findFirst({
        where: {
          bookingId: booking.id,
          workerId: workerId,
          status: 'ACCEPTED'
        }
      });

      if (existingAssignment) {
        throw new Error('You have already accepted this booking');
      }

      // Check available spots
      const acceptedAssignmentsCount = booking.assignments.length;
      const availableSpots = booking.workersNeeded - acceptedAssignmentsCount;

      if (availableSpots <= 0) {
        throw new Error('All spots for this booking have been filled');
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
              business: true,
              assignments: {
                where: {
                  status: 'ACCEPTED'
                },
                include: {
                  worker: {
                    select: {
                      name: true,
                      phone: true
                    }
                  }
                }
              }
            }
          },
          worker: true
        }
      });

      // Check if all needed workers are assigned
      const newAssignmentsCount = assignment.booking.assignments.length;
      console.log(`🔧 New assignments count: ${newAssignmentsCount}, Workers needed: ${booking.workersNeeded}`);

      // If enough workers accepted, update booking status to ASSIGNED
      if (newAssignmentsCount >= booking.workersNeeded) {
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
    const acceptedWorkers = assignment.booking.assignments.map((a: any) => 
      `• ${a.worker.name} (${a.worker.phone})`
    ).join('\n');

    const businessMessage = `
✅ *New Worker Accepted Your Booking!*

*Service:* ${assignment.booking.serviceType}
*New Worker:* ${assignment.worker.name}
*Worker Phone:* ${assignment.worker.phone}
${assignment.worker.rating ? `*Rating:* ${assignment.worker.rating} ⭐` : ''}

*All Accepted Workers (${assignment.booking.assignments.length}/${assignment.booking.workersNeeded}):*
${acceptedWorkers}

The worker will contact you shortly.

*Booking Details:*
- Date: ${new Date(assignment.booking.createdAt).toLocaleString('en-IN')}
- Location: ${assignment.booking.location}
- Workers Needed: ${assignment.booking.workersNeeded}
- Duration: ${assignment.booking.duration}

${assignment.booking.assignments.length >= assignment.booking.workersNeeded ? 
  '🎉 All required workers have been assigned!' : 
  `Still need ${assignment.booking.workersNeeded - assignment.booking.assignments.length} more worker(s).`
}

Thank you for choosing our service! 🛠️
    `.trim();

    await sendWhatsAppMessage(assignment.booking.business.phone, businessMessage);
    console.log(`✅ Business confirmation sent to: ${assignment.booking.business.phone}`);
  } catch (error) {
    console.error('❌ Failed to send business confirmation:', error);
  }
}