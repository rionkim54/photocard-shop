'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

export type Lang = 'ko' | 'en' | 'zh' | 'ja'

export const LANGUAGES: { code: Lang; label: string; short: string }[] = [
  { code: 'ko', label: '한국어', short: 'KO' },
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'zh', label: '中文', short: 'ZH' },
  { code: 'ja', label: '日本語', short: 'JA' },
]

export type Translations = {
  ko: string
  en: string
  zh?: string
  ja?: string
}

interface LangContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: (entry: Translations) => string
}

const LangContext = createContext<LangContextValue | null>(null)
const STORAGE_KEY = 'kstorm_lang_v1'

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('ko')

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Lang | null
      if (stored && LANGUAGES.some(l => l.code === stored)) {
        setLangState(stored)
        return
      }
      const nav = (typeof navigator !== 'undefined' ? navigator.language : '')
        .toLowerCase()
      if (nav.startsWith('en')) setLangState('en')
      else if (nav.startsWith('zh')) setLangState('zh')
      else if (nav.startsWith('ja')) setLangState('ja')
    } catch {}
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem(STORAGE_KEY, l)
    } catch {}
  }

  const t = (entry: Translations) =>
    entry[lang] ?? entry.en ?? entry.ko

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}
