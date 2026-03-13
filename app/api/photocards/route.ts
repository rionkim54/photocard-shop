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
      { next: { revalidate: 60 } }
    )

    if (!res.ok) throw new Error('Failed to fetch photocards')

    const data = await res.json()
    console.log('✅ photocards fetched:', data.total, '| sample keys:', data.data?.[0] ? Object.keys(data.data[0]) : [])
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch photocards' },
      { status: 500 }
    )
  }
}
