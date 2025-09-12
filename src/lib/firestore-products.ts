"use client";

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  QueryConstraint
} from 'firebase/firestore';
import { db } from './firebase';

export interface FirestoreProduct {
  id?: string;
  name: string;
  title?: string;
  description: string;
  price: number;
  image: string;
  category: string;
  artisanId: string; // Important: Links product to artisan
  artisanName?: string;
  artisanRegion?: string;
  material?: string;
  size?: string;
  keywords?: string;
  culturalStory?: string;
  status: 'draft' | 'active' | 'archived';
  
  // AI Generated Data (stored as nested objects)
  generatedData?: {
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
  };
  
  // Artisan editable fields (overrides AI generated data)
  artisanEdits?: {
    customTitle?: string;
    customDescription?: string;
    customPrice?: number;
    customKeywords?: string[];
    displayPreferences?: {
      showCulturalStory: boolean;
      showAIDescription: boolean;
      preferredLanguage: 'english' | 'hindi' | 'gujarati';
    };
  };
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
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

const PRODUCTS_COLLECTION = 'products';

// Helper function to clean data and remove undefined values
function cleanFirestoreData(data: any): any {
  const cleaned: any = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined && value !== null) {
      if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Timestamp)) {
        const cleanedNested = cleanFirestoreData(value);
        if (Object.keys(cleanedNested).length > 0) {
          cleaned[key] = cleanedNested;
        }
      } else {
        cleaned[key] = value;
      }
    }
  }
  
  return cleaned;
}

// Create a new product (initially as draft)
export async function createProduct(
  artisanId: string,
  formData: any,
  generatedData: GeneratedProductData,
  imageUrl: string
): Promise<FirestoreProduct> {
  try {
    // Extract price from generated pricing data
    const priceMatch = generatedData.pricing?.suggestedPriceRangeINR?.match(/₹([\d,]+)/);
    const suggestedPrice = priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : 0;

    const productData: Omit<FirestoreProduct, 'id'> = {
      name: formData.productName,
      title: generatedData.catalog?.title || formData.productName,
      description: generatedData.catalog?.description || formData.notes || '',
      price: suggestedPrice,
      image: imageUrl,
      category: formData.category,
      artisanId,
      artisanName: formData.artisanName || '',
      artisanRegion: formData.artisanRegion || '',
      material: formData.material || '',
      size: formData.size || '',
      keywords: generatedData.catalog?.keywords || '',
      culturalStory: generatedData.story?.culturalStory || '',
      status: 'draft', // Always start as draft
      generatedData: generatedData || {},
      artisanEdits: {
        displayPreferences: {
          showCulturalStory: true,
          showAIDescription: true,
          preferredLanguage: 'english'
        }
      },
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    // Clean the data to remove any undefined values
    const cleanedProductData = cleanFirestoreData(productData);
    
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), cleanedProductData);
    return { ...productData, id: docRef.id };
  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error('Failed to create product');
  }
}

// Get products for a specific artisan
export async function getArtisanProducts(
  artisanId: string,
  statusFilter?: 'draft' | 'active' | 'archived'
): Promise<FirestoreProduct[]> {
  try {
    const constraints: QueryConstraint[] = [
      where('artisanId', '==', artisanId),
      orderBy('updatedAt', 'desc')
    ];

    if (statusFilter) {
      constraints.push(where('status', '==', statusFilter));
    }

    const q = query(collection(db, PRODUCTS_COLLECTION), ...constraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as FirestoreProduct));
  } catch (error) {
    console.error('Error getting artisan products:', error);
    throw new Error('Failed to fetch products');
  }
}

// Get all active products for marketplace
export async function getMarketplaceProducts(
  categoryFilter?: string,
  limitCount: number = 50
): Promise<FirestoreProduct[]> {
  try {
    const constraints: QueryConstraint[] = [
      where('status', '==', 'active'),
      orderBy('updatedAt', 'desc'),
      limit(limitCount)
    ];

    if (categoryFilter) {
      constraints.push(where('category', '==', categoryFilter));
    }

    const q = query(collection(db, PRODUCTS_COLLECTION), ...constraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as FirestoreProduct));
  } catch (error) {
    console.error('Error getting marketplace products:', error);
    throw new Error('Failed to fetch marketplace products');
  }
}

// Get a single product by ID
export async function getProduct(productId: string): Promise<FirestoreProduct | null> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as FirestoreProduct;
    }
    return null;
  } catch (error) {
    console.error('Error getting product:', error);
    throw new Error('Failed to fetch product');
  }
}

// Update product (artisan edits)
export async function updateProduct(
  productId: string,
  updates: Partial<FirestoreProduct>,
  artisanId?: string
): Promise<void> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    
    // If artisanId is provided, verify ownership
    if (artisanId) {
      const product = await getProduct(productId);
      if (!product || product.artisanId !== artisanId) {
        throw new Error('Unauthorized to update this product');
      }
    }

    // Clean the updates to remove any undefined values
    const cleanedUpdates = cleanFirestoreData({
      ...updates,
      updatedAt: Timestamp.now()
    });
    
    await updateDoc(docRef, cleanedUpdates);
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error('Failed to update product');
  }
}

// Update artisan-specific edits (overrides for AI generated content)
export async function updateArtisanEdits(
  productId: string,
  artisanId: string,
  edits: FirestoreProduct['artisanEdits']
): Promise<void> {
  try {
    const product = await getProduct(productId);
    if (!product || product.artisanId !== artisanId) {
      throw new Error('Unauthorized to edit this product');
    }

    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    
    // Prepare update data with merged artisan edits
    const updateData: any = {
      artisanEdits: { ...product.artisanEdits, ...edits },
      updatedAt: Timestamp.now()
    };
    
    // If customPrice is being updated, also update the main price field
    if (edits?.customPrice !== undefined) {
      updateData.price = edits.customPrice;
    }
    
    await updateDoc(docRef, cleanFirestoreData(updateData));
  } catch (error) {
    console.error('Error updating artisan edits:', error);
    throw new Error('Failed to update product edits');
  }
}

// Change product status
export async function updateProductStatus(
  productId: string,
  artisanId: string,
  status: 'draft' | 'active' | 'archived'
): Promise<void> {
  try {
    await updateProduct(productId, { status }, artisanId);
  } catch (error) {
    console.error('Error updating product status:', error);
    throw new Error('Failed to update product status');
  }
}

// Delete product
export async function deleteProduct(productId: string, artisanId?: string): Promise<void> {
  try {
    // If artisanId is provided, verify ownership
    if (artisanId) {
      const product = await getProduct(productId);
      if (!product || product.artisanId !== artisanId) {
        throw new Error('Unauthorized to delete this product');
      }
    }

    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error('Failed to delete product');
  }
}

// Search products
export async function searchProducts(
  searchTerm: string,
  onlyActive: boolean = true
): Promise<FirestoreProduct[]> {
  try {
    const constraints: QueryConstraint[] = [];
    
    if (onlyActive) {
      constraints.push(where('status', '==', 'active'));
    }

    const q = query(collection(db, PRODUCTS_COLLECTION), ...constraints);
    const querySnapshot = await getDocs(q);
    
    const allProducts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as FirestoreProduct));

    // Client-side filtering for text search (Firebase doesn't support full-text search natively)
    const lowercaseSearchTerm = searchTerm.toLowerCase();
    return allProducts.filter(product => 
      product.name.toLowerCase().includes(lowercaseSearchTerm) ||
      product.title?.toLowerCase().includes(lowercaseSearchTerm) ||
      product.description.toLowerCase().includes(lowercaseSearchTerm) ||
      product.keywords?.toLowerCase().includes(lowercaseSearchTerm) ||
      product.category.toLowerCase().includes(lowercaseSearchTerm) ||
      product.artisanName?.toLowerCase().includes(lowercaseSearchTerm) ||
      product.artisanRegion?.toLowerCase().includes(lowercaseSearchTerm)
    );
  } catch (error) {
    console.error('Error searching products:', error);
    throw new Error('Failed to search products');
  }
}

// Helper function to get the final display values (combining AI generated and artisan edits)
export function getFinalProductDisplay(product: FirestoreProduct) {
  const artisanEdits = product.artisanEdits;
  const generatedData = product.generatedData;
  
  return {
    title: artisanEdits?.customTitle || generatedData?.catalog?.title || product.title || product.name,
    description: artisanEdits?.customDescription || (
      artisanEdits?.displayPreferences?.showAIDescription 
        ? generatedData?.catalog?.description 
        : product.description
    ),
    price: artisanEdits?.customPrice || product.price,
    keywords: artisanEdits?.customKeywords?.join(', ') || generatedData?.catalog?.keywords || product.keywords,
    culturalStory: artisanEdits?.displayPreferences?.showCulturalStory 
      ? (product.culturalStory || generatedData?.story?.culturalStory)
      : undefined,
    preferredLanguage: artisanEdits?.displayPreferences?.preferredLanguage || 'english'
  };
}
