'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLang, type Translations } from '../lib/i18n'

type Status = 'idle' | 'submitting' | 'success' | 'error'
type InquiryType = 'oem' | 'wholesale' | 'general' | 'other'

const COUNTRIES = [
  { code: 'KR', ko: '대한민국', en: 'Korea, Republic of', zh: '韩国', ja: '韓国' },
  { code: 'US', ko: '미국', en: 'United States', zh: '美国', ja: 'アメリカ' },
  { code: 'JP', ko: '일본', en: 'Japan', zh: '日本', ja: '日本' },
  { code: 'CN', ko: '중국', en: 'China', zh: '中国', ja: '中国' },
  { code: 'TW', ko: '대만', en: 'Taiwan', zh: '台湾', ja: '台湾' },
  { code: 'HK', ko: '홍콩', en: 'Hong Kong', zh: '香港', ja: '香港' },
  { code: 'SG', ko: '싱가포르', en: 'Singapore', zh: '新加坡', ja: 'シンガポール' },
  { code: 'TH', ko: '태국', en: 'Thailand', zh: '泰国', ja: 'タイ' },
  { code: 'VN', ko: '베트남', en: 'Vietnam', zh: '越南', ja: 'ベトナム' },
  { code: 'ID', ko: '인도네시아', en: 'Indonesia', zh: '印度尼西亚', ja: 'インドネシア' },
  { code: 'MY', ko: '말레이시아', en: 'Malaysia', zh: '马来西亚', ja: 'マレーシア' },
  { code: 'PH', ko: '필리핀', en: 'Philippines', zh: '菲律宾', ja: 'フィリピン' },
  { code: 'IN', ko: '인도', en: 'India', zh: '印度', ja: 'インド' },
  { code: 'AU', ko: '호주', en: 'Australia', zh: '澳大利亚', ja: 'オーストラリア' },
  { code: 'NZ', ko: '뉴질랜드', en: 'New Zealand', zh: '新西兰', ja: 'ニュージーランド' },
  { code: 'GB', ko: '영국', en: 'United Kingdom', zh: '英国', ja: 'イギリス' },
  { code: 'DE', ko: '독일', en: 'Germany', zh: '德国', ja: 'ドイツ' },
  { code: 'FR', ko: '프랑스', en: 'France', zh: '法国', ja: 'フランス' },
  { code: 'IT', ko: '이탈리아', en: 'Italy', zh: '意大利', ja: 'イタリア' },
  { code: 'ES', ko: '스페인', en: 'Spain', zh: '西班牙', ja: 'スペイン' },
  { code: 'NL', ko: '네덜란드', en: 'Netherlands', zh: '荷兰', ja: 'オランダ' },
  { code: 'CA', ko: '캐나다', en: 'Canada', zh: '加拿大', ja: 'カナダ' },
  { code: 'MX', ko: '멕시코', en: 'Mexico', zh: '墨西哥', ja: 'メキシコ' },
  { code: 'BR', ko: '브라질', en: 'Brazil', zh: '巴西', ja: 'ブラジル' },
  { code: 'AR', ko: '아르헨티나', en: 'Argentina', zh: '阿根廷', ja: 'アルゼンチン' },
  { code: 'RU', ko: '러시아', en: 'Russia', zh: '俄罗斯', ja: 'ロシア' },
  { code: 'AE', ko: '아랍에미리트', en: 'United Arab Emirates', zh: '阿拉伯联合酋长国', ja: 'アラブ首長国連邦' },
  { code: 'SA', ko: '사우디아라비아', en: 'Saudi Arabia', zh: '沙特阿拉伯', ja: 'サウジアラビア' },
  { code: 'OTHER', ko: '기타', en: 'Other', zh: '其他', ja: 'その他' },
] as const

const TYPE_OPTIONS: {
  id: InquiryType
  label: Translations
  desc: Translations
  icon: React.ReactNode
}[] = [
  {
    id: 'oem',
    label: { ko: 'OEM 판매', en: 'OEM Sales', zh: 'OEM 销售', ja: 'OEM販売' },
    desc: {
      ko: '맞춤형 굿즈 제작·납품',
      en: 'Custom merchandise production',
      zh: '定制商品生产与交付',
      ja: 'オーダーメイドグッズの製造・納品',
    },
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="5" width="14" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3 8h14" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 5V3.5h6V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'wholesale',
    label: { ko: '도매 / 수출', en: 'Wholesale / Export', zh: '批发 / 出口', ja: '卸売 / 輸出' },
    desc: {
      ko: '대량 구매 · 해외 수출',
      en: 'Bulk purchase & export',
      zh: '批量采购与海外出口',
      ja: '大量購入・海外輸出',
    },
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M2 7l8-3 8 3-8 3-8-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M2 12l8 3 8-3M2 17l8 3 8-3" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'general',
    label: { ko: '일반 상담', en: 'General Inquiry', zh: '一般咨询', ja: '一般お問い合わせ' },
    desc: {
      ko: '제품 · 주문 · 배송 문의',
      en: 'Product, order & shipping',
      zh: '产品、订单与配送',
      ja: '商品・注文・配送のご質問',
    },
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 14V6a2 2 0 012-2h10a2 2 0 012 2v6a2 2 0 01-2 2H8l-4 3v-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="7" cy="9" r="0.8" fill="currentColor" />
        <circle cx="10" cy="9" r="0.8" fill="currentColor" />
        <circle cx="13" cy="9" r="0.8" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'other',
    label: { ko: '기타 / 제휴', en: 'Partnership / Other', zh: '合作 / 其他', ja: '提携 / その他' },
    desc: {
      ko: '협력 · 미디어 · 기타 문의',
      en: 'Collaboration & press',
      zh: '合作、媒体及其他',
      ja: 'コラボ・メディア・その他',
    },
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 8a2 2 0 014 0c0 1.5-2 1.5-2 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="10" cy="14" r="0.8" fill="currentColor" />
      </svg>
    ),
  },
]

export default function ContactPage() {
  const { t, lang } = useLang()
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [form, setForm] = useState({
    name: '',
    company: '',
    country: '',
    email: '',
    phone: '',
    type: 'oem' as InquiryType,
    subject: '',
    message: '',
    consent: false,
  })

  const submitting = status === 'submitting'

  const setField = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm(f => ({ ...f, [k]: v }))

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!form.name || !form.country || !form.email || !form.subject || !form.message) {
      setStatus('error')
      setErrorMsg(t({
        ko: '필수 항목을 모두 입력해주세요.',
        en: 'Please fill in all required fields.',
        zh: '请填写所有必填项。',
        ja: '必須項目をすべてご入力ください。',
      }))
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setStatus('error')
      setErrorMsg(t({
        ko: '이메일 주소를 다시 확인해주세요.',
        en: 'Please check the email address.',
        zh: '请检查邮箱地址。',
        ja: 'メールアドレスをご確認ください。',
      }))
      return
    }
    if (!form.consent) {
      setStatus('error')
      setErrorMsg(t({
        ko: '개인정보 수집·이용에 동의해주세요.',
        en: 'Please agree to data processing.',
        zh: '请同意个人信息处理。',
        ja: '個人情報の取扱いに同意してください。',
      }))
      return
    }

    setStatus('submitting')
    const typeOpt = TYPE_OPTIONS.find(o => o.id === form.type)
    const country = COUNTRIES.find(c => c.code === form.country)

    try {
      const res = await fetch('https://formsubmit.co/ajax/zerowinart@naver.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          이름_Name: form.name,
          회사_Company: form.company || '-',
          국가_Country: country ? `${country.en} (${country.ko})` : form.country,
          이메일_Email: form.email,
          연락처_Phone: form.phone || '-',
          문의종류_Type: typeOpt ? `${typeOpt.label.en} / ${typeOpt.label.ko}` : form.type,
          제목_Subject: form.subject,
          내용_Message: form.message,
          접수일시_Submitted: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
          작성언어_Lang: lang.toUpperCase(),
          _subject: `[K-STORM Inquiry] ${typeOpt?.label.en ?? ''} - ${form.subject}`,
          _template: 'table',
          _captcha: 'false',
        }),
      })
      const data = await res.json().catch(() => ({}))
      const ok = res.ok && (data?.success === true || data?.success === 'true')
      if (!ok) {
        setStatus('error')
        setErrorMsg(
          data?.message ||
            t({
              ko: '문의 처리 중 문제가 발생했습니다.',
              en: 'There was a problem submitting your inquiry.',
              zh: '提交咨询时出现问题。',
              ja: 'お問い合わせの処理中に問題が発生しました。',
            }),
        )
        return
      }
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMsg(t({
        ko: '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        en: 'Network error. Please try again shortly.',
        zh: '网络错误，请稍后再试。',
        ja: 'ネットワークエラーが発生しました。後ほど再度お試しください。',
      }))
    }
  }

  return (
    <div className="bg-gradient-to-b from-sky-50/40 via-white to-white min-h-[70vh]">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs text-sky-600 uppercase tracking-[0.25em] font-medium mb-2">
            Contact Us
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            {t({
              ko: '비즈니스 문의 접수',
              en: 'Get in Touch',
              zh: '商务咨询',
              ja: 'ビジネスお問い合わせ',
            })}
          </h1>
          <p className="text-sm md:text-base text-slate-600 max-w-2xl leading-relaxed">
            {t({
              ko: 'OEM 판매 · 도매 · 수출 · 일반 상담 등 K-STORM의 모든 비즈니스 문의를 환영합니다. 영업일 기준 1-2일 이내 답변드립니다.',
              en: 'For OEM, wholesale, export, or general inquiries — we welcome all business questions from around the world. We respond within 1-2 business days.',
              zh: '欢迎来自全球的 OEM、批发、出口及一般业务咨询。我们将在 1-2 个工作日内回复。',
              ja: 'OEM・卸売・輸出・一般のお問い合わせなど、世界中からのビジネスのご質問を歓迎します。営業日1～2日以内にご返信いたします。',
            })}
          </p>
        </div>

        {status === 'success' ? (
          <SuccessCard
            onReset={() => {
              setStatus('idle')
              setForm({ name: '', company: '', country: '', email: '', phone: '', type: 'oem', subject: '', message: '', consent: false })
            }}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
            <form
              onSubmit={onSubmit}
              className="rounded-2xl border border-sky-100 bg-white p-6 md:p-8 shadow-sm space-y-6"
            >
              {/* Inquiry type */}
              <div>
                <Label required>
                  {t({ ko: '문의 종류', en: 'Inquiry Type', zh: '咨询类型', ja: 'お問い合わせ種類' })}
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
                  {TYPE_OPTIONS.map(opt => {
                    const active = form.type === opt.id
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setField('type', opt.id)}
                        className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all ${
                          active
                            ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-100'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div
                          className={`mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-lg flex-shrink-0 ${
                            active ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {opt.icon}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm font-semibold ${active ? 'text-sky-900' : 'text-slate-900'}`}>
                            {t(opt.label)}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {t(opt.desc)}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field>
                  <Label required>{t({ ko: '이름', en: 'Full Name', zh: '姓名', ja: 'お名前' })}</Label>
                  <input
                    value={form.name}
                    onChange={e => setField('name', e.target.value)}
                    placeholder={t({ ko: '홍길동', en: 'John Doe', zh: '张三', ja: '山田太郎' })}
                    className={inputCls}
                    required
                  />
                </Field>
                <Field>
                  <Label>{t({ ko: '회사명', en: 'Company', zh: '公司名称', ja: '会社名' })}</Label>
                  <input
                    value={form.company}
                    onChange={e => setField('company', e.target.value)}
                    placeholder={t({
                      ko: '(선택) 회사명',
                      en: '(Optional) Company name',
                      zh: '（选填）公司名称',
                      ja: '（任意）会社名',
                    })}
                    className={inputCls}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field>
                  <Label required>{t({ ko: '국가', en: 'Country', zh: '国家', ja: '国' })}</Label>
                  <select
                    value={form.country}
                    onChange={e => setField('country', e.target.value)}
                    className={inputCls}
                    required
                  >
                    <option value="">
                      {t({
                        ko: '— 국가를 선택해주세요 —',
                        en: '— Select your country —',
                        zh: '— 请选择国家 —',
                        ja: '— 国を選択してください —',
                      })}
                    </option>
                    {COUNTRIES.map(c => (
                      <option key={c.code} value={c.code}>
                        {t({ ko: c.ko, en: c.en, zh: c.zh, ja: c.ja })}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field>
                  <Label>{t({ ko: '연락처', en: 'Phone', zh: '联系电话', ja: '電話番号' })}</Label>
                  <input
                    value={form.phone}
                    onChange={e => setField('phone', e.target.value)}
                    placeholder="+82 10-1234-5678"
                    className={inputCls}
                  />
                </Field>
              </div>

              <Field>
                <Label required>{t({ ko: '이메일', en: 'Email', zh: '邮箱', ja: 'メール' })}</Label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setField('email', e.target.value)}
                  placeholder="name@example.com"
                  className={inputCls}
                  required
                />
              </Field>

              <Field>
                <Label required>{t({ ko: '제목', en: 'Subject', zh: '主题', ja: '件名' })}</Label>
                <input
                  value={form.subject}
                  onChange={e => setField('subject', e.target.value)}
                  placeholder={t({
                    ko: '문의 제목을 간단히 적어주세요',
                    en: 'Brief subject of your inquiry',
                    zh: '请简要说明咨询主题',
                    ja: 'お問い合わせの件名',
                  })}
                  className={inputCls}
                  required
                />
              </Field>

              <Field>
                <Label required>{t({ ko: '문의 내용', en: 'Message', zh: '咨询内容', ja: 'メッセージ' })}</Label>
                <textarea
                  value={form.message}
                  onChange={e => setField('message', e.target.value)}
                  rows={6}
                  placeholder={t({
                    ko: '구체적인 내용을 자유롭게 작성해주세요. 수량, 일정, 예산 등을 포함해주시면 더 빠른 답변이 가능합니다.',
                    en: 'Feel free to share details. Including quantity, timeline, and budget helps us respond faster.',
                    zh: '请详细说明您的需求。提供数量、时间和预算有助于我们更快回复。',
                    ja: '具体的な内容をご自由にご記入ください。数量・期間・予算を含めるとより迅速にご返信できます。',
                  })}
                  className={`${inputCls} resize-y min-h-[140px]`}
                  required
                />
              </Field>

              <label className="flex items-start gap-2.5 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={e => setField('consent', e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <span className="text-slate-600">
                  {t({
                    ko: '문의 응답 목적으로 입력하신 개인정보 수집·이용에 동의합니다.',
                    en: 'I agree to the processing of my personal data to respond to this inquiry.',
                    zh: '我同意为回复本次咨询而处理个人信息。',
                    ja: 'お問い合わせ対応のため、個人情報の取扱いに同意します。',
                  })}
                  <span className="text-rose-500"> *</span>
                </span>
              </label>

              {status === 'error' && errorMsg && (
                <div className="rounded-xl bg-rose-50 border border-rose-100 px-4 py-3 text-sm text-rose-700">
                  {errorMsg}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                <p className="text-xs text-slate-400">
                  <span className="text-rose-500">*</span>{' '}
                  {t({ ko: '필수 항목', en: 'Required fields', zh: '必填项', ja: '必須項目' })}
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-600 to-pink-500 px-7 py-3 text-sm font-semibold text-white shadow-lg hover:opacity-95 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 14 14" className="animate-spin">
                        <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6" fill="none" opacity="0.25" />
                        <path d="M12 7a5 5 0 00-5-5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                      </svg>
                      {t({ ko: '전송 중...', en: 'Submitting...', zh: '提交中...', ja: '送信中...' })}
                    </>
                  ) : (
                    <>
                      {t({ ko: '문의 접수하기', en: 'Submit Inquiry', zh: '提交咨询', ja: 'お問い合わせを送信' })}
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Info card */}
            <aside className="lg:sticky lg:top-24 self-start space-y-4">
              <div className="rounded-2xl bg-gradient-to-br from-sky-600 via-indigo-500 to-pink-500 p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute -top-16 -right-10 h-44 w-44 rounded-full bg-white/20 blur-3xl pointer-events-none" />
                <p className="text-xs uppercase tracking-[0.25em] text-white/80 mb-2">
                  Business Contact
                </p>
                <h2 className="font-serif text-xl font-bold mb-5">
                  {t({
                    ko: '비즈니스 문의 안내',
                    en: 'How to Reach Us',
                    zh: '联系我们',
                    ja: 'お問い合わせ方法',
                  })}
                </h2>

                <InfoRow
                  label={t({ ko: '이메일', en: 'Email', zh: '邮箱', ja: 'メール' })}
                  value="zerowinart@naver.com"
                />
                <InfoRow
                  label={t({ ko: '업무 시간', en: 'Business Hours', zh: '工作时间', ja: '営業時間' })}
                  value={t({
                    ko: '평일 10:00 - 18:00 (KST)',
                    en: 'Mon-Fri 10:00 - 18:00 (KST)',
                    zh: '周一至周五 10:00 - 18:00 (KST)',
                    ja: '月-金 10:00 - 18:00 (KST)',
                  })}
                />
                <InfoRow
                  label={t({ ko: '답변 소요', en: 'Response Time', zh: '回复时间', ja: '回答までの時間' })}
                  value={t({
                    ko: '영업일 기준 1-2일',
                    en: 'Within 1-2 business days',
                    zh: '1-2 个工作日内',
                    ja: '営業日1～2日以内',
                  })}
                />
                <InfoRow
                  label={t({ ko: '주소', en: 'Address', zh: '地址', ja: '住所' })}
                  value={t({
                    ko: '대한민국 서울특별시',
                    en: 'Seoul, Republic of Korea',
                    zh: '韩国首尔特别市',
                    ja: '大韓民国 ソウル特別市',
                  })}
                />
              </div>

              <div className="rounded-2xl border border-sky-100 bg-white p-5 text-sm">
                <p className="font-semibold text-slate-900 mb-2">
                  {t({
                    ko: '빠른 답변을 위한 팁',
                    en: 'Tips for a faster reply',
                    zh: '更快回复的小贴士',
                    ja: '迅速な回答のためのコツ',
                  })}
                </p>
                <ul className="space-y-1.5 text-slate-600 text-[13px] leading-relaxed">
                  <li className="flex gap-2">
                    <span className="text-sky-500">●</span>
                    {t({
                      ko: '수량과 납기일을 명시해주세요',
                      en: 'Specify quantity and deadline',
                      zh: '请注明数量与交期',
                      ja: '数量と納期をご明記ください',
                    })}
                  </li>
                  <li className="flex gap-2">
                    <span className="text-sky-500">●</span>
                    {t({
                      ko: '참고 이미지나 자료가 있다면 추후 회신 시 첨부 부탁드려요',
                      en: 'Attach reference images in your reply',
                      zh: '回复时请附上参考图或资料',
                      ja: '参考画像や資料があれば返信時に添付してください',
                    })}
                  </li>
                  <li className="flex gap-2">
                    <span className="text-sky-500">●</span>
                    {t({
                      ko: '예산 범위를 알려주시면 맞춤 제안이 가능합니다',
                      en: 'Sharing your budget helps us tailor a proposal',
                      zh: '告知预算范围可获得定制方案',
                      ja: 'ご予算をお知らせいただければ最適な提案が可能です',
                    })}
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}

const inputCls =
  'w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:opacity-60 transition'

function Field({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1.5">{children}</div>
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-semibold text-slate-700 tracking-wide">
      {children}
      {required && <span className="ml-1 text-rose-500">*</span>}
    </label>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-white/15 first-of-type:border-t-0 py-3 first-of-type:pt-0 last-of-type:pb-0">
      <p className="text-[10px] uppercase tracking-wider text-white/70 mb-0.5">{label}</p>
      <p className="text-sm font-medium break-all">{value}</p>
    </div>
  )
}

function SuccessCard({ onReset }: { onReset: () => void }) {
  const { t } = useLang()
  return (
    <div className="rounded-3xl border border-sky-100 bg-white p-10 md:p-14 text-center shadow-sm max-w-2xl mx-auto">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 mb-6">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M7 14.5l4.5 4.5L21 9.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-900 mb-3">
        {t({
          ko: '문의가 접수되었습니다',
          en: 'Your inquiry was received',
          zh: '咨询已收到',
          ja: 'お問い合わせを受け付けました',
        })}
      </h2>
      <p className="text-slate-600 leading-relaxed mb-8 max-w-md mx-auto">
        {t({
          ko: '소중한 관심에 감사드립니다. 영업일 기준 1-2일 이내에 입력하신 이메일로 답변드리겠습니다.',
          en: "Thank you for reaching out. We'll get back to you at the email you provided within 1-2 business days.",
          zh: '感谢您的关注。我们将在 1-2 个工作日内通过您填写的邮箱回复。',
          ja: 'お問い合わせいただきありがとうございます。営業日1～2日以内にご記入のメールアドレスへご返信いたします。',
        })}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onReset}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:border-slate-300"
        >
          {t({ ko: '새 문의 작성', en: 'New Inquiry', zh: '新建咨询', ja: '新しいお問い合わせ' })}
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 transition-colors"
        >
          {t({ ko: '홈으로 돌아가기', en: 'Back to Home', zh: '返回首页', ja: 'ホームに戻る' })}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
