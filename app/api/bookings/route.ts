import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { sendWhatsAppMessage } from '@/lib/whatsapp';

// GET bookings - supports both businessId and workerId
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const workerId = searchParams.get('workerId');

    console.log('Bookings API called with:', { businessId, workerId });

    // Handle business bookings
    if (businessId) {
      const bookings = await prisma.businessBooking.findMany({
        where: { businessId },
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
            include: {
              worker: {
                select: {
                  name: true,
                  phone: true,
                  rating: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return NextResponse.json({
        success: true,
        data: bookings
      });
    }

    // Handle worker bookings (NEW)
    if (workerId) {
      const assignments = await prisma.businessBookingAssignment.findMany({
        where: { 
          workerId: workerId,
          status: { in: ['ACCEPTED', 'COMPLETED'] } // Only show accepted/completed assignments
        },
        include: {
          booking: {
            include: {
              business: {
                select: {
                  name: true,
                  phone: true,
                  email: true,
                  companyName: true
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
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Transform data to match the expected format
      const workerBookings = assignments.map(assignment => ({
        id: assignment.booking.id,
        service: {
          name: assignment.booking.serviceType,
          description: `${assignment.booking.serviceType} service`,
          duration: assignment.booking.duration
        },
        user: {
          name: assignment.booking.business.name,
          phone: assignment.booking.business.phone
        },
        date: assignment.booking.date || assignment.booking.createdAt,
        address: assignment.booking.location,
        status: assignment.status,
        totalAmount: assignment.booking.negotiatedPrice || 0,
        specialNotes: assignment.booking.additionalNotes
      }));

      console.log(`Found ${workerBookings.length} bookings for worker ${workerId}`);

      return NextResponse.json({
        success: true,
        data: workerBookings
      });
    }

    // No valid parameters provided
    return NextResponse.json(
      { 
        success: false, 
        error: 'Either businessId or workerId is required' 
      },
      { status: 400 }
    );

  } catch (error:any) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch bookings',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// POST create a new business booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      businessId,
      serviceType,
      date,
      location,
      workersNeeded,
      duration,
      additionalNotes,
      negotiatedPrice
    } = body;

    // Validation
    if (!businessId || !serviceType || !date || !location || !workersNeeded || !duration) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields'
        },
        { status: 400 }
      );
    }

    // Find business
    const business = await prisma.businessUser.findUnique({
      where: { id: businessId }
    });

    if (!business) {
      return NextResponse.json(
        { success: false, error: 'Business not found' },
        { status: 404 }
      );
    }

    // Generate unique acceptance token
    const acceptToken = Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    // Set expiry time (24 hour from now)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Create booking
    const booking = await prisma.businessBooking.create({
      data: {
        businessId,
        serviceType,
        date: new Date(date),
        location,
        workersNeeded: parseInt(workersNeeded),
        duration,
        additionalNotes: additionalNotes || '',
        negotiatedPrice: negotiatedPrice ? parseFloat(negotiatedPrice) : null,
        acceptToken,
        expiresAt,
        status: 'PENDING'
      },
      include: {
        business: {
          select: {
            name: true,
            phone: true,
            email: true,
            companyName: true
          }
        }
      }
    });

    // Convert service type to slug format for worker matching
    const serviceSlug = serviceType.toLowerCase().replace(/[\/\s]+/g, '-');
    console.log(`Looking for workers with service slug: ${serviceSlug}`);

    // Find available workers for the service type
    const availableWorkers = await prisma.worker.findMany({
      where: {
        services: {
          has: serviceSlug // Workers who have this service type in their services array
        },
        isActive: true,
      }
    });

    console.log(`🔧 Found ${availableWorkers.length} available workers for ${serviceType}`);

    // Create assignment records for found workers
    if (availableWorkers.length > 0) {
      const assignmentPromises = availableWorkers.map(worker => 
        prisma.businessBookingAssignment.create({
          data: {
            bookingId: booking.id,
            workerId: worker.id,
            status: 'PENDING'
          }
        })
      );

      await Promise.all(assignmentPromises);
      console.log(`✅ Created ${availableWorkers.length} assignment records`);

      // Send WhatsApp messages to available workers
      await sendBookingNotifications(availableWorkers, booking, serviceType, business, acceptToken);
    } else {
      console.log(`⚠️ No available workers found for service: ${serviceType}`);
    }

    return NextResponse.json({
      success: true,
      data: booking,
      message: availableWorkers.length > 0
        ? `Booking created successfully. ${availableWorkers.length} workers notified.`
        : 'Booking created but no available workers found at the moment.'
    }, { status: 201 });

  } catch (error:any) {
    console.error('❌ Error creating booking:', error);

    // Handle specific Prisma errors
    if (error.code === 'P2023') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid ID format',
          details: 'The business ID format is incorrect'
        },
        { status: 400 }
      );
    }

    if (error.code === 'P2003') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid business',
          details: 'The business does not exist'
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create booking',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// Helper function to send WhatsApp notifications
async function sendBookingNotifications(
  workers: any[],
  booking: any,
  serviceType: string,
  business: any,
  acceptToken: string
) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const acceptLink = `${baseUrl}/worker/accept-booking?token=${acceptToken}`;

  const message = `
🛠️ *NEW BUSINESS BOOKING REQUEST!*

*Service:* ${serviceType}
*Business:* ${business.companyName}
*Contact Person:* ${business.name}
*Phone:* ${business.phone}
*Location:* ${booking.location}
*Date:* ${new Date(booking.date).toLocaleString('en-IN')}
*Workers Needed:* ${booking.workersNeeded}
*Duration:* ${booking.duration}
${booking.negotiatedPrice ? `*Negotiated Price:* ₹${booking.negotiatedPrice}` : ''}

⏰ *Accept within 24 hours:* 
${acceptLink}

*Note:* First come, first served!
    `.trim();

  // Send messages to all workers
  const messagePromises = workers.map(async (worker) => {
    try {
      await sendWhatsAppMessage(worker.phone, message);
      console.log(`✅ Notification sent to worker: ${worker.name} (${worker.phone})`);
      return { success: true, workerId: worker.id };
    } catch (error) {
      console.error(`❌ Failed to notify worker ${worker.phone}:`, error);
      return { success: false, workerId: worker.id, error };
    }
  });

  // Don't block response waiting for all messages
  Promise.allSettled(messagePromises)
    .then(results => {
      const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
      console.log(`📊 WhatsApp notifications: ${successful}/${workers.length} successful`);
    })
    .catch(error => {
      console.error('Error in notification summary:', error);
    });
}