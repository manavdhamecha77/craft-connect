
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardPlus,
  GalleryVerticalEnd,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Logo } from "./logo";
import { Button } from "./ui/button";

const menuItems = [
  {
    href: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/catalog-builder",
    label: "Catalog Builder",
    icon: ClipboardPlus,
  },
  {
    href: "/products",
    label: "Products",
    icon: GalleryVerticalEnd,
  },
];

const bottomMenuItems = [
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { toggleSidebar } = useSidebar();


  const getInitials = (name: string | null | undefined) => {
    if (!name) return "AN";
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[1][0]}`;
    }
    return name.substring(0, 2).toUpperCase();
  }

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between p-2">
         <Button variant="ghost" className="p-1 h-auto" onClick={toggleSidebar}>
            <Logo />
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="flex flex-col gap-2">
         <SidebarMenu>
           {bottomMenuItems.map((item) => (
             <SidebarMenuItem key={item.href}>
               <Link href={item.href}>
                 <SidebarMenuButton
                   isActive={pathname === item.href}
                   tooltip={item.label}
                 >
                   <item.icon />
                   <span>{item.label}</span>
                 </SidebarMenuButton>
               </Link>
             </SidebarMenuItem>
           ))}
         </SidebarMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex cursor-pointer items-center gap-3 rounded-md p-2 transition-colors hover:bg-sidebar-accent group-data-[state=collapsed]/sidebar-wrapper:justify-center group-data-[state=collapsed]/sidebar-wrapper:p-2 group-data-[state=collapsed]/sidebar-wrapper:size-8">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={user?.photoURL || ""}
                  alt={user?.displayName || "Artisan"}
                />
                <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
              </Avatar>
              <div className="overflow-hidden group-data-[state=collapsed]/sidebar-wrapper:hidden">
                <p className="truncate font-semibold">{user?.displayName || 'Artisan Name'}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {user?.email || 'artisan.name@example.com'}
                </p>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.displayName || 'Artisan Name'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/artisans/me">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
