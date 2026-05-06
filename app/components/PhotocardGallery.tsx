'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useCart } from '../lib/cart'

function imgSrc(imageUrl: string) {
  const encoded = btoa(unescape(encodeURIComponent(imageUrl)))
  return `/api/image?u=${encodeURIComponent(encoded)}`
}

interface Photocard {
  seller_photocard_id: number
  photocard_id?: number
  title?: string
  photocard_title?: string
  image_url: string
  group_name?: string
  singer_name?: string
  price?: number
  photocard_price?: number
}

interface Group {
  group_id?: string | number
  id?: string | number
  group_name?: string
  name?: string
}

interface Singer {
  singer_id?: string | number
  id?: string | number
  singer_name?: string
  name?: string
}

const DEFAULT_SKY_COLOR = '#66bfff'

function hexToRgb(hex: string) {
  const normalized = hex.replace('#', '')
  const safe = normalized.length === 3
    ? normalized.split('').map(ch => ch + ch).join('')
    : normalized.padEnd(6, '0').slice(0, 6)
  const value = Number.parseInt(safe, 16)

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  }
}

function rgbToHex(r: number, g: number, b: number) {
  const toHex = (value: number) => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function mixHex(color: string, target: string, ratio: number) {
  const fromRgb = hexToRgb(color)
  const toRgb = hexToRgb(target)

  return rgbToHex(
    fromRgb.r + (toRgb.r - fromRgb.r) * ratio,
    fromRgb.g + (toRgb.g - fromRgb.g) * ratio,
    fromRgb.b + (toRgb.b - fromRgb.b) * ratio,
  )
}

function rgba(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function buildSkyStyle(color: string) {
  const base = /^#[0-9a-fA-F]{6}$/.test(color) ? color : DEFAULT_SKY_COLOR
  const mid = mixHex(base, '#d7f0ff', 0.28)
  const low = mixHex(base, '#eef9ff', 0.6)
  const bottom = mixHex(base, '#ffffff', 0.86)
  const sunBase = mixHex(base, '#fff4bf', 0.7)
  const haze = mixHex(base, '#ffffff', 0.82)

  return {
    '--sky-top': mixHex(base, '#3e86d9', 0.18),
    '--sky-mid': mid,
    '--sky-low': low,
    '--sky-bottom': bottom,
    '--sky-sun': rgba(sunBase, 0.92),
    '--sky-sun-glow': rgba(sunBase, 0.34),
    '--sky-haze': rgba(haze, 0.24),
  } as React.CSSProperties
}

function priceStars(price: number | undefined) {
  if (!price) return null
  const count = price < 10000 ? 1 : price < 30000 ? 2 : price < 60000 ? 3 : price < 100000 ? 4 : 5
  return <span className="text-yellow-400 text-xs">{'★'.repeat(count)}</span>
}

function lsGet(key: string): string | null {
  return typeof window !== 'undefined' ? localStorage.getItem(key) : null
}
function lsSet(key: string, value: string) {
  if (typeof window !== 'undefined') localStorage.setItem(key, value)
}

function PaginationControls({ page, totalPages, onPageChange }: {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  if (totalPages <= 1) return null

  return (
    <div className="flex justify-center items-center gap-1 mt-8">
      <button onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page === 1}
        className="px-3 py-1.5 rounded-lg bg-white/70 text-slate-700 text-sm hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed">
        ‹
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
        .reduce<(number | '...')[]>((acc, p, idx, arr) => {
          if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push('...')
          acc.push(p)
          return acc
        }, [])
        .map((p, i) => p === '...'
          ? <span key={`e${i}`} className="px-2 text-slate-500">…</span>
          : <button key={p} onClick={() => onPageChange(p as number)}
              className={`px-3 py-1.5 rounded-lg text-sm min-w-[36px] transition-colors ${page === p ? 'bg-sky-600 text-white' : 'bg-white/70 text-slate-700 hover:bg-white'}`}>
              {p}
            </button>
        )
      }
      <button onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page === totalPages}
        className="px-3 py-1.5 rounded-lg bg-white/70 text-slate-700 text-sm hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed">
        ›
      </button>
    </div>
  )
}

const PAGE_SIZE_OPTIONS = [20, 40, 60, 100] as const
const DEFAULT_PAGE_SIZE = 20

// ── Detail Modal ───────────────────────────────────────────────────
function CardDetailModal({ card, onClose, onPrev, onNext, current, total }: {
  card: Photocard
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  current: number
  total: number
}) {
  const [wishlisted, setWishlisted] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const { add, has } = useCart()
  const title = card.title || card.photocard_title || '제목 없음'
  const price = card.price ?? card.photocard_price
  const group = card.group_name
  const singer = card.singer_name
  const inCart = has(card.seller_photocard_id)

  const handleAddToCart = () => {
    add({
      seller_photocard_id: card.seller_photocard_id,
      photocard_id: card.photocard_id,
      title,
      image_url: card.image_url,
      price: price ?? null,
      group_name: group,
      singer_name: singer,
    })
    setJustAdded(true)
    window.setTimeout(() => setJustAdded(false), 1600)
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8" onClick={onClose}>
      <button onClick={onClose}
        aria-label="닫기"
        className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white text-2xl hover:bg-white/25 transition-colors z-20">
        ✕
      </button>

      <button
        onClick={e => { e.stopPropagation(); onPrev() }}
        aria-label="이전"
        className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors z-20"
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M14 5l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button
        onClick={e => { e.stopPropagation(); onNext() }}
        aria-label="다음"
        className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors z-20"
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M8 5l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-5xl max-h-[90vh] grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-0 rounded-2xl overflow-hidden bg-white shadow-2xl animate-fade-up"
      >
        {/* Image */}
        <div className="relative bg-slate-100 aspect-[3/4] md:aspect-auto md:max-h-[90vh]">
          <img
            src={imgSrc(card.image_url)}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <span className="absolute top-4 left-4 inline-flex items-center rounded-full bg-slate-950/65 px-3 py-1 text-[11px] font-medium text-white tracking-wider">
            {current + 1} / {total}
          </span>
        </div>

        {/* Info */}
        <div className="flex flex-col p-6 sm:p-8 overflow-y-auto">
          <p className="text-[11px] text-sky-600 font-semibold uppercase tracking-[0.25em] mb-2">
            Photocard Detail
          </p>
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-slate-900 leading-snug mb-4">
            {title}
          </h3>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {group && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-800">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="3.5" cy="4.5" r="2" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="8.5" cy="4.5" r="2" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M1 10c.5-1.5 1.5-2.2 2.5-2.2s2 .7 2.5 2.2M6 10c.5-1.5 1.5-2.2 2.5-2.2s2 .7 2.5 2.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                {group}
              </span>
            )}
            {singer && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-700">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="4" r="2" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M2 11c.7-2 2.2-3 4-3s3.3 1 4 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                {singer}
              </span>
            )}
          </div>

          {/* Price */}
          <div className="rounded-2xl bg-gradient-to-br from-sky-50 to-pink-50 border border-sky-100 p-5 mb-6">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">판매가</p>
            {price ? (
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl font-bold text-slate-900">
                  ₩{price.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">{priceStars(price)}</span>
              </div>
            ) : (
              <span className="text-slate-500 text-sm">가격 정보 없음</span>
            )}
          </div>

          {/* Meta + QR */}
          <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] gap-5 mb-6">
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-100 pb-3">
                <dt className="text-slate-500">포토카드 ID</dt>
                <dd className="text-slate-800 font-medium">#{card.photocard_id ?? card.seller_photocard_id}</dd>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-3">
                <dt className="text-slate-500">카테고리</dt>
                <dd className="text-slate-800 font-medium">포토카드</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">배송</dt>
                <dd className="text-slate-800 font-medium">5만원 이상 무료</dd>
              </div>
            </dl>

            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-4 sm:w-[148px]">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=0&data=${encodeURIComponent(`https://kpop.zerowin.kr/photocard.html?id=${card.photocard_id ?? card.seller_photocard_id}`)}`}
                alt={`QR 코드 - 포토카드 ${card.photocard_id ?? card.seller_photocard_id}`}
                width={120}
                height={120}
                className="rounded-md bg-white p-1.5"
                loading="lazy"
              />
              <p className="mt-2 text-[10px] font-mono tracking-wider text-slate-500">
                ID {card.photocard_id ?? card.seller_photocard_id}
              </p>
              <p className="mt-1 text-[10px] text-slate-500 text-center leading-tight">
                스캔하면 카드를<br />찾을 수 있어요
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-auto flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() => setWishlisted(w => !w)}
              className={`flex-1 inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition-colors ${
                wishlisted
                  ? 'border-pink-300 bg-pink-50 text-pink-600'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 18 18" fill={wishlisted ? 'currentColor' : 'none'}>
                <path d="M9 15.5s-5.5-3.4-5.5-7A3 3 0 019 6.2a3 3 0 015.5 2.3c0 3.6-5.5 7-5.5 7z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
              </svg>
              {wishlisted ? '찜 완료' : '찜하기'}
            </button>
            <button
              onClick={handleAddToCart}
              className={`flex-1 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all ${
                justAdded
                  ? 'bg-emerald-500 scale-[1.02]'
                  : 'bg-gradient-to-r from-sky-600 to-pink-500 hover:opacity-95'
              }`}
            >
              {justAdded ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                    <path d="M4 9.5l3.5 3.5L14 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  담겼습니다
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                    <path d="M3 5h2l1.4 8.2a1 1 0 001 .8h6.2a1 1 0 001-.8L16 7H6" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
                    <circle cx="7.5" cy="16" r="1" fill="currentColor" />
                    <circle cx="13" cy="16" r="1" fill="currentColor" />
                  </svg>
                  {inCart ? '한 개 더 담기' : '장바구니 담기'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────────────
export default function PhotocardGallery() {
  const [groups, setGroups] = useState<Group[]>([])
  const [singers, setSingers] = useState<Singer[]>([])
  const [photocards, setPhotocards] = useState<Photocard[]>([])
  const [shuffledPhotocards, setShuffledPhotocards] = useState<Photocard[]>([])
  const [isShuffled, setIsShuffled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [skyColor, setSkyColor] = useState(DEFAULT_SKY_COLOR)
  const setSkyColorTheme = (color: string) => {
    setSkyColor(color)
    lsSet('pc_sky_color', color)
  }
  const shouldRestoreShuffle = useRef(false)

  const [selectedGroupId, setSelectedGroupId] = useState('')
  const [selectedGroupName, setSelectedGroupName] = useState('')
  const [selectedSinger, setSelectedSinger] = useState('')
  const [titleSearch, setTitleSearch] = useState('')

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE)
  const [total, setTotal] = useState(0)
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const [detailOpen, setDetailOpen] = useState(false)
  const [detailIndex, setDetailIndex] = useState(0)

  useEffect(() => {
    fetch('/api/groups').then(r => r.json()).then(data => {
      const raw = data?.data ?? data
      const list = Array.isArray(raw) ? raw : []
      setGroups(list)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    const storedColor = lsGet('pc_sky_color')
    if (storedColor && /^#[0-9a-fA-F]{6}$/.test(storedColor)) setSkyColor(storedColor)
    const storedSize = Number(lsGet('pc_page_size'))
    if (PAGE_SIZE_OPTIONS.includes(storedSize as (typeof PAGE_SIZE_OPTIONS)[number])) {
      setPageSize(storedSize)
    }
    shouldRestoreShuffle.current = lsGet('pc_shuffle') === '1'
  }, [])

  useEffect(() => {
    if (!selectedGroupId) { setSingers([]); setSelectedSinger(''); return }
    fetch(`/api/singers?group_id=${selectedGroupId}`).then(r => r.json()).then(data => {
      const raw = data?.data ?? data
      const list = Array.isArray(raw) ? raw : []
      setSingers(list)
    }).catch(() => {})
    setSelectedSinger('')
  }, [selectedGroupId])

  const fetchPhotocards = useCallback(async (p: number) => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(p), limit: String(pageSize) })
    if (selectedSinger)         { params.set('search', selectedSinger);    params.set('searchType', 'singer') }
    else if (selectedGroupName) { params.set('search', selectedGroupName); params.set('searchType', 'group') }
    else if (titleSearch)       { params.set('search', titleSearch) }
    try {
      const res = await fetch(`/api/photocards?${params.toString()}`)
      const data = await res.json()
      setPhotocards(data.data ?? [])
      setTotal(data.total ?? 0)
      setIsShuffled(false)
      setShuffledPhotocards([])
    } finally { setLoading(false) }
  }, [titleSearch, selectedGroupName, selectedSinger, pageSize])

  const scrollToGalleryTop = () => {
    if (typeof window === 'undefined') return
    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handlePageChange = (p: number) => {
    setPage(p)
    scrollToGalleryTop()
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    lsSet('pc_page_size', String(size))
    setPage(1)
    scrollToGalleryTop()
  }

  useEffect(() => { setPage(1); fetchPhotocards(1) }, [selectedGroupId, selectedSinger])

  useEffect(() => {
    if (selectedGroupId) return
    setIsShuffled(false)
    setShuffledPhotocards([])
    lsSet('pc_shuffle', '0')
  }, [selectedGroupId])

  const initShuffleDone = useRef(false)
  useEffect(() => {
    if (initShuffleDone.current || total === 0 || !shouldRestoreShuffle.current) return
    initShuffleDone.current = true
    toggleShuffle()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total])

  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return }
    fetchPhotocards(page)
  }, [page, pageSize])

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const gid = e.target.value
    const found = groups.find(g => String(g.group_id ?? g.id) === gid)
    setSelectedGroupId(gid)
    setSelectedGroupName(found ? (found.group_name ?? found.name ?? '') : '')
  }

  const displayed = isShuffled ? shuffledPhotocards : photocards

  const toggleShuffle = async () => {
    if (isShuffled) {
      setIsShuffled(false)
      setShuffledPhotocards([])
      lsSet('pc_shuffle', '0')
      return
    }
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: '1', limit: '1000' })
      if (selectedSinger)         { params.set('search', selectedSinger);    params.set('searchType', 'singer') }
      else if (selectedGroupName) { params.set('search', selectedGroupName); params.set('searchType', 'group') }
      const res = await fetch(`/api/photocards?${params.toString()}`)
      const data = await res.json()
      const arr: Photocard[] = data.data ?? []
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
      }
      setShuffledPhotocards(arr)
      setIsShuffled(true)
      lsSet('pc_shuffle', '1')
    } finally {
      setLoading(false)
    }
  }

  const openDetail  = (i: number) => { setDetailIndex(i); setDetailOpen(true) }
  const closeDetail = () => setDetailOpen(false)
  const prevDetail  = () => setDetailIndex(i => (i - 1 + displayed.length) % displayed.length)
  const nextDetail  = () => setDetailIndex(i => (i + 1) % displayed.length)

  useEffect(() => {
    if (!detailOpen) return
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  prevDetail()
      if (e.key === 'ArrowRight') nextDetail()
      if (e.key === 'Escape')     closeDetail()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [detailOpen])

  const getTitle = (card: Photocard) => card.title || card.photocard_title || ''
  const getPrice = (card: Photocard) => card.price ?? card.photocard_price

  return (
    <section
      id="gallery"
      style={buildSkyStyle(skyColor)}
      className="sky-stage text-slate-950 w-full min-h-[80vh]"
    >
      <div className="sky-backdrop" aria-hidden="true">
        <div className="sky-glow" />
        <div className="sky-cloud sky-cloud-a" />
        <div className="sky-cloud sky-cloud-b" />
        <div className="sky-cloud sky-cloud-c" />
      </div>

      {/* Filter bar */}
      <div className="relative z-10 border-b border-sky-200/60 bg-white/35 px-4 py-5 backdrop-blur-md flex-shrink-0 shadow-[0_10px_30px_rgba(116,180,255,0.18)]">
        <form onSubmit={e => { e.preventDefault(); setPage(1); fetchPhotocards(1) }}
          className="max-w-5xl mx-auto flex flex-wrap gap-2">
          <select value={selectedGroupId} onChange={handleGroupChange}
            className="flex-1 min-w-[140px] rounded-lg border border-white/60 bg-white/75 px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:border-sky-500">
            <option value="">전체 그룹</option>
            {groups.map((g, i) => {
              const gid = g.group_id ?? g.id ?? i
              const gname = g.group_name ?? g.name ?? String(gid)
              return <option key={gid} value={String(gid)}>{gname}</option>
            })}
          </select>

          {selectedGroupId && (
            <select value={selectedSinger} onChange={e => setSelectedSinger(e.target.value)}
              className="flex-1 min-w-[140px] rounded-lg border border-white/60 bg-white/75 px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:border-sky-500">
              <option value="">전체 멤버</option>
              {singers.map((s, i) => {
                const sid = s.singer_id ?? s.id ?? i
                const sname = s.singer_name ?? s.name ?? String(sid)
                return <option key={sid} value={sname}>{sname}</option>
              })}
            </select>
          )}

          <input type="text" value={titleSearch} onChange={e => setTitleSearch(e.target.value)}
            placeholder="제목 검색..."
            className="flex-1 min-w-[160px] rounded-lg border border-white/60 bg-white/75 px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-500 focus:outline-none focus:border-sky-500" />

          <label className="flex items-center gap-2 rounded-lg border border-white/60 bg-white/75 px-3 py-2 text-sm text-slate-900 shadow-sm">
            <span>배경색</span>
            <input
              type="color"
              value={skyColor}
              onChange={e => setSkyColorTheme(e.target.value)}
              className="h-8 w-10 cursor-pointer rounded border-0 bg-transparent p-0"
              aria-label="배경색 선택"
            />
          </label>

          <button type="submit"
            className="rounded-lg bg-sky-600 px-5 py-2 text-sm font-medium text-white shadow-[0_10px_24px_rgba(37,99,235,0.28)] transition-colors hover:bg-sky-500">
            검색
          </button>
        </form>
      </div>

      {/* Gallery */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-6">
        {loading ? (
          <div className="flex justify-center items-center h-48 text-slate-600">불러오는 중...</div>
        ) : displayed.length === 0 ? (
          <div className="flex justify-center items-center h-48 text-slate-500">포토카드가 없습니다</div>
        ) : (
          <>
            {/* Toolbar */}
            <div className="mb-4 flex items-center justify-between flex-wrap gap-3 rounded-2xl border border-white/50 bg-white/35 px-4 py-3 backdrop-blur-md shadow-[0_14px_34px_rgba(97,167,255,0.16)]">
              <div className="flex items-center gap-3 flex-wrap">
                <p className="text-sm text-slate-700">
                  총 {total}장 · {page}/{totalPages} 페이지
                </p>
                <label className="inline-flex items-center gap-1.5 text-sm">
                  <span className="text-slate-500">페이지당</span>
                  <select
                    value={pageSize}
                    onChange={e => handlePageSizeChange(Number(e.target.value))}
                    className="rounded-md border border-white/60 bg-white/75 px-2 py-1 text-sm text-slate-800 shadow-sm focus:outline-none focus:border-sky-500"
                    aria-label="페이지당 표시 개수"
                  >
                    {PAGE_SIZE_OPTIONS.map(s => (
                      <option key={s} value={s}>{s}장</option>
                    ))}
                  </select>
                </label>
              </div>
              <button onClick={toggleShuffle} disabled={!selectedGroupId}
                title={!selectedGroupId ? '전체 그룹에서는 셔플을 사용할 수 없음' : isShuffled ? '원래 순서' : '랜덤 셔플'}
                className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm transition-colors ${!selectedGroupId ? 'cursor-not-allowed bg-white/40 text-slate-400 opacity-40' : isShuffled ? 'bg-sky-600 text-white shadow-[0_10px_24px_rgba(37,99,235,0.24)]' : 'bg-white/70 text-slate-700 hover:bg-white hover:text-slate-950'}`}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M10.5 3.5l1.5 1.5-1.5 1.5M5.5 3.5H4a2 2 0 00-2 2v1M10.5 12.5l1.5-1.5-1.5-1.5M5.5 12.5H4a2 2 0 01-2-2v-1M13 5l-1.5 1.5L13 8M13 8l-1.5 1.5L13 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
                  <path d="M12 5h-2a2 2 0 00-2 2v2a2 2 0 00 2 2h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
                </svg>
                {isShuffled ? '셔플 중' : '셔플'}
              </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {displayed.map((card, index) => (
                <div key={card.seller_photocard_id} onClick={() => openDetail(index)}
                  className="cursor-pointer group relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-200 hover:scale-105 transition-transform duration-200 shadow-lg">
                  <img src={imgSrc(card.image_url)} alt={getTitle(card)}
                    loading="lazy" decoding="async"
                    className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <p className="text-white text-xs font-medium truncate">{getTitle(card)}</p>
                      {getPrice(card) && <p className="text-pink-300 text-xs flex items-center gap-1">₩{getPrice(card)!.toLocaleString()} {priceStars(getPrice(card))}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {!isShuffled && totalPages > 1 && (
              <PaginationControls page={page} totalPages={totalPages} onPageChange={handlePageChange} />
            )}
          </>
        )}
      </div>

      {/* Detail Modal */}
      {detailOpen && displayed.length > 0 && displayed[detailIndex] && (
        <CardDetailModal
          card={displayed[detailIndex]}
          onClose={closeDetail}
          onPrev={prevDetail}
          onNext={nextDetail}
          current={detailIndex}
          total={displayed.length}
        />
      )}
    </section>
  )
}
