import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function PromoSection() {
  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Photocard Collection */}
          <div className="relative overflow-hidden rounded-lg aspect-[4/3] lg:aspect-auto lg:min-h-[400px] group">
            <Image
              src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop"
              alt="Photocard collection"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-foreground/50" />
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <p className="text-xs text-background/80 uppercase tracking-widest mb-2">
                Collector&apos;s Corner
              </p>
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-background mb-3">
                Rare Photocards
              </h3>
              <p className="text-background/90 mb-6 max-w-xs text-pretty">
                Trade and collect rare photocards from limited edition albums
              </p>
              <Button
                asChild
                className="w-fit bg-background text-foreground hover:bg-background/90"
              >
                <Link href="/photocards">Browse Collection</Link>
              </Button>
            </div>
          </div>

          {/* Right Column - Two Smaller Promos */}
          <div className="grid grid-rows-2 gap-6">
            {/* Pre-orders */}
            <div className="relative overflow-hidden rounded-lg group">
              <Image
                src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=400&fit=crop"
                alt="Pre-orders"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-foreground/50" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <p className="text-xs text-background/80 uppercase tracking-widest mb-1">
                  Coming Soon
                </p>
                <h3 className="font-serif text-xl md:text-2xl font-bold text-background mb-2">
                  Pre-Order Now
                </h3>
                <p className="text-sm text-background/90 mb-4">
                  Be the first to get upcoming releases
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="w-fit border-background text-background hover:bg-background hover:text-foreground"
                >
                  <Link href="/preorders">View Pre-Orders</Link>
                </Button>
              </div>
            </div>

            {/* Fan Goods */}
            <div className="relative overflow-hidden rounded-lg group">
              <Image
                src="https://images.unsplash.com/photo-1501612780327-45045538702b?w=800&h=400&fit=crop"
                alt="Fan goods"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-foreground/50" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <p className="text-xs text-background/80 uppercase tracking-widest mb-1">
                  Official Merch
                </p>
                <h3 className="font-serif text-xl md:text-2xl font-bold text-background mb-2">
                  Fan Goods & Apparel
                </h3>
                <p className="text-sm text-background/90 mb-4">
                  Shirts, accessories, and more
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="w-fit border-background text-background hover:bg-background hover:text-foreground"
                >
                  <Link href="/merch">Shop Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
