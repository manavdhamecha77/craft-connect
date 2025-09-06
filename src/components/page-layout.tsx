
"use client";

import type { ReactNode } from "react";
import { AppNavbar } from "@/components/navbar";
import { useAuth } from "@/hooks/use-auth";
import { Footer } from "@/components/footer";


interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  const { user } = useAuth();
  
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      <main className="container mx-auto space-y-6 p-4 md:p-8 pt-6">
        {children}
        <Footer />
      </main>
    </div>
  );
}
