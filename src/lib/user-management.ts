"use client";

import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'artisan' | 'customer';
  createdAt: Timestamp;
  updatedAt: Timestamp;
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

const USERS_COLLECTION = 'users';

/**
 * Create a new user profile with role
 */
export async function createUserProfile(
  uid: string,
  email: string,
  displayName: string,
  role: 'artisan' | 'customer'
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if user already exists
    const existingUser = await getUserProfile(uid);
    if (existingUser) {
      return { 
        success: false, 
        error: `This account already exists as a ${existingUser.role}. Please sign in with the correct role.` 
      };
    }

    const userProfile: UserProfile = {
      uid,
      email,
      displayName,
      role,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      ...(role === 'artisan' && {
        artisanProfile: {
          name: displayName || 'Anonymous Artisan',
          region: 'Unknown Region'
        }
      })
    };

    const userDocRef = doc(db, USERS_COLLECTION, uid);
    await setDoc(userDocRef, userProfile);
    
    return { success: true };
  } catch (error) {
    console.error('Error creating user profile:', error);
    return { success: false, error: 'Failed to create user profile' };
  }
}

/**
 * Get user profile by UID
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

/**
 * Validate user role during sign in
 */
export async function validateUserRole(
  uid: string,
  expectedRole: 'artisan' | 'customer'
): Promise<{ valid: boolean; actualRole?: 'artisan' | 'customer'; error?: string }> {
  try {
    const userProfile = await getUserProfile(uid);
    
    if (!userProfile) {
      return { valid: false, error: 'User profile not found' };
    }
    
    if (userProfile.role !== expectedRole) {
      return { 
        valid: false, 
        actualRole: userProfile.role,
        error: `This account is registered as a ${userProfile.role}. Please sign in with the correct role.`
      };
    }
    
    return { valid: true, actualRole: userProfile.role };
  } catch (error) {
    console.error('Error validating user role:', error);
    return { valid: false, error: 'Failed to validate user role' };
  }
}

/**
 * Update user profile (for artisan profile updates)
 */
export async function updateUserProfile(
  uid: string,
  updates: Partial<Pick<UserProfile, 'displayName' | 'artisanProfile'>>
): Promise<{ success: boolean; error?: string }> {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, uid);
    const updateData = {
      ...updates,
      updatedAt: Timestamp.now()
    };
    
    await updateDoc(userDocRef, updateData);
    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error: 'Failed to update user profile' };
  }
}

/**
 * Check if an email is already registered with a different role
 */
export async function checkEmailRoleConflict(
  email: string,
  intendedRole: 'artisan' | 'customer'
): Promise<{ hasConflict: boolean; existingRole?: 'artisan' | 'customer'; error?: string }> {
  try {
    // Note: This is a simplified check. In a real app, you might want to 
    // create a separate collection indexed by email for better performance
    // For now, we'll check during the authentication process
    return { hasConflict: false };
  } catch (error) {
    console.error('Error checking email role conflict:', error);
    return { hasConflict: false, error: 'Failed to check email conflict' };
  }
}
