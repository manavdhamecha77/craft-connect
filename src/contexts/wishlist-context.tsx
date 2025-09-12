"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  artisan: string;
  region: string;
  category: string;
  rating?: number;
  addedDate: Date;
}

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (product: Omit<WishlistItem, 'addedDate'>) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  getTotalItems: () => number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Omit<WishlistItem, 'addedDate'>) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);
        // Convert addedDate strings back to Date objects
        const itemsWithDates = parsedWishlist.map((item: any) => ({
          ...item,
          addedDate: new Date(item.addedDate)
        }));
        setItems(itemsWithDates);
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
      }
    }
  }, []);

  // Save wishlist to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(items));
  }, [items]);

  const addToWishlist = (product: Omit<WishlistItem, 'addedDate'>) => {
    const existingItem = items.find(item => item.productId === product.productId);
    
    if (existingItem) {
      toast({
        title: "Already in wishlist",
        description: `${product.name} is already in your wishlist.`,
        variant: "default"
      });
      return;
    }

    setItems(currentItems => {
      const newItems = [...currentItems, { ...product, addedDate: new Date() }];
      return newItems;
    });
    
    // Toast after state update
    toast({
      title: "Added to wishlist",
      description: `${product.name} has been added to your wishlist.`
    });
  };

  const removeFromWishlist = (productId: string) => {
    const item = items.find(item => item.productId === productId);
    
    setItems(currentItems => {
      return currentItems.filter(item => item.productId !== productId);
    });
    
    // Toast after state update
    if (item) {
      toast({
        title: "Removed from wishlist",
        description: `${item.name} has been removed from your wishlist.`
      });
    }
  };

  const clearWishlist = () => {
    setItems([]);
    toast({
      title: "Wishlist cleared",
      description: "All items have been removed from your wishlist."
    });
  };

  const getTotalItems = () => {
    return items.length;
  };

  const isInWishlist = (productId: string) => {
    return items.some(item => item.productId === productId);
  };

  const toggleWishlist = (product: Omit<WishlistItem, 'addedDate'>) => {
    if (isInWishlist(product.productId)) {
      removeFromWishlist(product.productId);
    } else {
      addToWishlist(product);
    }
  };

  const value = {
    items,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    getTotalItems,
    isInWishlist,
    toggleWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
