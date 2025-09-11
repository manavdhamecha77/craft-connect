"use client";

import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential 
} from "firebase/auth";
import { auth } from "./firebase";
import { createUserProfile, validateUserRole, getUserProfile } from "./user-management";

export type AuthResult = {
  user?: {
    uid: string;
    email: string | null;
    displayName: string | null;
  };
  error?: string;
};

export const googleProvider = new GoogleAuthProvider();

export async function signUpWithEmail(
  email: string, 
  password: string, 
  displayName: string,
  role: 'artisan' | 'customer'
): Promise<AuthResult> {
  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth, 
      email, 
      password
    );
    
    // Update the user's profile with display name
    await updateProfile(userCredential.user, { displayName });

    const { uid, email: userEmail, displayName: userDisplayName } = userCredential.user;

    // Create a user profile with selected role
    const profileResult = await createUserProfile(uid, userEmail || '', userDisplayName || '', role);
    if (!profileResult.success) {
      return { error: profileResult.error };
    }

    return { 
      user: { 
        uid, 
        email: userEmail, 
        displayName: userDisplayName 
      } 
    };
  } catch (error: any) {
    console.error("Sign up error:", error);
    return { error: getAuthErrorMessage(error.code) };
  }
}

export async function signInWithEmail(
  email: string, 
  password: string,
  expectedRole?: 'artisan' | 'customer'
): Promise<AuthResult> {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth, 
      email, 
      password
    );
    
    const { uid, email: userEmail, displayName } = userCredential.user;

    // If expectedRole provided, validate against stored profile
    if (expectedRole) {
      const validation = await validateUserRole(uid, expectedRole);
      if (!validation.valid) {
        return { error: validation.error || 'Role mismatch. Please sign in with the correct role.' };
      }
    }

    return { 
      user: { 
        uid, 
        email: userEmail, 
        displayName 
      } 
    };
  } catch (error: any) {
    console.error("Sign in error:", error);
    return { error: getAuthErrorMessage(error.code) };
  }
}

export async function signInWithGoogle(expectedRole?: 'artisan' | 'customer'): Promise<AuthResult> {
  try {
    const userCredential: UserCredential = await signInWithPopup(auth, googleProvider);
    const { uid, email, displayName } = userCredential.user;

    // Only validate role if expectedRole is provided and user has a profile
    if (expectedRole) {
      const existingProfile = await getUserProfile(uid);
      
      if (!existingProfile) {
        // New user - create profile with selected role
        const profileResult = await createUserProfile(uid, email || '', displayName || '', expectedRole);
        if (!profileResult.success) {
          return { error: profileResult.error };
        }
      } else {
        // Existing user - validate role
        const validation = await validateUserRole(uid, expectedRole);
        if (!validation.valid) {
          return { error: validation.error || 'Role mismatch. Please sign in with the correct role.' };
        }
      }
    }
    
    return { 
      user: { 
        uid, 
        email, 
        displayName 
      } 
    };
  } catch (error: any) {
    console.error("Google sign in error:", error);
    return { error: getAuthErrorMessage(error.code) };
  }
}

// Helper function to provide user-friendly error messages
function getAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled.';
    case 'auth/popup-blocked':
      return 'Pop-up was blocked by your browser. Please allow pop-ups and try again.';
    default:
      return 'An error occurred during authentication. Please try again.';
  }
}
