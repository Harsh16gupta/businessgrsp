
import { NextRequest, NextResponse } from 'next/server';


export async function GET(request: NextRequest) {
  try {
    // This is where you'd fetch data from your database
    // For now, returning mock data
    const checkoutData = {
      items: [
        { id: '1', name: 'Haircut for men', quantity: 1, price: 500 },
        { id: '2', name: 'Beard Trim & Design', quantity: 1, price: 317 },
      ],
      subtotal: 817,
      tax: 0,
      shipping: 0,
      discount: 0,
      total: 817,
      addresses: [
        {
          id: '1',
          name: 'John Doe',
          phone: '+91 8299244451',
          address: '123 Main Street, Apartment 4B',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          isDefault: true,
        },
      ],
      paymentMethods: [
        { id: '1', type: 'upi', name: 'UPI', isDefault: true },
        { id: '2', type: 'card', name: 'Credit/Debit Card', isDefault: false },
        { id: '3', type: 'netbanking', name: 'Net Banking', isDefault: false },
      ],
      coupons: [
        {
          id: '1',
          code: 'WELCOME20',
          description: 'Get 20% off on your first order',
          discount: 20,
          discountType: 'percentage',
          minAmount: 500,
        },
        {
          id: '2',
          code: 'FREESHIP',
          description: 'Free shipping on orders above ₹1000',
          discount: 0,
          discountType: 'fixed',
          minAmount: 1000,
        },
      ],
    };

    return NextResponse.json(checkoutData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch checkout data' },
      { status: 500 }
    );
  }
}