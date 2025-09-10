"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Camera, Edit, Save, X } from "lucide-react";

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

export function ProfileSettings() {
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

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n.charAt(0)).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Profile Picture Section */}
      <div className="flex items-start space-x-6">
        <div className="relative">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user?.photoURL || ""} alt={profile.name} />
            <AvatarFallback className="bg-gradient-to-br from-orange-400 to-red-500 text-white text-lg font-bold">
              {getInitials(profile.name || "A")}
            </AvatarFallback>
          </Avatar>
          <Button
            size="icon"
            variant="secondary"
            className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
            onClick={() => toast({ title: "Coming Soon", description: "Profile picture upload will be available soon!" })}
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">{profile.name || "Your Name"}</h3>
              <p className="text-sm text-muted-foreground">
                {profile.specialization && profile.region 
                  ? `${profile.specialization} • ${profile.region}${profile.state ? `, ${profile.state}` : ""}`
                  : "Complete your profile to showcase your craft"
                }
              </p>
            </div>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button onClick={() => setIsEditing(false)} variant="ghost" size="sm">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={loading} size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Saving..." : "Save"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* Profile Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h4 className="font-semibold">Basic Information</h4>
          
          <div>
            <Label htmlFor="name">Full Name</Label>
            {isEditing ? (
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your full name"
                className="mt-1"
              />
            ) : (
              <p className="mt-1 text-sm px-3 py-2 border rounded-md bg-muted/50">
                {profile.name || "Not provided"}
              </p>
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
                className="mt-1"
              />
            ) : (
              <p className="mt-1 text-sm px-3 py-2 border rounded-md bg-muted/50">
                {profile.experience || "Not specified"}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="specialization">Primary Specialization</Label>
            {isEditing ? (
              <Select 
                value={profile.specialization} 
                onValueChange={(value) => setProfile(prev => ({ ...prev, specialization: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select your craft specialization" />
                </SelectTrigger>
                <SelectContent>
                  {SPECIALIZATIONS.map(spec => (
                    <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="mt-1 text-sm px-3 py-2 border rounded-md bg-muted/50">
                {profile.specialization || "Not specified"}
              </p>
            )}
          </div>
        </div>

        {/* Location Information */}
        <div className="space-y-4">
          <h4 className="font-semibold">Location</h4>
          
          <div>
            <Label htmlFor="state">State</Label>
            {isEditing ? (
              <Select 
                value={profile.state} 
                onValueChange={(value) => setProfile(prev => ({ ...prev, state: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select your state" />
                </SelectTrigger>
                <SelectContent>
                  {INDIAN_STATES.map(state => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="mt-1 text-sm px-3 py-2 border rounded-md bg-muted/50">
                {profile.state || "Not provided"}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="region">City/Region</Label>
            {isEditing ? (
              <Input
                id="region"
                value={profile.region}
                onChange={(e) => setProfile(prev => ({ ...prev, region: e.target.value }))}
                placeholder="e.g., Jaipur, Kutch, Varanasi"
                className="mt-1"
              />
            ) : (
              <p className="mt-1 text-sm px-3 py-2 border rounded-md bg-muted/50">
                {profile.region || "Not provided"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div>
        <Label htmlFor="bio">About You & Your Craft</Label>
        {isEditing ? (
          <Textarea
            id="bio"
            value={profile.bio}
            onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
            placeholder="Tell customers about your craft, your journey, and what makes your work special..."
            rows={4}
            className="mt-1"
          />
        ) : (
          <div className="mt-1 px-3 py-2 border rounded-md bg-muted/50 min-h-[100px]">
            <p className="text-sm whitespace-pre-wrap">
              {profile.bio || "No biography provided yet. Share your story to help customers connect with your craft!"}
            </p>
          </div>
        )}
      </div>

      {/* Skills & Techniques */}
      <div>
        <Label>Skills & Techniques</Label>
        {isEditing ? (
          <div className="mt-1 space-y-3">
            <div className="flex space-x-2">
              <Input
                value={newTechnique}
                onChange={(e) => setNewTechnique(e.target.value)}
                placeholder="Add a skill or technique"
                onKeyPress={(e) => e.key === 'Enter' && addTechnique()}
              />
              <Button onClick={addTechnique} size="sm">Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.techniques.map((technique, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => removeTechnique(technique)}
                >
                  {technique} ×
                </Badge>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-1 px-3 py-2 border rounded-md bg-muted/50">
            <div className="flex flex-wrap gap-2">
              {profile.techniques.length > 0 ? (
                profile.techniques.map((technique, index) => (
                  <Badge key={index} variant="secondary">{technique}</Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No skills added yet</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <Separator />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Need more control?</p>
          <p className="text-xs text-muted-foreground">
            Visit your full profile page for advanced editing options
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/profile">
            Full Profile Editor
          </Link>
        </Button>
      </div>
    </div>
  );
}
