'use client'

import { useLang, type Translations } from '../lib/i18n'

type FooterLink = { label: Translations; href: string }

const footerLinks: Record<string, FooterLink[]> = {
  shop: [
    { label: { ko: '신상품', en: 'New Arrivals', zh: '新品', ja: '新着' }, href: '#gallery' },
    { label: { ko: '베스트', en: 'Best Sellers', zh: '畅销', ja: 'ベスト' }, href: '#gallery' },
    { label: { ko: '사전 예약', en: 'Pre-Orders', zh: '预购', ja: '予約販売' }, href: '#gallery' },
    { label: { ko: '세일', en: 'Sale', zh: '特价', ja: 'セール' }, href: '#gallery' },
    { label: { ko: '기프트 카드', en: 'Gift Cards', zh: '礼品卡', ja: 'ギフトカード' }, href: '#newsletter' },
  ],
  categories: [
    { label: { ko: '앨범', en: 'Albums', zh: '专辑', ja: 'アルバム' }, href: '#categories' },
    { label: { ko: '포토카드', en: 'Photocards', zh: '小卡', ja: 'フォトカード' }, href: '#gallery' },
    { label: { ko: '응원봉', en: 'Lightsticks', zh: '应援棒', ja: 'ペンライト' }, href: '#gallery' },
    { label: { ko: '굿즈', en: 'Merch', zh: '周边', ja: 'グッズ' }, href: '#gallery' },
    { label: { ko: '의류', en: 'Apparel', zh: '服装', ja: 'アパレル' }, href: '#gallery' },
  ],
  support: [
    { label: { ko: '문의하기', en: 'Contact Us', zh: '联系我们', ja: 'お問い合わせ' }, href: '/contact' },
    { label: { ko: 'OEM 문의', en: 'OEM Inquiry', zh: 'OEM 咨询', ja: 'OEM 問い合わせ' }, href: '/contact' },
    { label: { ko: 'FAQ', en: 'FAQ', zh: '常见问题', ja: 'よくある質問' }, href: '/contact' },
    { label: { ko: '배송 안내', en: 'Shipping', zh: '配送说明', ja: '配送案内' }, href: '/contact' },
    { label: { ko: '반품/교환', en: 'Returns', zh: '退换货', ja: '返品/交換' }, href: '/contact' },
  ],
  company: [
    { label: { ko: '회사 소개', en: 'About Us', zh: '关于我们', ja: '会社概要' }, href: '#home' },
    { label: { ko: '채용 정보', en: 'Careers', zh: '招聘', ja: '採用情報' }, href: '#home' },
    { label: { ko: '제휴 문의', en: 'Partnerships', zh: '合作咨询', ja: '提携問い合わせ' }, href: '/contact' },
    { label: { ko: '개인정보처리방침', en: 'Privacy', zh: '隐私政策', ja: 'プライバシー' }, href: '#home' },
    { label: { ko: '이용약관', en: 'Terms', zh: '服务条款', ja: '利用規約' }, href: '#home' },
  ],
}

const socials = [
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="2" width="12" height="12" rx="3.5" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="8" cy="8" r="2.6" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="11.4" cy="4.6" r="0.8" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: 'Twitter',
    href: '#',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M14 4.7c-.4.2-.9.4-1.4.4.5-.3.9-.8 1.1-1.4-.5.3-1 .5-1.6.6-.5-.5-1.1-.8-1.8-.8-1.4 0-2.5 1.2-2.5 2.6 0 .2 0 .4.1.6C5.7 6.6 3.8 5.6 2.5 4 2.3 4.4 2.2 4.8 2.2 5.3c0 .9.4 1.7 1.1 2.2-.4 0-.8-.1-1.1-.3 0 1.3.9 2.3 2 2.6-.2.1-.4.1-.7.1-.2 0-.3 0-.5-.1.3 1 1.2 1.8 2.4 1.8C4.4 12.3 3.3 12.7 2 12.7c-.2 0-.4 0-.6 0 1.2.8 2.6 1.2 4.1 1.2 4.9 0 7.6-4.2 7.6-7.8v-.4c.5-.4 1-.9 1.3-1.4z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: '#',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1.5" y="3.5" width="13" height="9" rx="2.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M7 6.5l3 1.5-3 1.5v-3z" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: '#',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8.7 14V8.5h1.9l.3-2.2H8.7V4.9c0-.6.2-1 1.1-1h1.2V1.9c-.2 0-.9-.1-1.7-.1-1.7 0-2.8 1-2.8 2.9v1.6H4.6v2.2h1.9V14h2.2z" />
      </svg>
    ),
  },
]

export default function Footer() {
  const { t } = useLang()
  return (
    <footer className="bg-white border-t border-sky-100">
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <a href="#home" className="inline-block mb-4">
              <span className="font-serif text-2xl font-bold text-slate-900">
                K-STORM<span className="text-pink-500">.</span>
              </span>
            </a>
            <p className="text-sm text-slate-600 mb-6 max-w-xs leading-relaxed">
              {t({
                ko: '정품 K-POP 굿즈와 앨범, 컬렉터블의 프리미엄 스토어',
                en: 'Premium destination for authentic K-POP merch, albums, and collectibles.',
                zh: '正版K-POP周边、专辑与收藏品的优质商店',
                ja: '正規K-POPグッズ・アルバム・コレクターズアイテムのプレミアムストア',
              })}
            </p>
            <div className="flex gap-2">
              {socials.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-50 text-slate-600 hover:bg-sky-600 hover:text-white transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title={t({ ko: '쇼핑', en: 'Shop', zh: '购物', ja: 'ショップ' })} links={footerLinks.shop} />
          <FooterColumn title={t({ ko: '카테고리', en: 'Categories', zh: '分类', ja: 'カテゴリー' })} links={footerLinks.categories} />
          <FooterColumn title={t({ ko: '고객 지원', en: 'Support', zh: '客户支持', ja: 'サポート' })} links={footerLinks.support} />
          <FooterColumn title={t({ ko: '회사 정보', en: 'Company', zh: '公司信息', ja: '会社情報' })} links={footerLinks.company} />
        </div>

        <div className="border-t border-sky-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © 2026 K-STORM. {t({ ko: '모든 권리 보유.', en: 'All rights reserved.', zh: '保留所有权利。', ja: 'All rights reserved.' })}
          </p>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">
              {t({ ko: '결제 수단', en: 'Payment', zh: '支付方式', ja: '決済方法' })}
            </span>
            <div className="flex gap-1.5">
              {['Visa', 'MC', 'Amex', '카카오페이', '토스'].map(m => (
                <span
                  key={m}
                  className="px-2 py-1 rounded-md bg-sky-50 text-xs text-slate-500"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  const { t } = useLang()
  return (
    <div>
      <h4 className="font-semibold text-slate-900 mb-4 text-sm">{title}</h4>
      <ul className="space-y-2.5">
        {links.map((l, i) => (
          <li key={i}>
            <a
              href={l.href}
              className="text-sm text-slate-600 hover:text-sky-600 transition-colors"
            >
              {t(l.label)}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
