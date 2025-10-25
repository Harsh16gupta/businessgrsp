// app/api/admin/dashboard/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { authenticateAdmin, requireAdmin } from '@/lib/auth-admin';

export async function GET(request: NextRequest) {
  try {
    const admin = await authenticateAdmin(request);
    requireAdmin(admin);

    // Get total counts - handle potential null serviceId
    const [
      totalBookings,
      pendingBookings,
      totalServices,
      activeWorkers,
      totalBusinesses,
      recentBookings
    ] = await Promise.all([
      // Total bookings - count all regardless of serviceId
      prisma.businessBooking.count(),
      
      // Pending bookings
      prisma.businessBooking.count({
        where: { status: 'PENDING' }
      }),
      
      // Active services
      prisma.service.count({
        where: { isActive: true }
      }),
      
      // Active workers
      prisma.worker.count({
        where: { isActive: true }
      }),
      
      // Total businesses
      prisma.businessUser.count(),
      
      // Recent bookings (last 5) - handle potential null serviceId
      prisma.businessBooking.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          business: {
            select: {
              companyName: true,
              name: true
            }
          }
        }
      })
    ]);

    const stats = {
      totalBookings,
      pendingBookings,
      totalServices,
      activeWorkers,
      totalBusinesses,
      recentBookings
    };

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    
    if (error.message === 'Admin access required') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Handle Prisma validation errors
    if (error.code === 'P2032') {
      console.error('Database schema mismatch:', error.meta);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Database configuration issue',
          details: 'Please check your database schema'
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch dashboard stats',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}