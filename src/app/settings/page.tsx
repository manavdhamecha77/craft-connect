"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageLayout } from "@/components/page-layout";
import { PageHeader } from "@/components/page-header";
import {
  User,
  Palette,
  Bell,
  Shield,
  CreditCard,
  Globe,
  HelpCircle,
  ArrowLeft,
  Settings as SettingsIcon
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { ArtisanProfile, ProfileCompletionIndicator } from "@/components/artisan-profile";
import { ProfileSettings } from "./_components/profile-settings";
import { BusinessSettings } from "./_components/business-settings";
import { NotificationSettings } from "./_components/notification-settings";
import { PrivacySettings } from "./_components/privacy-settings";
import { HelpSettings } from "./_components/help-settings";

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  const settingsSections = [
    {
      id: "profile",
      label: "Profile",
      icon: User,
      description: "Manage your artisan profile and personal information"
    },
    {
      id: "business",
      label: "Business",
      icon: Palette,
      description: "Store settings, craft specialization, and business details"
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      description: "Control how and when you receive notifications"
    },
    {
      id: "privacy",
      label: "Privacy & Security",
      icon: Shield,
      description: "Manage your privacy settings and account security"
    },
    {
      id: "help",
      label: "Help & Support",
      icon: HelpCircle,
      description: "Get help and contact support"
    }
  ];

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <PageHeader 
                title="Settings" 
                description="Manage your account, business, and app preferences"
              />
            </div>
          </div>
          {user?.artisanProfile && (
            <div className="flex items-center space-x-4">
              <ProfileCompletionIndicator artisan={user.artisanProfile} />
              <Button asChild size="sm">
                <Link href="/profile">Edit Profile</Link>
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <SettingsIcon className="h-4 w-4" />
                  <span>Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {settingsSections.map((section) => {
                  const IconComponent = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveTab(section.id)}
                      className={`w-full text-left p-3 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground ${
                        activeTab === section.id 
                          ? 'bg-primary text-primary-foreground' 
                          : 'text-muted-foreground'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent className="h-4 w-4" />
                        <div>
                          <p className="font-medium text-sm">{section.label}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Profile Summary */}
            {user?.artisanProfile && (
              <Card className="mt-4">
                <CardContent className="p-4">
                  <ArtisanProfile 
                    artisan={user.artisanProfile} 
                    variant="compact" 
                    showBio={false}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>Profile Settings</span>
                    </CardTitle>
                    <CardDescription>
                      Manage your personal information and artisan profile that customers see.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProfileSettings />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="business" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Palette className="h-5 w-5" />
                      <span>Business Settings</span>
                    </CardTitle>
                    <CardDescription>
                      Configure your craft business details, specialization, and store preferences.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BusinessSettings />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Bell className="h-5 w-5" />
                      <span>Notification Preferences</span>
                    </CardTitle>
                    <CardDescription>
                      Control how and when you receive notifications about your products and business.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <NotificationSettings />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="privacy" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="h-5 w-5" />
                      <span>Privacy & Security</span>
                    </CardTitle>
                    <CardDescription>
                      Manage your account security, data privacy, and visibility settings.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PrivacySettings />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="help" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <HelpCircle className="h-5 w-5" />
                      <span>Help & Support</span>
                    </CardTitle>
                    <CardDescription>
                      Get help, view documentation, or contact our support team.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <HelpSettings />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
