
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  signInAnonymously,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "./use-toast";
import { getUserProfile, createUserProfile, updateUserProfile } from "@/lib/user-management";


export interface ArtisanUser extends User {
  role?: 'artisan' | 'customer';
  artisanProfile?: {
    name: string;
    region: string;
    specialization?: string;
    bio?: string;
    experience?: string;
    techniques?: string;
    inspiration?: string;
    goals?: string;
  };
}

interface AuthContextType {
  user: ArtisanUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInAsGuest: () => Promise<void>;
  updateArtisanProfile: (profile: ArtisanUser['artisanProfile']) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ArtisanUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Load user profile from Firestore
          let userProfile = await getUserProfile(firebaseUser.uid);
          
          // If no profile exists, set user with a special flag to trigger migration
          if (!userProfile) {
            // Mark user as needing profile migration
            setUser({
              ...firebaseUser,
              role: 'customer', // Default role
              artisanProfile: {
                name: firebaseUser.displayName || 'Anonymous User',
                region: 'Unknown Region'
              },
              needsProfileMigration: true // Custom flag for migration
            } as ArtisanUser & { needsProfileMigration: boolean });
            setLoading(false);
            return;
          }
          
          if (userProfile) {
            setUser({
              ...firebaseUser,
              role: userProfile.role,
              artisanProfile: userProfile.artisanProfile || {
                name: firebaseUser.displayName || 'Anonymous User',
                region: 'Unknown Region'
              }
            } as ArtisanUser);
          } else {
            // Fallback - should not happen
            setUser({
              ...firebaseUser,
              role: 'customer',
              artisanProfile: {
                name: firebaseUser.displayName || 'Customer',
                region: 'Unknown Region'
              }
            } as ArtisanUser);
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
          // Fallback to basic user data
          setUser({
            ...firebaseUser,
            role: 'customer',
            artisanProfile: {
              name: firebaseUser.displayName || 'Customer',
              region: 'Unknown Region'
            }
          } as ArtisanUser);
        }
      } else {
        setUser(null);
        // If user is not authenticated and trying to access protected routes
        const protectedRoutes = ['/dashboard', '/products', '/orders', '/profile', '/onboarding', '/catalog-builder'];
        const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
        
        if (isProtectedRoute && pathname !== '/auth') {
          router.replace('/auth');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [pathname, router]);

  // Handle profile migration redirection
  useEffect(() => {
    if (!loading && user && (user as any).needsProfileMigration) {
      // Redirect to migration page if user needs profile setup
      if (pathname !== '/migrate') {
        router.replace('/migrate');
      }
    }
  }, [user, loading, router, pathname]);

  // Handle browser history navigation
  useEffect(() => {
    const handlePopState = () => {
      // If user is not authenticated and trying to go back to protected routes
      if (!user && !loading) {
        const protectedRoutes = ['/dashboard', '/products', '/orders', '/profile', '/onboarding', '/catalog-builder'];
        const isProtectedRoute = protectedRoutes.some(route => window.location.pathname.startsWith(route));
        
        if (isProtectedRoute) {
          window.history.replaceState(null, '', '/auth');
          router.replace('/auth');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [user, loading, router]);

  const signOut = async () => {
    await firebaseSignOut(auth);
    // Clear localStorage data on logout
    localStorage.removeItem('userRole');
    localStorage.removeItem('productDataNeedsRefresh');
    
    // Use replace instead of push to prevent back button issues
    router.replace("/auth");
  };

  const signInAsGuest = async () => {
    try {
      setLoading(true);
      await signInAnonymously(auth);
      // The onAuthStateChanged listener will handle setting the user
    } catch (error) {
      console.error('Error signing in anonymously:', error);
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Failed to sign in. Please try again.",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateArtisanProfile = async (profile: ArtisanUser['artisanProfile']) => {
    if (!user) return;

    try {
      // Update in Firestore
      await updateUserProfile(user.uid, { artisanProfile: profile });
      
      const updatedUser = {
        ...user,
        artisanProfile: profile
      };

      setUser(updatedUser);

      // Keep localStorage as backup
      localStorage.setItem(
        `artisan_profile_${user.uid}`,
        JSON.stringify(profile)
      );
    } catch (error) {
      console.error('Error updating artisan profile:', error);
      toast({
        variant: "destructive",
        title: "Profile Update Failed",
        description: "Failed to update your profile. Please try again.",
      });
    }
  };

  const value = { user, loading, signOut, signInAsGuest, updateArtisanProfile };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Custom hook to get current artisan ID
export function useCurrentArtisanId(): string | null {
  const { user } = useAuth();
  return user?.uid || null;
}

// Custom hook to check if user is authenticated
export function useRequireAuth() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to auth page if not authenticated
      const protectedRoutes = ['/dashboard', '/products', '/orders', '/profile', '/onboarding', '/catalog-builder'];
      const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
      
      if (isProtectedRoute) {
        router.replace('/auth');
      }
    }
  }, [loading, user, router, pathname]);

  return { user, loading };
}
