// lib/whatsapp.ts
import twilio from 'twilio';

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_WHATSAPP_FROM;

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

// Send OTP via WhatsApp
export async function sendOTP(to: string, otp: string, userType: 'USER' | 'WORKER') {
  // Format phone number for WhatsApp
  const toFormatted = `whatsapp:+91${to}`; // Assuming Indian numbers
  
  const message = `
🔐 *GRSP - Verification Code*

Your OTP for ${userType === 'WORKER' ? 'Worker' : 'User'} verification is:

🎯 *${otp}*

This code is valid for 2 minutes.

Do not share this OTP with anyone.

Thank you for choosing GRSP! 🛠️
  `.trim();

  try {
    if (!client) {
      // Fallback to console in development
      console.log('📱 WhatsApp OTP (Simulated):');
      console.log(`To: ${to}`);
      console.log(`OTP: ${otp}`);
      console.log(`Message: ${message}`);
      console.log('---');
      return { success: true, simulated: true };
    }

    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to: toFormatted
    });
    
    console.log(`✅ WhatsApp OTP sent to ${to}: ${result.sid}`);
    return { success: true, messageId: result.sid };
  } catch (error: any) {
    console.error('❌ Error sending WhatsApp OTP:', error);
    
    // Fallback to SMS if WhatsApp fails
    try {
      await sendSMS(to, otp, userType);
      return { success: true, fallback: 'sms' };
    } catch (smsError) {
      console.error('❌ SMS fallback also failed:', smsError);
      throw new Error('Failed to send verification code');
    }
  }
}

// SMS Fallback
async function sendSMS(to: string, otp: string, userType: 'USER' | 'WORKER') {
  if (!client) {
    console.log('📞 SMS OTP (Simulated):');
    console.log(`To: ${to}`);
    console.log(`OTP: ${otp}`);
    return { success: true, simulated: true };
  }

  const message = `Your GRSP verification code is ${otp}. Valid for 2 minutes.`;

  const result = await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: `+91${to}`
  });

  console.log(`✅ SMS OTP sent to ${to}: ${result.sid}`);
  return { success: true, messageId: result.sid };
}

// Send general WhatsApp messages (for bookings)
export async function sendWhatsAppMessage(to: string, message: string) {
  const toFormatted = `whatsapp:+91${to}`;

  try {
    if (!client) {
      console.log('📱 WhatsApp Message (Simulated):');
      console.log(`To: ${to}`);
      console.log(`Message: ${message}`);
      return { success: true, simulated: true };
    }

    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to: toFormatted
    });
    
    console.log(`✅ WhatsApp message sent to ${to}: ${result.sid}`);
    return { success: true, messageId: result.sid };
  } catch (error) {
    console.error(`❌ Failed to send WhatsApp to ${to}:`, error);
    throw error;
  }
}

// Verify Twilio configuration
export function checkTwilioConfig() {
  const config = {
    accountSid: !!process.env.TWILIO_ACCOUNT_SID,
    authToken: !!process.env.TWILIO_AUTH_TOKEN,
    fromNumber: !!process.env.TWILIO_WHATSAPP_FROM,
    isConfigured: !!process.env.TWILIO_ACCOUNT_SID && 
                 !!process.env.TWILIO_AUTH_TOKEN && 
                 !!process.env.TWILIO_WHATSAPP_FROM
  };
  
  console.log('🔧 Twilio Configuration:', config);
  return config;
}