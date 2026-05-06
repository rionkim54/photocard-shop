'use client'

import { useState, useEffect } from 'react'
import { useLang, type Translations } from '../lib/i18n'

const slides: {
  eyebrow: string
  title: Translations
  description: Translations
  cta: Translations
  href: string
  accent: string
  align: 'left' | 'right' | 'center'
}[] = [
  {
    eyebrow: '2026 SPRING COLLECTION',
    title: {
      ko: '당신의 최애를 만나다',
      en: 'Meet Your Bias',
      zh: '邂逅你的爱豆',
      ja: '推しに出会う',
    },
    description: {
      ko: '갓 입고된 K-POP 앨범과 한정판 굿즈를 가장 먼저 만나보세요. 전 세계 팬들이 사랑하는 K-STORM의 큐레이션',
      en: 'Discover the latest K-POP albums and limited-edition merchandise. Curated for fans worldwide by K-STORM.',
      zh: '率先发现最新的K-POP专辑与限定周边。K-STORM 为全球粉丝精心策划',
      ja: '最新のK-POPアルバムと限定グッズをいち早くチェック。世界中のファンに愛されるK-STORMセレクション',
    },
    cta: { ko: '쇼핑 시작하기', en: 'Start Shopping', zh: '开始购物', ja: '今すぐ購入' },
    href: '#gallery',
    accent: 'from-sky-500 via-cyan-400 to-blue-500',
    align: 'left',
  },
  {
    eyebrow: 'LIMITED EDITION',
    title: {
      ko: '한정판 포토카드',
      en: 'Limited Photocards',
      zh: '限定版小卡',
      ja: '限定フォトカード',
    },
    description: {
      ko: '오직 K-STORM에서만 만날 수 있는 사인 앨범과 희귀 포토카드. 컬렉터를 위한 단 하나의 컬렉션',
      en: 'Signed albums and rare photocards exclusive to K-STORM. The collection every collector dreams of.',
      zh: '仅在K-STORM 才能找到的签名专辑与稀有小卡。为收藏家打造的唯一系列',
      ja: 'K-STORMだけで手に入るサイン入りアルバムとレアフォトカード。コレクターのための唯一無二のコレクション',
    },
    cta: { ko: '컬렉션 보기', en: 'View Collection', zh: '查看系列', ja: 'コレクションを見る' },
    href: '#gallery',
    accent: 'from-pink-500 via-rose-400 to-fuchsia-500',
    align: 'right',
  },
  {
    eyebrow: 'OFFICIAL MERCH',
    title: {
      ko: '나의 응원, 빛나게',
      en: 'Light Up Your Cheer',
      zh: '点亮你的应援',
      ja: '推しを照らす光',
    },
    description: {
      ko: '공식 라이선스 응원봉과 굿즈로 콘서트와 팬미팅을 더욱 특별하게. 전 세계 어디든 안전하게 배송',
      en: 'Make every concert and fan meeting unforgettable with officially licensed lightsticks and merch. Safe worldwide shipping.',
      zh: '用官方授权的应援棒与周边让演唱会和粉丝见面会更加特别。安全配送至全球',
      ja: '公式ライセンスのペンライトとグッズで、コンサートやファンミーティングをもっと特別に。世界中へ安全配送',
    },
    cta: { ko: '컬렉션 보기', en: 'View Collection', zh: '查看系列', ja: 'コレクションを見る' },
    href: '#gallery',
    accent: 'from-violet-500 via-purple-400 to-indigo-500',
    align: 'center',
  },
]

export default function Hero() {
  const { t } = useLang()
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const ti = setInterval(() => setIdx(i => (i + 1) % slides.length), 6000)
    return () => clearInterval(ti)
  }, [])

  const next = () => setIdx(i => (i + 1) % slides.length)
  const prev = () => setIdx(i => (i - 1 + slides.length) % slides.length)

  return (
    <section
      id="home"
      className="relative w-full h-[60vh] min-h-[440px] md:h-[72vh] overflow-hidden"
    >
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === idx ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${s.accent}`} />
          <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-white/30 blur-3xl" />
          <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_55%)]" />
          <div className="absolute inset-0 bg-slate-900/20" />

          <div className="absolute right-[6%] top-1/2 -translate-y-1/2 hidden md:flex gap-3 opacity-90">
            <div className="h-56 w-40 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/30 shadow-2xl rotate-[-8deg]" />
            <div className="h-64 w-44 rounded-2xl bg-white/25 backdrop-blur-sm border border-white/40 shadow-2xl translate-y-2" />
            <div className="h-56 w-40 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/30 shadow-2xl rotate-[8deg]" />
          </div>

          <div className="relative h-full mx-auto max-w-7xl px-6 flex items-center">
            <div
              className={`max-w-xl ${
                s.align === 'center'
                  ? 'mx-auto text-center'
                  : s.align === 'right'
                  ? 'ml-auto text-right md:hidden lg:block'
                  : 'mr-auto text-left'
              }`}
            >
              <p className="text-xs md:text-sm font-medium text-white/85 tracking-[0.25em] uppercase mb-3 animate-fade-up">
                {s.eyebrow}
              </p>
              <h1
                className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-5 drop-shadow-[0_4px_24px_rgba(0,0,0,0.25)] animate-fade-up"
                style={{ animationDelay: '0.1s' }}
              >
                {t(s.title)}
              </h1>
              <p
                className="text-base md:text-lg text-white/95 mb-8 max-w-md leading-relaxed animate-fade-up"
                style={{ animationDelay: '0.2s' }}
              >
                {t(s.description)}
              </p>
              <a
                href={s.href}
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-slate-900 shadow-xl hover:bg-slate-50 transition-colors animate-fade-up"
                style={{ animationDelay: '0.3s' }}
              >
                {t(s.cta)}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm text-white hover:bg-white/40 transition-colors"
        aria-label="Previous slide"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M11 4l-5 5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm text-white hover:bg-white/40 transition-colors"
        aria-label="Next slide"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
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
