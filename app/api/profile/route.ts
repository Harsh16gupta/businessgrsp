import { NextResponse, NextRequest } from "next/server";
import { AppError, ValidationError, NotFoundError } from "@/lib/utils/error";
import prisma from '@/lib/db'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')
        const userType = searchParams.get('userType')

        if (!userId) {
            throw new ValidationError('User ID is required')
        }

        if (!userType || !['BUSINESS', 'WORKER'].includes(userType)) {
            throw new ValidationError('Valid userType (BUSINESS or WORKER) is required')
        }

        let userData = null;

        if (userType === 'BUSINESS') {
            // ✅ FIX: Use businUser instead of user
            userData = await prisma.businessUser.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    phone: true,
                    name: true,
                    email: true,
                    companyName: true,
                    location: true,
                    role: true,
                    isVerified: true,
                    createdAt: true,
                    updatedAt: true,
                    // ✅ FIX: Use bookings (from BusinessBooking relation) instead of Booking
                    bookings: {
                        include: {
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
                        orderBy: { createdAt: 'desc' },
                        take: 5
                    }
                }
            })
        } else if (userType === 'WORKER') {
            userData = await prisma.worker.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    phone: true,
                    name: true,
                    email: true,
                    role: true,
                    services: true,
                    rating: true,
                    isActive: true,
                    isVerified: true,
                    createdAt: true,
                    updatedAt: true,
                    // ✅ FIX: Remove Service (doesn't exist) and use bookings (from BusinessBookingAssignment)
                    bookings: {
                        include: {
                            booking: {
                                include: {
                                    business: {
                                        select: {
                                            name: true,
                                            phone: true,
                                            companyName: true,
                                            location: true
                                        }
                                    }
                                }
                            }
                        },
                        orderBy: { createdAt: 'desc' },
                        take: 5
                    }
                }
            })
        }

        if (!userData) {
            throw new NotFoundError(userType === 'BUSINESS' ? 'Business user' : 'Worker')
        }

        return NextResponse.json({
            success: true,
            data: userData
        })

    } catch (error) {
        console.error('Get profile error:', error)
        if (error instanceof AppError) {
            return NextResponse.json(
                { error: error.message, code: error.code },
                { status: error.statusCode }
            )
        }
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')
        const userType = searchParams.get('userType')

        if (!userId) {
            throw new ValidationError('User ID is required')
        }

        if (!userType || !['BUSINESS', 'WORKER'].includes(userType)) {
            throw new ValidationError('Valid userType (BUSINESS or WORKER) is required')
        }

        const body = await request.json()
        const { name, email, companyName, location } = body

        // Prepare update data
        const updateData: any = {}
        if (name !== undefined) updateData.name = name.trim()
        if (email !== undefined) updateData.email = email?.trim() || null
        
        // ✅ ADD: Business-specific fields
        if (userType === 'BUSINESS') {
            if (companyName !== undefined) updateData.companyName = companyName.trim()
            if (location !== undefined) updateData.location = location.trim()
        }
        
        updateData.updatedAt = new Date()

        let updatedUser = null;

        if (userType === 'BUSINESS') {
            // ✅ FIX: Use businUser instead of user
            // Check if business user exists
            const existingUser = await prisma.businessUser.findUnique({
                where: { id: userId }
            })
            if (!existingUser) {
                throw new NotFoundError('Business user')
            }

            updatedUser = await prisma.businessUser.update({
                where: { id: userId },
                data: updateData,
                select: {
                    id: true,
                    phone: true,
                    name: true,
                    email: true,
                    companyName: true,
                    location: true,
                    role: true,
                    isVerified: true
                }
            })
        } else if (userType === 'WORKER') {
            // Check if worker exists
            const existingWorker = await prisma.worker.findUnique({
                where: { id: userId }
            })
            if (!existingWorker) {
                throw new NotFoundError('Worker')
            }

            updatedUser = await prisma.worker.update({
                where: { id: userId },
                data: updateData,
                select: {
                    id: true,
                    phone: true,
                    name: true,
                    email: true,
                    role: true,
                    services: true,
                    rating: true,
                    isVerified: true
                }
            })
        }

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedUser
        })

    } catch (error) {
        console.error('Update profile error:', error)
        if (error instanceof AppError) {
            return NextResponse.json(
                { error: error.message, code: error.code },
                { status: error.statusCode }
            )
        }
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}