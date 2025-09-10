"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/cart-context";
import { useOrders } from "@/contexts/orders-context";
import { PageLayout } from "@/components/page-layout";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { 
  CreditCard, 
  Smartphone, 
  Truck,
  MapPin,
  ShoppingBag,
  Lock,
  CheckCircle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function CheckoutPage() {
  const { items, getTotalItems, getTotalPrice, clearCart } = useCart();
  const { createOrder } = useOrders();
  const router = useRouter();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card');
  
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    // Payment fields
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    upiId: ''
  });

  const subtotal = getTotalPrice();
  const shipping = subtotal > 1000 ? 0 : 50;
  const total = subtotal + shipping;

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.fullName || !formData.address || !formData.city || 
        !formData.state || !formData.pincode || !formData.phone) {
      toast({
        title: "Missing information",
        description: "Please fill in all shipping address fields.",
        variant: "destructive"
      });
      return false;
    }

    if (paymentMethod === 'card') {
      if (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardName) {
        toast({
          title: "Missing payment information",
          description: "Please fill in all card details.",
          variant: "destructive"
        });
        return false;
      }
    }

    if (paymentMethod === 'upi' && !formData.upiId) {
      toast({
        title: "Missing UPI ID",
        description: "Please enter your UPI ID.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const shippingAddress = {
        fullName: formData.fullName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        phone: formData.phone
      };

      const orderId = await createOrder(items, shippingAddress, paymentMethod);
      
      // Clear cart after successful order
      clearCart();
      
      // Redirect to order confirmation
      router.push(`/orders/${orderId}`);
      
    } catch (error) {
      toast({
        title: "Order failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PageLayout>
      <PageHeader
        title="Checkout"
        description="Review your order and complete your purchase"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+91 12345 67890"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="House number, street name, area"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="City"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="State"
                  />
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    placeholder="123456"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                <div className="flex items-center space-x-2 p-3 border rounded-md">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center cursor-pointer">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Credit/Debit Card
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 p-3 border rounded-md">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi" className="flex items-center cursor-pointer">
                    <Smartphone className="h-4 w-4 mr-2" />
                    UPI Payment
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 p-3 border rounded-md">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod" className="flex items-center cursor-pointer">
                    <Truck className="h-4 w-4 mr-2" />
                    Cash on Delivery
                  </Label>
                </div>
              </RadioGroup>

              {/* Payment Form Fields */}
              {paymentMethod === 'card' && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-md">
                  <div>
                    <Label htmlFor="cardName">Cardholder Name *</Label>
                    <Input
                      id="cardName"
                      value={formData.cardName}
                      onChange={(e) => handleInputChange('cardName', e.target.value)}
                      placeholder="Name on card"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date *</Label>
                      <Input
                        id="expiryDate"
                        value={formData.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        value={formData.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value)}
                        placeholder="123"
                        maxLength={3}
                        type="password"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="p-4 bg-gray-50 rounded-md">
                  <Label htmlFor="upiId">UPI ID *</Label>
                  <Input
                    id="upiId"
                    value={formData.upiId}
                    onChange={(e) => handleInputChange('upiId', e.target.value)}
                    placeholder="yourname@paytm"
                  />
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="p-4 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-700">
                    You can pay in cash when your order is delivered. Additional ₹20 COD charges may apply.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Items */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{item.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.artisan} • Qty: {item.quantity}
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({getTotalItems()} items)</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `₹${shipping}`
                    )}
                  </span>
                </div>
                
                {paymentMethod === 'cod' && (
                  <div className="flex justify-between text-sm">
                    <span>COD Charges</span>
                    <span>₹20</span>
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>₹{(total + (paymentMethod === 'cod' ? 20 : 0)).toLocaleString()}</span>
              </div>
              
              <Button 
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full bg-[#FF9933] hover:bg-[#FF9933]/90" 
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Place Order
                  </>
                )}
              </Button>
              
              <div className="text-xs text-muted-foreground text-center">
                <Lock className="h-3 w-3 inline mr-1" />
                Secure checkout • 256-bit SSL encryption
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
