// app/api/admin/services/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { authenticateAdmin, requireAdmin } from '@/lib/auth-admin';

// GET - Get all active services (public route)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    const where: any = {
      isActive: true
    };

    if (category && category !== 'all') {
      where.category = category;
    }

    if (featured === 'true') {
      where.featured = true;
    }

    const services = await prisma.service.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { popularity: 'desc' }
      ]
    });

    return NextResponse.json({
      success: true,
      data: services
    });

  } catch (error: any) {
    console.error('Error fetching services:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch services',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const admin = await authenticateAdmin(request);
    requireAdmin(admin);
    const {
      name,
      description,
      category,
      basePrice,
      serviceCharge = 0,
      duration,
      image = '/images/factory-helper.png',
      tags = [],
      seoKeywords = [],
      featured = false,
      isActive = true,
      popularity = 0
    } = body;

    // Validate required fields
    if (!name || !description || !category || !basePrice || !duration) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, description, category, basePrice, duration' },
        { status: 400 }
      );
    }

    // Check if service with same name already exists
    const existingService = await prisma.service.findFirst({
      where: {
        name: name.trim(),
        isActive: true
      }
    });

    if (existingService) {
      return NextResponse.json(
        { success: false, error: 'Service name already exists' },
        { status: 400 }
      );
    }

    // Create new service
    const service = await prisma.service.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        category: category.trim(),
        basePrice: parseFloat(basePrice),
        serviceCharge: parseFloat(serviceCharge),
        duration: duration.trim(),
        image,
        tags: Array.isArray(tags) ? tags : [],
        seoKeywords: Array.isArray(seoKeywords) ? seoKeywords : [],
        featured: Boolean(featured),
        isActive: Boolean(isActive),
        popularity: parseInt(popularity)
      }
    });

    return NextResponse.json({
      success: true,
      data: service,
      message: 'Service created successfully'
    });

  } catch (error: any) {
    console.error('Error creating service:', error);

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
        error: 'Failed to create service',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}