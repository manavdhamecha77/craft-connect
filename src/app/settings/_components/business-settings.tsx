"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Store, Package, IndianRupee, Globe } from "lucide-react";

export function BusinessSettings() {
  const { toast } = useToast();

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your business settings have been updated.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Store Information */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Store className="h-4 w-4" />
          <h4 className="font-semibold">Store Information</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="storeName">Store Name</Label>
            <Input
              id="storeName"
              placeholder="Your Artisan Store"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="storeSlug">Store URL</Label>
            <Input
              id="storeSlug"
              placeholder="your-store-name"
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              craftconnect.com/store/your-store-name
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Product Settings */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Package className="h-4 w-4" />
          <h4 className="font-semibold">Product Settings</h4>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Auto-publish products</Label>
              <p className="text-xs text-muted-foreground">
                Automatically make products visible when created
              </p>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Show cultural stories</Label>
              <p className="text-xs text-muted-foreground">
                Display AI-generated cultural stories by default
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable product reviews</Label>
              <p className="text-xs text-muted-foreground">
                Allow customers to leave reviews on your products
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>

      <Separator />

      {/* Pricing & Currency */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <IndianRupee className="h-4 w-4" />
          <h4 className="font-semibold">Pricing & Currency</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="currency">Default Currency</Label>
            <Input
              id="currency"
              value="INR (₹)"
              disabled
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="taxRate">Tax Rate (%)</Label>
            <Input
              id="taxRate"
              placeholder="18"
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Language & Region */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Globe className="h-4 w-4" />
          <h4 className="font-semibold">Language & Region</h4>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Show Hindi translations</Label>
              <p className="text-xs text-muted-foreground">
                Display product information in Hindi
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Show Gujarati translations</Label>
              <p className="text-xs text-muted-foreground">
                Display product information in Gujarati
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Advanced Business Features</p>
          <p className="text-xs text-muted-foreground">
            Access advanced analytics, bulk operations, and more
          </p>
        </div>
        <Button variant="outline">
          Coming Soon
        </Button>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>
          Save Business Settings
        </Button>
      </div>
    </div>
  );
}
