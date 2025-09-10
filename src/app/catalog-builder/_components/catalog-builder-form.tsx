"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Bot,
  CircleDashed,
  ClipboardCheck,
  Image as ImageIcon,
  IndianRupee,
  Lightbulb,
  Megaphone,
  MessageCircle,
  Sparkles,
  BookOpenText,
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  handleGenerateCatalogEntry,
  handleGenerateCulturalStory,
  handleGenerateMarketingContent,
  handleSuggestPricing,
} from "../actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { createProduct, type GeneratedProductData } from "@/lib/firestore-products";
import { useCurrentArtisanId, useRequireAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  category: z.string().min(1, "Category is required"),
  notes: z.string().optional(),
  image: z.any().optional(),
  artisanName: z.string().optional(),
  artisanRegion: z.string().optional(),
  material: z.string().optional(),
  size: z.string().optional(),
  artisanEffortHours: z.coerce.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CatalogBuilderForm() {
  const { toast } = useToast();
  const { user, loading: authLoading } = useRequireAuth();
  const artisanId = useCurrentArtisanId();
  const [loadingStates, setLoadingStates] = useState({
    catalog: false,
    story: false,
    pricing: false,
    marketing: false,
    saving: false,
  });
  const [generatedData, setGeneratedData] = useState({
    catalog: null,
    story: null,
    pricing: null,
    marketing: null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "Handwoven Banarasi Saree",
      category: "Saree",
      notes: "Made with pure silk and real gold zari threads.",
      artisanName: "The Weavers of Varanasi",
      artisanRegion: "Varanasi, Uttar Pradesh",
      material: "Silk",
      size: "6 yards",
      artisanEffortHours: 120,
    },
  });

  const formValues = watch();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onGenerateCatalog = async () => {
    if (!formValues.productName || !formValues.category || !imagePreview) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide product name, category, and an image.",
      });
      return;
    }
    setLoadingStates((s) => ({ ...s, catalog: true }));
    const result = await handleGenerateCatalogEntry({
      productName: formValues.productName,
      category: formValues.category,
      notes: formValues.notes,
      image: imagePreview,
    });
    if (result.error) {
      toast({
        variant: "destructive",
        title: "Error Generating Catalog",
        description: result.error,
      });
    } else {
      setGeneratedData((d) => ({ ...d, catalog: result.data }));
      toast({
        title: "Catalog Generated!",
        description: "Product details have been created by AI.",
      });
    }
    setLoadingStates((s) => ({ ...s, catalog: false }));
  };

  const onGenerateStory = async () => {
    if (!formValues.productName || !formValues.artisanName || !formValues.artisanRegion) {
        toast({ variant: "destructive", title: "Missing Information", description: "Please provide product name, artisan name, and region." });
        return;
    }
    setLoadingStates(s => ({ ...s, story: true }));
    const result = await handleGenerateCulturalStory({
        productName: formValues.productName,
        artisanName: formValues.artisanName,
        artisanRegion: formValues.artisanRegion,
        notes: formValues.notes || '',
    });
    if (result.error) {
        toast({ variant: "destructive", title: "Error Generating Story", description: result.error });
    } else {
        setGeneratedData(d => ({ ...d, story: result.data }));
        toast({ title: "Story Generated!", description: "A cultural story has been crafted." });
    }
    setLoadingStates(s => ({ ...s, story: false }));
  };

  const onSuggestPrice = async () => {
    if (!formValues.category || !formValues.material || !formValues.size || !formValues.artisanEffortHours) {
        toast({ variant: "destructive", title: "Missing Information", description: "Please provide all pricing attributes." });
        return;
    }
    setLoadingStates(s => ({ ...s, pricing: true }));
    const result = await handleSuggestPricing({
        productCategory: formValues.category,
        material: formValues.material,
        size: formValues.size,
        artisanEffortHours: Number(formValues.artisanEffortHours),
    });
    if (result.error) {
        toast({ variant: "destructive", title: "Error Suggesting Price", description: result.error });
    } else {
        setGeneratedData(d => ({ ...d, pricing: result.data }));
        toast({ title: "Price Suggested!", description: "A price range has been recommended." });
    }
    setLoadingStates(s => ({ ...s, pricing: false }));
  };

  const onGenerateMarketing = async () => {
    const description = (generatedData.catalog as any)?.description || formValues.notes;
    if (!formValues.productName || !description) {
        toast({ variant: "destructive", title: "Missing Information", description: "Product name and description are needed." });
        return;
    }
    setLoadingStates(s => ({ ...s, marketing: true }));
    const result = await handleGenerateMarketingContent({
        productName: formValues.productName,
        productDescription: description,
    });
    if (result.error) {
        toast({ variant: "destructive", title: "Error Generating Content", description: result.error });
    } else {
        setGeneratedData(d => ({ ...d, marketing: result.data }));
        toast({ title: "Marketing Magic!", description: "Social media content is ready." });
    }
    setLoadingStates(s => ({ ...s, marketing: false }));
  };

  const onSaveProduct = async () => {
    // Check if user is authenticated
    if (!artisanId) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in to save your product.",
      });
      return;
    }

    // Validate that we have essential data to save the product
    if (!formValues.productName || !formValues.category || !imagePreview) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide product name, category, and an image before saving.",
      });
      return;
    }

    if (!generatedData.catalog) {
      toast({
        variant: "destructive",
        title: "Generate Catalog Entry First",
        description: "Please generate the catalog entry before saving the product.",
      });
      return;
    }

    setLoadingStates(s => ({ ...s, saving: true }));

    try {
      // Save product to Firestore as draft
      const savedProduct = await createProduct(
        artisanId,
        formValues,
        {
          catalog: generatedData.catalog || undefined,
          pricing: generatedData.pricing || undefined,
          story: generatedData.story || undefined,
          marketing: generatedData.marketing || undefined,
        },
        imagePreview
      );

      toast({
        title: "Product Saved as Draft!",
        description: `${savedProduct.title || savedProduct.name} has been saved to your products. You can now edit and publish it from the Products page.`,
      });

      // Navigate to the products page to show the new draft
      router.push(`/products`);
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        variant: "destructive",
        title: "Error Saving Product",
        description: "Failed to save the product to the database. Please check your connection and try again.",
      });
    } finally {
      setLoadingStates(s => ({ ...s, saving: false }));
    }
  };


  const getStepStatus = (stepNumber: number) => {
    switch (stepNumber) {
      case 1: return generatedData.catalog ? 'completed' : 'active';
      case 2: return generatedData.story ? 'completed' : generatedData.catalog ? 'active' : 'pending';
      case 3: return generatedData.pricing ? 'completed' : generatedData.story ? 'active' : 'pending';
      case 4: return generatedData.marketing ? 'completed' : generatedData.pricing ? 'active' : 'pending';
      default: return 'pending';
    }
  };

  const StepIndicator = ({ stepNumber, title, status }: { stepNumber: number, title: string, status: string }) => (
    <div className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
      status === 'completed' ? 'bg-green-50 border border-green-200' :
      status === 'active' ? 'bg-primary/10 border border-primary/20' :
      'bg-muted/30 border border-muted'
    }`}>
      <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
        status === 'completed' ? 'bg-green-500 text-white' :
        status === 'active' ? 'bg-primary text-primary-foreground' :
        'bg-muted text-muted-foreground'
      }`}>
        {status === 'completed' ? '✓' : stepNumber}
      </div>
      <span className={`font-medium ${
        status === 'completed' ? 'text-green-700' :
        status === 'active' ? 'text-primary' :
        'text-muted-foreground'
      }`}>{title}</span>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Progress Indicator */}
      <Card className="bg-gradient-to-r from-primary/5 to-amber-50 border-primary/10">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StepIndicator stepNumber={1} title="Product Details" status={getStepStatus(1)} />
            <StepIndicator stepNumber={2} title="Cultural Story" status={getStepStatus(2)} />
            <StepIndicator stepNumber={3} title="Smart Pricing" status={getStepStatus(3)} />
            <StepIndicator stepNumber={4} title="Marketing" status={getStepStatus(4)} />
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit(() => {})} className="space-y-8">
        {/* Step 1: Catalog Builder */}
        <Card className="overflow-hidden border-l-4 border-l-primary">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ClipboardCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <span className="text-lg">Step 1: Product Details</span>
                <p className="text-sm text-muted-foreground font-normal mt-1">
                  Provide basic information about your handcrafted piece
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                {...register("productName")}
                placeholder="e.g., 'Blue Pottery Vase'"
              />
              {errors.productName && (
                <p className="text-sm text-destructive">{errors.productName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Saree">Saree</SelectItem>
                        <SelectItem value="Painting">Painting</SelectItem>
                        <SelectItem value="Pottery">Pottery</SelectItem>
                        <SelectItem value="Jewelry">Jewelry</SelectItem>
                        <SelectItem value="Handicraft">Handicraft</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes / Keywords</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Describe unique features, materials used, or inspiration."
            />
          </div>
          <div className="space-y-4">
            <Label className="text-base font-medium">Product Image</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="relative group">
                <div className={`w-full aspect-square border-2 border-dashed rounded-xl flex items-center justify-center transition-all ${
                  imagePreview 
                    ? 'border-primary/30 bg-primary/5' 
                    : 'border-muted-foreground/30 bg-muted/20 hover:border-primary/50 hover:bg-primary/5'
                }`}>
                  {imagePreview ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={imagePreview}
                        alt="Product preview"
                        fill
                        className="object-cover rounded-xl"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-xl" />
                    </div>
                  ) : (
                    <div className="text-center space-y-3">
                      <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-primary">Upload your creation</p>
                        <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB</p>
                      </div>
                    </div>
                  )}
                </div>
                {imagePreview && (
                  <div className="absolute -bottom-2 -right-2">
                    <div className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                      ✓
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    {...register("image")}
                    onChange={onFileChange}
                    className="hidden"
                  />
                  <label 
                    htmlFor="image" 
                    className="flex items-center justify-center w-full py-3 px-6 border-2 border-primary/20 border-dashed rounded-lg cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all group"
                  >
                    <div className="text-center space-y-2">
                      <div className="w-8 h-8 mx-auto bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Sparkles className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <span className="font-medium text-primary">Choose Image</span>
                        <p className="text-xs text-muted-foreground">or drag and drop</p>
                      </div>
                    </div>
                  </label>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <Lightbulb className="h-4 w-4 text-amber-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-amber-800">Pro Tip</p>
                      <p className="text-amber-700">Use high-quality images with good lighting to get better AI-generated descriptions.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/20 border-t">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-muted-foreground">
              {imagePreview && formValues.productName && formValues.category
                ? "Ready to generate your catalog entry"
                : "Please fill in the required fields above"}
            </div>
            <Button
              type="button"
              onClick={onGenerateCatalog}
              disabled={loadingStates.catalog || !imagePreview || !formValues.productName || !formValues.category}
              size="lg"
              className="min-w-[200px]"
            >
              {loadingStates.catalog ? (
                <>
                  <CircleDashed className="animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2" />
                  Generate Catalog Entry
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      {generatedData.catalog && <GeneratedCatalogDetails data={generatedData.catalog} />}

      {/* Step 2: Storytelling */}
      <Card className="overflow-hidden border-l-4 border-l-amber-500">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-transparent">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <BookOpenText className="h-5 w-5 text-amber-700" />
            </div>
            <div>
              <span className="text-lg">Step 2: Cultural Story</span>
              <p className="text-sm text-muted-foreground font-normal mt-1">
                Share the heritage and tradition behind your craft
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="artisanName">Artisan/Community Name</Label>
              <Input id="artisanName" {...register("artisanName")} placeholder="e.g., 'The Weavers of Kutch'" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="artisanRegion">Region</Label>
              <Input id="artisanRegion" {...register("artisanRegion")} placeholder="e.g., 'Gujarat, India'" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/20 border-t">
          <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {formValues.artisanName && formValues.artisanRegion
                  ? "Ready to craft your cultural story"
                  : "Please provide artisan details above"}
              </div>
              <Button 
                type="button" 
                onClick={onGenerateStory} 
                disabled={loadingStates.story || !formValues.artisanName || !formValues.artisanRegion}
                size="lg"
                className="min-w-[180px] bg-amber-600 hover:bg-amber-700"
              >
                {loadingStates.story ? (
                  <>
                    <CircleDashed className="animate-spin mr-2" />
                    Crafting...
                  </>
                ) : (
                  <>
                    <BookOpenText className="mr-2" />
                    Generate Story
                  </>
                )}
              </Button>
            </div>
            {generatedData.story && (
              <div className="p-4 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-amber-100 rounded-full">
                    <BookOpenText className="h-4 w-4 text-amber-700" />
                  </div>
                  <div className="flex-1">
                    <Label className="font-semibold text-amber-900">Your Cultural Story</Label>
                    <p className="text-sm mt-2 text-amber-800 leading-relaxed">{(generatedData.story as any).culturalStory}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Step 3: Pricing */}
      <Card className="overflow-hidden border-l-4 border-l-green-500">
        <CardHeader className="bg-gradient-to-r from-green-50 to-transparent">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <IndianRupee className="h-5 w-5 text-green-700" />
            </div>
            <div>
              <span className="text-lg">Step 3: Smart Pricing</span>
              <p className="text-sm text-muted-foreground font-normal mt-1">
                Get AI-powered price suggestions based on your craft
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="space-y-2">
              <Label htmlFor="material">Material</Label>
              <Input id="material" {...register("material")} placeholder="e.g., 'Cotton'" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="size">Size</Label>
              <Input id="size" {...register("size")} placeholder="e.g., 'Medium' or '12x16 inches'" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="artisanEffortHours">Effort (Hours)</Label>
              <Input id="artisanEffortHours" type="number" {...register("artisanEffortHours")} placeholder="e.g., 40" />
            </div>
        </CardContent>
        <CardFooter className="bg-muted/20 border-t">
          <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {formValues.material && formValues.size && formValues.artisanEffortHours
                  ? "Ready to calculate intelligent pricing"
                  : "Please provide material, size, and effort details"}
              </div>
              <Button 
                type="button" 
                onClick={onSuggestPrice} 
                disabled={loadingStates.pricing || !formValues.material || !formValues.size || !formValues.artisanEffortHours}
                size="lg"
                className="min-w-[180px] bg-green-600 hover:bg-green-700"
              >
                {loadingStates.pricing ? (
                  <>
                    <CircleDashed className="animate-spin mr-2" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <IndianRupee className="mr-2" />
                    Suggest Price
                  </>
                )}
              </Button>
            </div>
            {generatedData.pricing && (
              <div className="p-6 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <IndianRupee className="h-5 w-5 text-green-700" />
                    </div>
                    <div>
                      <Label className="font-semibold text-green-900">Suggested Price Range</Label>
                      <p className="text-2xl font-bold text-green-800 mt-1">{(generatedData.pricing as any).suggestedPriceRangeINR}</p>
                    </div>
                  </div>
                  <div className="bg-white/60 p-4 rounded-lg">
                    <Label className="font-semibold text-green-900">AI Reasoning:</Label>
                    <p className="text-sm mt-2 text-green-800 leading-relaxed">{(generatedData.pricing as any).reasoning}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Step 4: Marketing */}
      <Card className="overflow-hidden border-l-4 border-l-purple-500">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-transparent">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Megaphone className="h-5 w-5 text-purple-700" />
            </div>
            <div>
              <span className="text-lg">Step 4: Marketing Content</span>
              <p className="text-sm text-muted-foreground font-normal mt-1">
                Create engaging social media content to promote your craft
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="py-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Megaphone className="h-5 w-5 text-purple-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-purple-800">Multi-Platform Content</p>
                <p className="text-purple-700 mt-1">Generate Instagram captions, WhatsApp status, and ad scripts in multiple languages.</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/20 border-t">
          <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {generatedData.catalog
                  ? "Ready to create marketing magic"
                  : "Generate catalog entry first to proceed"}
              </div>
              <Button 
                type="button" 
                onClick={onGenerateMarketing} 
                disabled={!generatedData.catalog || loadingStates.marketing}
                size="lg"
                className="min-w-[200px] bg-purple-600 hover:bg-purple-700"
              >
                {loadingStates.marketing ? (
                  <>
                    <CircleDashed className="animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Megaphone className="mr-2" />
                    Generate Marketing
                  </>
                )}
              </Button>
            </div>
            {generatedData.marketing && <GeneratedMarketingContent data={generatedData.marketing} />}
          </div>
        </CardFooter>
      </Card>
      
      {/* Final Save Section */}
      <Card className="bg-gradient-to-r from-primary/5 to-blue-50 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span>Ready to Save Your Creation?</span>
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Your product will be saved as a draft. You can edit and publish it later from your Products page.
              </p>
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${generatedData.catalog ? 'bg-green-500' : 'bg-muted'}`}></div>
                  <span>Catalog Entry</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${generatedData.story ? 'bg-green-500' : 'bg-muted'}`}></div>
                  <span>Cultural Story</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${generatedData.pricing ? 'bg-green-500' : 'bg-muted'}`}></div>
                  <span>Pricing</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${generatedData.marketing ? 'bg-green-500' : 'bg-muted'}`}></div>
                  <span>Marketing</span>
                </div>
              </div>
            </div>
            <Button 
              size="lg" 
              onClick={onSaveProduct}
              disabled={!generatedData.catalog || !formValues.productName || !formValues.category || !imagePreview || loadingStates.saving || authLoading}
              className="min-w-[200px] h-12 text-base"
            >
              {loadingStates.saving ? (
                <>
                  <CircleDashed className="animate-spin mr-2" />
                  Saving Draft...
                </>
              ) : (
                <>
                  <ClipboardCheck className="mr-2" />
                  Save as Draft
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      </form>
    </div>
  );
}

function GeneratedCatalogDetails({ data }: { data: any }) {
    return (
        <Card className="bg-gradient-to-r from-primary/5 to-blue-50 border-primary/20 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent border-b">
                <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-primary/20 rounded-lg">
                        <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <span className="text-lg">AI Generated Catalog Details</span>
                        <p className="text-sm text-muted-foreground font-normal mt-1">
                            Review and customize your product information
                        </p>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="genTitle" className="text-base font-medium">Product Title</Label>
                            <Input 
                                id="genTitle" 
                                defaultValue={data.title} 
                                className="bg-background border-primary/20 focus:border-primary" 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="genDesc" className="text-base font-medium">Product Description</Label>
                            <Textarea 
                                id="genDesc" 
                                defaultValue={data.description} 
                                rows={6} 
                                className="bg-background border-primary/20 focus:border-primary resize-none" 
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="space-y-3">
                            <Label className="text-base font-medium">Keywords</Label>
                            <div className="flex flex-wrap gap-2 p-4 bg-background border border-primary/20 rounded-lg">
                                {data.keywords.split(',').map((kw: string, idx: number) => 
                                    <Badge key={idx} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                                        {kw.trim()}
                                    </Badge>
                                )}
                            </div>
                        </div>
                        
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <div className="flex items-start space-x-2">
                                <Lightbulb className="h-4 w-4 text-amber-600 mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-medium text-amber-800">Content Ready!</p>
                                    <p className="text-amber-700">Your AI-generated content is ready to use. You can edit it above if needed.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <Label className="text-base font-medium flex items-center space-x-2">
                        <span>Multi-Language Translations</span>
                        <Badge variant="outline" className="text-xs">AI Powered</Badge>
                    </Label>
                    <Tabs defaultValue="english" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="english" className="text-sm">English</TabsTrigger>
                            <TabsTrigger value="hindi" className="text-sm">हिन्दी</TabsTrigger>
                            <TabsTrigger value="gujarati" className="text-sm">ગુજરાતી</TabsTrigger>
                        </TabsList>
                        <TabsContent value="english" className="mt-4">
                            <div className="p-4 border border-primary/20 rounded-lg bg-background">
                                <p className="text-sm leading-relaxed">{data.translations.english}</p>
                            </div>
                        </TabsContent>
                        <TabsContent value="hindi" className="mt-4">
                            <div className="p-4 border border-primary/20 rounded-lg bg-background">
                                <p className="text-sm leading-relaxed">{data.translations.hindi}</p>
                            </div>
                        </TabsContent>
                        <TabsContent value="gujarati" className="mt-4">
                            <div className="p-4 border border-primary/20 rounded-lg bg-background">
                                <p className="text-sm leading-relaxed">{data.translations.gujarati}</p>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </CardContent>
        </Card>
    )
}

function GeneratedMarketingContent({ data }: { data: any }) {
    const renderContent = (captions: string[], status: string, script: string) => (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-purple-100 rounded-lg">
                        <Megaphone className="h-4 w-4 text-purple-700" />
                    </div>
                    <h3 className="font-semibold text-purple-900">Instagram Captions</h3>
                </div>
                <div className="space-y-3">
                    {captions.map((caption, i) => (
                        <div key={i} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                            <div className="flex justify-between items-start">
                                <p className="text-sm text-purple-800 flex-1 leading-relaxed">{caption}</p>
                                <Badge variant="outline" className="ml-2 text-xs">#{i + 1}</Badge>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="space-y-3">
                <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-green-100 rounded-lg">
                        <MessageCircle className="h-4 w-4 text-green-700" />
                    </div>
                    <h3 className="font-semibold text-green-900">WhatsApp Status</h3>
                </div>
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800 leading-relaxed">{status}</p>
                </div>
            </div>
            
            <div className="space-y-3">
                <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-blue-100 rounded-lg">
                        <Bot className="h-4 w-4 text-blue-700" />
                    </div>
                    <h3 className="font-semibold text-blue-900">30-Second Ad Script</h3>
                </div>
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800 leading-relaxed whitespace-pre-wrap">{script}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="mt-4 p-6 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-purple-100 rounded-full">
                    <Megaphone className="h-5 w-5 text-purple-700" />
                </div>
                <div>
                    <h3 className="font-semibold text-purple-900">Marketing Content Ready!</h3>
                    <p className="text-sm text-purple-700">Multi-platform content in multiple languages</p>
                </div>
            </div>
            
            <Tabs defaultValue="english" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-white/50">
                    <TabsTrigger value="english" className="text-sm">English</TabsTrigger>
                    <TabsTrigger value="hindi" className="text-sm">हिन्दी</TabsTrigger>
                    <TabsTrigger value="gujarati" className="text-sm">ગુજરાતી</TabsTrigger>
                </TabsList>
                <TabsContent value="english" className="mt-6">
                    {renderContent(data.instagramCaptions, data.whatsappStatus, data.adScript)}
                </TabsContent>
                <TabsContent value="hindi" className="mt-6">
                    {renderContent(data.hindiInstagramCaptions, data.hindiWhatsappStatus, data.hindiAdScript)}
                </TabsContent>
                <TabsContent value="gujarati" className="mt-6">
                    {renderContent(data.gujaratiInstagramCaptions, data.gujaratiWhatsappStatus, data.gujaratiAdScript)}
                </TabsContent>
            </Tabs>
        </div>
    )
}
