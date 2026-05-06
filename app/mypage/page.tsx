'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '../lib/cart'

type Tab = 'orders' | 'wishlist' | 'addresses' | 'settings'

const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
  {
    key: 'orders',
    label: '주문 내역',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="3" y="3.5" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M5.5 6.5h5M5.5 8.8h5M5.5 11h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'wishlist',
    label: '찜한 상품',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 13.5s-5-3-5-6.3A2.7 2.7 0 018 5.4a2.7 2.7 0 015 1.8c0 3.3-5 6.3-5 6.3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: 'addresses',
    label: '배송지',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 14s-5-4-5-8a5 5 0 0110 0c0 4-5 8-5 8z" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="8" cy="6" r="1.6" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    key: 'settings',
    label: '설정',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M8 1.5v1.6M8 12.9v1.6M14.5 8h-1.6M3.1 8H1.5M12.6 3.4l-1.1 1.1M4.5 11.5l-1.1 1.1M12.6 12.6l-1.1-1.1M4.5 4.5L3.4 3.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
]

export default function MyPage() {
  const [tab, setTab] = useState<Tab>('orders')
  const { items, count } = useCart()

  return (
    <div className="bg-gradient-to-b from-sky-50/40 to-white min-h-[70vh]">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        {/* Profile header */}
        <div className="rounded-3xl bg-gradient-to-br from-sky-600 via-indigo-500 to-pink-500 p-6 md:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute -top-20 -right-12 h-72 w-72 rounded-full bg-white/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-3xl font-serif font-bold">
              K
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-[0.2em] text-white/80 mb-1">
                K-STORM Member
              </p>
              <h1 className="font-serif text-2xl md:text-3xl font-bold truncate">
                K-STORM 팬님
              </h1>
              <p className="text-sm text-white/80 mt-1">cherrychance54@gmail.com</p>
            </div>
            <div className="grid grid-cols-3 gap-3 md:gap-6 w-full md:w-auto">
              <Stat label="주문" value="0" />
              <Stat label="장바구니" value={String(count)} />
              <Stat label="적립금" value="0P" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 border-b border-slate-200 mb-8 overflow-x-auto">
          {tabs.map(t => {
            const active = tab === t.key
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`inline-flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors ${
                  active
                    ? 'border-sky-600 text-sky-700'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            )
          })}
        </div>

        {/* Tab content */}
        <div className="rounded-2xl border border-sky-100 bg-white p-6 md:p-8 shadow-sm">
          {tab === 'orders' && <OrdersPanel />}
          {tab === 'wishlist' && <WishlistPanel cartItems={items.length} />}
          {tab === 'addresses' && <AddressesPanel />}
          {tab === 'settings' && <SettingsPanel />}
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/15 backdrop-blur-sm border border-white/25 px-3 py-3 md:px-5 md:py-4 text-center">
      <p className="text-[10px] md:text-xs uppercase tracking-wider text-white/80">
        {label}
      </p>
      <p className="font-serif text-xl md:text-2xl font-bold mt-0.5">
        {value}
      </p>
    </div>
  )
}

function EmptyState({ title, hint, cta }: { title: string; hint: string; cta?: { label: string; href: string } }) {
  return (
    <div className="text-center py-10">
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-sky-50 text-sky-500 mb-4">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M5 6h12M5 11h12M5 16h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="font-serif text-lg font-bold text-slate-900 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-500 mb-5">{hint}</p>
      {cta && (
        <Link
          href={cta.href}
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 transition-colors"
        >
          {cta.label}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      )}
    </div>
  )
}

function OrdersPanel() {
  return (
    <EmptyState
      title="아직 주문 내역이 없어요"
      hint="첫 포토카드를 골라보세요"
      cta={{ label: '둘러보기', href: '/#gallery' }}
    />
  )
}

function WishlistPanel({ cartItems }: { cartItems: number }) {
  return (
    <div>
      {cartItems > 0 ? (
        <div className="flex items-start gap-4 rounded-xl bg-sky-50 border border-sky-100 p-4 mb-6">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-sky-600">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 5h2l1.4 8.2a1 1 0 001 .8h6.2a1 1 0 001-.8L16 7H6" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-900">
              장바구니에 {cartItems}종의 상품이 담겨있어요
            </p>
            <p className="text-xs text-slate-500 mt-0.5">결제하기 전에 한 번 더 확인해보세요</p>
          </div>
          <Link
            href="/cart"
            className="self-center text-sm font-semibold text-sky-700 hover:underline"
          >
            장바구니 →
          </Link>
        </div>
      ) : null}

      <EmptyState
        title="찜한 상품이 없어요"
        hint="포토카드 상세 화면에서 하트를 눌러 찜해보세요"
        cta={{ label: '포토카드 보러가기', href: '/#gallery' }}
      />
    </div>
  )
}

function AddressesPanel() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center">
        <p className="text-sm text-slate-500 mb-3">등록된 배송지가 없어요</p>
        <button className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          + 배송지 추가
        </button>
      </div>
    </div>
  )
}

function SettingsPanel() {
  const rows = [
    { label: '닉네임', value: 'K-STORM 팬', editable: true },
    { label: '이메일', value: 'cherrychance54@gmail.com', editable: false },
    { label: '연락처', value: '미등록', editable: true },
    { label: '마케팅 수신', value: '동의함', editable: true },
  ]
  return (
    <div className="divide-y divide-slate-100">
      {rows.map(r => (
        <div key={r.label} className="flex items-center justify-between py-4">
          <div>
            <p className="text-xs text-slate-500 mb-0.5">{r.label}</p>
            <p className="text-sm font-medium text-slate-900">{r.value}</p>
          </div>
          {r.editable && (
            <button className="text-sm text-sky-600 hover:underline">변경</button>
          )}
        </div>
      ))}
      <div className="pt-6">
        <button className="text-sm text-slate-400 hover:text-rose-600 transition-colors">
          로그아웃
        </button>
      </div>
    </div>
  )
}
