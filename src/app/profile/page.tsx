"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
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
  ArrowLeft
} from "lucide-react";

const SPECIALIZATIONS = [
  "Pottery & Ceramics",
  "Textiles & Weaving",
  "Jewelry & Metalwork",
  "Wood Carving",
  "Painting & Art",
  "Leather Work",
  "Embroidery",
  "Block Printing",
  "Handicrafts",
  "Sculpture",
  "Other"
];

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
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [profile, setProfile] = useState({
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

  useEffect(() => {
    if (user?.artisanProfile) {
      const currentProfile = user.artisanProfile;
      
      // Parse region to extract city and state
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

      // Parse techniques from comma-separated string
      let techniques: string[] = [];
      if ((currentProfile as any).techniques) {
        techniques = (currentProfile as any).techniques.split(", ").filter((t: string) => t.trim());
      }

      setProfile({
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
  }, [user]);

  const addTechnique = () => {
    if (newTechnique.trim() && !profile.techniques.includes(newTechnique.trim())) {
      setProfile(prev => ({
        ...prev,
        techniques: [...prev.techniques, newTechnique.trim()]
      }));
      setNewTechnique("");
    }
  };

  const removeTechnique = (technique: string) => {
    setProfile(prev => ({
      ...prev,
      techniques: prev.techniques.filter(t => t !== technique)
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const fullRegion = profile.state ? `${profile.region}, ${profile.state}` : profile.region;
      
      updateArtisanProfile({
        name: profile.name,
        region: fullRegion,
        specialization: profile.specialization,
        bio: profile.bio,
        experience: profile.experience,
        techniques: profile.techniques.join(", "),
        inspiration: profile.inspiration,
        goals: profile.goals
      });

      toast({
        title: "Profile Updated",
        description: "Your artisan profile has been saved successfully.",
      });

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
              <CardTitle className="text-xl">{profile.name || "Artisan"}</CardTitle>
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
