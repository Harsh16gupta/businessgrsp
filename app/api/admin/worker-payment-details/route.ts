import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { authenticateAdmin, requireAdmin } from '@/lib/auth-admin';

export async function GET(request: NextRequest) {
  try {
    const admin = await authenticateAdmin(request);
    requireAdmin(admin);

    const { searchParams } = new URL(request.url);
    const workerId = searchParams.get('workerId');
    const bookingId = searchParams.get('bookingId');

    if (workerId) {
      // Get specific worker's payment details
      const worker = await prisma.worker.findUnique({
        where: { id: workerId },
        include: {
          paymentDetails: true,
          bookings: {
            include: {
              booking: {
                select: {
                  id: true,
                  serviceType: true,
                  status: true,
                  paymentAmount: true,
                  amountPerWorker: true
                }
              }
            }
          }
        }
      });

      if (!worker) {
        return NextResponse.json(
          { success: false, error: 'Worker not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          worker: {
            id: worker.id,
            name: worker.name,
            phone: worker.phone,
            services: worker.services,
            rating: worker.rating
          },
          paymentDetails: worker.paymentDetails,
          bookings: worker.bookings
        }
      });
    }

    if (bookingId) {
      // Get all workers with payment details for a specific booking
      const assignments = await prisma.businessBookingAssignment.findMany({
        where: { 
          bookingId,
          status: 'ACCEPTED'
        },
        include: {
          worker: {
            include: {
              paymentDetails: true
            }
          },
          booking: {
            select: {
              serviceType: true,
              paymentAmount: true,
              amountPerWorker: true,
              numberOfDays: true
            }
          }
        }
      });

      const workersWithPayment = assignments.map(assignment => ({
        assignmentId: assignment.id,
        worker: {
          id: assignment.worker.id,
          name: assignment.worker.name,
          phone: assignment.worker.phone,
          rating: assignment.worker.rating
        },
        paymentDetails: assignment.worker.paymentDetails,
        bookingDetails: assignment.booking,
        assignmentStatus: assignment.status
      }));

      return NextResponse.json({
        success: true,
        data: workersWithPayment
      });
    }

    // Get all workers with payment details
    const workers = await prisma.worker.findMany({
      where: { isActive: true },
      include: {
        paymentDetails: true,
        bookings: {
          include: {
            booking: {
              select: {
                id: true,
                serviceType: true,
                status: true
              }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    const workersWithPayment = workers.map(worker => ({
      id: worker.id,
      name: worker.name,
      phone: worker.phone,
      services: worker.services,
      rating: worker.rating,
      paymentDetails: worker.paymentDetails,
      totalBookings: worker.bookings.length,
      completedBookings: worker.bookings.filter(b => b.booking.status === 'COMPLETED').length
    }));

    return NextResponse.json({
      success: true,
      data: workersWithPayment
    });

  } catch (error: any) {
    console.error('Error fetching worker payment details:', error);
    
    if (error.message === 'Admin access required') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to fetch worker payment details' },
      { status: 500 }
    );
  }
}