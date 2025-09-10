"use client";

export interface MarketplaceProduct {
  id: string;
  name: string;
  title?: string;
  description: string;
  price: number;
  image: string;
  category: string;
  artisanName?: string;
  artisanRegion?: string;
  material?: string;
  size?: string;
  keywords?: string;
  culturalStory?: string;
  status: 'active' | 'draft' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface GeneratedProductData {
  catalog?: {
    title: string;
    description: string;
    keywords: string;
    translations: {
      hindi: string;
      gujarati: string;
      english: string;
    };
  };
  pricing?: {
    suggestedPriceRangeINR: string;
    reasoning: string;
  };
  story?: {
    culturalStory: string;
  };
  marketing?: any;
}

const STORAGE_KEY = 'craft-connect-marketplace-products';

// Get all products from localStorage
export function getMarketplaceProducts(): MarketplaceProduct[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const products = JSON.parse(stored);
    return products.map((product: any) => ({
      ...product,
      createdAt: new Date(product.createdAt),
      updatedAt: new Date(product.updatedAt)
    }));
  } catch (error) {
    console.error('Error loading marketplace products:', error);
    return [];
  }
}

// Save products to localStorage
function saveMarketplaceProducts(products: MarketplaceProduct[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('Error saving marketplace products:', error);
  }
}

// Add a new product to marketplace
export function addProductToMarketplace(
  formData: any,
  generatedData: GeneratedProductData,
  imagePreview: string
): MarketplaceProduct {
  const products = getMarketplaceProducts();
  
  // Extract price from generated pricing data
  const priceMatch = generatedData.pricing?.suggestedPriceRangeINR?.match(/₹([\d,]+)/);
  const suggestedPrice = priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : 0;
  
  const newProduct: MarketplaceProduct = {
    id: `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: formData.productName,
    title: generatedData.catalog?.title || formData.productName,
    description: generatedData.catalog?.description || formData.notes || '',
    price: suggestedPrice,
    image: imagePreview,
    category: formData.category,
    artisanName: formData.artisanName,
    artisanRegion: formData.artisanRegion,
    material: formData.material,
    size: formData.size,
    keywords: generatedData.catalog?.keywords,
    culturalStory: generatedData.story?.culturalStory,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  products.push(newProduct);
  saveMarketplaceProducts(products);
  
  return newProduct;
}

// Update an existing product
export function updateMarketplaceProduct(id: string, updates: Partial<MarketplaceProduct>): void {
  const products = getMarketplaceProducts();
  const productIndex = products.findIndex(p => p.id === id);
  
  if (productIndex === -1) return;
  
  products[productIndex] = {
    ...products[productIndex],
    ...updates,
    updatedAt: new Date()
  };
  
  saveMarketplaceProducts(products);
}

// Delete a product
export function deleteMarketplaceProduct(id: string): void {
  const products = getMarketplaceProducts();
  const filteredProducts = products.filter(p => p.id !== id);
  saveMarketplaceProducts(filteredProducts);
}

// Get a single product by ID
export function getMarketplaceProduct(id: string): MarketplaceProduct | undefined {
  const products = getMarketplaceProducts();
  return products.find(p => p.id === id);
}

// Get products by category
export function getProductsByCategory(category: string): MarketplaceProduct[] {
  const products = getMarketplaceProducts();
  return products.filter(p => p.category === category && p.status === 'active');
}

// Get products by status
export function getProductsByStatus(status: 'active' | 'draft' | 'archived'): MarketplaceProduct[] {
  const products = getMarketplaceProducts();
  return products.filter(p => p.status === status);
}

// Search products
export function searchMarketplaceProducts(query: string): MarketplaceProduct[] {
  const products = getMarketplaceProducts();
  const lowercaseQuery = query.toLowerCase();
  
  return products.filter(product => 
    product.status === 'active' && (
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.title?.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.keywords?.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery) ||
      product.artisanName?.toLowerCase().includes(lowercaseQuery) ||
      product.artisanRegion?.toLowerCase().includes(lowercaseQuery)
    )
  );
}
