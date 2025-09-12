"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth, useRequireAuth } from "@/hooks/use-auth";
import { getArtisanProducts, getFinalProductDisplay, type FirestoreProduct } from "@/lib/firestore-products";
import { PageLayout } from "@/components/page-layout";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  Package,
  Plus,
  TrendingUp,
  Eye,
  Edit,
  Users,
  IndianRupee,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Archive,
  Palette,
  MapPin
} from "lucide-react";
import { useCurrentArtisanId } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

const CHART_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  draftProducts: number;
  archivedProducts: number;
  avgPrice: number;
  totalValue: number;
  recentActivity: string[];
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useRequireAuth();
  const artisanId = useCurrentArtisanId();
  const [products, setProducts] = useState<FirestoreProduct[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    activeProducts: 0,
    draftProducts: 0,
    archivedProducts: 0,
    avgPrice: 0,
    totalValue: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  // Always call all hooks first, then handle conditions
  useEffect(() => {
    if (artisanId) {
      loadDashboardData();
    }
  }, [artisanId]);

  // Add effect to refresh data when page becomes visible (user returns from edit page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && artisanId) {
        // Page became visible, refresh data
        loadDashboardData();
      }
    };

    const handleFocus = () => {
      // Window regained focus, refresh data
      if (artisanId) {
        loadDashboardData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [artisanId]);

  // Listen for localStorage changes to refresh data when needed
  useEffect(() => {
    const handleStorageChange = () => {
      if (localStorage.getItem('productDataNeedsRefresh') && artisanId) {
        loadDashboardData();
        localStorage.removeItem('productDataNeedsRefresh');
      }
    };

    // Check on mount
    handleStorageChange();

    // Listen for storage events from other tabs/windows
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for same-tab localStorage changes
    window.addEventListener('localStorageChanged', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChanged', handleStorageChange);
    };
  }, [artisanId]);

  // Check if profile is incomplete and redirect to onboarding
  useEffect(() => {
    if (user && (!user.artisanProfile || user.artisanProfile.name === 'Anonymous Artisan')) {
      router.push('/onboarding');
    }
  }, [user, router]);

  const loadDashboardData = async () => {
    if (!artisanId) return;

    try {
      setLoading(true);
      const fetchedProducts = await getArtisanProducts(artisanId);
      setProducts(fetchedProducts);

      // Calculate stats
      const totalProducts = fetchedProducts.length;
      const activeProducts = fetchedProducts.filter(p => p.status === 'active').length;
      const draftProducts = fetchedProducts.filter(p => p.status === 'draft').length;
      const archivedProducts = fetchedProducts.filter(p => p.status === 'archived').length;
      
      const totalValue = fetchedProducts.reduce((sum, p) => {
        const finalDisplay = getFinalProductDisplay(p);
        return sum + (finalDisplay.price || 0);
      }, 0);
      const avgPrice = totalProducts > 0 ? totalValue / totalProducts : 0;

      // Generate recent activity
      const sortedProducts = fetchedProducts.sort((a, b) => 
        b.updatedAt.toDate().getTime() - a.updatedAt.toDate().getTime()
      );
      const recentActivity = sortedProducts.slice(0, 5).map(p => {
        const timeAgo = getTimeAgo(p.updatedAt.toDate());
        return `${p.status === 'draft' ? 'Created' : 'Updated'} "${p.title || p.name}" ${timeAgo}`;
      });

      setStats({
        totalProducts,
        activeProducts,
        draftProducts,
        archivedProducts,
        avgPrice,
        totalValue,
        recentActivity
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  // Always call all memoized values
  const categoryData = React.useMemo(() => {
    const categoryCount = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryCount).map(([category, count]) => ({
      name: category,
      value: count
    }));
  }, [products]);

  const statusData = React.useMemo(() => [
    { name: 'Active', value: stats.activeProducts, color: '#22c55e' },
    { name: 'Draft', value: stats.draftProducts, color: '#f59e0b' },
    { name: 'Archived', value: stats.archivedProducts, color: '#6b7280' }
  ].filter(item => item.value > 0), [stats]);

  const getProfileCompletionScore = () => {
    if (!user?.artisanProfile) return 20;
    
    const profile = user.artisanProfile;
    let score = 20; // Base score for having a profile
    
    if (profile.name && profile.name !== 'Anonymous Artisan') score += 20;
    if (profile.region && profile.region !== 'Unknown Region') score += 15;
    if (profile.specialization) score += 15;
    if (profile.bio) score += 20;
    if ((profile as any).experience) score += 5;
    if ((profile as any).techniques) score += 5;
    
    return Math.min(score, 100);
  };

  const quickActions = [
    {
      icon: Plus,
      label: "Create Product",
      description: "Use AI to create a new product listing",
      href: "/catalog-builder",
      color: "bg-primary"
    },
    {
      icon: Package,
      label: "Manage Products",
      description: "View and edit your product collection",
      href: "/products",
      color: "bg-blue-500"
    },
    {
      icon: Eye,
      label: "View Marketplace",
      description: "See how your products appear to customers",
      href: "/marketplace",
      color: "bg-green-500"
    },
    {
      icon: Edit,
      label: "Edit Profile",
      description: "Update your artisan profile and story",
      href: "/profile",
      color: "bg-purple-500"
    }
  ];

  // Show loading states
  if (authLoading || loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Show loading while redirecting incomplete profiles
  if (user && (!user.artisanProfile || user.artisanProfile.name === 'Anonymous Artisan')) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Setting up your profile...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  const profileCompletionScore = getProfileCompletionScore();

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <PageHeader 
              title={`Welcome back, ${user?.artisanProfile?.name || 'Artisan'}!`}
              description="Here's what's happening with your craft business"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:space-x-2">
            <Badge variant="secondary" className="flex items-center space-x-1 text-xs">
              <Palette className="h-3 w-3" />
              <span className="truncate max-w-24 sm:max-w-none">{user?.artisanProfile?.specialization || 'Artisan'}</span>
            </Badge>
            <Badge variant="outline" className="flex items-center space-x-1 text-xs">
              <MapPin className="h-3 w-3" />
              <span className="truncate max-w-20 sm:max-w-none">{user?.artisanProfile?.region || 'Location'}</span>
            </Badge>
          </div>
        </div>

        {/* Profile Completion Alert */}
        {profileCompletionScore < 80 && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <CardTitle className="text-lg text-yellow-800">Complete Your Profile</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-yellow-700 text-sm">
                A complete profile helps customers trust and connect with your craft story.
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center space-x-3 flex-1">
                  <Progress value={profileCompletionScore} className="flex-1" />
                  <span className="text-sm font-medium text-yellow-800 whitespace-nowrap">{profileCompletionScore}%</span>
                </div>
                <Button asChild size="sm" className="w-full sm:w-auto">
                  <Link href="/profile">Complete Profile</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Products</CardTitle>
              <Package className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              <div className="text-xl sm:text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                {stats.activeProducts} active, {stats.draftProducts} drafts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6">
              <CardTitle className="text-xs sm:text-sm font-medium">Active Products</CardTitle>
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              <div className="text-xl sm:text-2xl font-bold text-green-600">{stats.activeProducts}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                Live on marketplace
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6">
              <CardTitle className="text-xs sm:text-sm font-medium">Average Price</CardTitle>
              <IndianRupee className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              <div className="text-xl sm:text-2xl font-bold">₹{Math.round(stats.avgPrice).toLocaleString()}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                Across all products
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Value</CardTitle>
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              <div className="text-xl sm:text-2xl font-bold">₹{Math.round(stats.totalValue).toLocaleString()}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                Portfolio value
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <div className="group p-4 rounded-lg border hover:border-primary hover:shadow-md transition-all cursor-pointer">
                    <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{action.label}</h3>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Charts */}
          <Card>
            <CardHeader>
              <CardTitle>Product Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="status" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="status">By Status</TabsTrigger>
                  <TabsTrigger value="category">By Category</TabsTrigger>
                </TabsList>
                
                <TabsContent value="status" className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </TabsContent>
                
                <TabsContent value="category" className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                      <p className="text-sm text-muted-foreground">{activity}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No recent activity</p>
                  <Button asChild className="mt-3" size="sm">
                    <Link href="/catalog-builder">Create your first product</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
