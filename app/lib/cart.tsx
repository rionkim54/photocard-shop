'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

export interface CartItem {
  seller_photocard_id: number
  photocard_id?: number
  title: string
  image_url: string
  price: number | null
  group_name?: string
  singer_name?: string
  quantity: number
}

interface CartContextValue {
  items: CartItem[]
  count: number
  total: number
  ready: boolean
  add: (item: Omit<CartItem, 'quantity'>) => void
  remove: (seller_photocard_id: number) => void
  setQuantity: (seller_photocard_id: number, qty: number) => void
  clear: () => void
  has: (seller_photocard_id: number) => boolean
}

const CartContext = createContext<CartContextValue | null>(null)
const STORAGE_KEY = 'kstorm_cart_v1'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
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
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {}
  }, [items, ready])

  const add = (item: Omit<CartItem, 'quantity'>) =>
    setItems(prev => {
      const existing = prev.find(
        i => i.seller_photocard_id === item.seller_photocard_id,
      )
      if (existing) {
        return prev.map(i =>
          i.seller_photocard_id === item.seller_photocard_id
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })

  const remove = (id: number) =>
    setItems(prev => prev.filter(i => i.seller_photocard_id !== id))

  const setQuantity = (id: number, qty: number) => {
    if (qty <= 0) {
      remove(id)
      return
    }
    setItems(prev =>
      prev.map(i =>
        i.seller_photocard_id === id ? { ...i, quantity: qty } : i,
      ),
    )
  }

  const clear = () => setItems([])
  const has = (id: number) =>
    items.some(i => i.seller_photocard_id === id)

  const count = items.reduce((s, i) => s + i.quantity, 0)
  const total = items.reduce((s, i) => s + (i.price || 0) * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, count, total, ready, add, remove, setQuantity, clear, has }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
