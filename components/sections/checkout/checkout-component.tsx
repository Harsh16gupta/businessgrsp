'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/Checkbox';

// Define the missing types
interface CheckoutItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  type: string;
  name: string;
  isDefault: boolean;
}

interface Coupon {
  id: string;
  code: string;
  description: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  minAmount: number;
}

interface CheckoutData {
  items: CheckoutItem[];
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  coupons: Coupon[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  selectedAddress?: string;
  selectedPayment?: string;
  appliedCoupon?: string;
}

interface CheckoutComponentProps {
  data: CheckoutData;
  onPlaceOrder: (orderData: any) => Promise<any>;
}

export default function CheckoutComponent({ data, onPlaceOrder }: CheckoutComponentProps) {
  const [selectedAddress, setSelectedAddress] = useState<string | undefined>(data.selectedAddress);
  const [selectedPayment, setSelectedPayment] = useState<string | undefined>(data.selectedPayment);
  const [appliedCoupon, setAppliedCoupon] = useState<string | undefined>(data.appliedCoupon);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showCoupons, setShowCoupons] = useState(false);

  const handlePlaceOrder = async () => {
    if (!selectedAddress || !selectedPayment) {
      alert('Please select address and payment method');
      return;
    }

    setIsPlacingOrder(true);
    try {
      const orderData = {
        addressId: selectedAddress,
        paymentMethodId: selectedPayment,
        couponCode: appliedCoupon,
        phoneNumber,
        items: data.items,
        total: data.total,
      };
      
      await onPlaceOrder(orderData);
      // Handle success - redirect to success page or show confirmation
    } catch (error) {
      console.error('Order placement failed:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const applyCoupon = (coupon: Coupon) => {
    setAppliedCoupon(coupon.code);
    setShowCoupons(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 animate-in fade-in-0 slide-in-from-top-4 duration-500">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Send booking details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Send booking details to</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="tel"
                placeholder="Phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="max-w-xs"
              />
            </CardContent>
          </Card>

          {/* Address Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Address</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold mb-4">Select an address</h3>
              <div className="space-y-3">
                {data.addresses.map((address: Address) => (
                  <div
                    key={address.id}
                    className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-accent/50 transition-all duration-200 hover:scale-[1.02]"
                    onClick={() => setSelectedAddress(address.id)}
                  >
                    <Checkbox
                      checked={selectedAddress === address.id}
                      onCheckedChange={() => setSelectedAddress(address.id)}
                    />
                    <div className="flex-1">
                      <p className="font-medium">{address.name}</p>
                      <p className="text-sm text-muted-foreground">{address.phone}</p>
                      <p className="text-sm text-muted-foreground">{address.address}</p>
                      <p className="text-sm text-muted-foreground">
                        {address.city}, {address.state} - {address.pincode}
                      </p>
                      {address.isDefault && (
                        <Badge variant="secondary" className="mt-1">
                          Default
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.paymentMethods.map((method: PaymentMethod) => (
                  <div
                    key={method.id}
                    className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-accent/50 transition-all duration-200 hover:scale-[1.02]"
                    onClick={() => setSelectedPayment(method.id)}
                  >
                    <Checkbox
                      checked={selectedPayment === method.id}
                      onCheckedChange={() => setSelectedPayment(method.id)}
                    />
                    <span className="font-medium">{method.name}</span>
                    {method.isDefault && (
                      <Badge variant="secondary">Default</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Services */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Grooming Essentials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data.items.map((item: CheckoutItem) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <span>{item.name} x{item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="mt-4">
                Edit package
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          {/* Coupons */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Coupons and offers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div 
                  className="flex items-center justify-between cursor-pointer p-2 hover:bg-accent/30 rounded-lg transition-colors"
                  onClick={() => setShowCoupons(!showCoupons)}
                >
                  <span>{data.coupons.length} offers available</span>
                  <span className={`transition-transform duration-200 ${showCoupons ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </div>
                
                {showCoupons && (
                  <div className="space-y-2 animate-in fade-in-0 zoom-in-95 duration-300">
                    {data.coupons.map((coupon: Coupon) => (
                      <div
                        key={coupon.id}
                        className="p-3 border rounded-lg cursor-pointer hover:bg-accent/50 transition-all duration-200 hover:scale-[1.02]"
                        onClick={() => applyCoupon(coupon)}
                      >
                        <div className="font-medium">{coupon.code}</div>
                        <div className="text-sm text-muted-foreground">
                          {coupon.description}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {appliedCoupon && (
                  <div className="p-2 bg-green-50 border border-green-200 rounded-lg animate-in fade-in-0 slide-in-from-top-4 duration-300">
                    <div className="text-sm text-green-800">
                      Coupon applied: {appliedCoupon}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{data.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹{data.tax}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{data.shipping}</span>
                </div>
                {data.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{data.discount}</span>
                  </div>
                )}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Amount to pay</span>
                    <span>₹{data.total}</span>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full mt-6" 
                size="lg"
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder || !selectedAddress || !selectedPayment}
              >
                {isPlacingOrder ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  `Pay ₹${data.total}`
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}