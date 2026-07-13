'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { imgSrc } from '../../lib/imgSrc'

const STORAGE_KEY = 'kstorm_set_maxident_whitea'

const MEMBERS = [
  { name: 'BANG CHAN', id: 351528, imageUrl: 'http://zerowin.tplinkdns.com/uploads/image-1762504182979.jpg' },
  { name: 'LEE KNOW', id: 358723, imageUrl: 'http://zerowin.tplinkdns.com/uploads/image-1773564482112.jpg' },
  { name: 'CHANGBIN', id: 351298, imageUrl: 'http://zerowin.tplinkdns.com/uploads/image-1762153297446.jpg' },
  { name: 'HYUNJIN', id: 351129, imageUrl: 'http://zerowin.tplinkdns.com/uploads/image-1761996716798.jpg' },
  { name: 'HAN', id: 351545, imageUrl: 'http://zerowin.tplinkdns.com/uploads/image-1762507919896.jpg' },
  { name: 'FELIX', id: 353064, imageUrl: 'http://zerowin.tplinkdns.com/uploads/image-1765282025619.jpg' },
  { name: 'SEUNGMIN', id: 352989, imageUrl: 'http://zerowin.tplinkdns.com/uploads/image-1765269115467.jpg' },
  { name: 'I.N', id: 353188, imageUrl: 'http://zerowin.tplinkdns.com/uploads/image-1765364459075.jpg' },
]

export default function MaxidentWhiteAPage() {
  const [collected, setCollected] = useState<Set<number>>(new Set())
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setCollected(new Set(JSON.parse(raw)))
    } catch {}
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...collected]))
  }, [collected, ready])

  const toggle = (id: number) => {
    setCollected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const count = collected.size
  const total = MEMBERS.length
  const percent = Math.round((count / total) * 100)

  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-3xl px-4 py-10">

        {/* 헤더 */}
        <div className="mb-8">
          <Link href="/collection" className="text-xs text-slate-400 hover:text-slate-600 mb-4 inline-flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            내 수집카드
          </Link>

          <div className="rounded-3xl bg-gradient-to-br from-slate-600 via-slate-500 to-slate-700 p-6 text-white shadow-xl overflow-hidden relative">
            <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-12 -left-8 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300 mb-1">Stray Kids</p>
              <h1 className="font-serif text-3xl md:text-4xl font-bold mb-0.5">MAXIDENT</h1>
              <p className="text-sm font-medium text-slate-300 mb-5">WHITE / A 버전</p>

              {/* 진행률 */}
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-1 h-2.5 rounded-full bg-white/25 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-white transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="text-sm font-bold tabular-nums">{count}/{total}</span>
              </div>
              <p className="text-xs text-slate-300">
                {count === 0 && '아직 수집한 카드가 없어요'}
                {count > 0 && count < total && `${total - count}장 더 수집하면 완성!`}
                {count === total && '🎉 풀셋 완성!'}
              </p>
            </div>
          </div>
        </div>

        {/* 카드 그리드 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {MEMBERS.map(({ name, id, imageUrl }) => {
            const isCollected = collected.has(id)

            return (
              <button
                key={id}
                onClick={() => toggle(id)}
                className={`group relative rounded-2xl overflow-hidden transition-all duration-300 text-left
                  ${isCollected
                    ? 'ring-2 ring-slate-400 shadow-lg shadow-slate-200'
                    : 'ring-1 ring-slate-200 hover:ring-slate-300'
                  }`}
              >
                {/* 카드 이미지 */}
                <div className="aspect-[3/4] bg-gradient-to-br from-slate-200 to-slate-300 relative">
                  <img
                    src={imgSrc(imageUrl)}
                    alt={name}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-500
                      ${isCollected ? '' : 'grayscale'}`}
                  />

                  {/* 수집 완료 오버레이 */}
                  {isCollected && (
                    <div className="absolute inset-0 bg-slate-500/10 flex items-start justify-end p-2">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-600 text-white shadow-md">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2.5 6l2.5 2.5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </div>
                  )}

                  {/* 미수집 호버 오버레이 */}
                  {!isCollected && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="rounded-full bg-black/60 px-3 py-1 text-white text-[11px] font-semibold backdrop-blur-sm">
                        탭하여 수집
                      </span>
                    </div>
                  )}
                </div>

                {/* 멤버명 */}
                <div className={`px-2 py-2 text-center transition-colors ${isCollected ? 'bg-slate-50' : 'bg-white'}`}>
                  <p className={`text-xs font-bold tracking-wider ${isCollected ? 'text-slate-600' : 'text-slate-400'}`}>
                    {name}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        {/* 초기화 버튼 */}
        {count > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setCollected(new Set())}
              className="text-xs text-slate-400 hover:text-rose-500 transition-colors"
            >
              초기화
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
