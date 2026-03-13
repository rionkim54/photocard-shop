import { NextResponse } from 'next/server'

const API_URL = process.env.PHOTOCARD_API_URL

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/api/v1/lists/groups`, { cache: 'no-store' })

    if (!res.ok) throw new Error('Failed to fetch groups')

    const data = await res.json()
    console.log('groups raw:', JSON.stringify(data).slice(0, 400))
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch groups' },
      { status: 500 }
    )
  }
}
