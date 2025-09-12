import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to format price in INR
export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

// Utility function to format price range in INR
export function formatINRRange(min: number, max: number): string {
  return `₹${min.toLocaleString('en-IN')} - ₹${max.toLocaleString('en-IN')}`
}
