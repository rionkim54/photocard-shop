'use client'

import { useState, useEffect } from 'react'

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

const slides: { image: string; href: string; download?: string }[] = [
  {
    image: `${BASE_PATH}/images/banner_1.png`,
    href: `${BASE_PATH}/docs/KSTORM_IR.pdf`,
    download: 'KSTORM_IR.pdf',
  },
  {
    image: `${BASE_PATH}/images/banner_3.png`,
    href: `${BASE_PATH}#gallery`,
  },
  {
    image: `${BASE_PATH}/images/banner_2.png`,
    href: `${BASE_PATH}/collection`,
  },
]

export default function Hero() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const ti = setInterval(() => setIdx(i => (i + 1) % slides.length), 6000)
    return () => clearInterval(ti)
  }, [])

  const next = () => setIdx(i => (i + 1) % slides.length)
  const prev = () => setIdx(i => (i - 1 + slides.length) % slides.length)

  return (
    <section id="home" className="relative w-full overflow-hidden bg-black">
      {/* 이미지 자체 비율로 높이 결정 */}
      <img
        src={slides[0].image}
        alt=""
        aria-hidden="true"
        className="w-full h-auto block invisible"
      />

      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === idx ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <a
            href={s.href}
            download={s.download}
            className="absolute inset-0 block cursor-pointer"
          >
            <img
              src={s.image}
              alt=""
              className="w-full h-full object-cover"
            />
          </a>
        </div>
      ))}

      {/* 이전/다음 버튼 */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm text-white hover:bg-white/40 transition-colors z-10"
        aria-label="Previous slide"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M11 4l-5 5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm text-white hover:bg-white/40 transition-colors z-10"
        aria-label="Next slide"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* 인디케이터 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`h-2 rounded-full transition-all ${
              i === idx ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
