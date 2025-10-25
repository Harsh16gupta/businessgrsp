import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { authenticateAdmin, requireAdmin } from '@/lib/auth-admin';

export async function GET(request: NextRequest) {
  try {
    const admin = await authenticateAdmin(request);
    requireAdmin(admin);

    const businesses = await prisma.businessUser.findMany({
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
        _count: {
          select: {
            bookings: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: businesses
    });
  } catch (error: any) {
    console.error('Error fetching businesses:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch businesses'
      },
      { status: 500 }
    );
  }
}