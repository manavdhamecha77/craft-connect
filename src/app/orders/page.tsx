"use client";

import { useOrders } from "@/contexts/orders-context";
import { useAuth } from "@/hooks/use-auth";
import { PageLayout } from "@/components/page-layout";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin,
  ShoppingBag,
  Star,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function OrdersPage() {
  const { getCustomerOrders } = useOrders();
  const { user } = useAuth();
  
  const orders = getCustomerOrders('current-customer'); // In real app, use actual customer ID

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <Package className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (orders.length === 0) {
    return (
      <PageLayout>
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-6">
              You haven't placed any orders yet. Start exploring our marketplace!
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
        title="My Orders"
        description={`You have ${orders.length} order${orders.length !== 1 ? 's' : ''}`}
      />

      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Placed on {format(order.orderDate, 'MMM dd, yyyy')}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1 capitalize">{order.status}</span>
                  </Badge>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/orders/${order.id}`}>
                      View Details
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {/* Order Items */}
              <div className="space-y-3 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">
                        by {item.artisan} • Qty: {item.quantity}
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              {/* Order Summary */}
              <div className="flex items-center justify-between text-sm">
                <div className="space-y-1">
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>Delivering to {order.shippingAddress.city}, {order.shippingAddress.state}</span>
                  </div>
                  {order.trackingId && (
                    <div className="text-muted-foreground">
                      Tracking ID: {order.trackingId}
                    </div>
                  )}
                  {order.estimatedDelivery && order.status !== 'delivered' && (
                    <div className="text-green-600">
                      Expected by {format(order.estimatedDelivery, 'MMM dd')}
                    </div>
                  )}
                </div>
                
                <div className="text-right">
                  <div className="font-semibold">
                    Total: ₹{order.totalAmount.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {order.paymentMethod} payment
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              {order.status === 'delivered' && (
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  {order.items.map((item, index) => (
                    <Button 
                      key={index}
                      asChild 
                      variant="outline" 
                      size="sm"
                    >
                      <Link href={`/products/${item.productId}/review`}>
                        <Star className="h-3 w-3 mr-1" />
                        Rate {item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name}
                      </Link>
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
}
