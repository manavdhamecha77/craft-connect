"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  artisan: string;
  region: string;
  quantity: number;
  maxQuantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.productId === product.productId);
      
      if (existingItem) {
        if (existingItem.quantity >= existingItem.maxQuantity) {
          // Use setTimeout to defer toast call outside of render
          setTimeout(() => {
            toast({
              title: "Cannot add more",
              description: "This item is already at maximum quantity in your cart.",
              variant: "destructive"
            });
          }, 0);
          return currentItems;
        }
        
        // Use setTimeout to defer toast call outside of render
        setTimeout(() => {
          toast({
            title: "Quantity updated",
            description: `${product.name} quantity increased in cart.`
          });
        }, 0);
        
        return currentItems.map(item =>
          item.productId === product.productId
            ? { ...item, quantity: Math.min(item.quantity + 1, item.maxQuantity) }
            : item
        );
      } else {
        // Use setTimeout to defer toast call outside of render
        setTimeout(() => {
          toast({
            title: "Added to cart",
            description: `${product.name} has been added to your cart.`
          });
        }, 0);
        
        return [...currentItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    let itemName = '';
    
    setItems(currentItems => {
      const item = currentItems.find(item => item.productId === productId);
      if (item) {
        itemName = item.name;
      }
      return currentItems.filter(item => item.productId !== productId);
    });
    
    // Use setTimeout to defer toast call outside of render
    if (itemName) {
      setTimeout(() => {
        toast({
          title: "Removed from cart",
          description: `${itemName} has been removed from your cart.`
        });
      }, 0);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.productId === productId
          ? { ...item, quantity: Math.min(quantity, item.maxQuantity) }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    // Use setTimeout to defer toast call outside of render
    setTimeout(() => {
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart."
      });
    }, 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const isInCart = (productId: string) => {
    return items.some(item => item.productId === productId);
  };

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isInCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
