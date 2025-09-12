"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { createUserProfile, getUserProfile } from '@/lib/user-management';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ShoppingBag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ProfileMigration() {
  const [isCreating, setIsCreating] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isChecking, setIsChecking] = useState(true);
  const { user, refreshUserProfile } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // Check if user already has a profile when component mounts
  useEffect(() => {
    if (!user) return;
    
    const checkExistingProfile = async () => {
      try {
        setIsChecking(true);
        const existingProfile = await getUserProfile(user.uid);
        
        if (existingProfile) {
          // User already has a profile, redirect them
          const redirectPath = existingProfile.role === 'artisan' ? '/onboarding' : '/marketplace';
          
          toast({
            title: "Profile Found",
            description: `Welcome back! Redirecting you to your ${existingProfile.role} area.`,
          });
          
          // Update auth context with existing profile
          await refreshUserProfile();
          
          setTimeout(() => {
            router.replace(redirectPath);
            
            // Fallback redirect
            setTimeout(() => {
              if (window.location.pathname === '/migrate') {
                window.location.href = redirectPath;
              }
            }, 2000);
          }, 1500);
        }
      } catch (error) {
        console.error('Error checking existing profile:', error);
        // Continue with normal flow if check fails
      } finally {
        setIsChecking(false);
      }
    };
    
    checkExistingProfile();
  }, [user, router, toast, refreshUserProfile]);

  if (!user) return null;
  
  // Show loading state while checking for existing profile
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-amber-50/50 to-primary/5 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p className="text-sm text-muted-foreground">Checking your account...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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

        try {
          // Refresh user profile to update auth context
          await refreshUserProfile();
          
          // Perform redirect with fallback mechanisms
          const redirectPath = role === 'artisan' ? '/onboarding' : '/marketplace';
          
          // Wait for state to update, then redirect
          setTimeout(async () => {
            try {
              await router.replace(redirectPath);
              
              // Add additional fallback if router.replace doesn't work
              setTimeout(() => {
                if (window.location.pathname === '/migrate') {
                  console.log('Router redirect failed, using window.location');
                  window.location.href = redirectPath;
                }
              }, 2000);
            } catch (redirectError) {
              console.error('Router redirect failed:', redirectError);
              // Fallback to window.location
              window.location.href = redirectPath;
            }
          }, 1000);
        } catch (refreshError) {
          console.error('Profile refresh failed:', refreshError);
          // Still try to redirect even if refresh fails
          const redirectPath = role === 'artisan' ? '/onboarding' : '/marketplace';
          setTimeout(() => {
            window.location.href = redirectPath;
          }, 1000);
        }
      } else {
        // Check if we should retry
        if (retryCount < 2 && result.error?.includes('network')) {
          setRetryCount(prev => prev + 1);
          toast({
            title: "Retrying...",
            description: `Network issue detected. Retrying profile creation (${retryCount + 1}/3)...`,
          });
          // Retry after a short delay
          setTimeout(() => {
            handleCreateProfile(role);
          }, 2000);
          return;
        }
        
        toast({
          variant: "destructive",
          title: "Profile Creation Failed",
          description: result.error || "Failed to create your profile. Please try again.",
        });
        setRetryCount(0); // Reset retry count on explicit failure
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      
      // If multiple failures, offer emergency fallback
      if (retryCount >= 2) {
        toast({
          variant: "destructive",
          title: "Multiple Failures Detected",
          description: "Please refresh the page or contact support if this continues.",
          action: (
            <button 
              onClick={() => window.location.reload()} 
              className="text-sm underline"
            >
              Refresh Page
            </button>
          ),
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
        });
      }
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
          
          {isCreating && (
            <div className="text-center py-2">
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <p className="text-sm text-muted-foreground">
                  {retryCount > 0 ? `Retrying (${retryCount}/3)...` : 'Creating your profile...'}
                </p>
              </div>
            </div>
          )}
          
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
