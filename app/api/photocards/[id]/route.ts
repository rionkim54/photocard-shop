import { NextRequest, NextResponse } from 'next/server'
import { apiFetch } from '@/lib/api-fetch'

const API_URL = process.env.PHOTOCARD_API_URL

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const res = await apiFetch(
      `${API_URL}/api/mobile/seller_photocards?search=${id}&page=1&limit=1`,
      { next: { revalidate: 60 } } as RequestInit
    )

    if (!res.ok) throw new Error('Not found')

    const json = await res.json()
    const item = json.data?.[0]
    if (!item) throw new Error('Photocard not found')

    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json(
      { error: 'Photocard not found' },
      { status: 404 }
    )
  }
}
