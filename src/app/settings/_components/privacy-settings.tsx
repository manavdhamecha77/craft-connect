"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Shield, Eye, Lock, Download, Trash2, AlertTriangle } from "lucide-react";

export function PrivacySettings() {
  const { toast } = useToast();
  const { signOut } = useAuth();

  const handleSaveSettings = () => {
    toast({
      title: "Privacy Settings Updated",
      description: "Your privacy preferences have been saved.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Data Export Initiated",
      description: "We'll email you a copy of your data within 24 hours.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      variant: "destructive",
      title: "Account Deletion",
      description: "This feature will be available soon. Contact support for assistance.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Profile Visibility */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Eye className="h-4 w-4" />
          <h4 className="font-semibold">Profile Visibility</h4>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Public profile</Label>
              <p className="text-xs text-muted-foreground">
                Make your artisan profile visible to everyone
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Show contact information</Label>
              <p className="text-xs text-muted-foreground">
                Display your region and specialization publicly
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Show product count</Label>
              <p className="text-xs text-muted-foreground">
                Display how many products you have created
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>

      <Separator />

      {/* Data Privacy */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Shield className="h-4 w-4" />
          <h4 className="font-semibold">Data Privacy</h4>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Analytics tracking</Label>
              <p className="text-xs text-muted-foreground">
                Help us improve by sharing anonymous usage data
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Performance monitoring</Label>
              <p className="text-xs text-muted-foreground">
                Track app performance to enhance your experience
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Marketing communications</Label>
              <p className="text-xs text-muted-foreground">
                Receive personalized tips and product updates
              </p>
            </div>
            <Switch />
          </div>
        </div>
      </div>

      <Separator />

      {/* Security Settings */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Lock className="h-4 w-4" />
          <h4 className="font-semibold">Security</h4>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Two-factor authentication</Label>
              <p className="text-xs text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Button variant="outline" size="sm">
              Enable
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Login alerts</Label>
              <p className="text-xs text-muted-foreground">
                Get notified of new login attempts
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Session management</Label>
              <p className="text-xs text-muted-foreground">
                Manage active sessions across devices
              </p>
            </div>
            <Button variant="outline" size="sm">
              Manage
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* Data Management */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <h4 className="font-semibold">Data Management</h4>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Export your data</Label>
              <p className="text-xs text-muted-foreground">
                Download a copy of your profile, products, and activity data
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Data retention</Label>
              <p className="text-xs text-muted-foreground">
                Choose how long we keep your data after account deletion
              </p>
            </div>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* Danger Zone */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <h4 className="font-semibold text-red-700">Danger Zone</h4>
        </div>
        
        <div className="border border-red-200 rounded-lg p-4 bg-red-50">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-red-700">Delete account</Label>
                <p className="text-xs text-red-600">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </div>
            
            <p className="text-xs text-red-600">
              <strong>Warning:</strong> This action cannot be undone. All your products, 
              profile information, and account data will be permanently deleted.
            </p>
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Privacy Policy</p>
          <p className="text-xs text-muted-foreground">
            Learn more about how we protect your data
          </p>
        </div>
        <Button variant="outline">
          View Policy
        </Button>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>
          Save Privacy Settings
        </Button>
      </div>
    </div>
  );
}
