import { NextResponse } from 'next/server'
import { apiFetch } from '@/lib/api-fetch'

const API_URL = process.env.PHOTOCARD_API_URL

export async function GET() {
  if (!API_URL) {
    console.error('PHOTOCARD_API_URL is not set — restart dev server after creating .env.local')
    return NextResponse.json({ error: 'PHOTOCARD_API_URL not configured' }, { status: 500 })
  }
  try {
    const res = await apiFetch(`${API_URL}/api/v1/lists/groups`, { cache: 'no-store' })

    if (!res.ok) throw new Error(`Upstream ${res.status}`)

    const data = await res.json()
    console.log('groups raw:', JSON.stringify(data).slice(0, 400))
    return NextResponse.json(data)
  } catch (error) {
    console.error('groups fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch groups', detail: String(error) },
      { status: 500 }
    )
  }
}
