
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
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Load user role from localStorage
        const userRole = localStorage.getItem('userRole') as 'artisan' | 'customer' || 'customer';
        
        // Load artisan profile from localStorage or set defaults
        const savedProfile = localStorage.getItem(`artisan_profile_${firebaseUser.uid}`);
        const artisanProfile = savedProfile ? JSON.parse(savedProfile) : {
          name: userRole === 'artisan' ? 'Anonymous Artisan' : firebaseUser.displayName || 'Customer',
          region: 'Unknown Region'
        };

        setUser({
          ...firebaseUser,
          role: userRole,
          artisanProfile
        } as ArtisanUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [pathname, router]);

  const signOut = async () => {
    await firebaseSignOut(auth);
    router.push("/auth");
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

  const updateArtisanProfile = (profile: ArtisanUser['artisanProfile']) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      artisanProfile: profile
    };

    setUser(updatedUser);

    // Save to localStorage
    localStorage.setItem(
      `artisan_profile_${user.uid}`,
      JSON.stringify(profile)
    );
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
  const { user, loading, signInAsGuest } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      // Automatically sign in as anonymous user for demo purposes
      signInAsGuest();
    }
  }, [loading, user, signInAsGuest]);

  return { user, loading };
}
