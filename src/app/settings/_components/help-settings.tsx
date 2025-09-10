"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
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

  const handleContactSupport = () => {
    toast({
      title: "Support Request",
      description: "We'll get back to you within 24 hours.",
    });
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
      badge: "New",
      action: "Watch Videos"
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
      question: "What payment methods are accepted?",
      category: "Payments"
    },
    {
      question: "How can I promote my artisan profile?",
      category: "Marketing"
    },
    {
      question: "What are the commission rates?",
      category: "Fees"
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
                        <Badge variant={section.badge === "New" ? "default" : "secondary"} className="text-xs">
                          {section.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  {section.action}
                  <ExternalLink className="h-3 w-3 ml-2" />
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
                <Button variant="ghost" size="sm">
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
            <Button variant="outline" className="justify-start">
              <Star className="h-4 w-4 mr-2" />
              Rate Your Experience
            </Button>
            
            <Button variant="outline" className="justify-start">
              <MessageCircle className="h-4 w-4 mr-2" />
              Suggest a Feature
            </Button>
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <HelpCircle className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800">Join Our Beta Program</p>
                <p className="text-sm text-blue-600">
                  Be the first to try new features and help shape the future of our platform.
                </p>
                <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700">
                  Learn More
                </Button>
              </div>
            </div>
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
            <Button variant="outline" size="sm">
              Terms of Service
            </Button>
            <Button variant="outline" size="sm">
              Privacy Policy
            </Button>
            <Button variant="outline" size="sm">
              Release Notes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
