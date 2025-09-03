
import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "./ui/button"

interface Product {
  id: string
  name: string
  price: number
  image: string
  hint: string
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <Link href={`/products/${product.id}`} className="block relative aspect-video">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform hover:scale-105"
            data-ai-hint={product.hint}
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg leading-tight">
          <Link href={`/products/${product.id}`}>{product.name}</Link>
        </CardTitle>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 pt-0">
        <p className="font-bold text-primary">₹{product.price.toLocaleString()}</p>
        <Button variant="ghost" size="icon">
          <Heart className="h-5 w-5" />
          <span className="sr-only">Like</span>
        </Button>
      </CardFooter>
    </Card>
  )
}
