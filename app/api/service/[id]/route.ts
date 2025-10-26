import { NextResponse, NextRequest } from "next/server";
import { AppError, ValidationError, NotFoundError } from "@/lib/utils/error";
import prisma from '@/lib/db'

interface ServiceUpdateData {
    title?: string;
    description?: string;
    category?: string;
    price?: number;
    duration?: number;
    isActive?: boolean;
    updatedAt: Date;
}

// Get single service by service-id
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        if (!id) {
            throw new ValidationError('Service ID is required')
        }
        const service = await prisma.service.findUnique({
            where: { id },
            include: {
                worker: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        rating: true,
                        services: true
                    }
                }
            }
        })
        if (!service) {
            throw new NotFoundError('Service')
        }

        return NextResponse.json({
            success: true,
            data: service
        })

    } catch (error) {
        console.error('Get service error:', error)
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

// Updating the service
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json()
        const { title, description, category, price, duration, isActive } = body
        if (!id) {
            throw new ValidationError("Service ID is required")
        }
        const existingServiceId = await prisma.service.findUnique({
            where: { id }
        })
        if (!existingServiceId) {
            throw new NotFoundError("This service does not exist in database")
        }
        // Prepare update data
        const updateData: ServiceUpdateData = { updatedAt: new Date() };
        if (title !== undefined) updateData.title = title.trim()
        if (description !== undefined) updateData.description = description.trim()
        if (category !== undefined) updateData.category = category.trim()
        if (price !== undefined) {
            if (price <= 0) throw new ValidationError('Price must be greater than 0')
            updateData.price = parseFloat(price)
        }
        if (duration !== undefined) {
            if (duration <= 0) throw new ValidationError('Duration must be greater than 0')
            updateData.duration = parseInt(duration)
        }
        if (isActive !== undefined) updateData.isActive = Boolean(isActive)

        const updatedService = await prisma.service.update({
            where: { id },
            data: updateData,
            include: {
                worker: {
                    select: {
                        id: true,
                        name: true,
                        phone: true
                    }
                }
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Service updated successfully',
            data: updatedService
        })
    }
    catch (error) {
        console.error('Update service error:', error)
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

// isActive(true) ------>  isActive(false)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        if (!id) {
            throw new ValidationError('Service ID is required')
        }

        // Checking if service exists
        const existingService = await prisma.service.findUnique({
            where: { id }
        })

        if (!existingService) {
            throw new NotFoundError('Service')
        }
        // isActive(true) ------>  isActive(false)
        await prisma.service.update({
            where: { id },
            data: {
                isActive: false,
                updatedAt: new Date()
            }
        })
        return NextResponse.json({
            success: true,
            message: 'Service deleted successfully'
        })
    } catch (error) {
        console.error('Delete service error:', error)
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