import { NextRequest, NextResponse } from 'next/server'
import { applyWatermark } from '@/lib/watermark'

const WATERMARK_TEXT = process.env.WATERMARK_TEXT || '© K-STORM'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const encoded = searchParams.get('u')

  if (!encoded) {
    return NextResponse.json({ error: 'Missing parameter' }, { status: 400 })
  }

  try {
    const imageUrl = Buffer.from(encoded, 'base64').toString('utf-8')

    const imageRes = await fetchWithRetry(imageUrl, 2)
    if (!imageRes.ok) {
      console.error(`upstream image ${imageRes.status} for ${imageUrl}`)
      throw new Error(`Upstream ${imageRes.status}`)
    }

    const imageBuffer = await imageRes.arrayBuffer()
    const watermarked = await applyWatermark(imageBuffer, WATERMARK_TEXT, 0.3)

    return new NextResponse(new Uint8Array(watermarked), {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch (error) {
    console.error('Image error:', error)
    return NextResponse.json({ error: 'Image not found', detail: String(error) }, { status: 404 })
  }
}

async function fetchWithRetry(url: string, retries: number): Promise<Response> {
  const headers = { 'User-Agent': 'Mozilla/5.0 (compatible; photocard-shop/1.0)' }
  let lastErr: unknown
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, { headers, cache: 'no-store' })
      if (res.ok) return res
      if (res.status >= 400 && res.status < 500 && res.status !== 408 && res.status !== 429) return res
      lastErr = new Error(`Upstream ${res.status}`)
    } catch (e) {
      lastErr = e
    }
    if (i < retries) await new Promise(r => setTimeout(r, 200 * (i + 1)))
  }
  throw lastErr
}
