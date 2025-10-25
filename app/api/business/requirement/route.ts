import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { sendBusinessRequirementEmail } from '@/lib/nodemailer'

// In your /api/business/requirement/route.ts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      companyName,
      contactPerson,
      email,
      phone,
      serviceType,
      workersNeeded,
      duration,
      location,
      additionalNotes,
      proposedBudget // ✅ MAKE SURE THIS IS INCLUDED
    } = body;

    console.log('📧 API Received data:', body); // Debug log

    // Validate required fields
    if (!companyName || !contactPerson || !email || !phone || !serviceType || !workersNeeded || !duration || !location) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if business user exists by phone
    const existingBusiness = await prisma.businessUser.findUnique({
      where: { phone }
    });

    if (existingBusiness) {
      // Generate unique acceptToken for each booking
      const acceptToken = Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

      // Set expiry time (1 hour from now)
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      // Business user exists, create the requirement immediately
      const booking = await prisma.businessBooking.create({
        data: {
          businessId: existingBusiness.id,
          serviceType,
          workersNeeded: parseInt(workersNeeded),
          duration,
          location,
          additionalNotes: additionalNotes || '',
          status: 'PENDING',
          acceptToken,
          expiresAt,
          date: new Date()
        },
        include: {
          business: {
            select: {
              name: true,
              companyName: true,
              phone: true,
              email: true
            }
          }
        }
      });

      console.log('✅ Business requirement created:', {
        bookingId: booking.id,
        serviceType: booking.serviceType,
        workersNeeded: booking.workersNeeded
      });

      // ✅ Send email with ALL data including proposedBudget
      try {
        await sendBusinessRequirementEmail({
          companyName,
          contactPerson,
          email,
          phone,
          serviceType,
          workersNeeded: parseInt(workersNeeded),
          duration,
          location,
          additionalNotes: additionalNotes || '',
          proposedBudget: proposedBudget || '', // ✅ INCLUDE BUDGET
          bookingId: booking.id
        });
        console.log('✅ Email sent successfully to admin');
      } catch (emailError) {
        console.error('❌ Failed to send email:', emailError);
        // Don't fail the whole request if email fails
      }

      return NextResponse.json({
        success: true,
        data: booking,
        message: 'Requirement submitted successfully!'
      });
    } else {
      // Business user doesn't exist, return redirect response
      return NextResponse.json({
        success: false,
        redirectTo: '/business-auth',
        requireAuth: true,
        formData: {
          companyName,
          contactPerson,
          email,
          phone,
          serviceType,
          workersNeeded,
          duration,
          location,
          additionalNotes,
          proposedBudget // ✅ INCLUDE BUDGET IN REDIRECT
        },
        message: 'Please create a business account first'
      }, { status: 401 });
    }

  } catch (error: any) {
    console.error('❌ Error submitting requirement:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit requirement',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
// ✅ REMOVE the duplicate email functions from here - they're causing conflicts