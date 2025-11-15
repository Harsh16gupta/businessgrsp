import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workerId = searchParams.get('workerId');

    if (!workerId) {
      return NextResponse.json(
        { success: false, error: 'Worker ID is required' },
        { status: 400 }
      );
    }

    // Get payment details from database
    const paymentDetails = await prisma.paymentDetails.findUnique({
      where: { workerId },
      select: {
        id: true,
        upiId: true,
        phoneNumber: true,
        bankAccount: true,
        ifscCode: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json({
      success: true,
      data: paymentDetails || {
        upiId: '',
        phoneNumber: '',
        bankAccount: '',
        ifscCode: '',
        isVerified: false
      }
    });
  } catch (error) {
    console.error('Error fetching payment details:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workerId, upiId, phoneNumber, bankAccount, ifscCode } = body;

    if (!workerId) {
      return NextResponse.json(
        { success: false, error: 'Worker ID is required' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!upiId && !phoneNumber) {
      return NextResponse.json(
        { success: false, error: 'Either UPI ID or Phone Number is required' },
        { status: 400 }
      );
    }

    // Validate UPI ID format if provided
    if (upiId && !isValidUPIId(upiId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid UPI ID format' },
        { status: 400 }
      );
    }

    // Validate phone number format if provided
    if (phoneNumber && !isValidPhoneNumber(phoneNumber)) {
      return NextResponse.json(
        { success: false, error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Save or update payment details
    const paymentDetails = await prisma.paymentDetails.upsert({
      where: { workerId },
      update: {
        upiId: upiId || '',
        phoneNumber: phoneNumber || '',
        bankAccount: bankAccount || '',
        ifscCode: ifscCode || '',
        updatedAt: new Date()
      },
      create: {
        workerId,
        upiId: upiId || '',
        phoneNumber: phoneNumber || '',
        bankAccount: bankAccount || '',
        ifscCode: ifscCode || ''
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        upiId: paymentDetails.upiId,
        phoneNumber: paymentDetails.phoneNumber,
        bankAccount: paymentDetails.bankAccount,
        ifscCode: paymentDetails.ifscCode,
        isVerified: paymentDetails.isVerified
      }
    });
  } catch (error) {
    console.error('Error saving payment details:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper functions for validation
function isValidUPIId(upiId: string): boolean {
  const upiRegex = /^[a-zA-Z0-9.\-_]{2,49}@[a-zA-Z]{2,}$/;
  return upiRegex.test(upiId);
}

function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
}