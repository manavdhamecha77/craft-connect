
import Image from "next/image"
import Link from "next/link"
import { Globe, Mail } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PageLayout } from "@/components/page-layout"
import { PageHeader } from "@/components/page-header"
import { ProductCard } from "@/components/product-card"

// NOTE: This is placeholder data. In a real application, you would fetch this
// data from a database based on the provided `id`.
const artisan = {
  name: "Artisan Name",
  bio: "This is the artisan's biography. It will describe their craft, passion, and history.",
  location: "City, State",
  avatar: "",
  coverImage: "https://picsum.photos/1200/400",
  tags: ["Tag One", "Tag Two", "Tag Three"],
  products: [],
}

export default function ArtisanProfilePage({
  params,
}: {
  params: { id: string }
}) {
  const isOwnProfile = params.id === "me"

  return (
    <PageLayout>
      <div className="space-y-8">
        <Card className="overflow-hidden">
          <div className="relative h-48 w-full">
            <Image
              src={artisan.coverImage}
              alt="Artisan cover image"
              fill
              className="object-cover"
              data-ai-hint="weaving loom"
            />
          </div>
          <CardHeader className="flex-col items-start gap-4 md:flex-row md:items-center -mt-16 z-10 relative">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage src={artisan.avatar} />
              <AvatarFallback>AN</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <CardTitle className="text-3xl">{artisan.name}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Globe className="h-4 w-4" /> {artisan.location}
              </CardDescription>
              <div className="flex flex-wrap gap-2 pt-2">
                {artisan.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              {isOwnProfile ? (
                <Button asChild>
                    <Link href="/settings">Edit Profile</Link>
                </Button>
              ) : (
                <>
                  <Button variant="outline">
                    <Mail className="mr-2" /> Message
                  </Button>
                  <Button>Follow</Button>
                </>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="max-w-prose text-muted-foreground">{artisan.bio}</p>
          </CardContent>
        </Card>

        <div>
          <PageHeader
            title="Products"
            description="Explore the collection from this artisan."
            className="mb-6"
          />
           {artisan.products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {artisan.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <Card className="flex items-center justify-center h-48">
                    <p className="text-muted-foreground">No products to display.</p>
                </Card>
            )}
        </div>
      </div>
    </PageLayout>
  )
}
