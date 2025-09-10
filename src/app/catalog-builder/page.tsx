import { PageLayout } from "@/components/page-layout";
import { PageHeader } from "@/components/page-header";
import { CatalogBuilderForm } from "./_components/catalog-builder-form";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Palette, BookOpen } from "lucide-react";

export default function CatalogBuilderPage() {
  return (
    <PageLayout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Palette className="h-8 w-8 text-primary" />
            <Sparkles className="h-6 w-6 text-amber-500" />
          </div>
          <PageHeader
            title="AI Catalog Builder"
            description="Transform your handcrafted masterpiece into a compelling story with the power of AI"
          />
          <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Smart Descriptions</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span>Cultural Stories</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Pricing Intelligence</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto">
          <CatalogBuilderForm />
        </div>
      </div>
    </PageLayout>
  );
}
