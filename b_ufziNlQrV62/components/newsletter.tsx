"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubmitted(true)
      setEmail("")
    }
  }

  return (
    <section className="py-16 md:py-24 bg-foreground text-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-background/10 mb-6">
            <Mail className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Join the Fan Club
          </h2>
          <p className="text-background/80 mb-8 text-pretty">
            Subscribe to our newsletter for exclusive drops, early access to pre-orders,
            and special discounts. Be the first to know about new arrivals!
          </p>

          {isSubmitted ? (
            <div className="bg-background/10 rounded-lg p-6">
              <p className="text-lg font-medium">
                Welcome to the fandom! 🎉
              </p>
              <p className="text-background/80 text-sm mt-2">
                Check your inbox for a special welcome gift.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/10 border-background/20 text-background placeholder:text-background/50 focus-visible:ring-background/50"
                required
              />
              <Button
                type="submit"
                className="bg-background text-foreground hover:bg-background/90 shrink-0"
              >
                Subscribe
              </Button>
            </form>
          )}

          <p className="text-xs text-background/60 mt-4">
            By subscribing, you agree to receive marketing emails. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  )
}
