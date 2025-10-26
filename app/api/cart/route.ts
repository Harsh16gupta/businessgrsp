import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// This would typically use a proper cart system, but for simplicity:
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, serviceId, quantity = 1 } = body;

    if (!userId || !serviceId) {
      return NextResponse.json(
        { success: false, error: 'User ID and Service ID are required' },
        { status: 400 }
      );
    }

    // Verify service exists - FIXED: use prisma.service (singular)
    const service = await prisma.service.findUnique({
      where: { id: serviceId, isActive: true }
    });

    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service not found or unavailable' },
        { status: 404 }
      );
    }

    // Calculate total price with service charge
    const SERVICE_CHARGE_PERCENTAGE = 18;
    const MINIMUM_SERVICE_CHARGE = 50;
    
    const serviceCharge = Math.max(
      (service.basePrice * SERVICE_CHARGE_PERCENTAGE) / 100, // FIXED: use basePrice instead of price
      MINIMUM_SERVICE_CHARGE
    );
    
    const totalPrice = service.basePrice + serviceCharge; // FIXED: use basePrice

    // In a real app, you'd store cart items in database
    // For now, we'll return the calculated cart item
    const cartItem = {
      id: service.id,
      serviceId: service.id,
      title: service.name, // FIXED: use name instead of title
      description: service.description,
      basePrice: service.basePrice, // FIXED: use basePrice
      serviceCharge,
      totalPrice,
      quantity,
      duration: service.duration
      // REMOVED: worker info since Service model doesn't have worker relation in your schema
    };

    return NextResponse.json({
      success: true,
      data: cartItem,
      message: 'Service added to cart'
    });

  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to add service to cart',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}