/**
 * Loading Components Usage Examples
 * 
 * This file shows how to use the various loading components throughout your platform.
 * Copy these examples into your components as needed.
 */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./button";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { ProductCard } from "@/components/product-card";

// Product interface for examples
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  hint: string;
}
import { 
  Loading, 
  PageLoading, 
  InlineLoading, 
  SectionLoading, 
  CardSkeleton, 
  LoadingGrid, 
  ButtonLoading 
} from "./loading";

// 1. Basic Loading Spinner (replace simple spinners)
export function BasicLoadingExample() {
  return (
    <div className="p-4">
      {/* Simple craft-themed spinner */}
      <Loading variant="craft" size="md" text="Loading..." />
      
      {/* Traditional spinner */}
      <Loading variant="spinner" size="lg" text="Processing..." />
      
      {/* Animated dots */}
      <Loading variant="dots" size="sm" text="Please wait..." />
      
      {/* Logo with animation */}
      <Loading variant="logo" size="xl" text="CraftConnect" />
    </div>
  );
}

// 2. Full Page Loading (for major page loads)
export function PageLoadingExample() {
  const [loading, setLoading] = useState(true);
  
  if (loading) {
    return (
      <PageLoading 
        text="Loading Your Dashboard"
        subtext="Preparing your artisan workspace with the latest updates..."
      />
    );
  }
  
  return <div>Your page content here...</div>;
}

// 3. Section Loading (for content areas)
export function SectionLoadingExample() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  return (
    <div>
      <h2>Your Products</h2>
      {loading ? (
        <SectionLoading text="Loading your products..." />
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

// 4. Card Skeletons (for grid layouts)
export function CardSkeletonExample() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {loading ? (
        // Show 8 skeleton cards while loading
        Array.from({ length: 8 }, (_, i) => (
          <CardSkeleton key={i} />
        ))
      ) : (
        products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))
      )}
    </div>
  );
}

// 5. Loading Grid (easier way for product grids)
export function LoadingGridExample() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  if (loading) {
    return <LoadingGrid count={12} columns={4} />;
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// 6. Button Loading States
export function ButtonLoadingExample() {
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => setSaving(false), 2000);
  };
  
  const handleDelete = async () => {
    setDeleting(true);
    // Simulate API call
    setTimeout(() => setDeleting(false), 2000);
  };
  
  return (
    <div className="flex gap-4">
      {/* Regular button */}
      <Button onClick={handleSave} disabled={saving}>
        {saving ? <InlineLoading text="Saving..." /> : "Save Product"}
      </Button>
      
      {/* Or use ButtonLoading component */}
      {saving ? (
        <ButtonLoading text="Saving..." variant="default" />
      ) : (
        <Button onClick={handleSave}>Save Product</Button>
      )}
      
      {/* Destructive action */}
      {deleting ? (
        <ButtonLoading text="Deleting..." variant="outline" />
      ) : (
        <Button variant="outline" onClick={handleDelete}>Delete</Button>
      )}
    </div>
  );
}

// 7. Inline Loading (for small sections)
export function InlineLoadingExample() {
  const [stats, setStats] = useState<{total: number; orders: number} | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  
  return (
    <div className="bg-card p-4 rounded-lg">
      <h3>Sales Statistics</h3>
      {loadingStats ? (
        <InlineLoading text="Calculating stats..." />
      ) : (
        <div>
          <p>Total Sales: ₹{stats?.total || 0}</p>
          <p>Orders: {stats?.orders || 0}</p>
        </div>
      )}
    </div>
  );
}

// 8. Form Loading States
export function FormLoadingExample() {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate form submission
    setTimeout(() => setSubmitting(false), 3000);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <Input placeholder="Product name" disabled={submitting} />
        <Textarea placeholder="Description" disabled={submitting} />
        
        <div className="flex justify-between">
          <Button type="button" variant="outline" disabled={submitting}>
            Cancel
          </Button>
          
          {submitting ? (
            <ButtonLoading text="Creating Product..." />
          ) : (
            <Button type="submit">Create Product</Button>
          )}
        </div>
      </div>
    </form>
  );
}

// 9. Data Fetching with Different Loading States
export function DataFetchingExample() {
  const [data, setData] = useState<{message: string} | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setData({ message: "Data loaded" });
        setLoading(false);
      }, 2000);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  if (loading) {
    return (
      <PageLoading 
        text="Loading Artisan Profiles"
        subtext="Discovering talented craftspeople in your region..."
      />
    );
  }
  
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  
  return (
    <div>
      {/* Your data display */}
    </div>
  );
}

// 10. Navigation Loading (for route changes)
export function NavigationLoadingExample() {
  const router = useRouter();
  const [navigating, setNavigating] = useState(false);
  
  const handleNavigation = (path: string) => {
    setNavigating(true);
    router.push(path);
  };
  
  return (
    <>
      {navigating && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm p-4">
          <InlineLoading text="Navigating..." />
        </div>
      )}
      
      <nav>
        <Button onClick={() => handleNavigation('/dashboard')}>
          Dashboard
        </Button>
        <Button onClick={() => handleNavigation('/products')}>
          Products
        </Button>
      </nav>
    </>
  );
}

/**
 * Quick Reference:
 * 
 * 1. <Loading /> - Basic loading spinner with different variants
 * 2. <PageLoading /> - Full page loading with logo and text
 * 3. <SectionLoading /> - Loading for content sections
 * 4. <CardSkeleton /> - Skeleton for individual cards
 * 5. <LoadingGrid /> - Grid of skeleton cards
 * 6. <ButtonLoading /> - Loading state for buttons
 * 7. <InlineLoading /> - Small loading indicator
 * 
 * Variants:
 * - "craft" - CraftConnect themed with palette icon
 * - "spinner" - Traditional spinning circle
 * - "dots" - Three animated dots
 * - "pulse" - Pulsing circle
 * - "logo" - Animated logo
 * 
 * Sizes: "sm", "md", "lg", "xl"
 */
