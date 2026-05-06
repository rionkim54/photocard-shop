const items = [
  '5만원 이상 구매 시 무료배송',
  '●',
  '매주 신상 입고',
  '●',
  '정품 K-POP 공식 굿즈',
  '●',
  '한정판 사전 예약',
  '●',
  '전 세계 배송 가능',
  '●',
  '사인 앨범 입고',
  '●',
]

export default function MarqueeBanner() {
  return (
    <div className="bg-gradient-to-r from-sky-600 via-pink-500 to-sky-600 text-white py-2 overflow-hidden">
      <div className="animate-marquee whitespace-nowrap flex">
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="mx-4 text-xs font-medium uppercase tracking-[0.2em]"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
