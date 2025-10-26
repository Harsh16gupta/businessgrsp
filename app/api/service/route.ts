// app/api/service/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET all service categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let whereClause: any = { isActive: true };

    // Filter by category if provided
    if (category && category !== 'all') {
      whereClause.category = category;
    }

    // Search functionality
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search.toLowerCase() } }
      ];
    }

    const services = await prisma.service.findMany({
      where: whereClause,
      orderBy: {
        name: 'asc'
      }
    });

    // Transform to match frontend expectations - FIXED: Add proper typing
    const transformedServices = services.map((service: any) => ({
      id: service.id,
      name: service.name,
      description: service.description,
      category: service.category,
      basePrice: service.basePrice,
      serviceCharge: service.serviceCharge || Math.max((service.basePrice * 18) / 100, 50),
      duration: service.duration,
      image: service.image || "/images/services/default.jpg",
      tags: service.tags,
      seoKeywords: service.seoKeywords || [`${service.name} near me`, service.category, "professional services"],
      popularity: service.popularity || 75,
      featured: service.featured || service.tags.includes('featured'),
      isActive: service.isActive
    }));

    return NextResponse.json({
      success: true,
      data: transformedServices,
      total: transformedServices.length
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch services',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST - Create a new service category (for admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      name,
      category,
      basePrice,
      description,
      image,
      duration,
      tags,
      seoKeywords,
      featured = false
    } = body;

    // Validation
    if (!name || !category || !basePrice || !description || !duration) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
      data: {
        name,
        category,
        basePrice: parseFloat(basePrice),
        serviceCharge: Math.max((parseFloat(basePrice) * 18) / 100, 50),
        description,
        image: image || "/images/services/default.jpg",
        duration,
        tags: tags || [],
        seoKeywords: seoKeywords || [`${name} near me`, category, "professional services"],
        featured: Boolean(featured),
        isActive: true
      }
    });

    return NextResponse.json({
      success: true,
      data: service,
      message: 'Service category created successfully'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating service:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'Service with this name already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create service',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}