"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useOrders } from "@/contexts/orders-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PageLayout } from "@/components/page-layout";
import { PageHeader } from "@/components/page-header";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  MapPin, 
  Palette, 
  FileText, 
  Save, 
  Edit,
  Calendar,
  Award,
  Heart,
  Target,
  ArrowLeft,
  Package,
  ShoppingBag,
  Star,
  Mail,
  Phone
} from "lucide-react";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateArtisanProfile } = useAuth();
  const { getCustomerOrders, reviews } = useOrders();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Customer profile state
  const [customerProfile, setCustomerProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    preferences: ""
  });
  
  // Artisan profile state (for backward compatibility)
  const [artisanProfile, setArtisanProfile] = useState({
    name: "",
    region: "",
    state: "",
    specialization: "",
    bio: "",
    experience: "",
    techniques: [] as string[],
    inspiration: "",
    goals: ""
  });

  const [newTechnique, setNewTechnique] = useState("");
  const isCustomer = user?.role === 'customer';
  const orders = isCustomer ? getCustomerOrders('current-customer') : [];
  const customerReviews = isCustomer ? reviews.filter(r => r.customerId === 'current-customer') : [];

  useEffect(() => {
    if (user?.artisanProfile) {
      if (isCustomer) {
        // Load customer profile from user data
        setCustomerProfile({
          name: user.artisanProfile.name || user.displayName || "",
          email: user.email || "",
          phone: "",
          address: "",
          city: "",
          state: user.artisanProfile.region?.split(", ")[1] || "",
          pincode: "",
          preferences: ""
        });
      } else {
        // Load artisan profile
        const currentProfile = user.artisanProfile;
        
        let city = "";
        let state = "";
        if (currentProfile.region) {
          const parts = currentProfile.region.split(", ");
          if (parts.length >= 2) {
            city = parts[0];
            state = parts[1];
          } else {
            city = currentProfile.region;
          }
        }

        let techniques: string[] = [];
        if ((currentProfile as any).techniques) {
          techniques = (currentProfile as any).techniques.split(", ").filter((t: string) => t.trim());
        }

        setArtisanProfile({
          name: currentProfile.name || "",
          region: city,
          state: state,
          specialization: currentProfile.specialization || "",
          bio: currentProfile.bio || "",
          experience: (currentProfile as any).experience || "",
          techniques: techniques,
          inspiration: (currentProfile as any).inspiration || "",
          goals: (currentProfile as any).goals || ""
        });
      }
    }
  }, [user, isCustomer]);

  const addTechnique = () => {
    if (newTechnique.trim() && !artisanProfile.techniques.includes(newTechnique.trim())) {
      setArtisanProfile(prev => ({
        ...prev,
        techniques: [...prev.techniques, newTechnique.trim()]
      }));
      setNewTechnique("");
    }
  };

  const removeTechnique = (technique: string) => {
    setArtisanProfile(prev => ({
      ...prev,
      techniques: prev.techniques.filter(t => t !== technique)
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (isCustomer) {
        // Save customer profile
        updateArtisanProfile({
          name: customerProfile.name,
          region: customerProfile.city ? `${customerProfile.city}, ${customerProfile.state}` : customerProfile.state,
        });
        
        toast({
          title: "Profile Updated",
          description: "Your profile has been saved successfully.",
        });
      } else {
        // Save artisan profile
        const fullRegion = artisanProfile.state ? `${artisanProfile.region}, ${artisanProfile.state}` : artisanProfile.region;
        
        updateArtisanProfile({
          name: artisanProfile.name,
          region: fullRegion,
          specialization: artisanProfile.specialization,
          bio: artisanProfile.bio,
          experience: artisanProfile.experience,
          techniques: artisanProfile.techniques.join(", "),
          inspiration: artisanProfile.inspiration,
          goals: artisanProfile.goals
        });

        toast({
          title: "Profile Updated",
          description: "Your artisan profile has been saved successfully.",
        });
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (isCustomer) {
    // Customer Profile Page
    return (
      <PageLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <PageHeader 
              title="My Profile" 
              description="Manage your account information and preferences"
            />
            <div className="flex items-center space-x-2">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Summary */}
            <Card className="lg:col-span-1">
              <CardHeader className="text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">
                    {customerProfile.name ? customerProfile.name.charAt(0).toUpperCase() : "C"}
                  </span>
                </div>
                <CardTitle className="text-xl">{customerProfile.name || "Customer"}</CardTitle>
                <Badge variant="secondary" className="mt-2">
                  <ShoppingBag className="h-3 w-3 mr-1" />
                  Customer
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-[#FF9933]">{orders.length}</div>
                    <div className="text-xs text-muted-foreground">Orders</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#4B0082]">{customerReviews.length}</div>
                    <div className="text-xs text-muted-foreground">Reviews</div>
                  </div>
                </div>
                {customerProfile.email && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground truncate">{customerProfile.email}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Profile Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Personal Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={customerProfile.name}
                          onChange={(e) => setCustomerProfile(prev => ({ ...prev, name: e.target.value }))}
                          className="mt-2"
                        />
                      ) : (
                        <p className="mt-2 text-sm">{customerProfile.name || "Not provided"}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <p className="mt-2 text-sm text-muted-foreground">{customerProfile.email || "Not provided"}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={customerProfile.phone}
                          onChange={(e) => setCustomerProfile(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+91 12345 67890"
                          className="mt-2"
                        />
                      ) : (
                        <p className="mt-2 text-sm">{customerProfile.phone || "Not provided"}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="pincode">PIN Code</Label>
                      {isEditing ? (
                        <Input
                          id="pincode"
                          value={customerProfile.pincode}
                          onChange={(e) => setCustomerProfile(prev => ({ ...prev, pincode: e.target.value }))}
                          placeholder="123456"
                          className="mt-2"
                        />
                      ) : (
                        <p className="mt-2 text-sm">{customerProfile.pincode || "Not provided"}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Address Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>Address Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address">Address</Label>
                    {isEditing ? (
                      <Textarea
                        id="address"
                        value={customerProfile.address}
                        onChange={(e) => setCustomerProfile(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="House number, street, area"
                        className="mt-2"
                        rows={2}
                      />
                    ) : (
                      <p className="mt-2 text-sm">{customerProfile.address || "Not provided"}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      {isEditing ? (
                        <Input
                          id="city"
                          value={customerProfile.city}
                          onChange={(e) => setCustomerProfile(prev => ({ ...prev, city: e.target.value }))}
                          placeholder="Your city"
                          className="mt-2"
                        />
                      ) : (
                        <p className="mt-2 text-sm">{customerProfile.city || "Not provided"}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      {isEditing ? (
                        <Select value={customerProfile.state} onValueChange={(value) => setCustomerProfile(prev => ({ ...prev, state: value }))}>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            {INDIAN_STATES.map(state => (
                              <SelectItem key={state} value={state}>{state}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="mt-2 text-sm">{customerProfile.state || "Not provided"}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shopping Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="h-5 w-5" />
                    <span>Shopping Preferences</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="preferences">What type of crafts interest you most?</Label>
                    {isEditing ? (
                      <Textarea
                        id="preferences"
                        value={customerProfile.preferences}
                        onChange={(e) => setCustomerProfile(prev => ({ ...prev, preferences: e.target.value }))}
                        placeholder="e.g., Pottery, Textiles, Jewelry, Paintings..."
                        className="mt-2"
                        rows={3}
                      />
                    ) : (
                      <p className="mt-2 text-sm">{customerProfile.preferences || "Not specified"}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Artisan Profile Page (original content)
  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <PageHeader 
              title="Your Profile" 
              description="Manage your artisan profile and showcase your craft story"
            />
          </div>
          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Summary Card */}
          <Card className="lg:col-span-1">
            <CardHeader className="text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">
                  {profile.name ? profile.name.charAt(0).toUpperCase() : "A"}
                </span>
              </div>
                <CardTitle className="text-xl">{artisanProfile.name || "Artisan"}</CardTitle>
              <div className="flex flex-col items-center space-y-2">
                {profile.specialization && (
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <Palette className="h-3 w-3" />
                    <span>{profile.specialization}</span>
                  </Badge>
                )}
                {(profile.region || profile.state) && (
                  <Badge variant="outline" className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{profile.region}{profile.state ? `, ${profile.state}` : ""}</span>
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.experience && (
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Experience:</span>
                  <span className="font-medium">{profile.experience}</span>
                </div>
              )}
              
              {profile.techniques.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 text-sm mb-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Skills & Techniques</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {profile.techniques.map((technique, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {technique}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Basic Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                        className="mt-2"
                      />
                    ) : (
                      <p className="mt-2 text-sm">{profile.name || "Not provided"}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="experience">Years of Experience</Label>
                    {isEditing ? (
                      <Input
                        id="experience"
                        value={profile.experience}
                        onChange={(e) => setProfile(prev => ({ ...prev, experience: e.target.value }))}
                        placeholder="e.g., 10 years"
                        className="mt-2"
                      />
                    ) : (
                      <p className="mt-2 text-sm">{profile.experience || "Not specified"}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="state">State</Label>
                    {isEditing ? (
                      <Select value={profile.state} onValueChange={(value) => setProfile(prev => ({ ...prev, state: value }))}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {INDIAN_STATES.map(state => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="mt-2 text-sm">{profile.state || "Not provided"}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="region">City/Region</Label>
                    {isEditing ? (
                      <Input
                        id="region"
                        value={profile.region}
                        onChange={(e) => setProfile(prev => ({ ...prev, region: e.target.value }))}
                        placeholder="e.g., Jaipur, Kutch"
                        className="mt-2"
                      />
                    ) : (
                      <p className="mt-2 text-sm">{profile.region || "Not provided"}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="specialization">Primary Specialization</Label>
                  {isEditing ? (
                    <Select value={profile.specialization} onValueChange={(value) => setProfile(prev => ({ ...prev, specialization: value }))}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        {SPECIALIZATIONS.map(spec => (
                          <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="mt-2 text-sm">{profile.specialization || "Not specified"}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Skills & Techniques */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Skills & Techniques</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="flex space-x-2">
                      <Input
                        value={newTechnique}
                        onChange={(e) => setNewTechnique(e.target.value)}
                        placeholder="Add a skill or technique"
                        onKeyPress={(e) => e.key === 'Enter' && addTechnique()}
                      />
                      <Button onClick={addTechnique}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile.techniques.map((technique, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="cursor-pointer"
                          onClick={() => removeTechnique(technique)}
                        >
                          {technique} ×
                        </Badge>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile.techniques.length > 0 ? (
                      profile.techniques.map((technique, index) => (
                        <Badge key={index} variant="secondary">{technique}</Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No techniques added yet</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Story & Bio */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Your Story</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="bio">About You & Your Craft</Label>
                  {isEditing ? (
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell your story..."
                      rows={4}
                      className="mt-2"
                    />
                  ) : (
                    <p className="mt-2 text-sm whitespace-pre-wrap">{profile.bio || "No biography provided"}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="inspiration">What Inspires Your Work?</Label>
                  {isEditing ? (
                    <Textarea
                      id="inspiration"
                      value={profile.inspiration}
                      onChange={(e) => setProfile(prev => ({ ...prev, inspiration: e.target.value }))}
                      placeholder="Share your inspiration..."
                      rows={3}
                      className="mt-2"
                    />
                  ) : (
                    <p className="mt-2 text-sm whitespace-pre-wrap">{profile.inspiration || "Not specified"}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="goals">Your Goals on CraftConnect</Label>
                  {isEditing ? (
                    <Textarea
                      id="goals"
                      value={profile.goals}
                      onChange={(e) => setProfile(prev => ({ ...prev, goals: e.target.value }))}
                      placeholder="What do you hope to achieve?"
                      rows={2}
                      className="mt-2"
                    />
                  ) : (
                    <p className="mt-2 text-sm whitespace-pre-wrap">{profile.goals || "Not specified"}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
