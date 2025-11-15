// app/api/admin/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { authenticateAdmin, requireAdmin } from '@/lib/auth-admin';

export async function GET(request: NextRequest) {
  try {
    const admin = await authenticateAdmin(request);
    requireAdmin(admin);

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');

    let whereClause = {};
    if (statusFilter && statusFilter !== 'ALL') {
      whereClause = { status: statusFilter };
    }

    const bookings = await prisma.businessBooking.findMany({
      where: whereClause,
      include: {
        business: {
          select: {
            companyName: true,
            name: true,
            phone: true,
          },
        },
        assignments: {
          where: {
            status: 'ACCEPTED'
          },
          include: {
            worker: {
              include: {
                paymentDetails: true // Add payment details
              },
              select: {
                name: true,
                phone: true,
                paymentDetails: true
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Enhance bookings data with payment information
    const enhancedBookings = bookings.map(booking => {
      const totalWorkers = booking.assignments.length;
      const totalPayment = booking.paymentAmount || 0;
      const perWorkerAmount = booking.amountPerWorker || (totalPayment / Math.max(booking.workersNeeded, 1));

      return {
        ...booking,
        paymentSummary: {
          totalPayment,
          perWorkerAmount,
          workersPaid: totalWorkers,
          totalWorkersNeeded: booking.workersNeeded,
          paymentPerWorker: perWorkerAmount
        },
        workersWithPayment: booking.assignments.map(assignment => ({
          workerId: assignment.worker.id,
          workerName: assignment.worker.name,
          workerPhone: assignment.worker.phone,
          upiId: assignment.worker.paymentDetails?.upiId || 'Not set',
          phoneNumber: assignment.worker.paymentDetails?.phoneNumber || 'Not set',
          isVerified: assignment.worker.paymentDetails?.isVerified || false,
          assignmentStatus: assignment.status
        }))
      };
    });

    return NextResponse.json({
      success: true,
      data: enhancedBookings,
    });
  } catch (error: any) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch bookings',
      },
      { status: 500 }
    );
  }
}