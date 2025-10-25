import { verifyCode, findorCreateWorker } from '@/lib/db/utils';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// Add this function since it's missing
async function findorCreateBusiness(phone: string, name: string, email: string, companyName: string, location: string) {
  try {
    let business = await prisma.businessUser.findUnique({
      where: { phone }
    })

    if (!business) {
      business = await prisma.businessUser.create({
        data: {
          phone: phone,
          name: name,
          email: email,
          companyName: companyName,
          location: location,
          role: 'BUSINESS'
        }
      })
      console.log(`Business user created successfully, ${phone}`);
    } else {
      console.log(`Business user already exist, ${phone}`);
    }
    return business;
  } catch (error) {
    console.error("Error in creating or Finding Business User", error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, otp, userType, action, name, services, companyName, email, location } = body;

    console.log(`===+ VERIFICATION REQUEST +===`);
    console.log(`Phone: ${phone}, Action: ${action}, UserType: ${userType}`);
    console.log(`OTP: ${otp}, Name: ${name || 'Not provided'}`);
    console.log(`Services: ${services ? services.join(', ') : 'Not provided'}`);
    console.log(`Business Data - Company: ${companyName}, Email: ${email}, Location: ${location}`);

    // Validate required fields
    if (!phone || !otp || !userType) {
      return NextResponse.json(
        { success: false, error: 'Phone, OTP and user type are required' },
        { status: 400 }
      );
    }

    // Validate OTP format
    const otpRegex = /^\d{6}$/;
    if (!otpRegex.test(otp)) {
      return NextResponse.json(
        { success: false, error: 'Invalid OTP format' },
        { status: 400 }
      );
    }

    // Verify OTP
    const isVerified = await verifyCode(phone, userType, otp);

    if (!isVerified) {
      console.log(`❌ OTP verification failed for: ${phone}`);
      return NextResponse.json(
        { success: false, error: 'Invalid or expired verification code' },
        { status: 400 }
      );
    }

    console.log(`✅ OTP verified successfully for: ${phone}`);

    // Create or find worker/business (USER type removed)
    let userData;

    // In the worker creation section, replace this part:
    if (userType === 'WORKER') {
      // For workers, handle service selection in registration flow
      if (action === 'register' && name) {
        let servicesArray = [];
        if (services && Array.isArray(services)) {
          // Services now come as slugs like "hotel-restaurant-staff"
          servicesArray = services;
        } else if (services && typeof services === 'string') {
          servicesArray = services.split(',').map(s => s.trim());
        }

        console.log(`🔧 Creating worker with services:`, servicesArray);
        userData = await findorCreateWorker(phone, name, servicesArray);
      } else {
        userData = await findorCreateWorker(phone, name);
      }
    } else if (userType === 'BUSINESS') {
      // For business users
      if (action === 'register') {
        if (!companyName || !email || !location) {
          return NextResponse.json(
            { success: false, error: 'Company name, email and location are required for business registration' },
            { status: 400 }
          );
        }
        userData = await findorCreateBusiness(phone, name, email, companyName, location);
      } else {
        // For business login, just find the business
        userData = await prisma.businessUser.findUnique({ where: { phone } });
        if (!userData) {
          return NextResponse.json(
            { success: false, error: 'Business account not found. Please register first.' },
            { status: 400 }
          );
        }
      }
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid user type. Only BUSINESS and WORKER are supported.' },
        { status: 400 }
      );
    }

    console.log(`✅ ${userType} ${action} successful:`, userData);

    // Remove sensitive data from response
    const { verificationCode, codeExpiresAt, ...safeUserData } = userData;

    return NextResponse.json({
      success: true,
      message: `${action === 'login' ? 'Login' : 'Registration'} successful!`,
      user: safeUserData
    });

  } catch (error: any) {
    console.error('❌ Error in verify-otp:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Verification failed',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}