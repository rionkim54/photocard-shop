import { NextRequest, NextResponse } from 'next/server'
import { applyWatermark } from '@/lib/watermark'

const WATERMARK_TEXT = process.env.WATERMARK_TEXT || '© KPOP STORE'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const encoded = searchParams.get('u')

  if (!encoded) {
    return NextResponse.json({ error: 'Missing parameter' }, { status: 400 })
  }

  try {
    const imageUrl = Buffer.from(encoded, 'base64').toString('utf-8')

    const imageRes = await fetch(imageUrl)
    if (!imageRes.ok) throw new Error('Failed to fetch image')

    const imageBuffer = await imageRes.arrayBuffer()
    const watermarked = await applyWatermark(imageBuffer, WATERMARK_TEXT, 0.3)

    return new NextResponse(watermarked, {
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
