"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ChevronRight, ChevronLeft, User, MapPin, Palette, FileText } from "lucide-react";

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

export default function OnboardingPage() {
  const router = useRouter();
  const { user, updateArtisanProfile } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
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

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

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

  const handleNext = () => {
    // Validate current step
    let isValid = true;
    let errorMessage = "";

    switch (step) {
      case 1:
        if (!profile.name.trim()) {
          isValid = false;
          errorMessage = "Please enter your name";
        }
        break;
      case 2:
        if (!profile.region.trim() || !profile.state) {
          isValid = false;
          errorMessage = "Please enter your region and state";
        }
        break;
      case 3:
        if (!profile.specialization) {
          isValid = false;
          errorMessage = "Please select your specialization";
        }
        break;
    }

    if (!isValid) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: errorMessage,
      });
      return;
    }

    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    if (!profile.bio.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please write a brief bio about yourself and your craft",
      });
      return;
    }

    setLoading(true);
    try {
      // Save the complete profile
      const fullRegion = `${profile.region}, ${profile.state}`;
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
        title: "Welcome to CraftConnect!",
        description: "Your artisan profile has been created successfully.",
      });

      // Redirect to dashboard
      router.push("/dashboard");
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to CraftConnect</CardTitle>
          <p className="text-muted-foreground">Let's set up your artisan profile</p>
          <Progress value={progress} className="mt-4" />
          <p className="text-sm text-muted-foreground mt-2">Step {step} of {totalSteps}</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <User className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Tell us about yourself</h3>
              </div>
              
              <div>
                <Label htmlFor="name">Your Name *</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="experience">Years of Experience (Optional)</Label>
                <Input
                  id="experience"
                  value={profile.experience}
                  onChange={(e) => setProfile(prev => ({ ...prev, experience: e.target.value }))}
                  placeholder="e.g., 10 years"
                  className="mt-2"
                />
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Where are you from?</h3>
              </div>

              <div>
                <Label htmlFor="state">State *</Label>
                <Select value={profile.state} onValueChange={(value) => setProfile(prev => ({ ...prev, state: value }))}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select your state" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDIAN_STATES.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="region">City/Region *</Label>
                <Input
                  id="region"
                  value={profile.region}
                  onChange={(e) => setProfile(prev => ({ ...prev, region: e.target.value }))}
                  placeholder="e.g., Jaipur, Kutch, Varanasi"
                  className="mt-2"
                />
              </div>
            </div>
          )}

          {/* Step 3: Craft Specialization */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Palette className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">What's your craft?</h3>
              </div>

              <div>
                <Label htmlFor="specialization">Primary Specialization *</Label>
                <Select value={profile.specialization} onValueChange={(value) => setProfile(prev => ({ ...prev, specialization: value }))}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select your primary craft" />
                  </SelectTrigger>
                  <SelectContent>
                    {SPECIALIZATIONS.map(spec => (
                      <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="techniques">Techniques & Skills</Label>
                <div className="flex space-x-2 mt-2">
                  <Input
                    value={newTechnique}
                    onChange={(e) => setNewTechnique(e.target.value)}
                    placeholder="e.g., Block printing, Hand weaving"
                    onKeyPress={(e) => e.key === 'Enter' && addTechnique()}
                  />
                  <Button type="button" onClick={addTechnique}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
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
              </div>
            </div>
          )}

          {/* Step 4: Story & Bio */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Tell your story</h3>
              </div>

              <div>
                <Label htmlFor="bio">About You & Your Craft *</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell customers about your craft, your journey, and what makes your work special..."
                  rows={4}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="inspiration">What Inspires Your Work?</Label>
                <Textarea
                  id="inspiration"
                  value={profile.inspiration}
                  onChange={(e) => setProfile(prev => ({ ...prev, inspiration: e.target.value }))}
                  placeholder="Share what motivates and inspires your creativity..."
                  rows={3}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="goals">Your Goals on CraftConnect</Label>
                <Textarea
                  id="goals"
                  value={profile.goals}
                  onChange={(e) => setProfile(prev => ({ ...prev, goals: e.target.value }))}
                  placeholder="What do you hope to achieve? Growing your business, reaching new customers..."
                  rows={2}
                  className="mt-2"
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={step === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {step < totalSteps ? (
              <Button onClick={handleNext}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleComplete} disabled={loading}>
                {loading ? "Creating Profile..." : "Complete Setup"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
