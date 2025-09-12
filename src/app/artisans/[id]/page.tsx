"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  MapPin, 
  Star, 
  Package, 
  Calendar,
  Award,
  Palette,
  Users,
  ArrowLeft,
  Mail,
  Share2,
  Heart,
  ShoppingBag,
  IndianRupee
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PageLayout } from "@/components/page-layout";
import { getUserProfile } from "@/lib/user-management";
import { getArtisanProducts, getFinalProductDisplay } from "@/lib/firestore-products";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface ArtisanProfile {
  uid: string;
  displayName: string;
  email: string;
  role: 'artisan';
  artisanProfile: {
    name: string;
    region: string;
    specialization?: string;
    bio?: string;
    experience?: string;
    techniques?: string;
    inspiration?: string;
    goals?: string;
  };
  createdAt: any;
}

export default function ArtisanProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [artisan, setArtisan] = useState<ArtisanProfile | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    avgRating: 0,
    totalValue: 0
  });

  const artisanId = params.id as string;
  const isOwnProfile = user?.uid === artisanId;

  useEffect(() => {
    if (artisanId) {
      loadArtisanData();
    }
  }, [artisanId]);

  const loadArtisanData = async () => {
    try {
      setLoading(true);
      
      // Fetch artisan profile
      const artisanProfile = await getUserProfile(artisanId);
      
      if (!artisanProfile || artisanProfile.role !== 'artisan') {
        toast({
          variant: "destructive",
          title: "Artisan Not Found",
          description: "The artisan profile you're looking for doesn't exist.",
        });
        return;
      }
      
      setArtisan(artisanProfile);
      
      // Fetch artisan's products
      const artisanProducts = await getArtisanProducts(artisanId);
      setProducts(artisanProducts);
      
      // Calculate stats
      const activeProducts = artisanProducts.filter(p => p.status === 'active');
      const totalValue = activeProducts.reduce((sum, product) => {
        const displayData = getFinalProductDisplay(product);
        return sum + (displayData.price || 0);
      }, 0);
      
      // Generate demo rating (in real app, this would come from reviews)
      const avgRating = activeProducts.length > 0 
        ? Math.round((Math.random() * 1.0 + 4.0) * 10) / 10
        : 0;
      
      setStats({
        totalProducts: artisanProducts.length,
        activeProducts: activeProducts.length,
        avgRating,
        totalValue
      });
      
    } catch (error) {
      console.error('Error loading artisan data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load artisan profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCoverImage = (specialization?: string) => {
    const imageMap: { [key: string]: string } = {
      'pottery': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=400&fit=crop',
      'painting': 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200&h=400&fit=crop',
      'textile': 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&h=400&fit=crop',
      'jewelry': 'https://images.unsplash.com/photo-1544891504-2c1e5a8cb7e2?w=1200&h=400&fit=crop',
      'handicraft': 'https://images.unsplash.com/photo-1544919982-b61976f0ba43?w=1200&h=400&fit=crop',
      'embroidery': 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=1200&h=400&fit=crop'
    };
    
    const spec = specialization?.toLowerCase() || '';
    for (const [key, image] of Object.entries(imageMap)) {
      if (spec.includes(key)) return image;
    }
    return 'https://images.unsplash.com/photo-1544891504-2c1e5a8cb7e2?w=1200&h=400&fit=crop';
  };

  const getArtisanInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${artisan?.artisanProfile.name} - CraftConnect AI`,
        text: `Check out ${artisan?.artisanProfile.name}'s beautiful handcrafted products!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Profile link copied to clipboard!",
      });
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading artisan profile...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!artisan) {
    return (
      <PageLayout>
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Artisan Not Found</h3>
            <p className="text-muted-foreground mb-6">
              The artisan profile you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/artisans">Browse All Artisans</Link>
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="space-y-8">
        {/* Header Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            {!isOwnProfile && (
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Follow
              </Button>
            )}
          </div>
        </div>

        {/* Hero Section */}
        <Card className="overflow-hidden">
          {/* Cover Image Section */}
          <div className="relative h-64 w-full">
            <Image
              src={getCoverImage(artisan.artisanProfile.specialization)}
              alt={`${artisan.artisanProfile.name}'s craft`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            {artisan.artisanProfile.specialization && (
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="bg-white/90">
                  {artisan.artisanProfile.specialization}
                </Badge>
              </div>
            )}
          </div>
          
          {/* Profile Information Section - Completely Separated */}
          <CardHeader className="bg-background border-t p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar positioned completely outside image */}
              <Avatar className="h-32 w-32 border-4 border-background shadow-xl flex-shrink-0">
                <AvatarImage src="" alt={artisan.artisanProfile.name} />
                <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                  {getArtisanInitials(artisan.artisanProfile.name)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-3 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-foreground break-words">
                      {artisan.artisanProfile.name}
                    </h1>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{artisan.artisanProfile.region}</span>
                    </div>
                    {stats.avgRating > 0 && (
                      <div className="flex items-center text-muted-foreground">
                        <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                        <span>{stats.avgRating} rating</span>
                      </div>
                    )}
                  </div>
                  
                  {isOwnProfile && (
                    <Button asChild className="flex-shrink-0">
                      <Link href="/settings">
                        Edit Profile
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-8">
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-muted/30 rounded-lg p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.activeProducts}</div>
                <div className="text-sm text-muted-foreground mt-1">Active Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">₹{Math.round(stats.totalValue / 1000)}K</div>
                <div className="text-sm text-muted-foreground mt-1">Portfolio Value</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{artisan.artisanProfile.experience || 'N/A'}</div>
                <div className="text-sm text-muted-foreground mt-1">Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.avgRating || 'New'}</div>
                <div className="text-sm text-muted-foreground mt-1">Rating</div>
              </div>
            </div>
            
            <Separator />
            
            {/* Bio Section */}
            {artisan.artisanProfile.bio && (
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  About the Artisan
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {artisan.artisanProfile.bio}
                </p>
              </div>
            )}
            
            {/* Techniques & Experience */}
            <div className="grid md:grid-cols-2 gap-6">
              {artisan.artisanProfile.techniques && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Techniques
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {artisan.artisanProfile.techniques}
                  </p>
                </div>
              )}
              
              {artisan.artisanProfile.inspiration && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Inspiration
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {artisan.artisanProfile.inspiration}
                  </p>
                </div>
              )}
            </div>
            
            {artisan.artisanProfile.goals && (
              <div>
                <h4 className="font-medium mb-2">Goals & Vision</h4>
                <p className="text-sm text-muted-foreground">
                  {artisan.artisanProfile.goals}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Products Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Package className="h-6 w-6" />
                Products ({stats.activeProducts})
              </h2>
              <p className="text-muted-foreground">
                Discover beautiful handcrafted pieces by {artisan.artisanProfile.name}
              </p>
            </div>
            {stats.activeProducts > 0 && (
              <Button asChild variant="outline">
                <Link href={`/marketplace?artisan=${artisanId}`}>
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  View All
                </Link>
              </Button>
            )}
          </div>
          
          {stats.activeProducts > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products
                .filter(p => p.status === 'active')
                .slice(0, 8)
                .map((product) => {
                  const displayData = getFinalProductDisplay(product);
                  return (
                    <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          src={product.image}
                          alt={displayData.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold line-clamp-1 mb-2">{displayData.title}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-primary">
                            ₹{displayData.price?.toLocaleString()}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {product.category}
                          </Badge>
                        </div>
                        <Button asChild className="w-full mt-3" size="sm">
                          <Link href={`/marketplace/${product.id}`}>
                            View Product
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })
              }
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {isOwnProfile ? "No products yet" : "No products available"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {isOwnProfile 
                    ? "Start creating your first product to showcase your craft!"
                    : "This artisan hasn't listed any products yet. Check back later!"}
                </p>
                {isOwnProfile && (
                  <Button asChild>
                    <Link href="/catalog-builder">
                      Create Your First Product
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
