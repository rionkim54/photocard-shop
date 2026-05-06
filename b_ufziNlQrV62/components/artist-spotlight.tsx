import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const artists = [
  {
    id: 1,
    name: "BTS",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop",
    itemCount: 245,
  },
  {
    id: 2,
    name: "BLACKPINK",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    itemCount: 189,
  },
  {
    id: 3,
    name: "NewJeans",
    image: "https://images.unsplash.com/photo-1619983081563-430f63602796?w=300&h=300&fit=crop",
    itemCount: 156,
  },
  {
    id: 4,
    name: "Stray Kids",
    image: "https://images.unsplash.com/photo-1501612780327-45045538702b?w=300&h=300&fit=crop",
    itemCount: 203,
  },
  {
    id: 5,
    name: "SEVENTEEN",
    image: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=300&h=300&fit=crop",
    itemCount: 178,
  },
  {
    id: 6,
    name: "aespa",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
    itemCount: 134,
  },
]

export function ArtistSpotlight() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
              Shop by Artist
            </h2>
            <p className="text-muted-foreground">
              Browse merchandise from your favorite K-pop groups
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/artists">
              All Artists <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
          {artists.map((artist) => (
            <Link
              key={artist.id}
              href={`/artist/${artist.id}`}
              className="group text-center"
            >
              <div className="relative aspect-square rounded-full overflow-hidden bg-muted mb-3 ring-2 ring-transparent group-hover:ring-primary transition-all">
                <Image
                  src={artist.image}
                  alt={artist.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <h3 className="font-medium text-foreground group-hover:text-primary transition-colors text-sm md:text-base">
                {artist.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {artist.itemCount} items
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
