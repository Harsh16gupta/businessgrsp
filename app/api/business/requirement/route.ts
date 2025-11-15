import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { sendBusinessRequirementEmail } from '@/lib/nodemailer'

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
      proposedBudget, // Per worker per day amount from business
      numberOfDays,   // Number of days for the work
      totalCost       // Calculated total cost (workers × days × rate)
    } = body;

    console.log('📧 API Received data:', body); // Debug log

    // Validate required fields
    if (!companyName || !contactPerson || !email || !phone || !serviceType || !workersNeeded || !duration || !location || !numberOfDays) {
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

      // Calculate negotiated price (total proposed by business)
      const negotiatedPrice = proposedBudget ? parseFloat(proposedBudget) : null;
      
      // Calculate total cost if not provided
      const calculatedTotalCost = totalCost ? parseFloat(totalCost) : 
        (negotiatedPrice && numberOfDays && workersNeeded ? 
          negotiatedPrice * parseInt(workersNeeded) * parseInt(numberOfDays) : null);

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
          negotiatedPrice: negotiatedPrice,
          numberOfDays: parseInt(numberOfDays),
          totalCost: calculatedTotalCost,
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
        workersNeeded: booking.workersNeeded,
        numberOfDays: booking.numberOfDays,
        negotiatedPrice: booking.negotiatedPrice,
        totalCost: booking.totalCost
      });

      // ✅ Send email with ALL data including payment details
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
          proposedBudget: proposedBudget || '',
          numberOfDays: parseInt(numberOfDays),
          totalCost: calculatedTotalCost,
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
          proposedBudget,
          numberOfDays,
          totalCost
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