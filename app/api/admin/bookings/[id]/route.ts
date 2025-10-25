// app/api/admin/bookings/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { authenticateAdmin, requireAdmin } from '@/lib/auth-admin';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const admin = await authenticateAdmin(request);
    requireAdmin(admin);

    const { id } = await params;
    
    // Validate ID
    if (!id || id === 'undefined') {
      return NextResponse.json(
        { success: false, error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid booking ID format' },
        { status: 400 }
      );
    }

    const booking = await prisma.businessBooking.findUnique({
      where: { id },
      include: {
        business: {
          select: {
            companyName: true,
            name: true,
            phone: true,
            email: true
          }
        },
        assignments: {
          include: {
            worker: {
              select: {
                id: true,
                name: true,
                phone: true,
                rating: true, // ✅ Make sure rating is included
                services: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: booking
    });

  } catch (error: any) {
    console.error('Error fetching booking:', error);

    if (error.code === 'P2023') {
      return NextResponse.json(
        { success: false, error: 'Invalid booking ID' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch booking',
      },
      { status: 500 }
    );
  }
}