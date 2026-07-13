'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export interface CollectionItem {
  seller_photocard_id: number
  photocard_id?: number
  title: string
  image_url: string
  group_name?: string
  singer_name?: string
  price?: number
}

interface CollectionContextValue {
  items: CollectionItem[]
  ready: boolean
  toggle: (item: CollectionItem) => void
  has: (seller_photocard_id: number) => boolean
}

const CollectionContext = createContext<CollectionContextValue | null>(null)
const STORAGE_KEY = 'kstorm_collection_v1'

export function CollectionProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CollectionItem[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) setItems(parsed)
      }
    } catch {}
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) } catch {}
  }, [items, ready])

  const toggle = (item: CollectionItem) => {
    setItems(prev =>
      prev.some(i => i.seller_photocard_id === item.seller_photocard_id)
        ? prev.filter(i => i.seller_photocard_id !== item.seller_photocard_id)
        : [...prev, item]
    )
  }

  const has = (id: number) => items.some(i => i.seller_photocard_id === id)

  return (
    <CollectionContext.Provider value={{ items, ready, toggle, has }}>
      {children}
    </CollectionContext.Provider>
  )
}

export function useCollection() {
  const ctx = useContext(CollectionContext)
  if (!ctx) throw new Error('useCollection must be used within CollectionProvider')
  return ctx
}
