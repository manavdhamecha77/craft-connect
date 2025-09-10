"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Search, Filter, Heart, MapPin, Star, Plus, Grid3X3, List, ShoppingBag } from "lucide-react";
import { PageLayout } from "@/components/page-layout";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { getMarketplaceProducts, searchProducts, getFinalProductDisplay, type FirestoreProduct } from "@/lib/firestore-products";
import { useCart } from "@/contexts/cart-context";
import { useOrders } from "@/contexts/orders-context";
import { useAuth } from "@/hooks/use-auth";

export default function MarketplacePage() {
  const [products, setProducts] = useState<FirestoreProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<FirestoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const { addToCart, isInCart } = useCart();
  const { getProductAverageRating, getProductReviews } = useOrders();
  const { user } = useAuth();

  const categories = ["all", "Saree", "Painting", "Pottery", "Jewelry", "Handicraft"];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, selectedCategory, priceRange, sortBy, query]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const fetchedProducts = await getMarketplaceProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error loading marketplace products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Apply search filter
    if (query.trim()) {
      const searchTerm = query.toLowerCase();
      filtered = filtered.filter(product => {
        const displayData = getFinalProductDisplay(product);
        return (
          displayData.title.toLowerCase().includes(searchTerm) ||
          displayData.description.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm) ||
          (product.artisanName && product.artisanName.toLowerCase().includes(searchTerm))
        );
      });
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Apply price range filter
    if (priceRange !== "all") {
      filtered = filtered.filter(product => {
        const price = product.price || 0;
        switch (priceRange) {
          case "under-1000": return price < 1000;
          case "1000-5000": return price >= 1000 && price <= 5000;
          case "5000-15000": return price >= 5000 && price <= 15000;
          case "above-15000": return price > 15000;
          default: return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        case "name":
          return getFinalProductDisplay(a).title.localeCompare(getFinalProductDisplay(b).title);
        case "newest":
        default:
          return (b.createdAt?.toDate().getTime() || 0) - (a.createdAt?.toDate().getTime() || 0);
      }
    });

    setFilteredProducts(filtered);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleAddToCart = (product: FirestoreProduct) => {
    const displayData = getFinalProductDisplay(product);
    addToCart({
      id: product.id!,
      productId: product.id!,
      name: displayData.title,
      price: displayData.price || 0,
      image: product.image,
      artisan: product.artisanName || 'Unknown Artisan',
      region: product.artisanRegion || 'Unknown Region',
      maxQuantity: 1 // Since each product is unique, max quantity is 1
    });
  };

  return (
    <PageLayout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 via-amber-50/50 to-primary/5 rounded-xl p-8 mb-8">
        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Authentic Handcrafted Treasures</h1>
          <p className="text-lg text-muted-foreground mb-6">Explore unique artisanal products from skilled craftspeople across India. Each piece tells a story of tradition, culture, and exceptional craftsmanship.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search for handcrafted products..." 
                value={query} 
                onChange={handleSearch} 
                className="pl-10 h-12" 
              />
            </div>
            <Button asChild size="lg" className="h-12">
              <Link href="/catalog-builder">
                <Plus className="h-4 w-4 mr-2" />
                List Your Products
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="flex flex-wrap gap-4 flex-1">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="under-1000">Under ₹1,000</SelectItem>
              <SelectItem value="1000-5000">₹1,000 - ₹5,000</SelectItem>
              <SelectItem value="5000-15000">₹5,000 - ₹15,000</SelectItem>
              <SelectItem value="above-15000">Above ₹15,000</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant={viewMode === "grid" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button 
            variant={viewMode === "list" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-6 mx-2" />
          <span className="text-sm text-muted-foreground">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Products Display */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading handcrafted treasures...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-6">
              {query.trim() 
                ? `We couldn't find any products matching "${query}". Try adjusting your search or filters.`
                : "No products are available in the marketplace yet."}
            </p>
            <div className="flex gap-2 justify-center">
              {(selectedCategory !== "all" || priceRange !== "all" || sortBy !== "newest" || query.trim()) && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedCategory("all");
                    setPriceRange("all");
                    setSortBy("newest");
                    setQuery("");
                  }}
                >
                  Clear Filters
                </Button>
              )}
              <Button asChild>
                <Link href="/catalog-builder">List Your Products</Link>
              </Button>
            </div>
          </div>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const displayData = getFinalProductDisplay(product);
            const averageRating = getProductAverageRating(product.id!);
            const reviewCount = getProductReviews(product.id!).length;
            const inCart = isInCart(product.id!);
            const isOutOfStock = false; // For now, assume all products are in stock
            
            return (
              <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md h-full flex flex-col">
                <CardHeader className="p-0 relative">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image 
                      src={product.image} 
                      alt={displayData.title} 
                      fill 
                      className="object-cover transition-transform duration-300 group-hover:scale-105" 
                    />
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-semibold">Out of Stock</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="absolute top-3 right-3 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex-grow flex flex-col">
                  <div className="flex-grow">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">₹{displayData.price?.toLocaleString()}</p>
                      </div>
                    </div>
                    <CardTitle className="text-base font-semibold leading-tight mb-2 line-clamp-2">
                      {displayData.title}
                    </CardTitle>
                    
                    {/* Rating */}
                    {averageRating > 0 && (
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-muted-foreground">
                          {averageRating} ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
                        </span>
                      </div>
                    )}
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {displayData.description}
                    </p>
                    {(product.artisanName || product.artisanRegion) && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        {product.artisanRegion && (
                          <>
                            <MapPin className="w-3 h-3" />
                            <span>{product.artisanRegion}</span>
                          </>
                        )}
                        {product.artisanName && product.artisanRegion && <span>•</span>}
                        {product.artisanName && <span>By {product.artisanName}</span>}
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 mt-auto">
                  <div className="flex flex-col w-full space-y-2">
                    {user?.role === 'customer' && (
                      <Button 
                        onClick={() => handleAddToCart(product)}
                        disabled={isOutOfStock || inCart}
                        className="w-full bg-[#FF9933] hover:bg-[#FF9933]/90"
                        size="sm"
                      >
                        {inCart ? (
                          <>Added to Cart</>
                        ) : isOutOfStock ? (
                          <>Out of Stock</>
                        ) : (
                          <>
                            <ShoppingBag className="h-3 w-3 mr-1" />
                            Add to Cart
                          </>
                        )}
                      </Button>
                    )}
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href={`/marketplace/${product.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProducts.map((product) => {
            const displayData = getFinalProductDisplay(product);
            return (
              <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row">
                  <div className="relative w-full sm:w-48 aspect-[4/3] sm:aspect-square">
                    <Image 
                      src={product.image} 
                      alt={displayData.title} 
                      fill 
                      className="object-cover" 
                    />
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{product.category}</Badge>
                          {product.artisanRegion && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              <span>{product.artisanRegion}</span>
                            </div>
                          )}
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{displayData.title}</h3>
                        <p className="text-muted-foreground line-clamp-2 mb-3">{displayData.description}</p>
                        {product.artisanName && (
                          <p className="text-sm text-muted-foreground">By {product.artisanName}</p>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-2xl font-bold text-primary mb-4">₹{displayData.price?.toLocaleString()}</p>
                        <Button asChild>
                          <Link href={`/marketplace/${product.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </PageLayout>
  );
}

