"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Heart, MapPin, User, Share2, ShoppingCart, Star, Shield, Truck, RotateCcw, MessageCircle } from "lucide-react";
import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  getProduct, 
  getFinalProductDisplay, 
  type FirestoreProduct 
} from "@/lib/firestore-products";
import { ArtisanProfile } from "@/components/artisan-profile";

export default function ProductDetailPage() {
  const params = useParams();
  const { toast } = useToast();
  const [product, setProduct] = useState<FirestoreProduct | null>(null);
  const [loading, setLoading] = useState(true);

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

  const handleContact = () => {
    toast({
      title: "Contact Feature",
      description: "Contact functionality will be implemented soon!",
    });
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
            <Button variant="outline" size="sm">
              <Heart className="w-4 h-4" />
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
            >
              <Heart className="h-5 w-5" />
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
              
              {/* Rating placeholder */}
              <div className="flex items-center space-x-1">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-primary text-primary" />
                ))}
                <span className="text-sm text-muted-foreground ml-1">(New)</span>
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
            <div className="flex gap-3">
              <Button size="lg" className="flex-1" onClick={handleContact}>
                <ShoppingCart className="h-5 w-5 mr-2" />
                Contact Artisan
              </Button>
              <Button size="lg" variant="outline" onClick={handleContact}>
                <MessageCircle className="h-5 w-5 mr-2" />
                Ask Question
              </Button>
            </div>
            
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Direct from Artisan</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Contact the artisan directly to purchase this handcrafted item. 
                All payments and shipping arrangements are handled between you and the artisan.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="story" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-12 bg-muted/50">
            <TabsTrigger value="story" className="text-sm font-medium">Cultural Story</TabsTrigger>
            <TabsTrigger value="artisan" className="text-sm font-medium">About Artisan</TabsTrigger>
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
