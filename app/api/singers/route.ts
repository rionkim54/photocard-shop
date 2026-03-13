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
    console.log('singers raw:', JSON.stringify(data).slice(0, 400))
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch singers' },
      { status: 500 }
    )
  }
}
