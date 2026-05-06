'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '../lib/cart'
import { useLang } from '../lib/i18n'
import LanguageSwitcher from './LanguageSwitcher'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { count, ready } = useCart()
  const { t } = useLang()

  const navLinks = [
    { href: '/#home', label: t({ ko: '홈', en: 'Home', zh: '首页', ja: 'ホーム' }) },
    { href: '/#categories', label: t({ ko: '카테고리', en: 'Categories', zh: '分类', ja: 'カテゴリー' }) },
    { href: '/#gallery', label: t({ ko: '포토카드', en: 'Photocards', zh: '小卡', ja: 'フォトカード' }) },
    { href: '/contact', label: t({ ko: '문의', en: 'Contact', zh: '联系我们', ja: 'お問い合わせ' }) },
    { href: '/mypage', label: t({ ko: '마이페이지', en: 'My Page', zh: '我的页面', ja: 'マイページ' }) },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b border-sky-200/60 bg-white/80 backdrop-blur-md shadow-[0_2px_24px_rgba(116,180,255,0.12)]">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-3">
          {/* Mobile menu */}
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-700 hover:bg-sky-100"
            aria-label={t({ ko: '메뉴', en: 'Menu', zh: '菜单', ja: 'メニュー' })}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              {open ? (
                <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              ) : (
                <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              )}
            </svg>
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 select-none">
            <span className="font-serif text-2xl font-bold tracking-tight text-slate-900">
              K-STORM<span className="text-pink-500">.</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1">
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
                  className="w-44 lg:w-56 rounded-lg border border-sky-200 bg-white px-3 py-1.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:border-sky-500"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-700 hover:bg-sky-100"
                  aria-label="Close"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-700 hover:bg-sky-100"
                aria-label={t({ ko: '검색', en: 'Search', zh: '搜索', ja: '検索' })}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M12 12l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            )}

            <Link
              href="/mypage"
              className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-700 hover:bg-sky-100"
              aria-label={t({ ko: '찜한 상품', en: 'Wishlist', zh: '心愿单', ja: 'お気に入り' })}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 15.5s-5.5-3.4-5.5-7A3 3 0 019 6.2a3 3 0 015.5 2.3c0 3.6-5.5 7-5.5 7z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
              </svg>
            </Link>

            <Link
              href="/mypage"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-700 hover:bg-sky-100"
              aria-label={t({ ko: '마이페이지', en: 'My Page', zh: '我的页面', ja: 'マイページ' })}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.4" />
                <path d="M3 15.5c1.5-2.7 3.7-4 6-4s4.5 1.3 6 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </Link>

            <Link
              href="/cart"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-700 hover:bg-sky-100"
              aria-label={t({ ko: '장바구니', en: 'Cart', zh: '购物车', ja: 'カート' })}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 5h2l1.4 8.2a1 1 0 001 .8h6.2a1 1 0 001-.8L16 7H6" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
                <circle cx="7.5" cy="16" r="1" fill="currentColor" />
                <circle cx="13" cy="16" r="1" fill="currentColor" />
              </svg>
              {ready && count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-pink-500 px-1 text-[10px] font-semibold text-white">
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <nav className="lg:hidden border-t border-sky-100 py-3 flex flex-col gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700"
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
