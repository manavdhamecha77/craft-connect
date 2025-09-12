"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Sparkles, 
  PenTool, 
  IndianRupee, 
  MessageSquare, 
  Users, 
  ShoppingBag,
  Star,
  ArrowRight,
  Palette,
  Globe,
  Zap,
  Search,
  Filter,
  Heart
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { AppNavbar } from "./navbar";
import { Footer } from "./footer";
import { useEffect, useState } from 'react';
import { getTopArtisans, UserProfile } from '@/lib/user-management';

const artisanFeatures = [
  {
    icon: <Sparkles className="h-8 w-8" />,
    title: "AI Catalog Builder",
    description: "Generate compelling product titles, descriptions, keywords, and translations instantly with our Gemini-powered AI tools.",
    badge: "AI-Powered"
  },
  {
    icon: <PenTool className="h-8 w-8" />,
    title: "Storytelling Generator",
    description: "Craft authentic cultural stories for your products based on your heritage and artisan traditions.",
    badge: "Cultural"
  },
  {
    icon: <IndianRupee className="h-8 w-8" />,
    title: "Smart Pricing",
    description: "Get intelligent pricing suggestions based on product attributes, market data, and cultural value.",
    badge: "Smart"
  },
  {
    icon: <MessageSquare className="h-8 w-8" />,
    title: "Marketing Content",
    description: "Generate Instagram captions, WhatsApp statuses, and ad scripts that resonate with your audience.",
    badge: "Social"
  }
];

const customerFeatures = [
  {
    icon: <Search className="h-8 w-8" />,
    title: "Discover Authentic Crafts",
    description: "Browse thousands of unique handcrafted products from talented artisans across India."
  },
  {
    icon: <Filter className="h-8 w-8" />,
    title: "Advanced Filtering",
    description: "Find exactly what you're looking for with filters by region, craft type, price, and artisan."
  },
  {
    icon: <Heart className="h-8 w-8" />,
    title: "Support Artisans",
    description: "Every purchase directly supports local artisans and helps preserve traditional craftsmanship."
  },
  {
    icon: <Globe className="h-8 w-8" />,
    title: "Cultural Stories",
    description: "Learn the rich history and cultural significance behind each handcrafted piece."
  }
];

// Component for dynamic artisan showcase
function ArtisanShowcase() {
  const [artisans, setArtisans] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Test mode: set to true to use mock data for testing
  const TEST_MODE = false;

  useEffect(() => {
    async function fetchArtisans() {
      try {
        setLoading(true);
        
        if (TEST_MODE) {
          // Use mock data for testing
          const mockArtisans: UserProfile[] = [
            {
              uid: 'mock-1',
              email: 'meera@test.com',
              displayName: 'Meera Sharma',
              role: 'artisan',
              createdAt: { toMillis: () => Date.now() - 86400000 } as any,
              updatedAt: { toMillis: () => Date.now() } as any,
              artisanProfile: {
                name: 'Meera Sharma',
                region: 'Jaipur, Rajasthan',
                specialization: 'Block Printing',
                bio: 'Traditional Rajasthani block printing artisan with over 15 years of experience.',
                experience: '15 years',
                techniques: 'Block printing, Natural dyeing',
                inspiration: 'Rajasthani heritage and desert landscapes',
                goals: 'Preserve traditional techniques while reaching global markets'
              }
            },
            {
              uid: 'mock-2',
              email: 'ravi@test.com',
              displayName: 'Ravi Kumar',
              role: 'artisan',
              createdAt: { toMillis: () => Date.now() - 172800000 } as any,
              updatedAt: { toMillis: () => Date.now() } as any,
              artisanProfile: {
                name: 'Ravi Kumar',
                region: 'Srinagar, Kashmir',
                specialization: 'Pashmina Weaving',
                bio: 'Master weaver of authentic Kashmiri Pashmina shawls with 100 years of family tradition.',
                experience: '20 years',
                techniques: 'Hand weaving, Cashmere processing',
                inspiration: 'Kashmir valleys and ancestral legacy',
                goals: 'Showcase authentic Kashmiri Pashmina globally'
              }
            },
            {
              uid: 'mock-3',
              email: 'lakshmi@test.com',
              displayName: 'Lakshmi Devi',
              role: 'artisan',
              createdAt: { toMillis: () => Date.now() - 259200000 } as any,
              updatedAt: { toMillis: () => Date.now() } as any,
              artisanProfile: {
                name: 'Lakshmi Devi',
                region: 'Thanjavur, Tamil Nadu',
                specialization: 'Bronze Sculpture',
                bio: 'Expert in traditional Thanjavur bronze sculpture using ancient lost-wax casting technique.',
                experience: '18 years',
                techniques: 'Lost-wax casting, Bronze working',
                inspiration: 'Tamil Nadu mythology and temple architecture',
                goals: 'Preserve ancient bronze sculpture art'
              }
            }
          ];
          
          console.log('Using mock artisan data for testing');
          setArtisans(mockArtisans);
        } else {
          const fetchedArtisans = await getTopArtisans(3);
          setArtisans(fetchedArtisans);
          
          // If no artisans found, log this for debugging
          if (fetchedArtisans.length === 0) {
            console.log('No artisans found in database, will show fallback data');
          }
        }
      } catch (err) {
        console.error('Error fetching artisans:', err);
        setError('Failed to load artisans');
      } finally {
        setLoading(false);
      }
    }

    // Add a small delay to show loading state
    setTimeout(fetchArtisans, 1000);
  }, []);

  if (loading) {
    return (
      <section id="artisans" className="py-24 px-6 lg:px-8 bg-[#F5F5DC]">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl font-['Playfair_Display',serif]">
              Meet Our{" "}
              <span className="text-[#4B0082]">Artisans</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 font-['PT_Sans',sans-serif]">
              Discover the incredible craftsmanship from across India
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="text-center animate-pulse">
                <CardHeader>
                  <div className="flex flex-col items-center space-y-4">
                    <div className="h-24 w-24 bg-gray-200 rounded-full"></div>
                    <div>
                      <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center space-x-6">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || artisans.length === 0) {
    // Fallback to sample data if there's an error or no artisans
    const fallbackArtisans = [
      {
        name: "Meera Sharma",
        region: "Rajasthan",
        craft: "Block Printing",
        image: "/api/placeholder/120/120",
        products: 24,
        rating: 4.9
      },
      {
        name: "Ravi Kumar",
        region: "Kashmir",
        craft: "Pashmina Weaving",
        image: "/api/placeholder/120/120",
        products: 18,
        rating: 4.8
      },
      {
        name: "Lakshmi Devi",
        region: "Tamil Nadu",
        craft: "Bronze Sculpture",
        image: "/api/placeholder/120/120",
        products: 31,
        rating: 5.0
      }
    ];

    return (
      <section id="artisans" className="py-24 px-6 lg:px-8 bg-[#F5F5DC]">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl font-['Playfair_Display',serif]">
              Meet Our{" "}
              <span className="text-[#4B0082]">Artisans</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 font-['PT_Sans',sans-serif]">
              Discover the incredible craftsmanship from across India
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {fallbackArtisans.map((artisan, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={artisan.image} alt={artisan.name} />
                      <AvatarFallback className="bg-[#FF9933]/10 text-[#4B0082] text-xl">
                        {artisan.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl font-['Playfair_Display',serif]">
                        {artisan.name}
                      </CardTitle>
                      <CardDescription className="text-[#4B0082] font-medium">
                        {artisan.craft} • {artisan.region}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Palette className="h-4 w-4 mr-1 text-[#FF9933]" />
                      {artisan.products} Products
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                      {artisan.rating}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="artisans" className="py-24 px-6 lg:px-8 bg-[#F5F5DC]">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl font-['Playfair_Display',serif]">
            Meet Our{" "}
            <span className="text-[#4B0082]">Artisans</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 font-['PT_Sans',sans-serif]">
            Discover the incredible craftsmanship from across India
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {artisans.map((artisan, index) => {
            const profile = artisan.artisanProfile;
            // Generate a random rating and product count for display
            const rating = (4.5 + Math.random() * 0.5).toFixed(1);
            const productCount = Math.floor(Math.random() * 30) + 10;
            
            return (
              <Card key={artisan.uid} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/api/placeholder/120/120" alt={profile?.name || artisan.displayName} />
                      <AvatarFallback className="bg-[#FF9933]/10 text-[#4B0082] text-xl">
                        {(profile?.name || artisan.displayName || 'A').split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl font-['Playfair_Display',serif]">
                        {profile?.name || artisan.displayName}
                      </CardTitle>
                      <CardDescription className="text-[#4B0082] font-medium">
                        {profile?.specialization || 'Artisan'} • {profile?.region || 'India'}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Palette className="h-4 w-4 mr-1 text-[#FF9933]" />
                      {productCount} Products
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                      {rating}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const testimonials = [
  {
    name: "Priya Patel",
    craft: "Textile Arts",
    region: "Gujarat",
    text: "CraftConnect AI helped me reach international customers with perfectly translated descriptions. My sales increased by 300%!",
    rating: 5
  },
  {
    name: "Amit Singh",
    craft: "Wood Carving",
    region: "Uttar Pradesh", 
    text: "The storytelling feature helps me share the deep cultural meaning behind each piece. Customers love the authentic stories.",
    rating: 5
  },
  {
    name: "Sunita Joshi",
    craft: "Pottery",
    region: "Himachal Pradesh",
    text: "Smart pricing suggestions helped me value my work correctly. I was underselling my art for years!",
    rating: 5
  }
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F5F5DC]">
      <AppNavbar />
      
      {/* Hero Section */}
      <section className="relative px-6 lg:px-8 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl text-center">
          <div className="flex justify-center mb-8">
            <Badge variant="secondary" className="bg-[#FF9933]/10 text-[#4B0082] border-[#FF9933]/20 px-4 py-2">
              <Sparkles className="h-4 w-4 mr-2" />
              AI-Powered Artisan Platform
            </Badge>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl font-['Playfair_Display',serif]">
            Empower Your{" "}
            <span className="text-[#FF9933]">Craft</span>{" "}
            with{" "}
            <span className="text-[#4B0082]">AI</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto font-['PT_Sans',sans-serif]">
            CraftConnect AI helps artisans showcase their heritage, tell their stories, and reach global audiences with intelligent tools for catalog creation, pricing, and marketing.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-[#FF9933] hover:bg-[#FF9933]/90 text-white px-8 py-3 w-full sm:w-auto">
              <Link href="/auth?role=artisan">
                <Sparkles className="mr-2 h-5 w-5" />
                Join as Artisan
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-gray-800 text-white border-gray-800 hover:bg-gray-700 hover:border-gray-700 px-8 py-3 w-full sm:w-auto">
              <Link href="/marketplace">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Browse Marketplace
              </Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-gray-500 font-['PT_Sans',sans-serif]">
            <Link href="/auth?role=customer" className="underline hover:text-[#FF9933]">
              Or sign up as a customer to discover authentic crafts
            </Link>
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl font-['Playfair_Display',serif]">
              Features for{" "}
              <span className="text-[#FF9933]">Everyone</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 font-['PT_Sans',sans-serif]">
              Powerful AI tools for artisans, seamless discovery for customers
            </p>
          </div>

          {/* Artisan Features */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <Badge variant="secondary" className="bg-[#FF9933]/10 text-[#4B0082] border-[#FF9933]/20 px-4 py-2 mb-4">
                <Sparkles className="h-4 w-4 mr-2" />
                For Artisans
              </Badge>
              <h3 className="text-2xl font-bold text-gray-900 font-['Playfair_Display',serif]">
                AI-Powered Tools to Grow Your Craft Business
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {artisanFeatures.map((feature, index) => (
                <Card key={index} className="border-2 border-transparent hover:border-[#FF9933]/20 transition-all duration-300 hover:shadow-lg">
                  <CardHeader>
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="p-3 bg-[#FF9933]/10 text-[#4B0082] rounded-lg">
                        {feature.icon}
                      </div>
                      <div>
                        <Badge variant="outline" className="mb-2 text-xs">
                          {feature.badge}
                        </Badge>
                        <CardTitle className="text-lg font-['Playfair_Display',serif]">
                          {feature.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 font-['PT_Sans',sans-serif] text-center">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Customer Features */}
          <div>
            <div className="text-center mb-8">
              <Badge variant="secondary" className="bg-[#4B0082]/10 text-[#4B0082] border-[#4B0082]/20 px-4 py-2 mb-4">
                <ShoppingBag className="h-4 w-4 mr-2" />
                For Customers
              </Badge>
              <h3 className="text-2xl font-bold text-gray-900 font-['Playfair_Display',serif]">
                Discover and Support Authentic Indian Crafts
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {customerFeatures.map((feature, index) => (
                <Card key={index} className="border-2 border-transparent hover:border-[#4B0082]/20 transition-all duration-300 hover:shadow-lg">
                  <CardHeader>
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="p-3 bg-[#4B0082]/10 text-[#4B0082] rounded-lg">
                        {feature.icon}
                      </div>
                      <CardTitle className="text-lg font-['Playfair_Display',serif]">
                        {feature.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 font-['PT_Sans',sans-serif] text-center">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Artisan Showcase Section */}
      <ArtisanShowcase />

      {/* Marketplace Preview Section */}
      <section id="marketplace" className="py-24 px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl font-['Playfair_Display',serif]">
              Discover the{" "}
              <span className="text-[#FF9933]">Marketplace</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 font-['PT_Sans',sans-serif]">
              Browse authentic handcrafted products from talented artisans across India
            </p>
          </div>
          <div className="text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[#FF9933]/10 rounded-full flex items-center justify-center mb-4">
                  <Palette className="h-8 w-8 text-[#FF9933]" />
                </div>
                <h3 className="text-xl font-semibold mb-2 font-['Playfair_Display',serif]">10,000+ Products</h3>
                <p className="text-gray-600 font-['PT_Sans',sans-serif]">Handcrafted with love and tradition</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[#4B0082]/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-[#4B0082]" />
                </div>
                <h3 className="text-xl font-semibold mb-2 font-['Playfair_Display',serif]">5,000+ Artisans</h3>
                <p className="text-gray-600 font-['PT_Sans',sans-serif]">From every corner of India</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[#FF9933]/10 rounded-full flex items-center justify-center mb-4">
                  <Globe className="h-8 w-8 text-[#FF9933]" />
                </div>
                <h3 className="text-xl font-semibold mb-2 font-['Playfair_Display',serif]">28 States</h3>
                <p className="text-gray-600 font-['PT_Sans',sans-serif]">Rich cultural diversity</p>
              </div>
            </div>
            <Button asChild size="lg" className="bg-[#4B0082] hover:bg-[#4B0082]/90 text-white px-8 py-3">
              <Link href="/marketplace">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Explore Marketplace
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-6 lg:px-8 bg-[#F5F5DC]">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl font-['Playfair_Display',serif]">
              Success{" "}
              <span className="text-[#FF9933]">Stories</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 font-['PT_Sans',sans-serif]">
              See how CraftConnect AI is transforming artisan businesses
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <CardDescription className="text-gray-700 italic font-['PT_Sans',sans-serif]">
                    "{testimonial.text}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-t pt-4">
                    <CardTitle className="text-sm font-['Playfair_Display',serif]">
                      {testimonial.name}
                    </CardTitle>
                    <CardDescription className="text-[#4B0082] text-sm">
                      {testimonial.craft} • {testimonial.region}
                    </CardDescription>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="about" className="py-24 px-6 lg:px-8 bg-[#4B0082] text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl font-['Playfair_Display',serif]">
            Ready to Join{" "}
            <span className="text-[#FF9933]">CraftConnect</span>
            ?
          </h2>
          <p className="mt-6 text-lg leading-8 text-indigo-100 font-['PT_Sans',sans-serif]">
            Whether you're an artisan looking to grow your business or a customer seeking authentic crafts, we have something for you.
          </p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Artisan CTA */}
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur">
              <Sparkles className="h-12 w-12 text-[#FF9933] mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 font-['Playfair_Display',serif]">For Artisans</h3>
              <p className="text-indigo-100 mb-6 text-sm font-['PT_Sans',sans-serif]">
                Use AI-powered tools to grow your craft business and reach global customers
              </p>
              <Button asChild size="lg" className="bg-[#FF9933] hover:bg-[#FF9933]/90 text-white w-full">
                <Link href="/auth?role=artisan">
                  <Zap className="mr-2 h-5 w-5" />
                  Start Selling
                </Link>
              </Button>
            </div>
            
            {/* Customer CTA */}
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur">
              <ShoppingBag className="h-12 w-12 text-[#FF9933] mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 font-['Playfair_Display',serif]">For Customers</h3>
              <p className="text-indigo-100 mb-6 text-sm font-['PT_Sans',sans-serif]">
                Discover authentic handcrafted products and support local artisans
              </p>
              <Button asChild variant="outline" size="lg" className="bg-white text-[#4B0082] border-white hover:bg-gray-100 hover:text-[#4B0082] w-full">
                <Link href="/auth?role=customer">
                  <Heart className="mr-2 h-5 w-5" />
                  Start Shopping
                </Link>
              </Button>
            </div>
          </div>
          <p className="mt-8 text-sm text-indigo-200 font-['PT_Sans',sans-serif]">
            Free to join • Secure platform • Supporting 10,000+ artisans
          </p>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
