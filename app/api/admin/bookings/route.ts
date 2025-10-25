// app/api/admin/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { authenticateAdmin, requireAdmin } from '@/lib/auth-admin';

export async function GET(request: NextRequest) {
  try {
    const admin = await authenticateAdmin(request);
    requireAdmin(admin);

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');

    let whereClause = {};
    if (statusFilter && statusFilter !== 'ALL') {
      whereClause = { status: statusFilter };
    }

    const bookings = await prisma.businessBooking.findMany({
      where: whereClause,
      include: {
        business: {
          select: {
            companyName: true,
            name: true,
            phone: true,
          },
        },
        assignments: {
          include: {
            worker: {
              select: {
                name: true,
                phone: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: bookings,
    });
  } catch (error: any) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch bookings',
      },
      { status: 500 }
    );
  }
}