import { ProductCard } from "./product-card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const featuredProducts = [
  {
    id: 1,
    name: "BLACKPINK - BORN PINK (Box Set)",
    artist: "BLACKPINK",
    price: 45.99,
    originalPrice: 54.99,
    image: "https://images.unsplash.com/photo-1619983081563-430f63602796?w=600&h=600&fit=crop",
    isNew: true,
  },
  {
    id: 2,
    name: "BTS - Proof (Collector's Edition)",
    artist: "BTS",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=600&fit=crop",
    badge: "Best Seller",
  },
  {
    id: 3,
    name: "NewJeans - Get Up (Limited Ver.)",
    artist: "NewJeans",
    price: 32.99,
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=600&fit=crop",
    isNew: true,
  },
  {
    id: 4,
    name: "Stray Kids - 5-STAR (Target Exclusive)",
    artist: "Stray Kids",
    price: 38.99,
    originalPrice: 44.99,
    image: "https://images.unsplash.com/photo-1501612780327-45045538702b?w=600&h=600&fit=crop",
  },
  {
    id: 5,
    name: "SEVENTEEN - FML (Deluxe Ver.)",
    artist: "SEVENTEEN",
    price: 42.99,
    image: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=600&h=600&fit=crop",
    badge: "Pre-Order",
  },
  {
    id: 6,
    name: "aespa - MY WORLD (Poster Ver.)",
    artist: "aespa",
    price: 28.99,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop",
    isNew: true,
  },
  {
    id: 7,
    name: "IVE - I've Mine (Digipack Ver.)",
    artist: "IVE",
    price: 24.99,
    originalPrice: 29.99,
    image: "https://images.unsplash.com/photo-1484755560615-a4c64e778a6c?w=600&h=600&fit=crop",
  },
  {
    id: 8,
    name: "LE SSERAFIM - UNFORGIVEN (Weverse Ver.)",
    artist: "LE SSERAFIM",
    price: 35.99,
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=600&fit=crop",
    badge: "Limited",
  },
]

export function FeaturedProducts() {
  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
              Featured Albums
            </h2>
            <p className="text-muted-foreground">
              The hottest releases and fan favorites
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/albums">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
