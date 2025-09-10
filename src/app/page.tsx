
"use client";

import { useAuth } from "@/hooks/use-auth";
import { LandingPage } from "@/components/landing-page";

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5DC] flex items-center justify-center">
        <div className="text-lg text-gray-600 font-['PT_Sans',sans-serif]">
          Loading...
        </div>
      </div>
    );
  }

  // Always show the landing page at root, regardless of auth status
  return <LandingPage />;
}
