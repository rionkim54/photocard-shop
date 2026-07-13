'use client'

import { useLang, type Translations } from '../lib/i18n'

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

const categories: {
  name: Translations
  description: Translations
  count: Translations
  href: string
  image: string
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
    image: `${BASE_PATH}/images/20260511_093125.png`,
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
    image: `${BASE_PATH}/images/20260511_093132.png`,
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
    image: `${BASE_PATH}/images/20260511_093142.png`,
  },
]

export default function Categories() {
  const { t } = useLang()
  return (
    <section id="categories" className="bg-white py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-5">
        {/* Section header — Samsung 스타일 */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Shop by Category</p>
            <h2 className="text-2xl md:text-3xl font-bold text-black">
              {t({
                ko: '카테고리별로 둘러보기',
                en: 'Browse by Category',
                zh: '按分类浏览',
                ja: 'カテゴリーで探す',
              })}
            </h2>
          </div>
          <a href="#gallery" className="hidden md:flex items-center gap-1 text-sm text-gray-600 hover:text-black transition-colors shrink-0 mb-1">
            {t({ ko: '전체 보기', en: 'View all', zh: '查看全部', ja: '全て見る' })}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map((c, i) => (
            <a
              key={i}
              href={c.href}
              className="group relative overflow-hidden rounded-xl aspect-[4/5] block bg-gray-100"
            >
              {/* 배경 이미지 */}
              <img
                src={c.image}
                alt={t(c.name)}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* 그라디언트 오버레이 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

              {/* 텍스트 */}
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <p className="text-xs uppercase tracking-widest mb-1.5 text-white/60">{t(c.count)}</p>
                <h3 className="text-2xl font-bold mb-1.5">{t(c.name)}</h3>
                <p className="text-sm text-white/75 mb-4">{t(c.description)}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium border-b border-white/40 pb-0.5 group-hover:border-white transition-colors">
                  {t({ ko: '자세히 보기', en: 'Explore', zh: '查看详情', ja: '詳しく見る' })}
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
