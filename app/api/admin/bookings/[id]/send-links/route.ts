import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { authenticateAdmin, requireAdmin } from '@/lib/auth-admin';
import { sendWhatsAppMessage } from '@/lib/whatsapp';

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
    try {
        const admin = await authenticateAdmin(request);
        requireAdmin(admin);

        const { id } = await params;
        if (!id) {
            return NextResponse.json({ error: 'Booking ID missing' }, { status: 400 });
        }

        // Parse request body for payment amount
        const body = await request.json();
        const paymentAmount = body.paymentAmount as number | undefined;

        console.log("Booking id exist, this is id send-links :::::::::::::::::", id);
        console.log("Payment amount:", paymentAmount);

        // Get the booking with business details
        const booking = await prisma.businessBooking.findUnique({
            where: { id },
            include: {
                business: {
                    select: {
                        companyName: true,
                        name: true,
                        phone: true
                    }
                }
            }
        });

        if (!booking) {
            return NextResponse.json(
                { success: false, error: 'Booking not found' },
                { status: 404 }
            );
        }

        console.log("Booking service type:", booking.serviceType);

        // Convert booking service type to slug format for matching
        const serviceSlug = booking.serviceType.toLowerCase().replace(/[\/\s]+/g, '-');
        console.log("Looking for workers with service slug:", serviceSlug);

        // Find workers who provide this service type (direct slug matching)
        const workers = await prisma.worker.findMany({
            where: {
                services: {
                    has: serviceSlug // Direct string matching with the service slug
                },
                isActive: true
            }
        });

        console.log(`Found ${workers.length} workers for service: ${serviceSlug}`);

        // Debug: Check what services workers actually have
        if (workers.length === 0) {
            const allWorkers = await prisma.worker.findMany({
                where: { isActive: true },
                select: { name: true, phone: true, services: true }
            });
            
            console.log("All active workers and their services:", allWorkers);
            
            return NextResponse.json(
                {
                    success: false,
                    error: 'No workers found for this service type',
                    details: {
                        bookingService: booking.serviceType,
                        searchSlug: serviceSlug,
                        availableWorkers: allWorkers
                    }
                },
                { status: 404 }
            );
        }

        // Create assignment records for all eligible workers
        console.log(`Found ${workers.length} workers, creating assignment records...`);
        try {
            const assignmentPromises = workers.map(async (worker) => {
                // First check if assignment already exists
                const existingAssignment = await prisma.businessBookingAssignment.findFirst({
                    where: {
                        bookingId: id,
                        workerId: worker.id
                    }
                });

                if (existingAssignment) {
                    // Update existing assignment
                    return await prisma.businessBookingAssignment.update({
                        where: { id: existingAssignment.id },
                        data: {
                            status: 'PENDING',
                            updatedAt: new Date()
                        }
                    });
                } else {
                    // Create new assignment
                    return await prisma.businessBookingAssignment.create({
                        data: {
                            bookingId: id,
                            workerId: worker.id,
                            status: 'PENDING'
                        }
                    });
                }
            });

            await Promise.all(assignmentPromises);
            console.log(`✅ Created/updated ${workers.length} assignment records`);
        } catch (assignmentError) {
            console.error('❌ Error creating assignment records:', assignmentError);
        }

        // Update booking with payment amount if provided
        if (paymentAmount) {
            const amountPerWorker = paymentAmount / booking.workersNeeded;
            
            await prisma.businessBooking.update({
                where: { id },
                data: {
                    paymentAmount: paymentAmount,
                    amountPerWorker: amountPerWorker
                }
            });
            console.log(`💰 Updated booking with payment amount: ₹${paymentAmount} (₹${amountPerWorker}/worker)`);
        }

        // Generate accept token if not exists
        let acceptToken = booking.acceptToken;
        if (!acceptToken) {
            acceptToken = Math.random().toString(36).substring(2, 15) +
                Math.random().toString(36).substring(2, 15);

            await prisma.businessBooking.update({
                where: { id },
                data: {
                    acceptToken,
                    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // expires after 24 hours
                }
            });
        }

        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const acceptLink = `${baseUrl}/worker/accept-booking?token=${acceptToken}`;
        console.log("link to accept is :::::::", acceptLink);

        // Calculate payment details for message
        const amountPerWorker = paymentAmount ? (paymentAmount / booking.workersNeeded).toFixed(2) : null;

        // Create WhatsApp message with payment information
        let message = `
🛠️ *NEW BUSINESS BOOKING REQUEST!*

*Service:* ${booking.serviceType}
*Business:* ${booking.business.companyName}
*Contact Person:* ${booking.business.name}
*Location:* ${booking.location}
*Workers Needed:* ${booking.workersNeeded}
*Duration:* ${booking.duration}
`;

        // Add payment information if available
        if (paymentAmount && amountPerWorker) {
            message += `
💰 *Payment Details:*
*Total Amount:* ₹${paymentAmount}
*Amount Per Worker:* ₹${amountPerWorker}
`;
        }

        message += `
⏰ *Accept within 1 hour:* 
${acceptLink}

*Note:* First come, first served!
        `.trim();

        let sentCount = 0;
        const failedSends: string[] = [];

        // Send messages sequentially to avoid rate limiting
        for (const worker of workers) {
            try {
                console.log(`Sending message to worker: ${worker.name} (${worker.phone})`);
                await sendWhatsAppMessage(worker.phone, message);
                sentCount++;
                console.log(`✅ Notification sent to worker: ${worker.name} (${worker.phone})`);

                // Small delay between messages to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error(`❌ Failed to notify worker ${worker.phone}:`, error);
                failedSends.push(worker.phone);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Booking links sent to ${sentCount} workers${failedSends.length > 0 ? `, failed for ${failedSends.length} workers` : ''}${paymentAmount ? ` with payment amount: ₹${paymentAmount}` : ''}`,
            data: {
                workersNotified: sentCount,
                totalWorkers: workers.length,
                failedSends: failedSends,
                paymentAmount: paymentAmount,
                amountPerWorker: amountPerWorker,
                workersFound: workers.map(w => ({ 
                    name: w.name, 
                    phone: w.phone, 
                    services: w.services 
                }))
            }
        });

    } catch (error: any) {
        console.error('Error sending worker links:', error);

        if (error.message === 'Admin access required') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to send worker links',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            },
            { status: 500 }
        );
    }
}