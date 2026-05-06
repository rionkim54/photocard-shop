"use client"

const marqueeItems = [
  "FREE SHIPPING ON ORDERS $50+",
  "★",
  "NEW ARRIVALS EVERY WEEK",
  "★",
  "AUTHENTIC K-POP MERCHANDISE",
  "★",
  "EXCLUSIVE PRE-ORDERS",
  "★",
  "WORLDWIDE DELIVERY",
  "★",
  "SIGNED ALBUMS AVAILABLE",
  "★",
]

export function MarqueeBanner() {
  return (
    <div className="bg-primary text-primary-foreground py-2 overflow-hidden">
      <div className="animate-marquee whitespace-nowrap flex">
        {[...marqueeItems, ...marqueeItems].map((item, index) => (
          <span
            key={index}
            className="mx-4 text-xs font-medium uppercase tracking-wider"
          >
            {item}
          </span>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  )
}
