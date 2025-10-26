// app/api/worker/notifications/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

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

        // Get pending assignments for this worker
        const pendingAssignments = await prisma.businessBookingAssignment.findMany({
            where: {
                workerId,
                status: 'PENDING'
            },
            include: {
                booking: {
                    include: {
                        business: {
                            select: {
                                companyName: true,
                                name: true,
                                phone: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Get available bookings that match worker's services
        const worker = await prisma.worker.findUnique({
            where: { id: workerId },
            select: { services: true }
        });

        let availableBookings = [];
        if (worker && worker.services.length > 0) {
            availableBookings = await prisma.businessBooking.findMany({
                where: {
                    status: 'PENDING',
                    serviceType: {
                        in: worker.services
                    },
                    // Exclude bookings where worker already has an assignment
                    assignments: {
                        none: {
                            workerId: workerId
                        }
                    }
                },
                include: {
                    business: {
                        select: {
                            companyName: true,
                            name: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: 10 // Limit to recent 10
            });
        }

        return NextResponse.json({
            success: true,
            data: {
                pendingAssignments,
                availableBookings,
                totalPending: pendingAssignments.length,
                totalAvailable: availableBookings.length
            }
        });

    } catch (error) {
        console.error('Error fetching worker notifications:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch notifications' },
            { status: 500 }
        );
    }
}