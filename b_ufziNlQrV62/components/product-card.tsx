"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

interface Product {
  id: number
  name: string
  artist: string
  price: number
  originalPrice?: number
  image: string
  badge?: string
  isNew?: boolean
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <Badge className="bg-primary text-primary-foreground">New</Badge>
            )}
            {product.badge && (
              <Badge variant="secondary">{product.badge}</Badge>
            )}
            {discount && (
              <Badge className="bg-destructive text-destructive-foreground">
                -{discount}%
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsWishlisted(!isWishlisted)
            }}
            className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              isWishlisted
                ? "bg-primary text-primary-foreground"
                : "bg-background/80 text-foreground hover:bg-background"
            }`}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
          </button>

          {/* Quick Add Button */}
          <div
            className={`absolute bottom-3 left-3 right-3 transition-all duration-300 ${
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            <Button
              className="w-full bg-background text-foreground hover:bg-background/90"
              onClick={(e) => {
                e.preventDefault()
                // Add to cart logic
              }}
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>

        <div className="mt-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            {product.artist}
          </p>
          <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
