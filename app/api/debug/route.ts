// Add this temporary debug route to check authentication
// app/api/admin/debug/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin } from '@/lib/auth-admin';

export async function GET(request: NextRequest) {
  try {
    console.log('🔧 Debug: Checking authentication...');
    
    const admin = await authenticateAdmin(request);
    console.log('🔧 Debug: Admin object:', admin);
    
    if (!admin) {
      return NextResponse.json({
        success: false,
        error: 'No admin found',
        details: 'Authentication failed'
      }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      data: {
        admin,
        message: 'Authentication successful'
      }
    });

  } catch (error: any) {
    console.error('🔧 Debug: Authentication error:', error);
    return NextResponse.json({
      success: false,
      error: 'Authentication failed',
      details: error.message
    }, { status: 500 });
  }
}