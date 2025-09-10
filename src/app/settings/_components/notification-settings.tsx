"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Mail, Smartphone, MessageCircle, ShoppingBag, Users, Star } from "lucide-react";

export function NotificationSettings() {
  const { toast } = useToast();

  const handleSaveSettings = () => {
    toast({
      title: "Notification Settings Saved",
      description: "Your notification preferences have been updated.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Mail className="h-4 w-4" />
          <h4 className="font-semibold">Email Notifications</h4>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Order notifications</Label>
              <p className="text-xs text-muted-foreground">
                Get notified when you receive new orders
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Product inquiries</Label>
              <p className="text-xs text-muted-foreground">
                Receive emails when customers ask about your products
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Weekly sales summary</Label>
              <p className="text-xs text-muted-foreground">
                Get a weekly report of your sales and performance
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Marketing tips & updates</Label>
              <p className="text-xs text-muted-foreground">
                Receive tips to grow your craft business
              </p>
            </div>
            <Switch />
          </div>
        </div>
      </div>

      <Separator />

      {/* Push Notifications */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Smartphone className="h-4 w-4" />
          <h4 className="font-semibold">Push Notifications</h4>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>New customer messages</Label>
              <p className="text-xs text-muted-foreground">
                Instant notifications for customer messages
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Product views milestone</Label>
              <p className="text-xs text-muted-foreground">
                Get notified when your products reach view milestones
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Daily performance updates</Label>
              <p className="text-xs text-muted-foreground">
                Daily summary of product views and engagement
              </p>
            </div>
            <Switch />
          </div>
        </div>
      </div>

      <Separator />

      {/* Activity Notifications */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-4 w-4" />
          <h4 className="font-semibold">Activity Notifications</h4>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShoppingBag className="h-4 w-4 text-green-500" />
              <div>
                <Label>New orders</Label>
                <p className="text-xs text-muted-foreground">
                  When customers place orders for your products
                </p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="h-4 w-4 text-blue-500" />
              <div>
                <Label>New followers</Label>
                <p className="text-xs text-muted-foreground">
                  When someone follows your artisan store
                </p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Star className="h-4 w-4 text-yellow-500" />
              <div>
                <Label>Product reviews</Label>
                <p className="text-xs text-muted-foreground">
                  When customers leave reviews on your products
                </p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>

      <Separator />

      {/* Frequency Settings */}
      <div className="space-y-4">
        <h4 className="font-semibold">Notification Frequency</h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Instant notifications</Label>
              <p className="text-xs text-muted-foreground">
                Receive notifications immediately as they happen
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Daily digest</Label>
              <p className="text-xs text-muted-foreground">
                Get a summary of all activity once per day
              </p>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Weekly summary</Label>
              <p className="text-xs text-muted-foreground">
                Receive a comprehensive weekly business report
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Quiet Hours</p>
          <p className="text-xs text-muted-foreground">
            Set times when you don't want to receive notifications
          </p>
        </div>
        <Button variant="outline">
          Configure
        </Button>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>
          Save Notification Settings
        </Button>
      </div>
    </div>
  );
}
