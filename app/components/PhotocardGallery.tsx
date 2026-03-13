'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

function imgSrc(imageUrl: string) {
  const encoded = btoa(unescape(encodeURIComponent(imageUrl)))
  return `/api/image?u=${encoded}`
}

interface Photocard {
  seller_photocard_id: number
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

type ViewMode = 'grid' | 'carousel' | 'flat' | 'collage'

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

// ── shared swipe hook ──────────────────────────────────────────────
function useSwipe(onLeft: () => void, onRight: () => void) {
  const startX = useRef<number | null>(null)

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null) return
    const dx = e.changedTouches[0].clientX - startX.current
    if (Math.abs(dx) > 50) dx > 0 ? onLeft() : onRight()
    startX.current = null
  }
  return { onTouchStart, onTouchEnd }
}

// helper: compute wrapped offset (-n/2 ~ n/2)
function wrappedOffset(cardIdx: number, centerIdx: number, n: number) {
  let off = cardIdx - centerIdx
  if (off > n / 2)  off -= n
  if (off < -n / 2) off += n
  return off
}

const TIMER_OPTIONS = [1, 2, 3, 5, 10] // seconds

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
        className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 text-sm hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed">
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
          ? <span key={`e${i}`} className="px-2 text-gray-500">…</span>
          : <button key={p} onClick={() => onPageChange(p as number)}
              className={`px-3 py-1.5 rounded-lg text-sm min-w-[36px] transition-colors ${page === p ? 'bg-pink-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
              {p}
            </button>
        )
      }
      <button onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page === totalPages}
        className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 text-sm hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed">
        ›
      </button>
    </div>
  )
}

function useAutoPlay(goRight: () => void, interval: number, playing: boolean) {
  useEffect(() => {
    if (!playing) return
    const id = setInterval(goRight, interval * 1000)
    return () => clearInterval(id)
  }, [goRight, interval, playing])
}

// ── 3D Carousel ────────────────────────────────────────────────────
// translateX strip + per-card rotateY/scale/opacity transition
function CarouselView({ photocards, getTitle, getPrice }: {
  photocards: Photocard[]
  getTitle: (c: Photocard) => string
  getPrice: (c: Photocard) => number | undefined
}) {
  const [index, setIndex] = useState(0)
  const [containerH, setContainerH] = useState(400)
  const [playing, setPlaying] = useState(false)
  const togglePlay = () => setPlaying(p => { const next = !p; lsSet('pc_playing', next ? '1' : '0'); return next })
  const [timerSec, setTimerSec] = useState(3)
  const setTimer = (s: number) => { setTimerSec(s); lsSet('pc_timer', String(s)) }
  const containerRef = useRef<HTMLDivElement>(null)
  const n = photocards.length

  useEffect(() => {
    setPlaying(lsGet('pc_playing') === '1')
    setTimerSec(Number(lsGet('pc_timer') || '3'))
  }, [])

  useEffect(() => {
    if (!containerRef.current) return
    const obs = new ResizeObserver(e => setContainerH(e[0].contentRect.height))
    obs.observe(containerRef.current)
    return () => obs.disconnect()
  }, [])

  const CARD_H = Math.round(containerH * 0.78)
  const CARD_W = Math.round(CARD_H * (3 / 4))
  const GAP = 16
  const STEP = CARD_W + GAP

  useEffect(() => { setIndex(0) }, [photocards])

  const goLeft  = useCallback(() => setIndex(i => (i - 1 + n) % n), [n])
  const goRight = useCallback(() => setIndex(i => (i + 1) % n), [n])

  useAutoPlay(goRight, timerSec, playing)

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  goLeft()
      if (e.key === 'ArrowRight') goRight()
      if (e.key === ' ') togglePlay()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [goLeft, goRight])

  const swipe = useSwipe(goLeft, goRight)

  if (n === 0) return null

  const stripX = `translateX(-${index * STEP + CARD_W / 2}px)`

  return (
    <div className="flex flex-col items-center select-none h-full w-full">
      <div ref={containerRef} className="relative w-full overflow-hidden flex-1" style={{ minHeight: 0, perspective: 900 }} {...swipe}>
        <button onClick={goLeft}
          className="absolute left-2 z-20 text-white text-4xl hover:text-pink-400 transition-colors p-2"
          style={{ top: '50%', transform: 'translateY(-50%)' }}>‹</button>

        {/* moving strip — translateX drives the slide animation */}
        <div style={{
          display: 'flex', gap: GAP, alignItems: 'center',
          position: 'absolute', top: 0, bottom: 0, left: '50%',
          transform: stripX,
          transition: 'transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)',
        }}>
          {photocards.map((card, i) => {
            const off = wrappedOffset(i, index, n)
            const absOff = Math.abs(off)
            const visible = absOff <= 2
            const rotateY = off * -35
            const scale   = absOff === 0 ? 1.1 : absOff === 1 ? 0.85 : 0.68
            const opacity = absOff === 0 ? 1 : absOff === 1 ? 0.6 : 0.3
            return (
              <div key={card.seller_photocard_id}
                onClick={() => setIndex(i)}
                style={{
                  flexShrink: 0,
                  width: CARD_W, height: CARD_H,
                  borderRadius: 14, overflow: 'hidden',
                  transform: `rotateY(${rotateY}deg) scale(${scale})`,
                  opacity: visible ? opacity : 0,
                  boxShadow: absOff === 0 ? '0 20px 60px rgba(0,0,0,0.7)' : '0 4px 20px rgba(0,0,0,0.4)',
                  cursor: absOff !== 0 ? 'pointer' : 'default',
                  transition: 'transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.4s ease',
                  zIndex: 10 - absOff,
                  pointerEvents: visible ? 'auto' : 'none',
                }}>
                <img src={imgSrc(card.image_url)} alt={getTitle(card)} className="w-full h-full object-cover" />
                {absOff === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <p className="text-white text-sm font-semibold truncate">{getTitle(card)}</p>
                    {getPrice(card) && <p className="text-pink-300 text-xs mt-0.5 flex items-center gap-1">₩{getPrice(card)!.toLocaleString()} {priceStars(getPrice(card))}</p>}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <button onClick={goRight}
          className="absolute right-2 z-20 text-white text-4xl hover:text-pink-400 transition-colors p-2"
          style={{ top: '50%', transform: 'translateY(-50%)' }}>›</button>
      </div>

      <p className="text-gray-400 text-sm mt-2">{index + 1} / {n}</p>
      {n <= 50 && (
        <div className="flex gap-1.5 mt-2 flex-wrap justify-center max-w-xs">
          {photocards.map((_, i) => (
            <button key={i} onClick={() => setIndex(i)}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${i === index ? 'bg-pink-400' : 'bg-gray-600'}`} />
          ))}
        </div>
      )}

      {/* Timer controls */}
      <div className="flex items-center gap-2 mt-3 mb-2">
        <button
          onClick={togglePlay}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${playing ? 'bg-pink-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="2" y="1" width="4" height="12" rx="1"/><rect x="8" y="1" width="4" height="12" rx="1"/></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M3 1.5l9 5.5-9 5.5V1.5z"/></svg>
          )}
          {playing ? '정지' : '자동재생'}
        </button>
        <div className="flex gap-1">
          {TIMER_OPTIONS.map(s => (
            <button key={s} onClick={() => setTimer(s)}
              className={`w-8 h-7 rounded text-xs transition-colors ${timerSec === s ? 'bg-pink-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}>
              {s}s
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Flat Carousel ──────────────────────────────────────────────────
function FlatCarouselView({ photocards, getTitle, getPrice }: {
  photocards: Photocard[]
  getTitle: (c: Photocard) => string
  getPrice: (c: Photocard) => number | undefined
}) {
  const [index, setIndex] = useState(0)
  const [containerH, setContainerH] = useState(400)
  const [playing, setPlaying] = useState(false)
  const togglePlay = () => setPlaying(p => { const next = !p; lsSet('pc_playing', next ? '1' : '0'); return next })
  const [timerSec, setTimerSec] = useState(3)
  const setTimer = (s: number) => { setTimerSec(s); lsSet('pc_timer', String(s)) }
  const containerRef = useRef<HTMLDivElement>(null)
  const n = photocards.length

  useEffect(() => {
    setPlaying(lsGet('pc_playing') === '1')
    setTimerSec(Number(lsGet('pc_timer') || '3'))
  }, [])

  useEffect(() => {
    if (!containerRef.current) return
    const obs = new ResizeObserver(e => setContainerH(e[0].contentRect.height))
    obs.observe(containerRef.current)
    return () => obs.disconnect()
  }, [])

  const CARD_H = Math.round(containerH * 0.72)
  const CARD_W = Math.round(CARD_H * (3 / 4))
  const GAP = 12
  const STEP = CARD_W + GAP

  useEffect(() => { setIndex(0) }, [photocards])

  const goLeft  = useCallback(() => setIndex(i => (i - 1 + n) % n), [n])
  const goRight = useCallback(() => setIndex(i => (i + 1) % n), [n])

  useAutoPlay(goRight, timerSec, playing)

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  goLeft()
      if (e.key === 'ArrowRight') goRight()
      if (e.key === ' ') togglePlay()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [goLeft, goRight])

  const swipe = useSwipe(goLeft, goRight)

  if (n === 0) return null

  const stripX = `translateX(-${index * STEP + CARD_W / 2}px)`

  return (
    <div className="flex flex-col items-center select-none h-full w-full">
      <div ref={containerRef} className="relative w-full overflow-hidden flex-1" style={{ minHeight: 0 }} {...swipe}>
        <button onClick={goLeft}
          className="absolute left-2 z-20 text-white text-4xl hover:text-pink-400 transition-colors p-2"
          style={{ top: '50%', transform: 'translateY(-50%)' }}>‹</button>

        {/* moving strip */}
        <div style={{
          display: 'flex', gap: GAP, alignItems: 'center',
          position: 'absolute', top: 0, bottom: 0, left: '50%',
          transform: stripX,
          transition: 'transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)',
        }}>
          {photocards.map((card, i) => {
            const off = wrappedOffset(i, index, n)
            const absOff = Math.abs(off)
            const visible = absOff <= 2
            const scale   = absOff === 0 ? 1.15 : absOff === 1 ? 0.88 : 0.70
            const opacity = absOff === 0 ? 1 : absOff === 1 ? 0.65 : 0.35
            return (
              <div key={card.seller_photocard_id}
                onClick={() => setIndex(i)}
                style={{
                  flexShrink: 0,
                  width: CARD_W, height: CARD_H,
                  borderRadius: 12, overflow: 'hidden',
                  transform: `scale(${scale})`,
                  opacity: visible ? opacity : 0,
                  boxShadow: absOff === 0 ? '0 16px 48px rgba(0,0,0,0.6)' : '0 4px 16px rgba(0,0,0,0.3)',
                  cursor: absOff !== 0 ? 'pointer' : 'default',
                  transition: 'transform 0.35s ease, opacity 0.35s ease',
                  pointerEvents: visible ? 'auto' : 'none',
                }}>
                <img src={imgSrc(card.image_url)} alt={getTitle(card)} className="w-full h-full object-cover" />
                {absOff === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <p className="text-white text-sm font-semibold truncate">{getTitle(card)}</p>
                    {getPrice(card) && <p className="text-pink-300 text-xs mt-0.5 flex items-center gap-1">₩{getPrice(card)!.toLocaleString()} {priceStars(getPrice(card))}</p>}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <button onClick={goRight}
          className="absolute right-2 z-20 text-white text-4xl hover:text-pink-400 transition-colors p-2"
          style={{ top: '50%', transform: 'translateY(-50%)' }}>›</button>
      </div>

      {n <= 50 && (
        <div className="flex gap-1.5 mt-3 flex-wrap justify-center max-w-xs">
          {photocards.map((_, i) => (
            <button key={i} onClick={() => setIndex(i)}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${i === index ? 'bg-pink-400' : 'bg-gray-600'}`} />
          ))}
        </div>
      )}

      {/* Timer controls */}
      <div className="flex items-center gap-2 mt-3 mb-2">
        <button
          onClick={togglePlay}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${playing ? 'bg-pink-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="2" y="1" width="4" height="12" rx="1"/><rect x="8" y="1" width="4" height="12" rx="1"/></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M3 1.5l9 5.5-9 5.5V1.5z"/></svg>
          )}
          {playing ? '정지' : '자동재생'}
        </button>
        <div className="flex gap-1">
          {TIMER_OPTIONS.map(s => (
            <button key={s} onClick={() => setTimer(s)}
              className={`w-8 h-7 rounded text-xs transition-colors ${timerSec === s ? 'bg-pink-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}>
              {s}s
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Collage (moodboard) ────────────────────────────────────────────
const COLLAGE_LAYOUTS: [number, number][][] = [
  [[2,2],[1,1],[1,1],[1,1],[1,1]],
  [[1,1],[1,1],[2,2],[1,1],[1,1]],
  [[1,2],[2,1],[1,1],[1,1],[1,1]],
  [[1,1],[2,1],[1,2],[1,1],[1,1]],
]

function CollageView({ photocards, getTitle, getPrice, onCardClick }: {
  photocards: Photocard[]
  getTitle: (c: Photocard) => string
  getPrice: (c: Photocard) => number | undefined
  onCardClick: (i: number) => void
}) {
  const chunks: { card: Photocard; globalIdx: number }[][] = []
  for (let i = 0; i < photocards.length; i += 5)
    chunks.push(photocards.slice(i, i + 5).map((card, j) => ({ card, globalIdx: i + j })))

  return (
    <div className="flex flex-col gap-3">
      {chunks.map((chunk, ci) => {
        const layout = COLLAGE_LAYOUTS[ci % COLLAGE_LAYOUTS.length]
        return (
          <div key={ci} className="grid gap-2"
            style={{ gridTemplateColumns: 'repeat(3, 1fr)', gridAutoRows: '120px' }}>
            {chunk.map(({ card, globalIdx }, j) => {
              const [cs, rs] = layout[j] ?? [1, 1]
              return (
                <div key={card.seller_photocard_id}
                  onClick={() => onCardClick(globalIdx)}
                  className="relative rounded-xl overflow-hidden cursor-pointer group bg-gray-800"
                  style={{ gridColumn: `span ${cs}`, gridRow: `span ${rs}` }}>
                  <img src={imgSrc(card.image_url)} alt={getTitle(card)}
                    className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <p className="text-white text-xs font-medium truncate">{getTitle(card)}</p>
                      {getPrice(card) && <p className="text-pink-300 text-xs flex items-center gap-1">₩{getPrice(card)!.toLocaleString()} {priceStars(getPrice(card))}</p>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

const PAGE_SIZE = 20

// ── Main ───────────────────────────────────────────────────────────
export default function PhotocardGallery() {
  const [groups, setGroups] = useState<Group[]>([])
  const [singers, setSingers] = useState<Singer[]>([])
  const [photocards, setPhotocards] = useState<Photocard[]>([])
  const [shuffledPhotocards, setShuffledPhotocards] = useState<Photocard[]>([])
  const [isShuffled, setIsShuffled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const setView = (m: ViewMode) => { setViewMode(m); lsSet('pc_view', m) }
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
  const [total, setTotal] = useState(0)
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const [sliderOpen, setSliderOpen] = useState(false)
  const [sliderIndex, setSliderIndex] = useState(0)

  useEffect(() => {
    fetch('/api/groups').then(r => r.json()).then(data => {
      const list = data.data ?? data
      console.log('groups sample:', list[0])
      setGroups(list)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    const storedView = lsGet('pc_view') as ViewMode | null
    const storedColor = lsGet('pc_sky_color')
    if (storedView) setViewMode(storedView)
    if (storedColor && /^#[0-9a-fA-F]{6}$/.test(storedColor)) setSkyColor(storedColor)
    shouldRestoreShuffle.current = lsGet('pc_shuffle') === '1'
  }, [])

  useEffect(() => {
    if (!selectedGroupId) { setSingers([]); setSelectedSinger(''); return }
    fetch(`/api/singers?group_id=${selectedGroupId}`).then(r => r.json()).then(data => {
      const list = data.data ?? data
      console.log('singers sample:', list[0])
      setSingers(list)
    }).catch(() => {})
    setSelectedSinger('')
  }, [selectedGroupId])

  const fetchPhotocards = useCallback(async (p: number) => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(p), limit: String(PAGE_SIZE) })
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
  }, [titleSearch, selectedGroupName, selectedSinger])

  // reset page and fetch on filter change
  useEffect(() => { setPage(1); fetchPhotocards(1) }, [selectedGroupId, selectedSinger])

  useEffect(() => {
    if (selectedGroupId) return
    setIsShuffled(false)
    setShuffledPhotocards([])
    lsSet('pc_shuffle', '0')
  }, [selectedGroupId])

  // auto-shuffle on initial load if preference was stored
  const initShuffleDone = useRef(false)
  useEffect(() => {
    if (initShuffleDone.current || total === 0 || !shouldRestoreShuffle.current) return
    initShuffleDone.current = true
    toggleShuffle()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total])

  // fetch when page changes (but not on initial mount — handled above)
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return }
    fetchPhotocards(page)
  }, [page])

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

  const openSlider  = (i: number) => { setSliderIndex(i); setSliderOpen(true) }
  const closeSlider = () => setSliderOpen(false)
  const prevSlide   = () => setSliderIndex(i => (i - 1 + displayed.length) % displayed.length)
  const nextSlide   = () => setSliderIndex(i => (i + 1) % displayed.length)

  useEffect(() => {
    if (!sliderOpen) return
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  prevSlide()
      if (e.key === 'ArrowRight') nextSlide()
      if (e.key === 'Escape')     closeSlider()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [sliderOpen])

  const getTitle = (card: Photocard) => card.title || card.photocard_title || ''
  const getPrice = (card: Photocard) => card.price ?? card.photocard_price

  const viewButtons: { mode: ViewMode; title: string; icon: React.ReactNode }[] = [
    {
      mode: 'grid', title: '그리드',
      icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
        <rect x="1" y="1" width="7" height="7" rx="1"/><rect x="10" y="1" width="7" height="7" rx="1"/>
        <rect x="1" y="10" width="7" height="7" rx="1"/><rect x="10" y="10" width="7" height="7" rx="1"/>
      </svg>
    },
    {
      mode: 'carousel', title: '3D 캐러셀',
      icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
        <rect x="5" y="2" width="8" height="14" rx="1.5"/>
        <rect x="1" y="4" width="3" height="10" rx="1" opacity="0.5"/>
        <rect x="14" y="4" width="3" height="10" rx="1" opacity="0.5"/>
      </svg>
    },
    {
      mode: 'flat', title: '플랫 캐러셀',
      icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
        <rect x="6" y="3" width="6" height="12" rx="1.5"/>
        <rect x="1" y="5" width="4" height="8" rx="1" opacity="0.5"/>
        <rect x="13" y="5" width="4" height="8" rx="1" opacity="0.5"/>
      </svg>
    },
    {
      mode: 'collage', title: '콜라주',
      icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
        <rect x="1" y="1" width="9" height="9" rx="1"/>
        <rect x="11" y="1" width="6" height="4" rx="1"/>
        <rect x="11" y="6" width="6" height="4" rx="1"/>
        <rect x="1" y="11" width="4" height="6" rx="1"/>
        <rect x="6" y="11" width="11" height="6" rx="1"/>
      </svg>
    },
  ]

  return (
    <div style={buildSkyStyle(skyColor)} className={`sky-stage text-slate-950 w-full ${viewMode === 'carousel' || viewMode === 'flat' ? 'h-dvh flex flex-col overflow-hidden' : 'min-h-dvh'}`}>
      <div className="sky-backdrop" aria-hidden="true">
        <div className="sky-glow" />
        <div className="sky-cloud sky-cloud-a" />
        <div className="sky-cloud sky-cloud-b" />
        <div className="sky-cloud sky-cloud-c" />
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-sky-200/60 bg-white/30 px-4 py-4 backdrop-blur-md flex-shrink-0 shadow-[0_10px_30px_rgba(116,180,255,0.18)]">
        <h1 className="text-2xl font-bold text-center mb-4 text-sky-950 drop-shadow-[0_1px_0_rgba(255,255,255,0.45)]">K-POP Photocard Shop</h1>

        <form onSubmit={e => { e.preventDefault(); setPage(1); fetchPhotocards(1) }}
          className="max-w-3xl mx-auto flex flex-wrap gap-2">
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
      <div className={viewMode === 'carousel' || viewMode === 'flat'
        ? 'relative z-10 flex w-full min-h-0 flex-1 flex-col overflow-hidden' : 'relative z-10 mx-auto w-full max-w-6xl px-4 py-6'}>
        {loading ? (
          <div className="flex justify-center items-center h-48 text-gray-400">불러오는 중...</div>
        ) : displayed.length === 0 ? (
          <div className="flex justify-center items-center h-48 text-gray-500">포토카드가 없습니다</div>
        ) : (
          <>
            {/* Toolbar */}
            <div className={`flex items-center justify-between ${viewMode === 'carousel' || viewMode === 'flat' ? 'border-b border-sky-200/60 bg-white/25 px-4 py-3 backdrop-blur-md' : 'mb-4 rounded-2xl border border-white/50 bg-white/35 px-4 py-3 backdrop-blur-md shadow-[0_14px_34px_rgba(97,167,255,0.16)]'}`}>
              <p className="text-sm text-slate-700">
                총 {total}장 · {page}/{totalPages} 페이지
              </p>
              <div className="flex items-center gap-2">
              <button onClick={toggleShuffle} disabled={!selectedGroupId} title={!selectedGroupId ? '전체 그룹에서는 셔플을 사용할 수 없음' : isShuffled ? '원래 순서' : '랜덤 셔플'}
                className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm transition-colors ${!selectedGroupId ? 'cursor-not-allowed bg-white/40 text-slate-400 opacity-40' : isShuffled ? 'bg-sky-600 text-white shadow-[0_10px_24px_rgba(37,99,235,0.24)]' : 'bg-white/70 text-slate-700 hover:bg-white hover:text-slate-950'}`}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M10.5 3.5l1.5 1.5-1.5 1.5M5.5 3.5H4a2 2 0 00-2 2v1M10.5 12.5l1.5-1.5-1.5-1.5M5.5 12.5H4a2 2 0 01-2-2v-1M13 5l-1.5 1.5L13 8M13 8l-1.5 1.5L13 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
                  <path d="M12 5h-2a2 2 0 00-2 2v2a2 2 0 00 2 2h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
                </svg>
                {isShuffled ? '셔플 중' : '셔플'}
              </button>
              <div className="flex gap-1 rounded-lg bg-white/65 p-1 shadow-sm">
                {viewButtons.map(({ mode, title, icon }) => (
                  <button key={mode} onClick={() => setView(mode)} title={title}
                    className={`rounded-md p-1.5 transition-colors ${viewMode === mode ? 'bg-sky-600 text-white' : 'text-slate-500 hover:text-slate-900'}`}>
                    {icon}
                  </button>
                ))}
              </div>
              </div>
            </div>

            {!isShuffled && viewMode !== 'grid' && (
              <div className="px-4 pb-4">
                <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} />
              </div>
            )}

            {viewMode === 'grid' && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {displayed.map((card, index) => (
                    <div key={card.seller_photocard_id} onClick={() => openSlider(index)}
                      className="cursor-pointer group relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-800 hover:scale-105 transition-transform duration-200 shadow-lg">
                      <img src={imgSrc(card.image_url)} alt={getTitle(card)}
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
                  <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} />
                )}
              </>
            )}
            {viewMode === 'carousel' && (
              <div className="flex-1 min-h-0">
                <CarouselView photocards={displayed} getTitle={getTitle} getPrice={getPrice} />
              </div>
            )}
            {viewMode === 'flat' && (
              <div className="flex-1 min-h-0">
                <FlatCarouselView photocards={displayed} getTitle={getTitle} getPrice={getPrice} />
              </div>
            )}
            {viewMode === 'collage' && (
              <CollageView photocards={displayed} getTitle={getTitle} getPrice={getPrice} onCardClick={openSlider} />
            )}
          </>
        )}
      </div>

      {/* Slider Modal */}
      {sliderOpen && displayed.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={closeSlider}>
          <button onClick={closeSlider}
            className="absolute top-4 right-4 text-white text-3xl hover:text-pink-400 z-10">✕</button>

          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-gray-400 text-sm">
            {sliderIndex + 1} / {displayed.length}
          </div>

          <button onClick={e => { e.stopPropagation(); prevSlide() }}
            className="absolute left-4 text-white text-5xl hover:text-pink-400 p-2 z-10">‹</button>

          <div className="relative h-[80vh] aspect-[3/4] rounded-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}>
            <img src={imgSrc(displayed[sliderIndex].image_url)} alt={getTitle(displayed[sliderIndex])}
              className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <p className="text-white font-semibold">{getTitle(displayed[sliderIndex])}</p>
              {getPrice(displayed[sliderIndex]) && (
                <p className="text-pink-300 text-sm mt-1 flex items-center gap-1">₩{getPrice(displayed[sliderIndex])!.toLocaleString()} {priceStars(getPrice(displayed[sliderIndex]))}</p>
              )}
            </div>
          </div>

          <button onClick={e => { e.stopPropagation(); nextSlide() }}
            className="absolute right-4 text-white text-5xl hover:text-pink-400 p-2 z-10">›</button>

          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1 px-4 overflow-x-auto">
            {displayed.map((card, i) => (
              <div key={card.seller_photocard_id}
                onClick={e => { e.stopPropagation(); setSliderIndex(i) }}
                className={`relative flex-shrink-0 w-12 h-16 rounded overflow-hidden cursor-pointer transition-opacity ${
                  i === sliderIndex ? 'ring-2 ring-pink-400 opacity-100' : 'opacity-40 hover:opacity-70'
                }`}>
                <img src={imgSrc(card.image_url)} alt={getTitle(card)}
                  className="absolute inset-0 w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
