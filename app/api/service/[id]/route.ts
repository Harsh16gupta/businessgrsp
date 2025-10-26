import { NextResponse, NextRequest } from "next/server";
import { AppError, ValidationError, NotFoundError } from "@/lib/utils/error";
import prisma from '@/lib/db'

interface ServiceUpdateData {
    name?: string;
    description?: string;
    category?: string;
    basePrice?: number;
    duration?: string;
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
            where: { id }
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
        const { name, description, category, basePrice, duration, isActive } = body
        
        if (!id) {
            throw new ValidationError("Service ID is required")
        }
        
        const existingServiceId = await prisma.service.findUnique({
            where: { id }
        })
        if (!existingServiceId) {
            throw new NotFoundError("This service does not exist in database")
        }
        
        // Prepare update data - using correct field names and types from your schema
        const updateData: any = { updatedAt: new Date() }; // Using any to avoid type conflicts
        
        if (name !== undefined) updateData.name = name.trim()
        if (description !== undefined) updateData.description = description.trim()
        if (category !== undefined) updateData.category = category.trim()
        if (basePrice !== undefined) {
            if (basePrice <= 0) throw new ValidationError('Price must be greater than 0')
            updateData.basePrice = parseFloat(basePrice)
        }
        if (duration !== undefined) {
            // Keep duration as string since that's what your schema expects
            updateData.duration = duration.toString()
        }
        if (isActive !== undefined) updateData.isActive = Boolean(isActive)

        const updatedService = await prisma.service.update({
            where: { id },
            data: updateData
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