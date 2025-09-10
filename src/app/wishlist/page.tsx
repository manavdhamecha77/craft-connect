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
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WishlistPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.role === 'artisan') {
      router.push('/dashboard');
    }
  }, [user, router]);

  // For now, show empty wishlist - this would be implemented with a wishlist context
  const wishlistItems: any[] = [];

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
              <div className="aspect-square bg-gray-200 rounded-md mb-4 relative">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <ShoppingBag className="h-12 w-12" />
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2 h-8 w-8 p-0 text-red-500"
                >
                  <Heart className="h-4 w-4 fill-current" />
                </Button>
              </div>
              
              <h3 className="font-semibold mb-1">{item.name}</h3>
              
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <MapPin className="h-3 w-3 mr-1" />
                by {item.artisan} • {item.region}
              </div>
              
              <div className="flex items-center mb-3">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm ml-1">{item.rating}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-[#FF9933]">₹{item.price?.toLocaleString()}</span>
                <Button size="sm" className="bg-[#FF9933] hover:bg-[#FF9933]/90">
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
}
