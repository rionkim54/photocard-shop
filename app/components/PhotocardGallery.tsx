'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useCart } from '../lib/cart'

import { imgSrc } from '../lib/imgSrc'
import { useCollection } from '../lib/collection'

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

interface Photocard {
  seller_photocard_id: number
  photocard_id?: number
  title?: string
  photocard_title?: string
  image_url?: string | null
  photocard_image_url?: string | null
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

type SortBy = '' | 'newest' | 'oldest'

function cardImgUrl(card: { image_url?: string | null; photocard_image_url?: string | null }): string {
  return card.photocard_image_url ?? card.image_url ?? ''
}

function getUploadTime(imageUrl: string | null | undefined): number {
  if (!imageUrl) return 0
  const m = imageUrl.match(/image-(\d{10,})/)
  return m ? parseInt(m[1]) : 0
}

function priceLabel(price: number | undefined) {
  if (!price) return null
  return <span className="text-[13px] text-gray-800">₩{price.toLocaleString()}</span>
}

function PaginationControls({ page, totalPages, onPageChange }: {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  if (totalPages <= 1) return null

  return (
    <div className="flex justify-center items-center gap-1 mt-10">
      <button onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page === 1}
        className="px-3 py-1.5 rounded border border-gray-300 text-gray-700 text-sm hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed">
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
          ? <span key={`e${i}`} className="px-2 text-gray-400">…</span>
          : <button key={p} onClick={() => onPageChange(p as number)}
              className={`px-3 py-1.5 rounded border text-sm min-w-[36px] transition-colors ${page === p ? 'border-black bg-black text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}>
              {p}
            </button>
        )
      }
      <button onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page === totalPages}
        className="px-3 py-1.5 rounded border border-gray-300 text-gray-700 text-sm hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed">
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
  const [justAdded, setJustAdded] = useState(false)
  const { add, has } = useCart()
  const { toggle: toggleCollection, has: inCollection } = useCollection()
  const collected = inCollection(card.seller_photocard_id)
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
      image_url: cardImgUrl(card),
      price: price ?? null,
      group_name: group,
      singer_name: singer,
    })
    setJustAdded(true)
    window.setTimeout(() => setJustAdded(false), 1600)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 sm:p-8" onClick={onClose}>
      <button onClick={onClose}
        aria-label="닫기"
        className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white text-xl hover:bg-white/20 transition-colors z-20">
        ✕
      </button>

      <button
        onClick={e => { e.stopPropagation(); onPrev() }}
        aria-label="이전"
        className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-20"
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M14 5l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button
        onClick={e => { e.stopPropagation(); onNext() }}
        aria-label="다음"
        className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-20"
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M8 5l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[92vh] grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl overflow-y-auto bg-white shadow-2xl animate-fade-up"
      >
        {/* Image */}
        <div className="relative bg-gray-100 aspect-[3/4] max-h-[42vh] md:max-h-[92vh] md:aspect-auto">
          <img
            src={imgSrc(cardImgUrl(card))}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-black/50 px-3 py-1 text-[11px] font-medium text-white">
            {current + 1} / {total}
          </span>
        </div>

        {/* Info */}
        <div className="flex flex-col p-6 sm:p-8 overflow-y-auto">
          <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-2">Photocard Detail</p>
          <h3 className="text-2xl font-bold text-black leading-snug mb-4">{title}</h3>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {group && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                {group}
              </span>
            )}
            {singer && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                {singer}
              </span>
            )}
          </div>

          {/* Price */}
          <div className="rounded-xl bg-gray-50 border border-gray-200 p-5 mb-6">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">판매가</p>
            {price ? (
              <span className="text-3xl font-bold text-black">₩{price.toLocaleString()}</span>
            ) : (
              <span className="text-gray-500 text-sm">가격 정보 없음</span>
            )}
          </div>

          {/* Meta + QR */}
          <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] gap-5 mb-6">
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-gray-100 pb-3">
                <dt className="text-gray-500">포토카드 ID</dt>
                <dd className="text-black font-medium">#{card.photocard_id ?? card.seller_photocard_id}</dd>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-3">
                <dt className="text-gray-500">카테고리</dt>
                <dd className="text-black font-medium">포토카드</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">배송</dt>
                <dd className="text-black font-medium">5만원 이상 무료</dd>
              </div>
            </dl>

            <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-gray-50 p-3 sm:p-4 sm:w-[140px]">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=0&data=${encodeURIComponent(`https://zerowin.tplinkdns.com/photocard.html?id=${card.photocard_id ?? card.seller_photocard_id}`)}`}
                alt={`QR 코드 - 포토카드 ${card.photocard_id ?? card.seller_photocard_id}`}
                width={110}
                height={110}
                className="rounded-md bg-white p-1"
                loading="lazy"
              />
              <p className="mt-2 text-[10px] font-mono tracking-wider text-gray-500">
                ID {card.photocard_id ?? card.seller_photocard_id}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-auto flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() => toggleCollection({
                seller_photocard_id: card.seller_photocard_id,
                photocard_id: card.photocard_id,
                title,
                image_url: cardImgUrl(card),
                group_name: card.group_name,
                singer_name: card.singer_name,
                price: card.price ?? card.photocard_price,
              })}
              className={`flex-1 inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition-colors ${
                collected
                  ? 'border-black bg-black text-white'
                  : 'border-gray-300 bg-white text-gray-800 hover:border-gray-700'
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill={collected ? 'currentColor' : 'none'}>
                <path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
              </svg>
              {collected ? '수집 완료' : '수집하기'}
            </button>
            <button
              onClick={handleAddToCart}
              className={`flex-1 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all ${
                justAdded
                  ? 'bg-gray-700 text-white'
                  : 'bg-black text-white hover:bg-gray-800'
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

function lsGet(key: string): string | null {
  return typeof window !== 'undefined' ? localStorage.getItem(key) : null
}
function lsSet(key: string, value: string) {
  if (typeof window !== 'undefined') localStorage.setItem(key, value)
}

// ── Main ───────────────────────────────────────────────────────────
export default function PhotocardGallery() {
  const [groups, setGroups] = useState<Group[]>([])
  const [singers, setSingers] = useState<Singer[]>([])
  const [photocards, setPhotocards] = useState<Photocard[]>([])
  const [shuffledPhotocards, setShuffledPhotocards] = useState<Photocard[]>([])
  const [isShuffled, setIsShuffled] = useState(false)
  const [sortBy, setSortBy] = useState<SortBy>('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [dateGroupName, setDateGroupName] = useState('')
  const [allDatePhotocards, setAllDatePhotocards] = useState<Photocard[]>([]) // 날짜 필터 원본
  const [dateGroups, setDateGroups] = useState<string[]>([])                  // 날짜 결과에 있는 그룹 목록
  const [sortedPhotocards, setSortedPhotocards] = useState<Photocard[]>([])
  const [isSorted, setIsSorted] = useState(false)
  const [sortPage, setSortPage] = useState(1)
  const [loading, setLoading] = useState(false)
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
    fetch(`${BASE_PATH}/api/groups`).then(r => r.json()).then(data => {
      const raw = data?.data ?? data
      setGroups(Array.isArray(raw) ? raw : [])
    }).catch(() => {})
  }, [])

  useEffect(() => {
    const storedSize = Number(lsGet('pc_page_size'))
    if (PAGE_SIZE_OPTIONS.includes(storedSize as (typeof PAGE_SIZE_OPTIONS)[number])) {
      setPageSize(storedSize)
    }
    shouldRestoreShuffle.current = lsGet('pc_shuffle') === '1'
  }, [])

  useEffect(() => {
    if (!selectedGroupId) { setSingers([]); setSelectedSinger(''); return }
    fetch(`${BASE_PATH}/api/singers?group_id=${selectedGroupId}`).then(r => r.json()).then(data => {
      const raw = data?.data ?? data
      setSingers(Array.isArray(raw) ? raw : [])
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
      const res = await fetch(`${BASE_PATH}/api/photocards?${params.toString()}`)
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

  const handlePageChange = (p: number) => { setPage(p); scrollToGalleryTop() }
  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    lsSet('pc_page_size', String(size))
    setPage(1)
    scrollToGalleryTop()
  }

  useEffect(() => { setPage(1); fetchPhotocards(1) }, [selectedGroupId, selectedSinger])

  useEffect(() => {
    if (selectedGroupId) return
    setIsShuffled(false); setShuffledPhotocards([]); lsSet('pc_shuffle', '0')
    setIsSorted(false); setSortedPhotocards([]); setSortBy('')
    setDateFrom(''); setDateTo(''); setDateGroupName(''); setAllDatePhotocards([]); setDateGroups([])
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

  const sortTotalPages = isSorted ? Math.max(1, Math.ceil(sortedPhotocards.length / pageSize)) : 1
  const sortedPage = isSorted
    ? sortedPhotocards.slice((sortPage - 1) * pageSize, sortPage * pageSize)
    : []

  const displayed = isSorted ? sortedPage : isShuffled ? shuffledPhotocards : photocards

  // 날짜 결과 중 그룹·정렬 적용 (클라이언트)
  const deriveSorted = (all: Photocard[], gname: string, sort: SortBy) => {
    let arr = gname ? all.filter(c => c.group_name === gname) : [...all]
    if (sort === 'newest') arr.sort((a, b) => getUploadTime(cardImgUrl(b)) - getUploadTime(cardImgUrl(a)))
    else if (sort === 'oldest') arr.sort((a, b) => getUploadTime(cardImgUrl(a)) - getUploadTime(cardImgUrl(b)))
    return arr
  }

  // 날짜 변경 시 전체 데이터 fetch → 그룹 목록 추출
  const fetchForDate = async (from: string, to: string) => {
    if (!from && !to) {
      setIsSorted(false); setAllDatePhotocards([]); setDateGroups([])
      setDateGroupName(''); setSortedPhotocards([]); setSortPage(1)
      return
    }
    setIsShuffled(false); setShuffledPhotocards([])
    setLoading(true)
    try {
      const res = await fetch(`${BASE_PATH}/api/photocards?page=1&limit=1000`)
      const data = await res.json()
      let arr: Photocard[] = data.data ?? []

      const fromMs = from ? new Date(from).getTime() : 0
      const toMs   = to
        ? new Date(to).getTime() + 86400000 - 1
        : from ? new Date(from).getTime() + 86400000 - 1 : Infinity
      arr = arr.filter(c => { const t = getUploadTime(cardImgUrl(c)); return t >= fromMs && t <= toMs })

      setAllDatePhotocards(arr)

      // 해당 날짜 결과에서 그룹 목록 추출 (중복 제거·가나다 정렬)
      const gs = [...new Set(arr.map(c => c.group_name).filter(Boolean) as string[])].sort((a, b) => a.localeCompare(b, 'ko'))
      setDateGroups(gs)

      // 그룹 선택 초기화 후 전체 표시
      setDateGroupName('')
      setSortedPhotocards(deriveSorted(arr, '', sortBy))
      setIsSorted(true); setSortPage(1)
    } finally { setLoading(false) }
  }

  const applySort = (sort: SortBy) => {
    setSortBy(sort)
    if (allDatePhotocards.length > 0) {
      // 날짜 필터 활성 중 → 클라이언트 재정렬만
      setSortedPhotocards(deriveSorted(allDatePhotocards, dateGroupName, sort))
      setSortPage(1)
    } else if (sort) {
      // 날짜 없이 정렬만
      setIsShuffled(false); setShuffledPhotocards([])
      setLoading(true)
      fetch(`${BASE_PATH}/api/photocards?page=1&limit=1000`)
        .then(r => r.json())
        .then(data => {
          const arr = deriveSorted(data.data ?? [], '', sort)
          setSortedPhotocards(arr); setIsSorted(true); setSortPage(1)
        })
        .finally(() => setLoading(false))
    } else {
      setIsSorted(false); setSortedPhotocards([]); setSortPage(1)
    }
  }

  const handleDateGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const gname = e.target.value
    setDateGroupName(gname)
    setSortedPhotocards(deriveSorted(allDatePhotocards, gname, sortBy))
    setSortPage(1)
  }

  const resetDateFilter = () => {
    setDateFrom(''); setDateTo('')
    setAllDatePhotocards([]); setDateGroups([]); setDateGroupName('')
    setIsSorted(false); setSortedPhotocards([]); setSortPage(1)
  }

  const toggleShuffle = async () => {
    if (isShuffled) { setIsShuffled(false); setShuffledPhotocards([]); lsSet('pc_shuffle', '0'); return }
    setIsSorted(false); setSortedPhotocards([]); setSortBy('')
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: '1', limit: '1000' })
      if (selectedSinger)         { params.set('search', selectedSinger);    params.set('searchType', 'singer') }
      else if (selectedGroupName) { params.set('search', selectedGroupName); params.set('searchType', 'group') }
      const res = await fetch(`${BASE_PATH}/api/photocards?${params.toString()}`)
      const data = await res.json()
      const arr: Photocard[] = data.data ?? []
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
      }
      setShuffledPhotocards(arr); setIsShuffled(true); lsSet('pc_shuffle', '1')
    } finally { setLoading(false) }
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
    <section id="gallery" className="bg-[#f5f5f5] min-h-[80vh]">

      {/* Filter bar */}
      <div className="bg-white border-b border-gray-200 px-5 py-3 sticky top-14 z-20">
        <div className="max-w-5xl mx-auto space-y-2">

          {/* 1행: 그룹/멤버/제목 검색 */}
          <form onSubmit={e => { e.preventDefault(); setPage(1); fetchPhotocards(1) }}
            className="flex flex-wrap gap-2 items-center">
            <select value={selectedGroupId} onChange={handleGroupChange}
              className="flex-1 min-w-[130px] rounded border border-gray-300 bg-white px-3 py-2 text-[13px] text-gray-800 focus:outline-none focus:border-gray-600">
              <option value="">전체 그룹</option>
              {groups.map((g, i) => {
                const gid = g.group_id ?? g.id ?? i
                const gname = g.group_name ?? g.name ?? String(gid)
                return <option key={gid} value={String(gid)}>{gname}</option>
              })}
            </select>

            {selectedGroupId && (
              <select value={selectedSinger} onChange={e => setSelectedSinger(e.target.value)}
                className="flex-1 min-w-[130px] rounded border border-gray-300 bg-white px-3 py-2 text-[13px] text-gray-800 focus:outline-none focus:border-gray-600">
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
              className="flex-1 min-w-[140px] rounded border border-gray-300 bg-white px-3 py-2 text-[13px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-gray-600" />

            <button type="submit"
              className="rounded bg-black px-5 py-2 text-[13px] font-medium text-white hover:bg-gray-800 transition-colors">
              검색
            </button>
          </form>

          {/* 2행: 날짜 범위 + 정렬 */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[12px] text-gray-400 shrink-0">등록일</span>

            <input
              type="date"
              value={dateFrom}
              onChange={e => { setDateFrom(e.target.value); fetchForDate(e.target.value, dateTo) }}
              className="rounded border border-gray-300 bg-white px-2.5 py-1.5 text-[13px] text-gray-800 focus:outline-none focus:border-gray-600"
            />

            <span className="text-[12px] text-gray-400">~</span>

            <input
              type="date"
              value={dateTo}
              onChange={e => { setDateTo(e.target.value); fetchForDate(dateFrom, e.target.value) }}
              className="rounded border border-gray-300 bg-white px-2.5 py-1.5 text-[13px] text-gray-800 focus:outline-none focus:border-gray-600"
            />

            {/* 날짜 결과 기반 그룹 드롭다운 — 날짜 선택 후에만 표시 */}
            {dateGroups.length > 0 && (
              <select
                value={dateGroupName}
                onChange={handleDateGroupChange}
                className="rounded border border-gray-300 bg-white px-2.5 py-1.5 text-[13px] text-gray-800 focus:outline-none focus:border-gray-600"
              >
                <option value="">전체</option>
                {dateGroups.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            )}

            {(dateFrom || dateTo) && (
              <button
                type="button"
                onClick={resetDateFilter}
                className="inline-flex items-center gap-1 rounded border border-gray-300 px-2.5 py-1.5 text-[12px] text-gray-600 hover:border-gray-500 hover:text-black transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                초기화
              </button>
            )}

            <div className="ml-auto">
              <select
                value={sortBy}
                onChange={e => applySort(e.target.value as SortBy)}
                className="rounded border border-gray-300 bg-white px-2.5 py-1.5 text-[13px] text-gray-800 focus:outline-none focus:border-gray-600"
                aria-label="정렬"
              >
                <option value="">기본순</option>
                <option value="newest">최신순 ↓</option>
                <option value="oldest">오래된순 ↑</option>
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* Gallery */}
      <div className="mx-auto w-full max-w-7xl px-5 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-48 text-gray-500 text-sm">불러오는 중...</div>
        ) : displayed.length === 0 ? (
          <div className="flex justify-center items-center h-48 text-gray-400 text-sm">포토카드가 없습니다</div>
        ) : (
          <>
            {/* Toolbar */}
            <div className="mb-5 flex items-center justify-between flex-wrap gap-3">
              <p className="text-[13px] text-gray-500">
                총 <span className="font-semibold text-black">{isSorted ? sortedPhotocards.length : total}</span>장
                {isSorted
                  ? <> · <span className="text-[12px] text-blue-600 font-medium">{sortBy === 'newest' ? '최신순' : '오래된순'}</span> · {sortPage}/{sortTotalPages} 페이지</>
                  : !isShuffled ? <> · {page}/{totalPages} 페이지</> : null
                }
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <label className="inline-flex items-center gap-1.5 text-[13px] text-gray-600">
                  페이지당
                  <select
                    value={pageSize}
                    onChange={e => handlePageSizeChange(Number(e.target.value))}
                    className="rounded border border-gray-300 bg-white px-2 py-1 text-[13px] text-gray-800 focus:outline-none focus:border-gray-600"
                    aria-label="페이지당 표시 개수"
                  >
                    {PAGE_SIZE_OPTIONS.map(s => (
                      <option key={s} value={s}>{s}장</option>
                    ))}
                  </select>
                </label>

                <button
                  onClick={toggleShuffle}
                  disabled={!selectedGroupId}
                  title={!selectedGroupId ? '그룹 선택 후 셔플 사용 가능' : isShuffled ? '원래 순서' : '랜덤 셔플'}
                  className={`inline-flex items-center gap-1.5 rounded border px-3 py-1.5 text-[13px] font-medium transition-colors ${
                    !selectedGroupId
                      ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                      : isShuffled
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 text-gray-700 hover:border-gray-600 hover:text-black'
                  }`}
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                    <path d="M10.5 3.5l1.5 1.5-1.5 1.5M5.5 5H4a2 2 0 00-2 2v1M10.5 12.5l1.5-1.5-1.5-1.5M5.5 11H4a2 2 0 01-2-2v-1M12 5h-2a2 2 0 00-2 2v2a2 2 0 002 2h2" />
                  </svg>
                  {isShuffled ? '셔플 중' : '셔플'}
                </button>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {displayed.map((card, index) => (
                <div
                  key={card.seller_photocard_id}
                  onClick={() => openDetail(index)}
                  className="cursor-pointer group bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                    <img
                      src={imgSrc(cardImgUrl(card))}
                      alt={getTitle(card)}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-2.5">
                    <p className="text-[12px] font-medium text-black leading-snug truncate mb-0.5">{getTitle(card)}</p>
                    {getPrice(card) && priceLabel(getPrice(card))}
                    {(card.group_name || card.singer_name) && (
                      <p className="text-[11px] text-gray-400 truncate mt-0.5">
                        {[card.group_name, card.singer_name].filter(Boolean).join(' · ')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {isSorted && sortTotalPages > 1 && (
              <PaginationControls page={sortPage} totalPages={sortTotalPages} onPageChange={p => { setSortPage(p); scrollToGalleryTop() }} />
            )}
            {!isSorted && !isShuffled && totalPages > 1 && (
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
