'use client'

import { useState } from 'react'
import { useLang } from '../lib/i18n'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function Newsletter() {
  const { t } = useLang()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error')
      setErrorMsg('이메일 주소를 다시 확인해주세요.')
      return
    }
    setStatus('submitting')
    setErrorMsg('')
    try {
      const res = await fetch('https://formsubmit.co/ajax/zerowinart@naver.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          구독_이메일: email,
          구독_일시: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
          _subject: `[K-STORM] 새 팬클럽 구독 - ${email}`,
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
              ko: '구독 처리 중 문제가 발생했습니다.',
              en: 'Something went wrong while processing your subscription.',
              zh: '订阅处理时出现问题。',
              ja: '購読処理中に問題が発生しました。',
            }),
        )
        return
      }
      setStatus('success')
      setEmail('')
    } catch (err) {
      setStatus('error')
      setErrorMsg(
        t({
          ko: '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          en: 'Network error. Please try again shortly.',
          zh: '网络错误，请稍后再试。',
          ja: 'ネットワークエラーが発生しました。後ほど再度お試しください。',
        }),
      )
    }
  }

  const submitting = status === 'submitting'

  return (
    <section
      id="newsletter"
      className="relative overflow-hidden py-16 md:py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white"
    >
      <div className="absolute -top-32 -left-20 h-96 w-96 rounded-full bg-pink-500/30 blur-3xl" />
      <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-sky-500/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/10 mb-6 ring-1 ring-white/20">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="3" y="5" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
              <path d="M3.5 6l7.5 6 7.5-6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            {t({
              ko: '팬클럽에 가입하세요',
              en: 'Join the Fan Club',
              zh: '加入粉丝俱乐部',
              ja: 'ファンクラブに登録',
            })}
          </h2>
          <p className="text-white/80 mb-8 max-w-md mx-auto leading-relaxed">
            {t({
              ko: '한정 발매 소식, 사전 예약 우선 접수, 멤버 전용 할인 등 가장 먼저 만나는 K-STORM 뉴스레터',
              en: 'Limited drops, priority pre-orders, members-only deals — get K-STORM news first.',
              zh: '限定发售情报、优先预订、会员专属折扣，第一时间获取 K-STORM 资讯',
              ja: '限定発売情報・優先予約・メンバー限定割引など、K-STORMの最新ニュースを最速でお届け',
            })}
          </p>

          {status === 'success' ? (
            <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 max-w-md mx-auto">
              <p className="text-lg font-semibold">
                {t({ ko: '환영합니다!', en: 'Welcome!', zh: '欢迎加入！', ja: 'ようこそ!' })}
              </p>
              <p className="text-white/75 text-sm mt-2">
                {t({
                  ko: '구독 신청이 접수되었어요. 곧 첫 소식을 보내드릴게요.',
                  en: "You're subscribed. The first newsletter is on its way.",
                  zh: '订阅成功。我们很快会发送第一封资讯。',
                  ja: 'ご登録ありがとうございます。最初のニュースをお届けします。',
                })}
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-4 text-xs text-white/70 underline-offset-4 hover:underline"
              >
                {t({
                  ko: '다른 이메일로 다시 구독하기',
                  en: 'Subscribe with another email',
                  zh: '使用其他邮箱再次订阅',
                  ja: '別のメールで再登録',
                })}
              </button>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                value={email}
                disabled={submitting}
                onChange={e => setEmail(e.target.value)}
                placeholder={t({
                  ko: '이메일 주소를 입력하세요',
                  en: 'Enter your email',
                  zh: '请输入您的邮箱',
                  ja: 'メールアドレスを入力',
                })}
                className="flex-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-5 py-3 text-sm text-white placeholder:text-white/55 focus:outline-none focus:border-white/60 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100 transition-colors shrink-0 disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 14 14" className="animate-spin">
                      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6" fill="none" opacity="0.25" />
                      <path d="M12 7a5 5 0 00-5-5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                    </svg>
                    {t({ ko: '전송 중...', en: 'Sending...', zh: '发送中...', ja: '送信中...' })}
                  </>
                ) : (
                  t({ ko: '구독하기', en: 'Subscribe', zh: '订阅', ja: '登録する' })
                )}
              </button>
            </form>
          )}

          {status === 'error' && errorMsg && (
            <p className="mt-4 text-sm text-rose-300">{errorMsg}</p>
          )}

          <p className="text-xs text-white/55 mt-5">
            {t({
              ko: '구독 시 마케팅 이메일 수신에 동의하게 되며, 언제든지 해지할 수 있습니다',
              en: 'By subscribing, you agree to receive marketing emails. Unsubscribe anytime.',
              zh: '订阅即表示您同意接收营销邮件，可随时取消订阅',
              ja: 'ご登録によりマーケティングメールの受信に同意されます。いつでも解除できます。',
            })}
          </p>
        </div>
      </div>
    </section>
  )
}
