"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Heart, MapPin, User } from "lucide-react";
import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getMarketplaceProduct, type MarketplaceProduct } from "@/lib/product-store";

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<MarketplaceProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const productId = params.id as string;
    if (productId) {
      const foundProduct = getMarketplaceProduct(productId);
      setProduct(foundProduct || null);
    }
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center py-20">
          <p>Loading product...</p>
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

  return (
    <PageLayout>
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/marketplace">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Marketplace
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image 
              src={product.image} 
              alt={product.name} 
              fill 
              className="object-cover" 
              priority 
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="secondary">{product.category}</Badge>
              <Button variant="ghost" size="icon">
                <Heart className="w-5 h-5" />
              </Button>
            </div>
            <h1 className="text-3xl font-bold">{product.title || product.name}</h1>
            <p className="text-2xl font-semibold text-primary mt-2">
              ₹{product.price.toLocaleString()}
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

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

          <div className="flex gap-3 pt-4">
            <Button className="flex-1">Add to Cart</Button>
            <Button variant="outline" className="flex-1">Contact Artisan</Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
