"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardPlus,
  GalleryVerticalEnd,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  User,
  X,
  ShoppingBag,
  Palette,
  ShoppingCart,
  Package,
  Heart,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import { useState } from "react";
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
import { Button } from "./ui/button";
import { Logo } from "./logo";

const getMenuItems = (userRole?: 'artisan' | 'customer') => {
  if (userRole === 'artisan') {
    return [
      {
        href: "/dashboard",
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
        label: "My Products",
        icon: GalleryVerticalEnd,
      },
      {
        href: "/marketplace",
        label: "Marketplace",
        icon: ShoppingBag,
      },
    ];
  }
  
  if (userRole === 'customer') {
    return [
      {
        href: "/marketplace",
        label: "Marketplace",
        icon: ShoppingBag,
      },
      {
        href: "/cart",
        label: "Cart",
        icon: ShoppingCart,
      },
      {
        href: "/orders",
        label: "My Orders",
        icon: Package,
      },
      {
        href: "/wishlist",
        label: "Wishlist",
        icon: Heart,
      },
    ];
  }
  
  // Default items for non-authenticated users
  return [
    {
      href: "/marketplace",
      label: "Marketplace", 
      icon: ShoppingBag,
    },
  ];
};

export function AppNavbar() {
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();
  const { getTotalItems } = useCart();
  const { getTotalItems: getWishlistTotalItems } = useWishlist();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const menuItems = getMenuItems(user?.role);
  const isLandingPage = pathname === '/';
  const cartItemsCount = getTotalItems();
  const wishlistItemsCount = getWishlistTotalItems();

  const getInitials = (name: string | null | undefined) => {
    if (!name || name === 'Anonymous Artisan') return user?.role === 'artisan' ? "A" : "C";
    const names = name.split(" ");
    if (names.length > 1) {
      return `${names[0][0]}${names[1][0]}`;
    }
    return name.substring(0, 2).toUpperCase();
  };
  
  // Landing page navigation items for non-authenticated users
  const landingNavItems = [
    { href: "#features", label: "Features" },
    { href: "#artisans", label: "Artisans" }, 
    { href: "#marketplace", label: "Marketplace" },
    { href: "#about", label: "About" }
  ];

  return (
    <>
      <nav className={cn(
        "sticky top-0 z-50 w-full border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/80",
        isLandingPage && !user ? "bg-white/95" : "bg-background/95"
      )}>
        <div className={cn(
          "relative flex h-16 items-center justify-between",
          isLandingPage ? "max-w-7xl mx-auto px-6 lg:px-8" : "container max-w-screen-2xl"
        )}>
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Logo />
            </Link>
          </div>

          {/* Desktop Navigation */}
          {!user && isLandingPage ? (
            // Landing page navigation for non-authenticated users
            <div className="hidden md:flex items-center space-x-8">
              {landingNavItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-gray-700 hover:text-[#FF9933] transition-colors font-medium"
                >
                  {item.label}
                </a>
              ))}
            </div>
          ) : user ? (
            // Authenticated user navigation
            <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:flex">
              <nav className="flex items-center space-x-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                      pathname === item.href
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground/60"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          ) : null}

          {/* Right Side: CTA Buttons or User Dropdown + Mobile Menu */}
          <div className="flex items-center space-x-2">
            {!user && isLandingPage ? (
              // Landing page CTA buttons for non-authenticated users
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/marketplace">
                  <Button variant="ghost" className="text-gray-700 hover:text-[#FF9933] hover:bg-[#FF9933]/10">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Browse Crafts
                  </Button>
                </Link>
                <Link href="/auth?role=artisan">
                  <Button className="bg-[#FF9933] hover:bg-[#FF9933]/90 text-white">
                    <Palette className="h-4 w-4 mr-2" />
                    Join as Artisan
                  </Button>
                </Link>
              </div>
            ) : !user ? (
              // Non-landing page auth buttons
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/marketplace">
                  <Button variant="ghost">Browse Marketplace</Button>
                </Link>
                <Link href="/auth">
                  <Button>Sign In</Button>
                </Link>
              </div>
            ) : (
              // Authenticated user section
              <>
                {user?.role === 'customer' && (
                  <>
                    <Link href="/wishlist" className="relative">
                      <Button variant="ghost" size="icon">
                        <Heart className="h-5 w-5" />
                        {wishlistItemsCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {wishlistItemsCount > 9 ? '9+' : wishlistItemsCount}
                          </span>
                        )}
                      </Button>
                    </Link>
                    <Link href="/cart" className="relative">
                      <Button variant="ghost" size="icon">
                        <ShoppingCart className="h-5 w-5" />
                        {cartItemsCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-[#FF9933] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {cartItemsCount > 9 ? '9+' : cartItemsCount}
                          </span>
                        )}
                      </Button>
                    </Link>
                  </>
                )}
                
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-10 w-10 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user?.photoURL || ""}
                        alt={user?.artisanProfile?.name || "User"}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-orange-400 to-red-500 text-white text-sm font-semibold">
                        {getInitials(user?.artisanProfile?.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.artisanProfile?.name || (user?.role === 'artisan' ? 'Artisan' : 'Customer')}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.role === 'artisan' 
                          ? (user?.artisanProfile?.specialization || "Artisan") 
                          : "Customer"
                        }
                      </p>
                      {user?.artisanProfile?.region && (
                        <p className="text-xs leading-none text-muted-foreground">
                          📍 {user.artisanProfile.region}
                        </p>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user?.role === 'artisan' && (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] w-full grid-flow-row auto-rows-max overflow-auto p-6 pb-16 shadow-md animate-in slide-in-from-bottom-80 md:hidden">
          <div className="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
            {!user && isLandingPage ? (
              // Landing page mobile menu
              <nav className="grid grid-flow-row auto-rows-max text-sm">
                {landingNavItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-gray-700 hover:text-[#FF9933] transition-colors font-medium px-3 py-2 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                <div className="flex flex-col space-y-2 pt-4 border-t">
                  <Link href="/marketplace">
                    <Button variant="outline" className="w-full border-[#4B0082] text-[#4B0082] hover:bg-[#4B0082] hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Browse Crafts
                    </Button>
                  </Link>
                  <Link href="/auth?role=artisan">
                    <Button className="w-full bg-[#FF9933] hover:bg-[#FF9933]/90 text-white" onClick={() => setIsMobileMenuOpen(false)}>
                      <Palette className="h-4 w-4 mr-2" />
                      Join as Artisan
                    </Button>
                  </Link>
                </div>
              </nav>
            ) : !user ? (
              // Non-landing page mobile menu for non-authenticated
              <nav className="grid grid-flow-row auto-rows-max text-sm gap-2">
                <Link href="/marketplace">
                  <Button variant="ghost" className="w-full justify-start" onClick={() => setIsMobileMenuOpen(false)}>
                    Browse Marketplace
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                    Sign In
                  </Button>
                </Link>
              </nav>
            ) : (
              // Authenticated user mobile menu
              <nav className="grid grid-flow-row auto-rows-max text-sm">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                      pathname === item.href
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground/60"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            )}
          </div>
        </div>
      )}
    </>
  );
}
