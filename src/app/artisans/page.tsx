"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, Package, Users, Award } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/page-layout";
import { PageHeader } from "@/components/page-header";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getUserProfile } from "@/lib/user-management";
import { getArtisanProducts } from "@/lib/firestore-products";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ArtisanProfile {
  uid: string;
  displayName: string;
  role: 'artisan';
  artisanProfile: {
    name: string;
    region: string;
    specialization?: string;
    bio?: string;
    experience?: string;
    techniques?: string;
  };
  productCount: number;
  totalValue: number;
  avgRating: number;
  coverImage?: string;
}

export default function ArtisansPage() {
  const [artisans, setArtisans] = useState<ArtisanProfile[]>([]);
  const [filteredArtisans, setFilteredArtisans] = useState<ArtisanProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");

  useEffect(() => {
    loadArtisans();
  }, []);

  useEffect(() => {
    filterArtisans();
  }, [artisans, searchQuery, selectedRegion, selectedSpecialization]);

  const loadArtisans = async () => {
    try {
      setLoading(true);
      
      // Fetch real artisans from Firestore users collection
      const usersRef = collection(db, 'users');
      const artisansQuery = query(usersRef, where('role', '==', 'artisan'));
      const querySnapshot = await getDocs(artisansQuery);
      
      const fetchedArtisans: ArtisanProfile[] = [];
      
      // Process each artisan and fetch their product stats
      for (const doc of querySnapshot.docs) {
        const userData = doc.data();
        const artisanId = doc.id;
        
        try {
          // Fetch artisan's products to calculate stats
          const products = await getArtisanProducts(artisanId);
          const activeProducts = products.filter(p => p.status === 'active');
          
          // Calculate stats
          const productCount = activeProducts.length;
          const totalValue = activeProducts.reduce((sum, product) => {
            const price = product.artisanEdits?.customPrice || product.price || 0;
            return sum + price;
          }, 0);
          
          // Generate a random rating between 4.0 and 5.0 for demo purposes
          // In a real app, this would come from actual reviews
          const avgRating = Math.round((Math.random() * 1.0 + 4.0) * 10) / 10;
          
          // Create cover image URL based on specialization or use a default
          const getCoverImage = (specialization: string) => {
            const imageMap: { [key: string]: string } = {
              'pottery': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop',
              'painting': 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=250&fit=crop',
              'textile': 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=250&fit=crop',
              'jewelry': 'https://images.unsplash.com/photo-1544891504-2c1e5a8cb7e2?w=400&h=250&fit=crop',
              'handicraft': 'https://images.unsplash.com/photo-1544919982-b61976f0ba43?w=400&h=250&fit=crop',
              'embroidery': 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=250&fit=crop'
            };
            
            const spec = specialization?.toLowerCase() || '';
            for (const [key, image] of Object.entries(imageMap)) {
              if (spec.includes(key)) return image;
            }
            return 'https://images.unsplash.com/photo-1544891504-2c1e5a8cb7e2?w=400&h=250&fit=crop';
          };
          
          const artisanProfile: ArtisanProfile = {
            uid: artisanId,
            displayName: userData.displayName || userData.artisanProfile?.name || 'Anonymous Artisan',
            role: 'artisan',
            artisanProfile: {
              name: userData.artisanProfile?.name || userData.displayName || 'Anonymous Artisan',
              region: userData.artisanProfile?.region || 'Unknown Region',
              specialization: userData.artisanProfile?.specialization,
              bio: userData.artisanProfile?.bio || 'Passionate artisan creating beautiful handcrafted pieces.',
              experience: userData.artisanProfile?.experience,
              techniques: userData.artisanProfile?.techniques
            },
            productCount,
            totalValue,
            avgRating,
            coverImage: getCoverImage(userData.artisanProfile?.specialization || '')
          };
          
          fetchedArtisans.push(artisanProfile);
        } catch (productError) {
          console.error(`Error fetching products for artisan ${artisanId}:`, productError);
          
          // Still add the artisan even if product fetch fails
          const artisanProfile: ArtisanProfile = {
            uid: artisanId,
            displayName: userData.displayName || userData.artisanProfile?.name || 'Anonymous Artisan',
            role: 'artisan',
            artisanProfile: {
              name: userData.artisanProfile?.name || userData.displayName || 'Anonymous Artisan',
              region: userData.artisanProfile?.region || 'Unknown Region',
              specialization: userData.artisanProfile?.specialization,
              bio: userData.artisanProfile?.bio || 'Passionate artisan creating beautiful handcrafted pieces.',
              experience: userData.artisanProfile?.experience,
              techniques: userData.artisanProfile?.techniques
            },
            productCount: 0,
            totalValue: 0,
            avgRating: 4.5,
            coverImage: 'https://images.unsplash.com/photo-1544891504-2c1e5a8cb7e2?w=400&h=250&fit=crop'
          };
          
          fetchedArtisans.push(artisanProfile);
        }
      }
      
      // Sort artisans by product count (most active first) then by name
      fetchedArtisans.sort((a, b) => {
        if (b.productCount !== a.productCount) {
          return b.productCount - a.productCount;
        }
        return a.artisanProfile.name.localeCompare(b.artisanProfile.name);
      });

      setArtisans(fetchedArtisans);
    } catch (error) {
      console.error('Error loading artisans:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterArtisans = () => {
    let filtered = artisans;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(artisan => 
        artisan.artisanProfile.name.toLowerCase().includes(query) ||
        artisan.artisanProfile.region.toLowerCase().includes(query) ||
        artisan.artisanProfile.specialization?.toLowerCase().includes(query) ||
        artisan.artisanProfile.bio?.toLowerCase().includes(query)
      );
    }

    // Region filter
    if (selectedRegion !== "all") {
      filtered = filtered.filter(artisan => artisan.artisanProfile.region === selectedRegion);
    }

    // Specialization filter
    if (selectedSpecialization !== "all") {
      filtered = filtered.filter(artisan => artisan.artisanProfile.specialization === selectedSpecialization);
    }

    setFilteredArtisans(filtered);
  };

  const getUniqueRegions = () => {
    const regions = artisans.map(artisan => artisan.artisanProfile.region);
    return [...new Set(regions)];
  };

  const getUniqueSpecializations = () => {
    const specializations = artisans
      .map(artisan => artisan.artisanProfile.specialization)
      .filter(Boolean);
    return [...new Set(specializations)] as string[];
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading artisans...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <PageHeader
            title="Meet Our Artisans"
            description="Discover the talented craftspeople behind our beautiful handcrafted products"
          />
          <div className="flex items-center justify-center gap-6 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-primary" />
              <span>{artisans.length} Artisans</span>
            </div>
            <div className="flex items-center gap-1">
              <Package className="h-4 w-4 text-primary" />
              <span>{artisans.reduce((sum, a) => sum + a.productCount, 0)}+ Products</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{getUniqueRegions().length} States</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
          <div className="flex-1">
            <Input
              placeholder="Search artisans by name, region, or craft..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Regions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {getUniqueRegions().map(region => (
                <SelectItem key={region} value={region}>{region}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Crafts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Crafts</SelectItem>
              {getUniqueSpecializations().map(spec => (
                <SelectItem key={spec} value={spec}>{spec}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Artisans Grid */}
        {filteredArtisans.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No artisans found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery.trim() || selectedRegion !== "all" || selectedSpecialization !== "all"
                  ? "Try adjusting your search filters to find more artisans."
                  : "No artisans are currently available."}
              </p>
              {(searchQuery.trim() || selectedRegion !== "all" || selectedSpecialization !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedRegion("all");
                    setSelectedSpecialization("all");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="text-center text-sm text-muted-foreground mb-6">
              Showing {filteredArtisans.length} of {artisans.length} artisans
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredArtisans.map((artisan) => (
                <Link key={artisan.uid} href={`/artisans/${artisan.uid}`}>
                  <Card className="group hover:shadow-md transition-all duration-200 cursor-pointer border hover:border-primary/20 h-full flex flex-col">
                    <CardHeader className="pb-3 flex-shrink-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            {/* Simple Avatar Initial */}
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <span className="text-primary font-semibold text-sm">
                                {artisan.artisanProfile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                              </span>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-lg leading-tight truncate">{artisan.artisanProfile.name}</h3>
                              <div className="flex items-center text-sm text-muted-foreground mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                <span className="truncate">{artisan.artisanProfile.region}</span>
                              </div>
                              {artisan.artisanProfile.specialization && (
                                <Badge variant="secondary" className="text-xs mt-2">
                                  {artisan.artisanProfile.specialization}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-sm flex-shrink-0">
                          <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                          <span>{artisan.avgRating}</span>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="flex-1 flex flex-col justify-between">
                      {/* Bio - fixed to one line */}
                      <div className="mb-3">
                        {artisan.artisanProfile.bio && (
                          <p className="text-sm text-muted-foreground line-clamp-1 truncate">
                            {artisan.artisanProfile.bio}
                          </p>
                        )}
                      </div>
                      
                      {/* Footer - always at bottom */}
                      <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Package className="h-3 w-3" />
                            {artisan.productCount} Products
                          </span>
                          {artisan.artisanProfile.experience && (
                            <span className="flex items-center gap-1">
                              <Award className="h-3 w-3" />
                              {artisan.artisanProfile.experience}
                            </span>
                          )}
                        </div>
                        <span className="text-primary font-medium flex-shrink-0">View Profile →</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
}
