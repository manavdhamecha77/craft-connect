import { PageLayout } from "@/components/page-layout";
import { PageHeader } from "@/components/page-header";
import { CatalogBuilderForm } from "./_components/catalog-builder-form";

export default function CatalogBuilderPage() {
  return (
    <PageLayout>
      <PageHeader
        title="AI Catalog Builder"
        description="Let's craft the perfect entry for your new creation."
      />
      <div className="max-w-4xl mx-auto">
        <CatalogBuilderForm />
      </div>
    </PageLayout>
  );
}
