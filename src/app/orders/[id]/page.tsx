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
  ArrowLeft,
  Phone,
  CreditCard,
  Calendar,
  Copy,
  Download
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export default function OrderDetailsPage() {
  const { getOrderById } = useOrders();
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  
  const orderId = params.id as string;
  const order = getOrderById(orderId);

  if (!order) {
    return (
      <PageLayout>
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">Order not found</h3>
            <p className="text-muted-foreground mb-6">
              The order you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button asChild>
              <Link href="/orders">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Orders
              </Link>
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

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

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'pending': return 25;
      case 'confirmed': return 50;
      case 'shipped': return 75;
      case 'delivered': return 100;
      default: return 0;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Order ID has been copied to your clipboard.",
    });
  };

  const handleDownloadReceipt = () => {
    // This would typically generate and download a PDF receipt
    toast({
      title: "Receipt downloaded",
      description: "Your order receipt has been downloaded.",
    });
  };

  return (
    <PageLayout>
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/orders">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Link>
        </Button>
      </div>

      <PageHeader
        title={`Order #${order.id}`}
        description={`Placed on ${format(order.orderDate, 'MMMM dd, yyyy')} at ${format(order.orderDate, 'HH:mm')}`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  Order Status
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1 capitalize">{order.status}</span>
                  </Badge>
                </CardTitle>
                {order.trackingId && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Tracking ID:</span>
                    <code className="text-sm bg-muted px-2 py-1 rounded">{order.trackingId}</code>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => copyToClipboard(order.trackingId!)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getStatusProgress(order.status)}%` }}
                  />
                </div>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div className={`space-y-1 ${getStatusProgress(order.status) >= 25 ? 'text-primary' : 'text-muted-foreground'}`}>
                    <Clock className="h-4 w-4 mx-auto" />
                    <div className="text-xs">Pending</div>
                  </div>
                  <div className={`space-y-1 ${getStatusProgress(order.status) >= 50 ? 'text-primary' : 'text-muted-foreground'}`}>
                    <CheckCircle className="h-4 w-4 mx-auto" />
                    <div className="text-xs">Confirmed</div>
                  </div>
                  <div className={`space-y-1 ${getStatusProgress(order.status) >= 75 ? 'text-primary' : 'text-muted-foreground'}`}>
                    <Truck className="h-4 w-4 mx-auto" />
                    <div className="text-xs">Shipped</div>
                  </div>
                  <div className={`space-y-1 ${getStatusProgress(order.status) >= 100 ? 'text-primary' : 'text-muted-foreground'}`}>
                    <Package className="h-4 w-4 mx-auto" />
                    <div className="text-xs">Delivered</div>
                  </div>
                </div>
                {order.estimatedDelivery && order.status !== 'delivered' && (
                  <div className="text-center text-sm text-green-600 font-medium">
                    Expected delivery: {format(order.estimatedDelivery, 'MMMM dd, yyyy')}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Items Ordered ({order.items.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">by {item.artisan}</p>
                      <p className="text-sm text-muted-foreground">from {item.region}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-muted-foreground">Qty: {item.quantity}</span>
                        <span className="text-sm text-muted-foreground">₹{item.price.toLocaleString()} each</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</div>
                      {order.status === 'delivered' && (
                        <Button asChild variant="outline" size="sm" className="mt-2">
                          <Link href={`/products/${item.productId}/review`}>
                            <Star className="h-3 w-3 mr-1" />
                            Rate Product
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{order.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{order.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CreditCard className="h-3 w-3" />
                <span className="capitalize">{order.paymentMethod} payment</span>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="font-medium">{order.shippingAddress.fullName}</div>
              <div className="text-sm text-muted-foreground">
                {order.shippingAddress.address}
              </div>
              <div className="text-sm text-muted-foreground">
                {order.shippingAddress.city}, {order.shippingAddress.state}
              </div>
              <div className="text-sm text-muted-foreground">
                {order.shippingAddress.pincode}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                <Phone className="h-3 w-3" />
                {order.shippingAddress.phone}
              </div>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Order ID</span>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-muted px-2 py-1 rounded">{order.id}</code>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard(order.id)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span>Order Date</span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(order.orderDate, 'MMM dd, yyyy HH:mm')}
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span>Payment Method</span>
                <span className="capitalize">{order.paymentMethod}</span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={handleDownloadReceipt}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Receipt
              </Button>
              {order.status === 'delivered' && (
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href={`/orders/${order.id}/return`}>
                    <Package className="h-4 w-4 mr-2" />
                    Return Items
                  </Link>
                </Button>
              )}
              {(order.status === 'pending' || order.status === 'confirmed') && (
                <Button variant="destructive" className="w-full justify-start">
                  Cancel Order
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
