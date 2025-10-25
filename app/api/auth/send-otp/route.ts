// app/api/auth/send-otp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { storeOTP } from '@/lib/db/utils';
import { sendOTP, checkTwilioConfig } from '@/lib/whatsapp';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, userType, action, name } = body;

    console.log(`===+ OTP REQUEST +===`);
    console.log(`Phone: ${phone}, Action: ${action}, UserType: ${userType}`);
    console.log(`Name: ${name || 'Not provided'}`);
    if (!['BUSINESS', 'WORKER'].includes(userType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid user type. Only BUSINESS and WORKER are supported.' },
        { status: 400 }
      );
    }
    // Validate required fields
    if (!phone || !userType) {
      return NextResponse.json(
        { success: false, error: 'Phone and user type are required' },
        { status: 400 }
      );
    }

    // Validate phone format (10 digits for India)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 10-digit Indian phone number' },
        { status: 400 }
      );
    }

    // Check Twilio configuration
    const twilioConfig = checkTwilioConfig();
    if (!twilioConfig.isConfigured) {
      console.log('⚠️ Twilio not configured - using simulation mode');
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`📱 Generated OTP for ${phone}: ${code}`);

    // Store OTP in database
    await storeOTP(phone, code, userType);
    console.log(`✅ OTP stored in database for: ${phone}`);

    // TODO: FIX TWILIO SERVICE - Currently skipping due to Twilio 503 errors
    // Send OTP via WhatsApp - temporarily disabled due to service issues
    /*
    try {
      const otpResult = await sendOTP(phone, code, userType);
      console.log(`✅ OTP sent successfully to ${phone}`, otpResult);
    } catch (error:any) {
      console.error(`❌ Failed to send OTP to ${phone}:`, error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to send verification code. Please try again.',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        { status: 500 }
      );
    }
    */

    // TEMPORARY FIX: Skip Twilio and return success with OTP for development
    // TODO: Remove this and uncomment Twilio code above when service is restored
    console.log(`🔧 TEMPORARY: Skipping Twilio, OTP for ${phone}: ${code}`);

    return NextResponse.json({
      success: true,
      message: `Verification code ready for ${phone}`,
      // Include OTP in development for testing - remove in production
      ...(process.env.NODE_ENV === 'development' && { debugOtp: code }),
      simulated: true // Flag to indicate we're in simulation mode
    });

  } catch (error: any) {
    console.error('❌ Error in send-otp:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process OTP request',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check configuration
export async function GET(request: NextRequest) {
  const config = checkTwilioConfig();

  return NextResponse.json({
    success: true,
    twilioConfigured: config.isConfigured,
    // TODO: Remove simulated flag when Twilio is working
    simulated: true, // Temporary flag to indicate simulation mode
    config: {
      accountSid: config.accountSid,
      authToken: config.authToken,
      fromNumber: config.fromNumber
    }
  });
}