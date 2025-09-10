"use client";

import { useCart } from "@/contexts/cart-context";
import { PageLayout } from "@/components/page-layout";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight,
  MapPin,
  ShoppingCart
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CartPage() {
  const { 
    items, 
    updateQuantity, 
    removeFromCart, 
    getTotalItems, 
    getTotalPrice, 
    clearCart 
  } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.role === 'artisan') {
      router.push('/dashboard');
    }
  }, [user, router]);

  const subtotal = getTotalPrice();
  const shipping = subtotal > 1000 ? 0 : 50; // Free shipping over ₹1000
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <PageLayout>
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-6">
              Discover amazing handcrafted products from talented artisans.
            </p>
            <Button asChild size="lg">
              <Link href="/marketplace">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Browse Marketplace
              </Link>
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        title="Shopping Cart"
        description={`${getTotalItems()} ${getTotalItems() === 1 ? 'item' : 'items'} in your cart`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Cart Items</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearCart}
              className="text-red-600 hover:text-red-700"
            >
              Clear All
            </Button>
          </div>

          {items.map((item) => (
            <Card key={item.productId}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="relative w-20 h-20 bg-gray-200 rounded-md flex-shrink-0">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <ShoppingBag className="h-8 w-8" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          by {item.artisan} • {item.region}
                        </div>
                        <div className="mt-2">
                          <span className="text-lg font-bold text-[#FF9933]">
                            ₹{item.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.productId)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                          className="w-20 text-center"
                          min="1"
                          max={item.maxQuantity}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.maxQuantity}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        {item.quantity >= item.maxQuantity && (
                          <Badge variant="secondary" className="text-xs">
                            Max Qty
                          </Badge>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <div className="font-semibold">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-xs text-muted-foreground">
                            ₹{item.price.toLocaleString()} each
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
              
              {subtotal < 1000 && (
                <div className="text-xs text-muted-foreground">
                  Add ₹{(1000 - subtotal).toLocaleString()} more for free shipping
                </div>
              )}
              
              <Separator />
              
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              
              <Button asChild className="w-full bg-[#FF9933] hover:bg-[#FF9933]/90" size="lg">
                <Link href="/checkout">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full">
                <Link href="/marketplace">
                  Continue Shopping
                </Link>
              </Button>
              
              <div className="text-xs text-muted-foreground text-center pt-2">
                Secure checkout • Free returns • 7-day delivery
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
