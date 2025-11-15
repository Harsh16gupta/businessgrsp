import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workerId = searchParams.get('workerId');

    if (!workerId) {
      return NextResponse.json(
        { success: false, error: 'Worker ID is required' },
        { status: 400 }
      );
    }

    // Get worker's completed assignments with payment information
    const assignments = await prisma.businessBookingAssignment.findMany({
      where: {
        workerId,
        status: 'COMPLETED'
      },
      include: {
        booking: {
          select: {
            paymentAmount: true,
            workersNeeded: true,
            numberOfDays: true,
            amountPerWorker: true,
            serviceType: true,
            createdAt: true
          }
        }
      }
    });

    // Calculate earnings
    let totalEarnings = 0;
    let paidEarnings = 0;
    let pendingEarnings = 0;

    const earningsBreakdown = assignments.map(assignment => {
      const booking = assignment.booking;
      let earnings = 0;

      if (booking.amountPerWorker && booking.numberOfDays) {
        earnings = booking.amountPerWorker * booking.numberOfDays;
      } else if (booking.paymentAmount && booking.workersNeeded && booking.numberOfDays) {
        earnings = (booking.paymentAmount / booking.workersNeeded / booking.numberOfDays) * booking.numberOfDays;
      }

      totalEarnings += earnings;

      // For now, we'll assume all completed assignments are paid
      // In a real app, you'd have a payment status field
      paidEarnings += earnings;

      return {
        assignmentId: assignment.id,
        bookingId: assignment.bookingId,
        serviceType: booking.serviceType,
        earnings,
        date: assignment.updatedAt,
        status: 'PAID' // You can add payment status to your schema
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        totalEarnings,
        paidEarnings,
        pendingEarnings,
        breakdown: earningsBreakdown
      }
    });
  } catch (error) {
    console.error('Error fetching earnings:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}