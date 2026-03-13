# Next.js API Routes 연동 코드

## 📁 파일 구조

```
app/
└── api/
    ├── photocards/
    │   ├── route.ts          ← 포토카드 목록
    │   └── [id]/
    │       └── route.ts      ← 포토카드 상세
    ├── groups/
    │   └── route.ts          ← 그룹 목록
    ├── singers/
    │   └── route.ts          ← 가수 목록
    └── image/
        └── [id]/
            └── route.ts      ← 워터마크 이미지 프록시
```

---

## .env.local 추가

```env
NEXT_PUBLIC_SUPABASE_URL=https://lzertmwmhkopgnnvxvey.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# 기존 서버 (서버사이드에서만 사용 - NEXT_PUBLIC 붙이지 않음!)
PHOTOCARD_API_URL=https://kpop.zerowin.kr
```

---

## 1. `app/api/photocards/route.ts` — 목록

```ts
import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.PHOTOCARD_API_URL

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const page = searchParams.get('page') || '1'
  const limit = searchParams.get('limit') || '20'
  const search = searchParams.get('search') || ''
  const searchType = searchParams.get('searchType') || ''

  const params = new URLSearchParams({ page, limit })
  if (search) params.set('search', search)
  if (searchType) params.set('searchType', searchType)

  try {
    const res = await fetch(
      `${API_URL}/api/mobile/seller_photocards?${params.toString()}`,
      { next: { revalidate: 60 } } // 60초 캐싱
    )

    if (!res.ok) throw new Error('Failed to fetch photocards')

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch photocards' },
      { status: 500 }
    )
  }
}
```

---

## 2. `app/api/photocards/[id]/route.ts` — 상세

```ts
import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.PHOTOCARD_API_URL

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const res = await fetch(
      `${API_URL}/api/photocard/${params.id}`,
      { next: { revalidate: 60 } }
    )

    if (!res.ok) throw new Error('Photocard not found')

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Photocard not found' },
      { status: 404 }
    )
  }
}
```

---

## 3. `app/api/groups/route.ts` — 그룹 목록

```ts
import { NextResponse } from 'next/server'

const API_URL = process.env.PHOTOCARD_API_URL

export async function GET() {
  try {
    const res = await fetch(
      `${API_URL}/api/v1/lists/groups`,
      { next: { revalidate: 3600 } } // 1시간 캐싱 (그룹은 잘 안 바뀜)
    )

    if (!res.ok) throw new Error('Failed to fetch groups')

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch groups' },
      { status: 500 }
    )
  }
}
```

---

## 4. `app/api/singers/route.ts` — 가수 목록

```ts
import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.PHOTOCARD_API_URL

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const group_id = searchParams.get('group_id')

  const params = new URLSearchParams()
  if (group_id) params.set('group_id', group_id)

  try {
    const res = await fetch(
      `${API_URL}/api/v1/lists/singers?${params.toString()}`,
      { next: { revalidate: 3600 } }
    )

    if (!res.ok) throw new Error('Failed to fetch singers')

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch singers' },
      { status: 500 }
    )
  }
}
```

---

## 5. `app/api/image/[id]/route.ts` — 워터마크 이미지 프록시

```ts
import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.PHOTOCARD_API_URL

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // id = seller_photocard_id
  // 먼저 포토카드 상세에서 image_url을 가져옴
  try {
    const res = await fetch(`${API_URL}/api/photocard/${params.id}`)
    if (!res.ok) throw new Error('Not found')

    const data = await res.json()
    const imageUrl = data.image_url
    if (!imageUrl) throw new Error('No image')

    // 원본 이미지 fetch
    const imageRes = await fetch(imageUrl)
    const imageBuffer = await imageRes.arrayBuffer()

    // TODO: 여기에 Sharp 워터마크 처리 추가 예정
    // 지금은 원본 이미지 그대로 반환 (워터마크 작업 전 테스트용)

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': imageRes.headers.get('content-type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400', // 24시간 캐싱
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Image not found' },
      { status: 404 }
    )
  }
}
```

---

## ✅ 테스트 방법

서버 실행 후 브라우저나 터미널에서:

```bash
# 포토카드 목록
curl http://localhost:3000/api/photocards?page=1&limit=5

# 검색
curl "http://localhost:3000/api/photocards?search=aespa&searchType=group"

# 상세
curl http://localhost:3000/api/photocards/1

# 그룹 목록
curl http://localhost:3000/api/groups

# 가수 목록
curl http://localhost:3000/api/singers?group_id=2
```

---

## 🔒 보안 확인

브라우저 개발자 도구(Network 탭)에서 요청을 봐도:
- `kpop.zerowin.kr` 주소가 **절대 노출되지 않음** ✅
- 모든 요청이 `localhost:3000/api/...` 로만 보임 ✅

---

## 📋 다음 단계

- [ ] 위 파일들 생성 후 `npm run dev` 실행
- [ ] 각 엔드포인트 테스트
- [ ] Sharp 설치 후 워터마크 추가
- [ ] 메인 페이지 UI 연동
