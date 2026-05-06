'use client'

import { useLang, type Translations } from '../lib/i18n'

const categories: {
  name: Translations
  description: Translations
  count: Translations
  href: string
  accent: string
  icon: React.ReactNode
}[] = [
  {
    name: { ko: '포토카드', en: 'Photocards', zh: '小卡', ja: 'フォトカード' },
    description: {
      ko: '공식 & 트레이딩 카드',
      en: 'Official & trading cards',
      zh: '官方与交换卡',
      ja: '公式 & トレーディングカード',
    },
    count: { ko: '2,000+ 종', en: '2,000+ items', zh: '2,000+ 款', ja: '2,000+ 種' },
    href: '#gallery',
    accent: 'from-pink-400 via-rose-400 to-fuchsia-500',
    icon: (
      <svg width="42" height="42" viewBox="0 0 42 42" fill="none" className="text-white">
        <rect x="9" y="6" width="20" height="28" rx="2.5" stroke="currentColor" strokeWidth="2" />
        <rect x="14" y="11" width="22" height="28" rx="2.5" stroke="currentColor" strokeWidth="2" fill="rgba(255,255,255,0.15)" />
        <circle cx="25" cy="22" r="3" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    name: { ko: '앨범', en: 'Albums', zh: '专辑', ja: 'アルバム' },
    description: {
      ko: '신보 & 사전 예약',
      en: 'New releases & pre-orders',
      zh: '新发行与预购',
      ja: '新譜 & 予約販売',
    },
    count: { ko: '500+ 종', en: '500+ items', zh: '500+ 款', ja: '500+ 種' },
    href: '#gallery',
    accent: 'from-sky-400 via-blue-400 to-indigo-500',
    icon: (
      <svg width="42" height="42" viewBox="0 0 42 42" fill="none" className="text-white">
        <circle cx="21" cy="21" r="14" stroke="currentColor" strokeWidth="2" />
        <circle cx="21" cy="21" r="6" stroke="currentColor" strokeWidth="2" />
        <circle cx="21" cy="21" r="1.6" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: { ko: '응원봉', en: 'Lightsticks', zh: '应援棒', ja: 'ペンライト' },
    description: {
      ko: '공식 라이선스 굿즈',
      en: 'Officially licensed merch',
      zh: '官方授权周边',
      ja: '公式ライセンスグッズ',
    },
    count: { ko: '50+ 종', en: '50+ items', zh: '50+ 款', ja: '50+ 種' },
    href: '#gallery',
    accent: 'from-violet-400 via-purple-400 to-pink-500',
    icon: (
      <svg width="42" height="42" viewBox="0 0 42 42" fill="none" className="text-white">
        <circle cx="21" cy="13" r="7" stroke="currentColor" strokeWidth="2" fill="rgba(255,255,255,0.15)" />
        <path d="M16 13c0-3 2.2-5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <rect x="19" y="20" width="4" height="14" rx="1.6" stroke="currentColor" strokeWidth="2" />
        <rect x="16" y="33" width="10" height="3" rx="1" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
]

export default function Categories() {
  const { t } = useLang()
  return (
    <section id="categories" className="relative py-16 md:py-20 bg-white/60 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <p className="text-xs text-sky-600 uppercase tracking-[0.25em] mb-3 font-medium">
            Shop by Category
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            {t({
              ko: '카테고리별로 둘러보기',
              en: 'Browse by Category',
              zh: '按分类浏览',
              ja: 'カテゴリーで探す',
            })}
          </h2>
          <p className="text-slate-600 max-w-md mx-auto">
            {t({
              ko: '나의 최애를 응원할 모든 것, 한 곳에서',
              en: 'Everything for your bias, all in one place',
              zh: '为爱豆应援的一切，尽在一处',
              ja: '推しを応援するすべてを、ひとつの場所で',
            })}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {categories.map((c, i) => (
            <a
              key={i}
              href={c.href}
              className={`group relative overflow-hidden rounded-2xl aspect-[4/5] block bg-gradient-to-br ${c.accent} shadow-[0_18px_38px_rgba(116,180,255,0.18)] transition-transform duration-500 hover:-translate-y-1`}
            >
              <div className="absolute -top-10 -right-10 h-44 w-44 rounded-full bg-white/30 blur-3xl" />
              <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-white/15 blur-3xl" />

              <div className="absolute top-7 left-7 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30">
                {c.icon}
              </div>

              <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                <p className="text-xs uppercase tracking-[0.2em] mb-2 text-white/80">
                  {t(c.count)}
                </p>
                <h3 className="font-serif text-3xl font-bold mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
                  {t(c.name)}
                </h3>
                <p className="text-sm text-white/90 mb-4">{t(c.description)}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold border-b border-white/60 pb-0.5 transition-colors group-hover:border-white">
                  {t({ ko: '자세히 보기', en: 'Explore', zh: '查看详情', ja: '詳しく見る' })}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
