
"use client";

import type { ReactNode } from "react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Logo } from "./logo";
import { Button } from "./ui/button";

interface PageLayoutProps {
  children: ReactNode;
}

function MobileHeader() {
    const { toggleSidebar } = useSidebar();
    return (
         <header className="flex h-14 items-center justify-between border-b bg-background/80 p-2 backdrop-blur-sm md:hidden">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleSidebar}>
              <Logo />
            </Button>
        </header>
    )
}

export function PageLayout({ children }: PageLayoutProps) {
  const { user } = useAuth();
  
  if (!user) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <MobileHeader/>
        <main className="flex-1 space-y-6 p-4 md:p-8 pt-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
