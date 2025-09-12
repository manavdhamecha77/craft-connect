"use client";

import { PageLayout } from "@/components/page-layout";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Heart, 
  ShoppingBag, 
  Star,
  MapPin
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import { useWishlist } from "@/contexts/wishlist-context";
import { useCart } from "@/contexts/cart-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WishlistPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { items: wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  useEffect(() => {
    if (user?.role === 'artisan') {
      router.push('/dashboard');
    }
  }, [user, router]);
  
  const handleAddToCart = (item: any) => {
    const cartItem = {
      id: `cart-${item.productId}-${Date.now()}`,
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      artisan: item.artisan,
      region: item.region,
      maxQuantity: 10
    };
    
    addToCart(cartItem);
  };

  if (wishlistItems.length === 0) {
    return (
      <PageLayout>
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground mb-6">
              Save items you love for later by clicking the heart icon on products.
            </p>
            <Button asChild size="lg">
              <Link href="/marketplace">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Browse Marketplace
              </Link>
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        title="My Wishlist"
        description={`${wishlistItems.length} item${wishlistItems.length !== 1 ? 's' : ''} saved for later`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="aspect-square bg-gray-200 rounded-md mb-4 relative overflow-hidden">
                <Link href={`/marketplace/${item.productId}`}>
                  <Image 
                    src={item.image} 
                    alt={item.name} 
                    fill 
                    className="object-cover hover:scale-105 transition-transform cursor-pointer" 
                  />
                </Link>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2 h-8 w-8 p-0 text-red-500 bg-white/80 hover:bg-white"
                  onClick={() => removeFromWishlist(item.productId)}
                >
                  <Heart className="h-4 w-4 fill-current" />
                </Button>
              </div>
              
              <Link href={`/marketplace/${item.productId}`}>
                <h3 className="font-semibold mb-1 hover:text-primary cursor-pointer line-clamp-2">{item.name}</h3>
              </Link>
              
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <MapPin className="h-3 w-3 mr-1" />
                by {item.artisan} {item.region && ` • ${item.region}`}
              </div>
              
              <div className="flex items-center mb-2">
                <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                  {item.category}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">₹{item.price?.toLocaleString()}</span>
                <Button 
                  size="sm" 
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => handleAddToCart(item)}
                >
                  Add to Cart
                </Button>
              </div>
              
              <div className="text-xs text-muted-foreground mt-2">
                Added {item.addedDate.toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
}
