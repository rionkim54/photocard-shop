'use client'

import { useCollection } from '../lib/collection'
import { imgSrc } from '../lib/imgSrc'
import Link from 'next/link'

export default function CollectionPage() {
  const { items, ready, toggle } = useCollection()

  if (!ready) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-500">
        로딩 중...
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-b from-sky-50/40 to-white min-h-[70vh]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate-900">
              내 수집카드
            </h1>
            <p className="text-sm text-slate-500 mt-1">{items.length}장 보유</p>
          </div>
          <Link
            href="/#gallery"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            + 카드 추가하기
          </Link>
        </div>

        {/* 세트 수집 */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">세트 수집</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/collection/maxident-pinkb"
              className="flex items-center gap-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 p-4 text-white shadow-md hover:shadow-lg hover:from-pink-600 hover:to-rose-500 transition-all"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/20">
                <span className="font-serif text-lg font-bold">M</span>
              </div>
              <div>
                <p className="font-bold text-sm">MAXIDENT · PINK/B</p>
                <p className="text-xs text-pink-100">Stray Kids · 8장 세트</p>
              </div>
              <svg className="ml-auto" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link
              href="/collection/maxident-whitea"
              className="flex items-center gap-4 rounded-2xl bg-gradient-to-r from-slate-600 to-slate-500 p-4 text-white shadow-md hover:shadow-lg hover:from-slate-700 hover:to-slate-600 transition-all"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/20">
                <span className="font-serif text-lg font-bold">M</span>
              </div>
              <div>
                <p className="font-bold text-sm">MAXIDENT · WHITE/A</p>
                <p className="text-xs text-slate-300">Stray Kids · 8장 세트</p>
              </div>
              <svg className="ml-auto" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link
              href="/collection/maxident-blackc"
              className="flex items-center gap-4 rounded-2xl bg-gradient-to-r from-zinc-900 to-zinc-700 p-4 text-white shadow-md hover:shadow-lg hover:from-black hover:to-zinc-800 transition-all"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/20">
                <span className="font-serif text-lg font-bold">M</span>
              </div>
              <div>
                <p className="font-bold text-sm">MAXIDENT · BLACK/C</p>
                <p className="text-xs text-zinc-400">Stray Kids · 8장 세트</p>
              </div>
              <svg className="ml-auto" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-sky-50 text-sky-400 mb-5">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <rect x="6" y="4" width="18" height="26" rx="3" stroke="currentColor" strokeWidth="1.8" />
                <rect x="12" y="8" width="18" height="26" rx="3" stroke="currentColor" strokeWidth="1.8" />
                <path d="M16 18h8M16 22h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="font-serif text-lg font-bold text-slate-900 mb-2">아직 수집한 카드가 없어요</h3>
            <p className="text-sm text-slate-500 mb-6">포토카드 상세 화면에서 ★ 버튼을 눌러 수집하세요</p>
            <Link
              href="/#gallery"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
            >
              포토카드 보러가기
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {items.map(card => (
              <div key={card.seller_photocard_id} className="group relative">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-200 shadow-md">
                  <img
                    src={imgSrc(card.image_url)}
                    alt={card.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <p className="text-white text-xs font-medium truncate">{card.title}</p>
                      {card.group_name && (
                        <p className="text-white/70 text-[10px] truncate">{card.group_name}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => toggle(card)}
                    title="수집 해제"
                    className="absolute top-2 right-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                      <path d="M7 1l1.6 3.3 3.6.5-2.6 2.5.6 3.6L7 9.3 3.8 11l.6-3.6L2 4.8l3.6-.5z" />
                    </svg>
                  </button>
                </div>
                {card.price && (
                  <p className="mt-1.5 text-xs text-slate-600 px-0.5">
                    ₩{card.price.toLocaleString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
