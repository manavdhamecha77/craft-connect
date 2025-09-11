"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  Phone, 
  FileText, 
  Book, 
  Video, 
  ExternalLink,
  Star,
  Users
} from "lucide-react";

export function HelpSettings() {
  const { toast } = useToast();
  
  // State for dialogs
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);
  const [isFeatureDialogOpen, setIsFeatureDialogOpen] = useState(false);
  
  // State for rating
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  
  // State for feature suggestion
  const [featureText, setFeatureText] = useState("");

  const handleContactSupport = () => {
    toast({
      title: "Support Request",
      description: "We'll get back to you within 24 hours.",
    });
  };

  const handleHelpAction = (action: string) => {
    switch (action) {
      case "Read Guide":
        toast({
          title: "Getting Started Guide",
          description: "Welcome to CraftConnect! Create your profile → Upload product photos → Use AI tools to generate descriptions → Add cultural stories → Set pricing → Publish to marketplace. Our AI assists you at every step to showcase your craft beautifully.",
        });
        break;
      case "View Tips":
        toast({
          title: "Photography Tips",
          description: "📸 Use natural light when possible • Take multiple angles (front, back, detail shots) • Show scale with everyday objects • Highlight unique textures and patterns • Clean backgrounds work best • Show the craft process if possible.",
        });
        break;
      case "Read Guidelines":
        toast({
          title: "Community Guidelines",
          description: "🎨 Only authentic handcrafted items • Respect cultural heritage • Use original photos • Price fairly • Respond to customers promptly • Share genuine stories behind your craft • Help fellow artisans grow together.",
        });
        break;
      case "Terms of Service":
        toast({
          title: "Terms of Service",
          description: "By using CraftConnect, you agree to our platform terms: Authentic handcrafted items only • Respect intellectual property • Fair pricing • Accurate descriptions • Timely order fulfillment • Community respect. Full terms available on our website.",
        });
        break;
      case "Privacy Policy":
        toast({
          title: "Privacy Policy",
          description: "We protect your data: Personal info secured with encryption • Photos used only for marketplace display • Payment details processed securely • We don't sell your data • You control your profile visibility • Contact us anytime about your data.",
        });
        break;
    }
  };

  const handleFAQAction = (question: string) => {
    switch (question) {
      case "How do I add cultural stories to my products?":
        toast({
          title: "Cultural Stories",
          description: "Cultural stories are automatically generated when you use our AI features in the Catalog Builder. Our AI creates authentic narratives based on your craft details, region, and techniques.",
        });
        break;
      case "How can I promote my artisan profile?":
        toast({
          title: "Promote Your Profile",
          description: "Use the AI tools in our Catalog Builder to create compelling product descriptions, generate social media content, and craft engaging stories. Our AI helps optimize your listings for better visibility.",
        });
        break;
    }
  };

  const helpSections = [
    {
      icon: <Book className="h-5 w-5" />,
      title: "Getting Started Guide",
      description: "Learn the basics of creating and managing your artisan profile",
      badge: "Popular",
      action: "Read Guide"
    },
    {
      icon: <Video className="h-5 w-5" />,
      title: "Video Tutorials",
      description: "Step-by-step video guides for common tasks",
      badge: "Coming Soon",
      action: "Coming Soon"
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: "Product Photography Tips",
      description: "Best practices for showcasing your handcrafted items",
      action: "View Tips"
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Community Guidelines",
      description: "Understanding our marketplace policies and standards",
      action: "Read Guidelines"
    }
  ];

  const faqItems = [
    {
      question: "How do I add cultural stories to my products?",
      category: "Products"
    },
    {
      question: "How can I promote my artisan profile?",
      category: "Marketing"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Contact Support</span>
          </CardTitle>
          <CardDescription>
            Get help from our dedicated artisan support team
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <MessageCircle className="h-6 w-6 text-blue-500" />
              <div>
                <p className="font-medium">Live Chat</p>
                <p className="text-sm text-muted-foreground">Mon-Fri, 9AM-6PM</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <Mail className="h-6 w-6 text-green-500" />
              <div>
                <p className="font-medium">Email Support</p>
                <p className="text-sm text-muted-foreground">24-48 hour response</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <Phone className="h-6 w-6 text-purple-500" />
              <div>
                <p className="font-medium">Phone Support</p>
                <p className="text-sm text-muted-foreground">Priority customers</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleContactSupport}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Help Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HelpCircle className="h-5 w-5" />
            <span>Help Resources</span>
          </CardTitle>
          <CardDescription>
            Guides and tutorials to help you succeed as an artisan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {helpSections.map((section, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  {section.icon}
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{section.title}</p>
                      {section.badge && (
                        <Badge 
                          variant={
                            section.badge === "New" ? "default" : 
                            section.badge === "Coming Soon" ? "outline" : 
                            "secondary"
                          } 
                          className="text-xs"
                        >
                          {section.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={section.action === "Coming Soon"}
                  onClick={() => section.action !== "Coming Soon" && handleHelpAction(section.action)}
                >
                  {section.action}
                  {section.action !== "Coming Soon" && <ExternalLink className="h-3 w-3 ml-2" />}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>
            Quick answers to common questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {faqItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{item.question}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {item.category}
                    </Badge>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleFAQAction(item.question)}
                >
                  View Answer
                </Button>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" className="w-full">
              View All FAQs
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5" />
            <span>Share Feedback</span>
          </CardTitle>
          <CardDescription>
            Help us improve your artisan experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Rate Your Experience */}
            <Dialog open={isRatingDialogOpen} onOpenChange={setIsRatingDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="justify-start">
                  <Star className="h-4 w-4 mr-2" />
                  Rate Your Experience
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rate Your Experience</DialogTitle>
                  <DialogDescription>Tell us how we're doing. Your feedback helps us improve.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {/* Star Rating */}
                  <div className="flex items-center space-x-1">
                    {[1,2,3,4,5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`text-2xl ${ (hoveredRating || rating) >= star ? 'text-yellow-500' : 'text-gray-300' }`}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        onClick={() => setRating(star)}
                        aria-label={`Rate ${star} star${star>1?'s':''}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>

                  {/* Review Text */}
                  <div className="space-y-2">
                    <Label htmlFor="review">Your review</Label>
                    <Textarea 
                      id="review"
                      placeholder="Share your experience..."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    onClick={() => {
                      if (rating === 0) {
                        toast({ variant: 'destructive', title: 'Please select a rating' });
                        return;
                      }
                      toast({
                        title: 'Thanks for your feedback! ⭐',
                        description: `Rating: ${rating}/5` + (reviewText ? ` • "${reviewText}"` : ''),
                      });
                      setIsRatingDialogOpen(false);
                      setRating(0);
                      setReviewText('');
                    }}
                  >
                    Submit
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            {/* Suggest a Feature */}
            <Dialog open={isFeatureDialogOpen} onOpenChange={setIsFeatureDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Suggest a Feature
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Suggest a Feature</DialogTitle>
                  <DialogDescription>Have an idea? We'd love to hear it.</DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                  <Label htmlFor="feature">Feature suggestion</Label>
                  <Textarea 
                    id="feature"
                    placeholder="Describe the feature you'd like to see..."
                    value={featureText}
                    onChange={(e) => setFeatureText(e.target.value)}
                    rows={4}
                  />
                </div>
                <DialogFooter>
                  <Button 
                    onClick={() => {
                      if (!featureText.trim()) {
                        toast({ variant: 'destructive', title: 'Please describe your feature idea' });
                        return;
                      }
                      toast({
                        title: 'Thanks for the suggestion! 💡',
                        description: 'We have received your feature request.',
                      });
                      setIsFeatureDialogOpen(false);
                      setFeatureText('');
                    }}
                  >
                    Submit
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* App Information */}
      <Card>
        <CardHeader>
          <CardTitle>App Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Version</p>
              <p className="text-muted-foreground">1.2.0</p>
            </div>
            <div>
              <p className="font-medium">Last Updated</p>
              <p className="text-muted-foreground">Dec 15, 2024</p>
            </div>
            <div>
              <p className="font-medium">Platform</p>
              <p className="text-muted-foreground">Web Application</p>
            </div>
            <div>
              <p className="font-medium">Region</p>
              <p className="text-muted-foreground">Global</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleHelpAction("Terms of Service")}
            >
              Terms of Service
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleHelpAction("Privacy Policy")}
            >
              Privacy Policy
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
