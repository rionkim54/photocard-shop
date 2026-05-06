'use client'

import Link from 'next/link'
import { useCart } from '../lib/cart'

function imgSrc(imageUrl: string) {
  const encoded = btoa(unescape(encodeURIComponent(imageUrl)))
  return `/api/image?u=${encodeURIComponent(encoded)}`
}

const SHIPPING_THRESHOLD = 50000
const SHIPPING_FEE = 3000

export default function CartPage() {
  const { items, total, ready, setQuantity, remove, clear } = useCart()

  const subtotal = total
  const shipping = subtotal === 0 ? 0 : subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
  const grandTotal = subtotal + shipping

  if (!ready) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-500">
        불러오는 중...
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-b from-sky-50/40 to-white min-h-[70vh]">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        {/* Page header */}
        <div className="mb-8">
          <p className="text-xs text-sky-600 uppercase tracking-[0.25em] font-medium mb-2">
            Shopping Cart
          </p>
          <div className="flex items-end justify-between flex-wrap gap-3">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900">
              장바구니
              {items.length > 0 && (
                <span className="ml-3 text-base font-medium text-slate-500">
                  {items.length}종 / {items.reduce((s, i) => s + i.quantity, 0)}개
                </span>
              )}
            </h1>
            {items.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('장바구니를 모두 비울까요?')) clear()
                }}
                className="text-sm text-slate-500 hover:text-slate-900 underline-offset-4 hover:underline"
              >
                전체 비우기
              </button>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
            {/* Items */}
            <div className="space-y-3">
              {items.map(item => {
                const lineTotal = (item.price || 0) * item.quantity
                return (
                  <div
                    key={item.seller_photocard_id}
                    className="flex gap-4 rounded-2xl border border-sky-100 bg-white p-4 shadow-sm"
                  >
                    <div className="relative h-28 w-21 sm:h-32 sm:w-24 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
                      <img
                        src={imgSrc(item.image_url)}
                        alt={item.title}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="text-sm sm:text-base font-medium text-slate-900 truncate">
                            {item.title || '제목 없음'}
                          </h3>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {item.group_name && (
                              <span className="inline-flex items-center rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-medium text-sky-800">
                                {item.group_name}
                              </span>
                            )}
                            {item.singer_name && (
                              <span className="inline-flex items-center rounded-full bg-pink-100 px-2 py-0.5 text-[11px] font-medium text-pink-700">
                                {item.singer_name}
                              </span>
                            )}
                          </div>
                          <p className="mt-1.5 text-[11px] text-slate-400">
                            ID #{item.photocard_id ?? item.seller_photocard_id}
                          </p>
                        </div>
                        <button
                          onClick={() => remove(item.seller_photocard_id)}
                          aria-label="삭제"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M4 4l8 8M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        </button>
                      </div>

                      <div className="mt-auto pt-3 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-full border border-slate-200">
                          <button
                            onClick={() => setQuantity(item.seller_photocard_id, item.quantity - 1)}
                            aria-label="수량 감소"
                            className="inline-flex h-8 w-8 items-center justify-center text-slate-600 hover:text-slate-900"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => setQuantity(item.seller_photocard_id, item.quantity + 1)}
                            aria-label="수량 증가"
                            className="inline-flex h-8 w-8 items-center justify-center text-slate-600 hover:text-slate-900"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-right">
                          {item.price ? (
                            <>
                              <p className="text-sm font-semibold text-slate-900">
                                ₩{lineTotal.toLocaleString()}
                              </p>
                              {item.quantity > 1 && (
                                <p className="text-[11px] text-slate-400">
                                  ₩{item.price.toLocaleString()} × {item.quantity}
                                </p>
                              )}
                            </>
                          ) : (
                            <p className="text-xs text-slate-400">가격 정보 없음</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Summary */}
            <aside className="lg:sticky lg:top-24 self-start rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
              <h2 className="font-serif text-xl font-bold text-slate-900 mb-5">
                주문 요약
              </h2>
              <dl className="space-y-3 text-sm mb-5">
                <div className="flex justify-between">
                  <dt className="text-slate-500">상품 금액</dt>
                  <dd className="text-slate-900 font-medium">
                    ₩{subtotal.toLocaleString()}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">배송비</dt>
                  <dd className="text-slate-900 font-medium">
                    {shipping === 0 ? (
                      <span className="text-emerald-600">무료</span>
                    ) : (
                      `₩${shipping.toLocaleString()}`
                    )}
                  </dd>
                </div>
                {shipping > 0 && (
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    ₩{(SHIPPING_THRESHOLD - subtotal).toLocaleString()} 더 담으면 무료배송이에요
                  </p>
                )}
                <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline">
                  <dt className="text-slate-700 font-medium">결제 예상 금액</dt>
                  <dd className="font-serif text-2xl font-bold text-slate-900">
                    ₩{grandTotal.toLocaleString()}
                  </dd>
                </div>
              </dl>

              <button
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-600 to-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:opacity-95 transition-opacity"
              >
                결제하기
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <Link
                href="/#gallery"
                className="mt-3 block text-center text-sm text-slate-500 hover:text-sky-600 transition-colors"
              >
                계속 쇼핑하기
              </Link>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyCart() {
  return (
    <div className="rounded-2xl border border-dashed border-sky-200 bg-white/70 p-12 text-center">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-sky-50 text-sky-500 mb-4">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M5 8h3l2 12h11l2-9H8" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
          <circle cx="11.5" cy="23" r="1.4" fill="currentColor" />
          <circle cx="20" cy="23" r="1.4" fill="currentColor" />
        </svg>
      </div>
      <h3 className="font-serif text-xl font-bold text-slate-900 mb-2">
        장바구니가 비어있어요
      </h3>
      <p className="text-sm text-slate-500 mb-6">
        마음에 드는 포토카드를 담아보세요
      </p>
      <Link
        href="/#gallery"
        className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700 transition-colors"
      >
        포토카드 보러가기
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  )
}
