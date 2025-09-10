"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Save, Eye, ImageIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageLayout } from "@/components/page-layout";
import { PageHeader } from "@/components/page-header";
import { useToast } from "@/hooks/use-toast";
import { useCurrentArtisanId, useRequireAuth } from "@/hooks/use-auth";
import {
  getProduct,
  updateArtisanEdits,
  updateProductStatus,
  getFinalProductDisplay,
  type FirestoreProduct
} from "@/lib/firestore-products";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading } = useRequireAuth();
  const artisanId = useCurrentArtisanId();
  
  const [product, setProduct] = useState<FirestoreProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  
  // Form state for artisan edits
  const [artisanEdits, setArtisanEdits] = useState({
    customTitle: "",
    customDescription: "",
    customPrice: 0,
    customKeywords: [] as string[],
    displayPreferences: {
      showCulturalStory: true,
      showAIDescription: true,
      preferredLanguage: "english" as "english" | "hindi" | "gujarati"
    }
  });

  const [newKeyword, setNewKeyword] = useState("");

  useEffect(() => {
    loadProduct();
  }, [productId, artisanId]);

  const loadProduct = async () => {
    if (!artisanId) return;
    
    try {
      setLoading(true);
      const fetchedProduct = await getProduct(productId);
      
      if (!fetchedProduct) {
        toast({
          variant: "destructive",
          title: "Product Not Found",
          description: "The product you're looking for doesn't exist.",
        });
        router.push("/products");
        return;
      }

      if (fetchedProduct.artisanId !== artisanId) {
        toast({
          variant: "destructive",
          title: "Unauthorized",
          description: "You don't have permission to edit this product.",
        });
        router.push("/products");
        return;
      }

      setProduct(fetchedProduct);
      
      // Initialize form with existing artisan edits or defaults
      const existingEdits = fetchedProduct.artisanEdits || {};
      setArtisanEdits({
        customTitle: existingEdits.customTitle || "",
        customDescription: existingEdits.customDescription || "",
        customPrice: existingEdits.customPrice || fetchedProduct.price || 0,
        customKeywords: existingEdits.customKeywords || [],
        displayPreferences: {
          showCulturalStory: existingEdits.displayPreferences?.showCulturalStory ?? true,
          showAIDescription: existingEdits.displayPreferences?.showAIDescription ?? true,
          preferredLanguage: existingEdits.displayPreferences?.preferredLanguage || "english"
        }
      });
    } catch (error) {
      console.error("Error loading product:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load product details.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!artisanId || !product?.id) return;

    setSaving(true);
    try {
      await updateArtisanEdits(product.id, artisanId, artisanEdits);
      
      toast({
        title: "Changes Saved",
        description: "Your product edits have been saved successfully.",
      });
      
      // Reload product to show updated data
      await loadProduct();
    } catch (error) {
      console.error("Error saving changes:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your changes. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!artisanId || !product?.id) return;

    setPublishing(true);
    try {
      await updateProductStatus(product.id, artisanId, 'active');
      
      toast({
        title: "Product Published",
        description: "Your product is now live on the marketplace!",
      });
      
      router.push("/products");
    } catch (error) {
      console.error("Error publishing product:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to publish your product. Please try again.",
      });
    } finally {
      setPublishing(false);
    }
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !artisanEdits.customKeywords.includes(newKeyword.trim())) {
      setArtisanEdits(prev => ({
        ...prev,
        customKeywords: [...prev.customKeywords, newKeyword.trim()]
      }));
      setNewKeyword("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setArtisanEdits(prev => ({
      ...prev,
      customKeywords: prev.customKeywords.filter(k => k !== keyword)
    }));
  };

  if (authLoading || loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading product details...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!product) {
    return null;
  }

  const finalDisplay = getFinalProductDisplay(product);

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <PageHeader 
                title="Edit Product" 
                description="Customize your product details and settings"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={product.status === 'draft' ? 'secondary' : product.status === 'archived' ? 'outline' : 'default'}>
              {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Edit Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="customTitle">Custom Title</Label>
                  <Input
                    id="customTitle"
                    value={artisanEdits.customTitle}
                    onChange={(e) => setArtisanEdits(prev => ({ ...prev, customTitle: e.target.value }))}
                    placeholder={product.generatedData?.catalog?.title || product.name}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Leave empty to use AI-generated title
                  </p>
                </div>

                <div>
                  <Label htmlFor="customDescription">Custom Description</Label>
                  <Textarea
                    id="customDescription"
                    rows={4}
                    value={artisanEdits.customDescription}
                    onChange={(e) => setArtisanEdits(prev => ({ ...prev, customDescription: e.target.value }))}
                    placeholder={product.generatedData?.catalog?.description || product.description}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Leave empty to use AI-generated description
                  </p>
                </div>

                <div>
                  <Label htmlFor="customPrice">Price (₹)</Label>
                  <Input
                    id="customPrice"
                    type="number"
                    min="0"
                    value={artisanEdits.customPrice}
                    onChange={(e) => setArtisanEdits(prev => ({ ...prev, customPrice: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Keywords</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder="Add a keyword"
                    onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                  />
                  <Button onClick={addKeyword}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {artisanEdits.customKeywords.map((keyword, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="cursor-pointer"
                      onClick={() => removeKeyword(keyword)}
                    >
                      {keyword} ×
                    </Badge>
                  ))}
                </div>
                {product.generatedData?.catalog?.keywords && (
                  <div>
                    <Label className="text-xs text-muted-foreground">AI-generated keywords:</Label>
                    <p className="text-sm text-muted-foreground">{product.generatedData.catalog.keywords}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Display Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="showAI">Use AI-generated description</Label>
                  <Switch
                    id="showAI"
                    checked={artisanEdits.displayPreferences.showAIDescription}
                    onCheckedChange={(checked) => 
                      setArtisanEdits(prev => ({
                        ...prev,
                        displayPreferences: { ...prev.displayPreferences, showAIDescription: checked }
                      }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="showStory">Show cultural story</Label>
                  <Switch
                    id="showStory"
                    checked={artisanEdits.displayPreferences.showCulturalStory}
                    onCheckedChange={(checked) => 
                      setArtisanEdits(prev => ({
                        ...prev,
                        displayPreferences: { ...prev.displayPreferences, showCulturalStory: checked }
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex space-x-4">
              <Button onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              
              {product.status === 'draft' && (
                <Button onClick={handlePublish} disabled={publishing}>
                  <Eye className="h-4 w-4 mr-2" />
                  {publishing ? "Publishing..." : "Publish"}
                </Button>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={finalDisplay.title}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-semibold">{finalDisplay.title}</h3>
                  <p className="text-2xl font-bold text-primary">₹{finalDisplay.price?.toLocaleString()}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">{finalDisplay.description}</p>
                </div>

                {finalDisplay.keywords && (
                  <div>
                    <Label className="text-sm font-medium">Keywords:</Label>
                    <p className="text-sm text-muted-foreground">{finalDisplay.keywords}</p>
                  </div>
                )}

                {finalDisplay.culturalStory && artisanEdits.displayPreferences.showCulturalStory && (
                  <div>
                    <Label className="text-sm font-medium">Cultural Story:</Label>
                    <p className="text-sm text-muted-foreground">{finalDisplay.culturalStory}</p>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Category: {product.category}</span>
                    <span>By: {product.artisanName}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Generated Content Reference */}
            {product.generatedData && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">AI Generated Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="english" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="english">English</TabsTrigger>
                      <TabsTrigger value="hindi">Hindi</TabsTrigger>
                      <TabsTrigger value="gujarati">Gujarati</TabsTrigger>
                    </TabsList>
                    {product.generatedData.catalog?.translations && (
                      <>
                        <TabsContent value="english" className="mt-4 text-sm">
                          <p className="text-muted-foreground">{product.generatedData.catalog.translations.english}</p>
                        </TabsContent>
                        <TabsContent value="hindi" className="mt-4 text-sm">
                          <p className="text-muted-foreground">{product.generatedData.catalog.translations.hindi}</p>
                        </TabsContent>
                        <TabsContent value="gujarati" className="mt-4 text-sm">
                          <p className="text-muted-foreground">{product.generatedData.catalog.translations.gujarati}</p>
                        </TabsContent>
                      </>
                    )}
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
