'use client'

import { useState, useEffect, useRef } from 'react'
import { useLang, LANGUAGES } from '../lib/i18n'

export default function LanguageSwitcher({
  variant = 'dropdown',
}: {
  variant?: 'dropdown' | 'pill'
}) {
  const { lang, setLang } = useLang()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  if (variant === 'pill') {
    return (
      <div className="inline-flex items-center rounded-full bg-white border border-sky-100 p-1 shadow-sm">
        {LANGUAGES.map(l => {
          const active = lang === l.code
          return (
            <button
              key={l.code}
              type="button"
              onClick={() => setLang(l.code)}
              className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-colors ${
                active
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              aria-label={l.label}
            >
              {l.short}
            </button>
          )
        })}
      </div>
    )
  }

  const current = LANGUAGES.find(l => l.code === lang) ?? LANGUAGES[0]

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-semibold text-slate-700 hover:bg-sky-100 transition-colors"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Change language"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="5.4" stroke="currentColor" strokeWidth="1.4" />
          <path d="M1.6 7h10.8M7 1.6c1.7 1.7 2.5 3.6 2.5 5.4 0 1.8-.8 3.7-2.5 5.4M7 1.6C5.3 3.3 4.5 5.2 4.5 7c0 1.8.8 3.7 2.5 5.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <span className="hidden sm:inline">{current.short}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1.5 w-36 rounded-xl border border-sky-100 bg-white shadow-xl py-1 z-50 animate-fade-up"
          role="listbox"
        >
          {LANGUAGES.map(l => {
            const active = lang === l.code
            return (
              <button
                key={l.code}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  setLang(l.code)
                  setOpen(false)
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm transition-colors ${
                  active
                    ? 'text-sky-700 bg-sky-50 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{l.label}</span>
                {active && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7.5l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
