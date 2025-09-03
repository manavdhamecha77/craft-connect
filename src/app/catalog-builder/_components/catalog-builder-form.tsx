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
  const [loadingStates, setLoadingStates] = useState({
    catalog: false,
    story: false,
    pricing: false,
    marketing: false,
  });
  const [generatedData, setGeneratedData] = useState({
    catalog: null,
    story: null,
    pricing: null,
    marketing: null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
        artisanEffortHours: formValues.artisanEffortHours,
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


  return (
    <form onSubmit={handleSubmit(() => {})} className="space-y-8">
      {/* Step 1: Catalog Builder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck /> Step 1: Product Details
          </CardTitle>
          <CardDescription>
            Provide basic information about your product and let our AI build
            your catalog entry.
          </CardDescription>
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
          <div className="space-y-2">
            <Label>Product Image</Label>
            <div className="flex items-center gap-4">
              <div className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/50">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Product preview"
                    width={128}
                    height={128}
                    className="object-cover w-full h-full rounded-lg"
                  />
                ) : (
                  <ImageIcon className="w-10 h-10 text-muted-foreground" />
                )}
              </div>
              <Input
                id="image"
                type="file"
                accept="image/*"
                {...register("image")}
                onChange={onFileChange}
                className="max-w-xs"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="button"
            onClick={onGenerateCatalog}
            disabled={loadingStates.catalog}
          >
            {loadingStates.catalog ? (
              <CircleDashed className="animate-spin" />
            ) : (
              <Sparkles />
            )}
            Generate Catalog Entry
          </Button>
        </CardFooter>
      </Card>
      
      {generatedData.catalog && <GeneratedCatalogDetails data={generatedData.catalog} />}

      {/* Step 2: Storytelling */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpenText /> Step 2: Cultural Story
          </CardTitle>
          <CardDescription>
            Tell the unique story behind your craft.
          </CardDescription>
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
        <CardFooter className="flex flex-col items-start gap-4">
           <Button type="button" onClick={onGenerateStory} disabled={loadingStates.story}>
                {loadingStates.story ? <CircleDashed className="animate-spin" /> : <Sparkles />}
                Generate Story
            </Button>
            {generatedData.story && (
                <div className="w-full p-4 rounded-md bg-muted/50">
                    <Label className="font-bold">Generated Story:</Label>
                    <p className="text-sm mt-2">{(generatedData.story as any).culturalStory}</p>
                </div>
            )}
        </CardFooter>
      </Card>

      {/* Step 3: Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IndianRupee /> Step 3: Smart Pricing
          </CardTitle>
          <CardDescription>
            Get an AI-powered price suggestion for your product.
          </CardDescription>
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
        <CardFooter className="flex flex-col items-start gap-4">
            <Button type="button" onClick={onSuggestPrice} disabled={loadingStates.pricing}>
                {loadingStates.pricing ? <CircleDashed className="animate-spin" /> : <Lightbulb />}
                Suggest Price
            </Button>
            {generatedData.pricing && (
                <div className="w-full p-4 rounded-md bg-muted/50 space-y-2">
                    <p className="text-lg">Suggested Price: <span className="font-bold text-primary">{(generatedData.pricing as any).suggestedPriceRangeINR}</span></p>
                    <div>
                        <Label className="font-bold">Reasoning:</Label>
                        <p className="text-sm mt-1">{(generatedData.pricing as any).reasoning}</p>
                    </div>
                </div>
            )}
        </CardFooter>
      </Card>

      {/* Step 4: Marketing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone /> Step 4: Marketing Content
          </CardTitle>
          <CardDescription>
            Generate social media content to promote your product.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col items-start gap-4">
            <Button type="button" onClick={onGenerateMarketing} disabled={!generatedData.catalog || loadingStates.marketing}>
                {loadingStates.marketing ? <CircleDashed className="animate-spin" /> : <Bot />}
                Generate Marketing Content
            </Button>
            {generatedData.marketing && <GeneratedMarketingContent data={generatedData.marketing} />}
        </CardFooter>
      </Card>
      
      <div className="flex justify-end pt-8">
        <Button size="lg" onClick={() => toast({ title: "Product Saved!", description: "Your new creation is now in your catalog." })}>
          Save Product
        </Button>
      </div>

    </form>
  );
}

function GeneratedCatalogDetails({ data }: { data: any }) {
    return (
        <Card className="bg-primary/5">
            <CardHeader>
                <CardTitle>AI Generated Details</CardTitle>
                <CardDescription>Review and edit the AI-generated content. Translations are also available.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="genTitle">Product Title</Label>
                    <Input id="genTitle" defaultValue={data.title} className="bg-background" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="genDesc">Product Description</Label>
                    <Textarea id="genDesc" defaultValue={data.description} rows={5} className="bg-background" />
                </div>
                <div className="space-y-2">
                    <Label>Keywords</Label>
                     <div className="flex flex-wrap gap-2">
                        {data.keywords.split(',').map((kw: string) => <Badge key={kw} variant="secondary">{kw.trim()}</Badge>)}
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Translations</Label>
                    <Tabs defaultValue="hindi">
                        <TabsList>
                            <TabsTrigger value="hindi">Hindi</TabsTrigger>
                            <TabsTrigger value="gujarati">Gujarati</TabsTrigger>
                            <TabsTrigger value="english">English</TabsTrigger>
                        </TabsList>
                        <TabsContent value="hindi" className="p-4 border rounded-md bg-background"><p>{data.translations.hindi}</p></TabsContent>
                        <TabsContent value="gujarati" className="p-4 border rounded-md bg-background"><p>{data.translations.gujarati}</p></TabsContent>
                        <TabsContent value="english" className="p-4 border rounded-md bg-background"><p>{data.translations.english}</p></TabsContent>
                    </Tabs>
                </div>
            </CardContent>
        </Card>
    )
}

function GeneratedMarketingContent({ data }: { data: any }) {
    const renderContent = (captions: string[], status: string, script: string) => (
        <div className="space-y-6">
            <div>
                <h3 className="font-semibold mb-2">Instagram Captions</h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                    {captions.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
            </div>
            <div>
                <h3 className="font-semibold mb-2">WhatsApp Status</h3>
                <p className="text-sm p-3 bg-muted rounded-md">{status}</p>
            </div>
            <div>
                <h3 className="font-semibold mb-2">30s Ad Script</h3>
                <p className="text-sm p-3 bg-muted rounded-md whitespace-pre-wrap">{script}</p>
            </div>
        </div>
    );

    return (
         <Tabs defaultValue="english" className="w-full">
            <TabsList>
                <TabsTrigger value="english">English</TabsTrigger>
                <TabsTrigger value="hindi">Hindi</TabsTrigger>
                <TabsTrigger value="gujarati">Gujarati</TabsTrigger>
            </TabsList>
            <TabsContent value="english" className="mt-4 p-4 border rounded-md">
                {renderContent(data.instagramCaptions, data.whatsappStatus, data.adScript)}
            </TabsContent>
            <TabsContent value="hindi" className="mt-4 p-4 border rounded-md">
                {renderContent(data.hindiInstagramCaptions, data.hindiWhatsappStatus, data.hindiAdScript)}
            </TabsContent>
            <TabsContent value="gujarati" className="mt-4 p-4 border rounded-md">
                {renderContent(data.gujaratiInstagramCaptions, data.gujaratiWhatsappStatus, data.gujaratiAdScript)}
            </TabsContent>
        </Tabs>
    )
}
