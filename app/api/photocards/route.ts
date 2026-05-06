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

  if (!API_URL) {
    console.error('PHOTOCARD_API_URL is not set — restart dev server after creating .env.local')
    return NextResponse.json({ error: 'PHOTOCARD_API_URL not configured' }, { status: 500 })
  }
  try {
    const url = `${API_URL}/api/mobile/seller_photocards?${params.toString()}`
    const res = await fetchWithRetry(url, 3)

    if (!res.ok) throw new Error(`Upstream ${res.status}`)

    const data = await res.json()
    console.log('photocards fetched:', data.total, '| sample keys:', data.data?.[0] ? Object.keys(data.data[0]) : [])
    return NextResponse.json(data)
  } catch (error) {
    console.error('photocards fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch photocards', detail: String(error) },
      { status: 500 }
    )
  }
}

async function fetchWithRetry(url: string, retries: number): Promise<Response> {
  let lastErr: unknown
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, { next: { revalidate: 60 } })
      if (res.ok) return res
      // non-retryable client errors
      if (res.status >= 400 && res.status < 500 && res.status !== 408 && res.status !== 429) return res
      lastErr = new Error(`Upstream ${res.status}`)
      if (res.status === 429) {
        const retryAfter = Number(res.headers.get('retry-after'))
        if (retryAfter > 0 && i < retries) {
          await new Promise(r => setTimeout(r, Math.min(retryAfter * 1000, 5000)))
          continue
        }
      }
    } catch (e) {
      lastErr = e
    }
    if (i < retries) await new Promise(r => setTimeout(r, 300 * Math.pow(2, i)))
  }
  throw lastErr
}
