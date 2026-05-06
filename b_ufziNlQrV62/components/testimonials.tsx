"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Sarah K.",
    location: "Los Angeles, CA",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 5,
    text: "Amazing selection and fast shipping! Got my BTS album within a week. The packaging was perfect and the photocard pulls were incredible.",
  },
  {
    id: 2,
    name: "Min J.",
    location: "Toronto, Canada",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    rating: 5,
    text: "Finally found a reliable store for authentic K-pop merch. The pre-order process was smooth and customer service was super helpful!",
  },
  {
    id: 3,
    name: "Emily R.",
    location: "London, UK",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    rating: 5,
    text: "Best place to buy K-pop albums! The prices are fair and they always have the latest releases. My go-to shop for all things K-pop.",
  },
  {
    id: 4,
    name: "David L.",
    location: "Sydney, Australia",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    rating: 5,
    text: "International shipping is excellent. My BLACKPINK lightstick arrived in perfect condition. Will definitely order again!",
  },
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleCount, setVisibleCount] = useState(1)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCount(3)
      } else if (window.innerWidth >= 768) {
        setVisibleCount(2)
      } else {
        setVisibleCount(1)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const maxIndex = Math.max(0, testimonials.length - visibleCount)

  const prev = () => setCurrentIndex((i) => Math.max(0, i - 1))
  const next = () => setCurrentIndex((i) => Math.min(maxIndex, i + 1))

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-xs text-primary uppercase tracking-widest mb-2">
            Testimonials
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Fans Are Saying
          </h2>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
              }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3"
                >
                  <div className="bg-card border border-border rounded-lg p-6 h-full">
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-primary text-primary"
                        />
                      ))}
                    </div>
                    <p className="text-foreground mb-6 leading-relaxed">
                      &quot;{testimonial.text}&quot;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden">
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {testimonial.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {testimonial.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prev}
              disabled={currentIndex === 0}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              disabled={currentIndex >= maxIndex}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
