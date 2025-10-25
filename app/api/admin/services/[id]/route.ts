// app/api/admin/services/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { authenticateAdmin, requireAdmin } from '@/lib/auth-admin';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get single service
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const admin = await authenticateAdmin(request);
    requireAdmin(admin);

    const { id } = await params; // ✅ AWAIT PARAMS FIRST

    const service = await prisma.service.findUnique({
      where: { id }
    });

    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: service
    });

  } catch (error: any) {
    console.error('Error fetching service:', error);
    
    if (error.message === 'Admin access required') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch service',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// PUT - Update service
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const admin = await authenticateAdmin(request);
    requireAdmin(admin);

    const { id } = await params; // ✅ AWAIT PARAMS FIRST

    const body = await request.json();
    
    const {
      name,
      description,
      category,
      basePrice,
      serviceCharge,
      duration,
      image,
      tags,
      seoKeywords,
      featured,
      isActive,
      popularity
    } = body;

    // Check if service exists
    const existingService = await prisma.service.findUnique({
      where: { id }
    });

    if (!existingService) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }

    const updateData: any = {};
    
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (basePrice !== undefined) updateData.basePrice = parseFloat(basePrice);
    if (serviceCharge !== undefined) updateData.serviceCharge = parseFloat(serviceCharge);
    if (duration !== undefined) updateData.duration = duration;
    if (image !== undefined) updateData.image = image;
    if (tags !== undefined) updateData.tags = tags;
    if (seoKeywords !== undefined) updateData.seoKeywords = seoKeywords;
    if (featured !== undefined) updateData.featured = Boolean(featured);
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);
    if (popularity !== undefined) updateData.popularity = parseInt(popularity);

    const service = await prisma.service.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      data: service,
      message: 'Service updated successfully'
    });

  } catch (error: any) {
    console.error('Error updating service:', error);
    
    if (error.message === 'Admin access required') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'Service name already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update service',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// DELETE - Soft delete service
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const admin = await authenticateAdmin(request);
    requireAdmin(admin);

    const { id } = await params; // ✅ AWAIT PARAMS FIRST

    // Check if service exists
    const existingService = await prisma.service.findUnique({
      where: { id }
    });

    if (!existingService) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }

    // Soft delete by setting isActive to false
    await prisma.service.update({
      where: { id },
      data: { isActive: false }
    });

    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully'
    });

  } catch (error: any) {
    console.error('Error deleting service:', error);
    
    if (error.message === 'Admin access required') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete service',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}