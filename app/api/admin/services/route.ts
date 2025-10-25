// app/api/services/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

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