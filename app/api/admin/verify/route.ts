// app/api/admin/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin } from '@/lib/auth-admin';

export async function GET(request: NextRequest) {
  try {
    const admin = await authenticateAdmin(request);
    
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: admin
    });

  } catch (error) {
    console.error('Admin verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Verification failed' },
      { status: 500 }
    );
  }
}