import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { authenticateAdmin, requireAdmin } from '@/lib/auth-admin';

// GET - Get all workers (simple version)
export async function GET(request: NextRequest) {
  try {
    const admin = await authenticateAdmin(request);
    requireAdmin(admin);

    const workers = await prisma.worker.findMany({
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        services: true,
        rating: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: workers
    });

  } catch (error: any) {
    console.error('Error fetching workers:', error);
    
    if (error.message === 'Admin access required') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch workers'
      },
      { status: 500 }
    );
  }
}