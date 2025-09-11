"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { createUserProfile } from '@/lib/user-management';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ShoppingBag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ProfileMigration() {
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  if (!user) return null;

  const handleCreateProfile = async (role: 'artisan' | 'customer') => {
    setIsCreating(true);
    
    try {
      const result = await createUserProfile(
        user.uid,
        user.email || '',
        user.displayName || '',
        role
      );

      if (result.success) {
        // Store role in localStorage for immediate UI update
        localStorage.setItem('userRole', role);
        
        toast({
          title: "Profile Created",
          description: `Your ${role} profile has been created successfully!`,
        });

        // Redirect to appropriate page
        const redirectPath = role === 'artisan' ? '/onboarding' : '/marketplace';
        router.replace(redirectPath);
        
        // Refresh the page to reload user data
        window.location.reload();
      } else {
        toast({
          variant: "destructive",
          title: "Profile Creation Failed",
          description: result.error || "Failed to create your profile. Please try again.",
        });
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-amber-50/50 to-primary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl mb-2">Complete Your Profile</CardTitle>
          <p className="text-muted-foreground text-sm">
            We need to set up your account role to continue. This is a one-time setup.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-center text-sm text-muted-foreground mb-6">
            Choose your role on CraftConnect AI:
          </p>
          
          <div className="space-y-3">
            <Button
              onClick={() => handleCreateProfile('artisan')}
              disabled={isCreating}
              className="w-full h-auto p-4 flex flex-col items-center gap-2"
              variant="outline"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#FF9933]" />
                <Badge variant="secondary" className="bg-[#FF9933]/10 text-[#4B0082] border-[#FF9933]/20">
                  Join as Artisan
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">
                Sell your handcrafted products and manage your craft business
              </span>
            </Button>
            
            <Button
              onClick={() => handleCreateProfile('customer')}
              disabled={isCreating}
              className="w-full h-auto p-4 flex flex-col items-center gap-2"
              variant="outline"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-[#4B0082]" />
                <Badge variant="secondary" className="bg-[#4B0082]/10 text-[#4B0082] border-[#4B0082]/20">
                  Join as Customer
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">
                Discover and purchase authentic handcrafted products
              </span>
            </Button>
          </div>
          
          <div className="text-center pt-4">
            <p className="text-xs text-muted-foreground">
              This choice is permanent and cannot be changed later.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
