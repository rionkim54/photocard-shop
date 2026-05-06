import { Header } from "@/components/header"
import { MarqueeBanner } from "@/components/marquee-banner"
import { Hero } from "@/components/hero"
import { Categories } from "@/components/categories"
import { FeaturedProducts } from "@/components/featured-products"
import { ArtistSpotlight } from "@/components/artist-spotlight"
import { PromoSection } from "@/components/promo-section"
import { Testimonials } from "@/components/testimonials"
import { Newsletter } from "@/components/newsletter"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <MarqueeBanner />
      <Header />
      <main>
        <Hero />
        <Categories />
        <FeaturedProducts />
        <ArtistSpotlight />
        <PromoSection />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}
