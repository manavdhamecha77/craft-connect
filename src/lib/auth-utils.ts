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
  displayName: string
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
  password: string
): Promise<AuthResult> {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth, 
      email, 
      password
    );
    
    const { uid, email: userEmail, displayName } = userCredential.user;
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

export async function signInWithGoogle(): Promise<AuthResult> {
  try {
    const userCredential: UserCredential = await signInWithPopup(auth, googleProvider);
    const { uid, email, displayName } = userCredential.user;
    
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
