"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const heroSlides = [
  {
    id: 1,
    title: "New Arrivals",
    subtitle: "Spring Collection 2026",
    description: "Discover the latest albums and exclusive merchandise from your favorite artists",
    cta: "Shop Now",
    image: "https://images.unsplash.com/photo-1619983081563-430f63602796?w=1200&h=800&fit=crop",
    align: "left" as const,
  },
  {
    id: 2,
    title: "Limited Edition",
    subtitle: "Collector's Items",
    description: "Rare photocards and signed albums you won't find anywhere else",
    cta: "Explore",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=800&fit=crop",
    align: "right" as const,
  },
  {
    id: 3,
    title: "Official Lightsticks",
    subtitle: "Light Up Your Fandom",
    description: "Authentic lightsticks to show your support at concerts and fan meetings",
    cta: "View Collection",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=800&fit=crop",
    align: "center" as const,
  },
]

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)

  return (
    <section className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden bg-muted">
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-foreground/40" />
          <div className="relative h-full container mx-auto px-4 flex items-center">
            <div
              className={`max-w-xl ${
                slide.align === "center"
                  ? "mx-auto text-center"
                  : slide.align === "right"
                  ? "ml-auto text-right"
                  : "mr-auto text-left"
              }`}
            >
              <p className="text-sm md:text-base font-medium text-background/80 mb-2 tracking-widest uppercase">
                {slide.subtitle}
              </p>
              <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-background mb-4 text-balance">
                {slide.title}
              </h1>
              <p className="text-base md:text-lg text-background/90 mb-8 max-w-md mx-auto text-pretty">
                {slide.description}
              </p>
              <Button
                size="lg"
                className="bg-background text-foreground hover:bg-background/90 font-medium"
              >
                {slide.cta}
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center text-background hover:bg-background/30 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center text-background hover:bg-background/30 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide
                ? "bg-background w-8"
                : "bg-background/50 hover:bg-background/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
