// app/api/worker/notifications/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// Define the type for available bookings
type AvailableBooking = {
    id: string;
    businessId: string;
    serviceId: string | null;
    serviceType: string;
    workersNeeded: number;
    duration: string;
    location: string;
    additionalNotes: string | null;
    status: string;
    negotiatedPrice: number | null;
    createdAt: Date;
    updatedAt: Date;
    acceptToken: string | null;
    expiresAt: Date | null;
    date: Date | null;
    business: {
        companyName: string;
        name: string;
    };
};

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

        // Initialize with proper type
        let availableBookings: AvailableBooking[] = [];
        
        if (worker && worker.services.length > 0) {
            const bookings = await prisma.businessBooking.findMany({
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
            
            availableBookings = bookings as AvailableBooking[];
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