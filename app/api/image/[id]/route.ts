import { NextRequest, NextResponse } from 'next/server'
import { applyWatermark } from '@/lib/watermark'

const API_URL = process.env.PHOTOCARD_API_URL
const WATERMARK_TEXT = process.env.WATERMARK_TEXT || '© KPOP STORE'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    // seller_photocard_id로 직접 필터
    const res = await fetch(
      `${API_URL}/api/mobile/seller_photocards?seller_photocard_id=${id}&page=1&limit=1`
    )
    if (!res.ok) throw new Error('Not found')

    const json = await res.json()
    const item = json.data?.[0]
    const imageUrl = item?.image_url
    if (!imageUrl) throw new Error('No image URL')

    const imageRes = await fetch(imageUrl)
    if (!imageRes.ok) throw new Error('Failed to fetch image')

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
    return NextResponse.json({ error: 'Image not found' }, { status: 404 })
  }
}
