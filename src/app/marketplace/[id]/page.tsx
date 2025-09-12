"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Heart, MapPin, User, Share2, ShoppingCart, Star, Shield, Truck, RotateCcw, MessageCircle, Plus, Minus, StarIcon } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import { useOrders } from "@/contexts/orders-context";
import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  getProduct, 
  getFinalProductDisplay, 
  type FirestoreProduct 
} from "@/lib/firestore-products";
import { ArtisanProfile } from "@/components/artisan-profile";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { getProductReviews, getProductAverageRating, canReviewProduct, addReview } = useOrders();
  const [product, setProduct] = useState<FirestoreProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    comment: ''
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [params.id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const productId = params.id as string;
      if (productId) {
        const fetchedProduct = await getProduct(productId);
        
        if (!fetchedProduct) {
          setProduct(null);
          return;
        }

        // Only show active products in marketplace
        if (fetchedProduct.status !== 'active') {
          toast({
            variant: "destructive",
            title: "Product Not Available",
            description: "This product is not currently available in the marketplace.",
          });
          setProduct(null);
          return;
        }

        setProduct(fetchedProduct);
        
        // Add demo reviews if none exist (for testing purposes)
        if (fetchedProduct.id) {
          const existingReviews = getProductReviews(fetchedProduct.id);
          if (existingReviews.length === 0) {
            // Add some demo reviews
            const demoReviews = [
              {
                productId: fetchedProduct.id,
                customerId: 'demo-customer-1',
                customerName: 'Priya Sharma',
                orderId: 'demo-order-1',
                rating: 5,
                comment: 'Beautiful handcrafted piece! The quality is exceptional and you can see the attention to detail. Highly recommend!'
              },
              {
                productId: fetchedProduct.id,
                customerId: 'demo-customer-2', 
                customerName: 'Rajesh Kumar',
                orderId: 'demo-order-2',
                rating: 4,
                comment: 'Great product and fast delivery. The artisan did an amazing job. Worth every penny.'
              }
            ];
            
            demoReviews.forEach(review => addReview(review));
          }
        }
      }
    } catch (error) {
      console.error("Error loading product:", error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product ? getFinalProductDisplay(product).title : "Product",
        text: product ? getFinalProductDisplay(product).description : "",
        url: window.location.href,
      }).catch((error) => console.log("Error sharing:", error));
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Product link has been copied to your clipboard.",
      });
    }
  };

  const handleAddToCart = () => {
    if (!product || !product.id) return;
    
    const displayData = getFinalProductDisplay(product);
    const cartItem = {
      id: `cart-${product.id}-${Date.now()}`,
      productId: product.id,
      name: displayData.title,
      price: displayData.price || 0,
      image: product.image,
      artisan: product.artisanName || "Unknown Artisan",
      region: product.artisanRegion || "",
      maxQuantity: 10 // Default max quantity
    };
    
    // Add multiple quantities if selected
    for (let i = 0; i < quantity; i++) {
      addToCart(cartItem);
    }
    
    // Reset quantity to 1 after adding to cart
    setQuantity(1);
  };
  
  const handleBuyNow = () => {
    if (!product || !product.id) return;
    
    // Add to cart first
    handleAddToCart();
    
    // Navigate to checkout
    router.push('/checkout');
  };
  
  const handleWishlistToggle = () => {
    if (!product || !product.id) return;
    
    const displayData = getFinalProductDisplay(product);
    const wishlistItem = {
      id: `wishlist-${product.id}-${Date.now()}`,
      productId: product.id,
      name: displayData.title,
      price: displayData.price || 0,
      image: product.image,
      artisan: product.artisanName || "Unknown Artisan",
      region: product.artisanRegion || "",
      category: product.category
    };
    
    toggleWishlist(wishlistItem);
  };
  
  const handleSubmitReview = async () => {
    if (!product || !product.id || reviewForm.rating === 0) {
      toast({
        title: "Invalid review",
        description: "Please provide a rating.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmittingReview(true);
    
    try {
      addReview({
        productId: product.id,
        customerId: 'current-customer', // In a real app, this would come from auth
        customerName: 'Customer', // In a real app, this would come from user profile
        orderId: 'mock-order-id', // This should be the actual order ID
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });
      
      // Reset form
      setReviewForm({ rating: 0, comment: '' });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading product...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!product) {
    return (
      <PageLayout>
        <div className="text-center py-20">
          <p className="text-muted-foreground">Product not found.</p>
          <Button asChild className="mt-4">
            <Link href="/marketplace">Back to Marketplace</Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  if (!product) {
    return (
      <PageLayout>
        <div className="text-center py-20">
          <p className="text-muted-foreground">Product not found.</p>
          <Button asChild className="mt-4">
            <Link href="/marketplace">Back to Marketplace</Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  const displayData = getFinalProductDisplay(product);
  
  // Create artisan profile object for the ArtisanProfile component
  const artisanProfile = {
    name: product.artisanName || "Unknown Artisan",
    region: product.artisanRegion || "",
    specialization: product.category,
    bio: product.generatedData?.story?.culturalStory || ""
  };

  return (
    <PageLayout>
      {/* Breadcrumb & Actions */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/marketplace" className="hover:text-foreground transition-colors">
              Marketplace
            </Link>
            <span>/</span>
            <span className="text-foreground">{displayData.title}</span>
          </nav>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={handleWishlistToggle}>
              <Heart className={`w-4 h-4 ${isInWishlist(product?.id || '') ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          </div>
        </div>
        
        <Button variant="ghost" className="-ml-2" asChild>
          <Link href="/marketplace">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Marketplace
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted group">
            <Image 
              src={product.image} 
              alt={displayData.title} 
              fill 
              className="object-cover transition-transform duration-300 group-hover:scale-105" 
              priority 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Button 
              size="sm" 
              variant="secondary" 
              className="absolute top-4 right-4 h-10 w-10 p-0 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm bg-white/80 hover:bg-white"
              onClick={handleWishlistToggle}
            >
              <Heart className={`h-5 w-5 ${isInWishlist(product?.id || '') ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          </div>
          
          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="flex flex-col items-center p-3 rounded-lg bg-muted/50">
              <Shield className="w-5 h-5 text-primary mb-1" />
              <span className="text-xs font-medium">Authentic</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-lg bg-muted/50">
              <Truck className="w-5 h-5 text-primary mb-1" />
              <span className="text-xs font-medium">Handcrafted</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-lg bg-muted/50">
              <RotateCcw className="w-5 h-5 text-primary mb-1" />
              <span className="text-xs font-medium">Quality</span>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-8">
          {/* Header Info */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="px-3 py-1">{product.category}</Badge>
                {product.artisanRegion && (
                  <Badge variant="outline" className="flex items-center space-x-1 px-3 py-1">
                    <MapPin className="h-3 w-3" />
                    <span>{product.artisanRegion}</span>
                  </Badge>
                )}
              </div>
              
              {/* Rating display */}
              <div className="flex items-center space-x-1">
                {(() => {
                  if (!product.id) return null;
                  const averageRating = getProductAverageRating(product.id);
                  const reviews = getProductReviews(product.id);
                  const fullStars = Math.floor(averageRating);
                  const hasHalfStar = averageRating % 1 >= 0.5;
                  
                  return (
                    <>
                      {[1,2,3,4,5].map((star) => (
                        <Star 
                          key={star} 
                          className={`w-4 h-4 ${
                            star <= fullStars 
                              ? 'fill-primary text-primary' 
                              : star === fullStars + 1 && hasHalfStar 
                                ? 'fill-primary/50 text-primary' 
                                : 'text-muted-foreground'
                          }`} 
                        />
                      ))}
                      <span className="text-sm text-muted-foreground ml-1">
                        {reviews.length > 0 
                          ? `${averageRating.toFixed(1)} (${reviews.length} ${reviews.length === 1 ? 'review' : 'reviews'})`
                          : '(No reviews yet)'
                        }
                      </span>
                    </>
                  );
                })()}
              </div>
            </div>
            
            <h1 className="text-4xl font-bold mb-3 leading-tight">{displayData.title}</h1>
            
            <div className="flex items-baseline space-x-4 mb-6">
              <p className="text-4xl font-bold text-primary">
                ₹{displayData.price?.toLocaleString()}
              </p>
              <p className="text-lg text-muted-foreground line-through">
                ₹{Math.floor((displayData.price || 0) * 1.2).toLocaleString()}
              </p>
              <Badge variant="destructive" className="text-xs">16% OFF</Badge>
            </div>
          </div>

          {/* Quick Description */}
          <div className="bg-muted/30 rounded-lg p-6">
            <h3 className="font-semibold mb-3 text-lg">About this piece</h3>
            <p className="text-muted-foreground leading-relaxed">{displayData.description}</p>
          </div>

          {/* Keywords */}
          {displayData.keywords && (
            <div>
              <h3 className="font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {displayData.keywords.split(',').map((keyword, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {keyword.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {(product.artisanName || product.artisanRegion) && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3">Artisan Information</h3>
                <div className="space-y-2">
                  {product.artisanName && (
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>{product.artisanName}</span>
                    </div>
                  )}
                  {product.artisanRegion && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{product.artisanRegion}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {(product.material || product.size) && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3">Specifications</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {product.material && (
                    <div>
                      <span className="text-muted-foreground">Material:</span>
                      <p className="font-medium">{product.material}</p>
                    </div>
                  )}
                  {product.size && (
                    <div>
                      <span className="text-muted-foreground">Size:</span>
                      <p className="font-medium">{product.size}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {product.culturalStory && (
            <>
              <Separator />
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cultural Story</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{product.culturalStory}</p>
                </CardContent>
              </Card>
            </>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            {/* Quantity Selector */}
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 px-3"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="min-w-[3rem] text-center text-sm font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 px-3"
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  disabled={quantity >= 10}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                size="lg" 
                variant="outline" 
                className="flex-1" 
                onClick={handleAddToCart}
                disabled={!product}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {isInCart(product?.id || '') ? 'Update Cart' : 'Add to Cart'}
              </Button>
              <Button 
                size="lg" 
                className="flex-1" 
                onClick={handleBuyNow}
                disabled={!product}
              >
                Buy Now
              </Button>
            </div>
            
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Authentic Handcrafted Product</span>
              </div>
              <p className="text-xs text-muted-foreground">
                This product is handcrafted by skilled artisans using traditional techniques. 
                Each piece is unique and supports local communities.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="story" className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-12 bg-muted/50">
            <TabsTrigger value="story" className="text-sm font-medium">Cultural Story</TabsTrigger>
            <TabsTrigger value="artisan" className="text-sm font-medium">About Artisan</TabsTrigger>
            <TabsTrigger value="reviews" className="text-sm font-medium">Reviews</TabsTrigger>
            <TabsTrigger value="translations" className="text-sm font-medium">Translations</TabsTrigger>
          </TabsList>
            
            <TabsContent value="story" className="mt-8">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <span className="w-1 h-6 bg-primary rounded-full"></span>
                      The Story Behind This Craft
                    </h3>
                    {displayData.culturalStory ? (
                      <div className="prose prose-gray max-w-none">
                        <p className="text-muted-foreground leading-relaxed text-base">
                          {displayData.culturalStory}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                          <MessageCircle className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground">
                          No cultural story available for this product yet.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="artisan" className="mt-8">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <span className="w-1 h-6 bg-primary rounded-full"></span>
                      Meet the Artisan
                    </h3>
                    <ArtisanProfile artisan={artisanProfile} variant="detailed" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-8">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <span className="w-1 h-6 bg-primary rounded-full"></span>
                      Customer Reviews
                    </h3>
                    
                    {(() => {
                      if (!product.id) return null;
                      const reviews = getProductReviews(product.id);
                      const canReview = canReviewProduct('current-customer', product.id);
                      const hasAlreadyReviewed = reviews.some(review => review.customerId === 'current-customer');
                      
                      return (
                        <>
                          {/* Review Form - Allow all users to review for testing */}
                          {!hasAlreadyReviewed && (
                            <div className="bg-muted/30 p-6 rounded-lg">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="font-medium">Write a Review</h4>
                                <Badge variant="secondary" className="text-xs">Testing Mode</Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mb-4">
                                In a real app, you'd only be able to review products you've purchased and received.
                              </p>
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium mb-2 block">Rating</label>
                                  <div className="flex items-center space-x-1">
                                    {[1,2,3,4,5].map((star) => (
                                      <button
                                        key={star}
                                        type="button"
                                        onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                                        className="focus:outline-none"
                                      >
                                        <Star 
                                          className={`w-6 h-6 cursor-pointer transition-colors ${
                                            star <= reviewForm.rating 
                                              ? 'fill-primary text-primary' 
                                              : 'text-muted-foreground hover:text-primary'
                                          }`} 
                                        />
                                      </button>
                                    ))}
                                  </div>
                                </div>
                                
                                <div>
                                  <label className="text-sm font-medium mb-2 block">Comment (Optional)</label>
                                  <Textarea
                                    value={reviewForm.comment}
                                    onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                                    placeholder="Share your experience with this product..."
                                    rows={3}
                                    className="resize-none"
                                  />
                                </div>
                                
                                <Button 
                                  onClick={handleSubmitReview}
                                  disabled={reviewForm.rating === 0 || isSubmittingReview}
                                  className="w-full sm:w-auto"
                                >
                                  {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                                </Button>
                              </div>
                            </div>
                          )}
                          
                          {/* Reviews List */}
                          <div className="space-y-4">
                            {reviews.length > 0 ? (
                              reviews.map((review) => (
                                <div key={review.id} className="border rounded-lg p-4">
                                  <div className="flex items-start justify-between mb-2">
                                    <div>
                                      <div className="flex items-center space-x-2 mb-1">
                                        <h5 className="font-medium">{review.customerName}</h5>
                                        <div className="flex items-center space-x-1">
                                          {[1,2,3,4,5].map((star) => (
                                            <Star 
                                              key={star}
                                              className={`w-4 h-4 ${
                                                star <= review.rating 
                                                  ? 'fill-primary text-primary' 
                                                  : 'text-muted-foreground'
                                              }`} 
                                            />
                                          ))}
                                        </div>
                                      </div>
                                      <p className="text-sm text-muted-foreground">
                                        {review.reviewDate.toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                  {review.comment && (
                                    <p className="text-sm leading-relaxed">{review.comment}</p>
                                  )}
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-8">
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                                  <Star className="w-6 h-6 text-muted-foreground" />
                                </div>
                                <p className="text-muted-foreground mb-2">No reviews yet</p>
                                <p className="text-sm text-muted-foreground">
                                  Be the first to review this product!
                                </p>
                              </div>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="translations" className="mt-8">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <span className="w-1 h-6 bg-primary rounded-full"></span>
                      Product Information in Other Languages
                    </h3>
                    {product.generatedData?.catalog?.translations ? (
                      <div className="grid gap-6">
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-2 text-amber-800">हिंदी (Hindi)</h4>
                          <p className="text-amber-700 text-sm leading-relaxed">
                            {product.generatedData.catalog.translations.hindi}
                          </p>
                        </div>
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-2 text-emerald-800">ગુજરાતી (Gujarati)</h4>
                          <p className="text-emerald-700 text-sm leading-relaxed">
                            {product.generatedData.catalog.translations.gujarati}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                          <MessageCircle className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground">
                          No translations available for this product yet.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
    </PageLayout>
  );
}
