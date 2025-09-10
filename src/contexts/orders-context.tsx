"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { CartItem } from "./cart-context";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  artisan: string;
  region: string;
}

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  paymentMethod: 'card' | 'upi' | 'cod';
  orderDate: Date;
  estimatedDelivery?: Date;
  trackingId?: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  customerId: string;
  customerName: string;
  orderId: string;
  rating: number;
  comment: string;
  reviewDate: Date;
}

interface OrdersContextType {
  orders: Order[];
  reviews: ProductReview[];
  createOrder: (items: CartItem[], shippingAddress: Order['shippingAddress'], paymentMethod: Order['paymentMethod']) => Promise<string>;
  getOrderById: (orderId: string) => Order | undefined;
  getCustomerOrders: (customerId: string) => Order[];
  addReview: (review: Omit<ProductReview, 'id' | 'reviewDate'>) => void;
  getProductReviews: (productId: string) => ProductReview[];
  getProductAverageRating: (productId: string) => number;
  canReviewProduct: (customerId: string, productId: string) => boolean;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<ProductReview[]>([]);

  // Load orders and reviews from localStorage on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    const savedReviews = localStorage.getItem('reviews');
    
    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders).map((order: any) => ({
          ...order,
          orderDate: new Date(order.orderDate),
          estimatedDelivery: order.estimatedDelivery ? new Date(order.estimatedDelivery) : undefined
        }));
        setOrders(parsedOrders);
      } catch (error) {
        console.error('Error loading orders from localStorage:', error);
      }
    }

    if (savedReviews) {
      try {
        const parsedReviews = JSON.parse(savedReviews).map((review: any) => ({
          ...review,
          reviewDate: new Date(review.reviewDate)
        }));
        setReviews(parsedReviews);
      } catch (error) {
        console.error('Error loading reviews from localStorage:', error);
      }
    }
  }, []);

  // Save orders to localStorage whenever orders change
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  // Save reviews to localStorage whenever reviews change
  useEffect(() => {
    localStorage.setItem('reviews', JSON.stringify(reviews));
  }, [reviews]);

  const createOrder = async (
    items: CartItem[], 
    shippingAddress: Order['shippingAddress'], 
    paymentMethod: Order['paymentMethod']
  ): Promise<string> => {
    const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const orderDate = new Date();
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(orderDate.getDate() + 7); // 7 days delivery

    const orderItems: OrderItem[] = items.map(item => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      artisan: item.artisan,
      region: item.region
    }));

    const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);

    const newOrder: Order = {
      id: orderId,
      customerId: 'current-customer', // In a real app, this would come from auth
      items: orderItems,
      totalAmount,
      status: 'pending',
      shippingAddress,
      paymentMethod,
      orderDate,
      estimatedDelivery,
      trackingId: `TRK${Date.now()}`
    };

    setOrders(currentOrders => [...currentOrders, newOrder]);

    // Simulate payment processing
    setTimeout(() => {
      setOrders(currentOrders =>
        currentOrders.map(order =>
          order.id === orderId ? { ...order, status: 'confirmed' } : order
        )
      );
    }, 2000);

    toast({
      title: "Order placed successfully!",
      description: `Order ${orderId} has been placed. You'll receive a confirmation shortly.`
    });

    return orderId;
  };

  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  const getCustomerOrders = (customerId: string) => {
    return orders
      .filter(order => order.customerId === customerId)
      .sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime());
  };

  const addReview = (review: Omit<ProductReview, 'id' | 'reviewDate'>) => {
    const newReview: ProductReview = {
      ...review,
      id: `REVIEW-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      reviewDate: new Date()
    };

    setReviews(currentReviews => [...currentReviews, newReview]);

    toast({
      title: "Review added!",
      description: "Thank you for your feedback. It helps other customers and artisans."
    });
  };

  const getProductReviews = (productId: string) => {
    return reviews
      .filter(review => review.productId === productId)
      .sort((a, b) => b.reviewDate.getTime() - a.reviewDate.getTime());
  };

  const getProductAverageRating = (productId: string) => {
    const productReviews = getProductReviews(productId);
    if (productReviews.length === 0) return 0;
    
    const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((totalRating / productReviews.length) * 10) / 10; // Round to 1 decimal
  };

  const canReviewProduct = (customerId: string, productId: string) => {
    // Check if customer has ordered this product and it's delivered
    const customerOrders = getCustomerOrders(customerId);
    const hasOrderedProduct = customerOrders.some(order => 
      order.status === 'delivered' && 
      order.items.some(item => item.productId === productId)
    );

    // Check if customer hasn't already reviewed this product
    const hasReviewed = reviews.some(review => 
      review.customerId === customerId && review.productId === productId
    );

    return hasOrderedProduct && !hasReviewed;
  };

  const value = {
    orders,
    reviews,
    createOrder,
    getOrderById,
    getCustomerOrders,
    addReview,
    getProductReviews,
    getProductAverageRating,
    canReviewProduct
  };

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  );
}

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};
