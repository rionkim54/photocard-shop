import Image from "next/image"
import Link from "next/link"

const categories = [
  {
    id: 1,
    name: "Albums",
    description: "Latest releases & pre-orders",
    image: "https://images.unsplash.com/photo-1619983081563-430f63602796?w=600&h=800&fit=crop",
    href: "/albums",
    count: "500+ items",
  },
  {
    id: 2,
    name: "Photocards",
    description: "Official & trading cards",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=800&fit=crop",
    href: "/photocards",
    count: "2000+ items",
  },
  {
    id: 3,
    name: "Lightsticks",
    description: "Official fan lightsticks",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=800&fit=crop",
    href: "/lightsticks",
    count: "50+ items",
  },
]

export function Categories() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Shop by Category
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto text-pretty">
            Find everything you need to support your favorite K-pop artists
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group relative overflow-hidden rounded-lg aspect-[3/4] block"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-xs text-background/70 uppercase tracking-wider mb-1">
                  {category.count}
                </p>
                <h3 className="font-serif text-2xl font-bold text-background mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-background/80">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
