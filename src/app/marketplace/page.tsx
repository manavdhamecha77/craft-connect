"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { PageLayout } from "@/components/page-layout";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getMarketplaceProducts, searchMarketplaceProducts, type MarketplaceProduct } from "@/lib/product-store";

export default function MarketplacePage() {
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setProducts(getMarketplaceProducts());
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q);
    if (q.trim().length === 0) {
      setProducts(getMarketplaceProducts());
    } else {
      setProducts(searchMarketplaceProducts(q));
    }
  };

  return (
    <PageLayout>
      <div className="flex items-center mb-4">
        <PageHeader title="Marketplace" />
        <div className="ml-auto flex items-center gap-2">
          <Input placeholder="Search products..." value={query} onChange={handleSearch} className="w-64" />
          <Button asChild>
            <Link href="/catalog-builder">Add Product</Link>
          </Button>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">No products in marketplace yet.</p>
          <Button asChild className="mt-4">
            <Link href="/catalog-builder">Create your first product</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardHeader className="p-0">
                <div className="relative aspect-video">
                  <Image src={product.image} alt={product.name} fill className="object-cover" />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">{product.category}</Badge>
                  <span className="text-primary font-semibold">₹{product.price.toLocaleString()}</span>
                </div>
                <CardTitle className="text-lg leading-tight">{product.title || product.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/marketplace/${product.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </PageLayout>
  );
}

