import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  details: string;
  duration?: string;
  basePrice?: number;
  serviceCharge?: number;
}

interface CartSummaryProps {
  items: CartItem[];
  total: number;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
  isLoading?: boolean;
}

export default function CartSummary({
  items,
  total,
  onIncrement,
  onDecrement,
  onRemove,
  onCheckout,
  isLoading = false
}: CartSummaryProps) {
  if (items.length === 0) {
    return (
      <Card className="lg:sticky lg:top-4 h-fit">
        <CardHeader>
          <CardTitle>Your Cart</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Your cart is empty
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lg:sticky lg:top-4 h-fit">
      <CardHeader>
        <CardTitle>Your Cart ({items.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="space-y-3 border-b pb-4 last:border-0">
            <div className="flex justify-between items-start">
              <div className="space-y-1 flex-1">
                <h4 className="font-medium text-sm">{item.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {item.details}
                </p>
                {item.duration && (
                  <p className="text-xs text-muted-foreground">
                    Duration: {item.duration}
                  </p>
                )}
                {item.basePrice && item.serviceCharge && (
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Base: ₹{item.basePrice}</div>
                    <div>Service: ₹{item.serviceCharge}</div>
                  </div>
                )}
              </div>
              <div className="text-right">
                <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDecrement(item.id)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="text-sm w-6 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onIncrement(item.id)}
                  >
                    +
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(item.id)}
                  className="mt-2 text-red-500 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        <div className="space-y-2 pt-4">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          
          <Button 
            className="w-full" 
            size="lg"
            onClick={onCheckout}
            disabled={isLoading || items.length === 0}
          >
            {isLoading ? "Processing..." : "Book Now & Notify Workers"}
          </Button>
          
          <p className="text-xs text-muted-foreground text-center">
            Workers will be notified via WhatsApp immediately
          </p>
        </div>
      </CardContent>
    </Card>
  );
}