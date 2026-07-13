'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '../lib/cart'
import { useCollection } from '../lib/collection'
import { useLang } from '../lib/i18n'
import LanguageSwitcher from './LanguageSwitcher'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { count, ready } = useCart()
  const { items: collectionItems } = useCollection()
  const { t } = useLang()

  const navLinks = [
    { href: '/#home', label: t({ ko: '홈', en: 'Home', zh: '首页', ja: 'ホーム' }) },
    { href: '/#categories', label: t({ ko: '카테고리', en: 'Categories', zh: '分类', ja: 'カテゴリー' }) },
    { href: '/#gallery', label: t({ ko: '포토카드', en: 'Photocards', zh: '小卡', ja: 'フォトカード' }) },
    { href: '/collection', label: t({ ko: '수집카드', en: 'Collection', zh: '收藏', ja: 'コレクション' }) },
    { href: '/contact', label: t({ ko: '문의', en: 'Contact', zh: '联系我们', ja: 'お問い合わせ' }) },
  ]

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex h-14 items-center justify-between gap-3">
          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded text-gray-700 hover:bg-gray-100"
            aria-label={t({ ko: '메뉴', en: 'Menu', zh: '菜单', ja: 'メニュー' })}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              {open ? (
                <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              ) : (
                <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              )}
            </svg>
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center select-none shrink-0">
            <span className="text-[1.35rem] font-bold tracking-tight text-black">
              K-STORM<span className="text-[#1428a0]">.</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7 flex-1 justify-center">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] font-medium text-gray-700 hover:text-black transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-0.5">
            <LanguageSwitcher />

            {searchOpen ? (
              <div className="hidden md:flex items-center gap-1 animate-fade-up">
                <input
                  autoFocus
                  type="text"
                  placeholder={t({
                    ko: '포토카드, 그룹 검색...',
                    en: 'Search photocards, groups...',
                    zh: '搜索小卡、组合...',
                    ja: 'フォトカード、グループを検索...',
                  })}
                  className="w-44 lg:w-56 rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-gray-600"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded text-gray-600 hover:bg-gray-100"
                  aria-label="Close"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded text-gray-700 hover:bg-gray-100"
                aria-label={t({ ko: '검색', en: 'Search', zh: '搜索', ja: '検索' })}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M12 12l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            )}

            {/* 수집카드 */}
            <Link
              href="/collection"
              className="relative hidden sm:inline-flex h-9 w-9 items-center justify-center rounded text-gray-700 hover:bg-gray-100"
              aria-label="수집카드"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="3" y="2" width="9" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                <rect x="6" y="4.5" width="9" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
              </svg>
              {collectionItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[10px] font-semibold text-white">
                  {collectionItems.length > 99 ? '99+' : collectionItems.length}
                </span>
              )}
            </Link>

            <Link
              href="/mypage"
              className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded text-gray-700 hover:bg-gray-100"
              aria-label="마이페이지"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.4" />
                <path d="M3 15.5c1.5-2.7 3.7-4 6-4s4.5 1.3 6 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </Link>

            <Link
              href="/cart"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded text-gray-700 hover:bg-gray-100"
              aria-label={t({ ko: '장바구니', en: 'Cart', zh: '购物车', ja: 'カート' })}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 5h2l1.4 8.2a1 1 0 001 .8h6.2a1 1 0 001-.8L16 7H6" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
                <circle cx="7.5" cy="16" r="1" fill="currentColor" />
                <circle cx="13" cy="16" r="1" fill="currentColor" />
              </svg>
              {ready && count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[10px] font-semibold text-white">
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <nav className="lg:hidden border-t border-gray-100 py-2 flex flex-col">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-2 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-black rounded"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
