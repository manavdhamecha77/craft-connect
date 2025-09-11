"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { File, ListFilter, MoreHorizontal, PlusCircle, Edit, Eye, Archive, Trash2, Search, Filter, Calendar, TrendingUp, Package } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageLayout } from "@/components/page-layout";
import { PageHeader } from "@/components/page-header";
import { format } from 'date-fns';
import { 
  getArtisanProducts, 
  updateProductStatus, 
  deleteProduct, 
  getFinalProductDisplay,
  type FirestoreProduct 
} from "@/lib/firestore-products";
import { useCurrentArtisanId, useRequireAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

const useProducts = () => {
  const [products, setProducts] = useState<FirestoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'draft' | 'active' | 'archived'>('all');
  const artisanId = useCurrentArtisanId();
  
  const fetchProducts = async () => {
    if (!artisanId) {
      setProducts([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const statusFilter = selectedStatus === 'all' ? undefined : selectedStatus;
      const fetchedProducts = await getArtisanProducts(artisanId, statusFilter);
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProducts();
  }, [artisanId, selectedStatus]);

  // Add effect to refresh data when page becomes visible (user returns from edit page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Page became visible, refresh data
        fetchProducts();
      }
    };

    const handleFocus = () => {
      // Window regained focus, refresh data
      fetchProducts();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [artisanId, selectedStatus]);

  // Listen for localStorage changes to refresh data when needed
  useEffect(() => {
    const handleStorageChange = () => {
      if (localStorage.getItem('productDataNeedsRefresh')) {
        fetchProducts();
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
  }, [artisanId, selectedStatus]);
  
  return { products, loading, fetchProducts, selectedStatus, setSelectedStatus };
};

export default function ProductsPage() {
  const { user, loading: authLoading } = useRequireAuth();
  const { products, loading: productsLoading, fetchProducts, selectedStatus, setSelectedStatus } = useProducts();
  const { toast } = useToast();
  const artisanId = useCurrentArtisanId();

  const handleStatusChange = async (productId: string, newStatus: 'draft' | 'active' | 'archived') => {
    if (!artisanId) return;
    
    try {
      await updateProductStatus(productId, artisanId, newStatus);
      toast({
        title: "Status Updated",
        description: `Product status changed to ${newStatus}.`,
      });
      fetchProducts(); // Refresh the list
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update product status.",
      });
    }
  };

  const handleDelete = async (productId: string, productName: string) => {
    if (!artisanId) return;
    
    if (!confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      await deleteProduct(productId, artisanId);
      toast({
        title: "Product Deleted",
        description: `"${productName}" has been deleted.`,
      });
      fetchProducts(); // Refresh the list
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete product.",
      });
    }
  };

  if (authLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  const statsData = [
    {
      title: "Total Products",
      value: products.length,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Active Products",
      value: products.filter(p => p.status === 'active').length,
      icon: Eye,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Draft Products",
      value: products.filter(p => p.status === 'draft').length,
      icon: Edit,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Archived Products",
      value: products.filter(p => p.status === 'archived').length,
      icon: Archive,
      color: "text-gray-600",
      bgColor: "bg-gray-50"
    }
  ];

  return (
    <PageLayout>
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Products</h1>
            <p className="text-muted-foreground mt-2">
              Manage your handcrafted products and track their performance
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <File className="h-4 w-4" />
              Export
            </Button>
            <Button className="gap-2" asChild>
              <Link href="/catalog-builder">
                <PlusCircle className="h-4 w-4" />
                Add Product
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className={`rounded-full p-3 ${stat.bgColor}`}>
                      <IconComponent className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Tabs defaultValue="all">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <TabsList className="bg-muted/50">
              <TabsTrigger 
                value="all" 
                onClick={() => setSelectedStatus('all')}
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                All ({products.length})
              </TabsTrigger>
              <TabsTrigger 
                value="draft" 
                onClick={() => setSelectedStatus('draft')}
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Draft ({products.filter(p => p.status === 'draft').length})
              </TabsTrigger>
              <TabsTrigger 
                value="active" 
                onClick={() => setSelectedStatus('active')}
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Active ({products.filter(p => p.status === 'active').length})
              </TabsTrigger>
              <TabsTrigger 
                value="archived" 
                onClick={() => setSelectedStatus('archived')}
                className="hidden sm:flex data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Archived ({products.filter(p => p.status === 'archived').length})
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>All Categories</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Saree</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Pottery</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Jewelry</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Handicraft</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <TabsContent value={selectedStatus}>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Your Collection</CardTitle>
                  <CardDescription className="mt-1">
                    Manage your handcrafted products and track their performance.
                  </CardDescription>
                </div>
                <div className="text-sm text-muted-foreground">
                  {products.length} product{products.length !== 1 ? 's' : ''} total
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b">
                    <TableHead className="hidden w-[100px] sm:table-cell pl-6">
                      <span className="sr-only">Image</span>
                    </TableHead>
                    <TableHead className="font-semibold">Product</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="hidden md:table-cell font-semibold">
                      Price
                    </TableHead>
                    <TableHead className="hidden lg:table-cell font-semibold">
                      Category
                    </TableHead>
                    <TableHead className="hidden lg:table-cell font-semibold">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Updated
                      </div>
                    </TableHead>
                    <TableHead className="w-[100px]">
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productsLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                          <p className="text-sm text-muted-foreground">Loading your products...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : products.length === 0 ? (
                     <TableRow>
                        <TableCell colSpan={7} className="h-32 text-center">
                          <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                              <Package className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <div className="space-y-2">
                              <h3 className="font-medium">
                                {selectedStatus === 'all' 
                                  ? 'No products found' 
                                  : `No ${selectedStatus} products`
                                }
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Start by creating your first handcrafted product listing.
                              </p>
                            </div>
                            <Button asChild>
                              <Link href="/catalog-builder">
                                <PlusCircle className="w-4 h-4 mr-2" />
                                Add Product
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                  ) : (
                    products.map((product) => {
                      const finalDisplay = getFinalProductDisplay(product);
                      return (
                        <TableRow key={product.id} className="hover:bg-muted/30 transition-colors">
                          <TableCell className="hidden sm:table-cell pl-6">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted">
                              <Image
                                alt="Product image"
                                className="object-cover"
                                fill
                                src={product.image}
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="font-medium leading-tight">
                                {finalDisplay.title}
                              </p>
                              <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                                {finalDisplay.description}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                product.status === 'active' ? 'default' : 
                                product.status === 'draft' ? 'secondary' : 
                                'outline'
                              }
                              className={
                                product.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' :
                                product.status === 'draft' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                                'bg-gray-100 text-gray-800 border-gray-200'
                              }
                            >
                              {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell font-semibold">
                            ₹{finalDisplay.price?.toLocaleString() || '0'}
                          </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Badge variant="outline" className="text-xs">
                            {product.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                          {product.updatedAt ? format(product.updatedAt.toDate(), "MMM d, yyyy") : 'Unknown'}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem asChild>
                                <Link href={`/products/${product.id}/edit`}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Details
                                </Link>
                              </DropdownMenuItem>
                              {product.status === 'active' && (
                                <DropdownMenuItem asChild>
                                  <Link href={`/marketplace/${product.id}`}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View in Marketplace
                                  </Link>
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              {product.status === 'draft' && (
                                <DropdownMenuItem onClick={() => handleStatusChange(product.id!, 'active')}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Publish
                                </DropdownMenuItem>
                              )}
                              {product.status === 'active' && (
                                <DropdownMenuItem onClick={() => handleStatusChange(product.id!, 'draft')}>
                                  <Archive className="h-4 w-4 mr-2" />
                                  Unpublish
                                </DropdownMenuItem>
                              )}
                              {product.status !== 'archived' && (
                                <DropdownMenuItem onClick={() => handleStatusChange(product.id!, 'archived')}>
                                  <Archive className="h-4 w-4 mr-2" />
                                  Archive
                                </DropdownMenuItem>
                              )}
                              {product.status === 'archived' && (
                                <DropdownMenuItem onClick={() => handleStatusChange(product.id!, 'draft')}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Restore
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleDelete(product.id!, product.title || product.name)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
            {products.length > 0 && (
              <CardFooter className="border-t bg-muted/20 px-6">
                <div className="flex items-center justify-between w-full">
                  <div className="text-sm text-muted-foreground">
                    Showing <strong>{products.length}</strong> product{products.length !== 1 ? 's' : ''}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>{products.filter(p => p.status === 'active').length} Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>{products.filter(p => p.status === 'draft').length} Draft</span>
                    </div>
                  </div>
                </div>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
