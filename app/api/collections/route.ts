import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import db from '@/lib/db'

export async function GET() {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rows = db.prepare('SELECT * FROM user_collections WHERE user_id = ? ORDER BY created_at DESC').all(user.id)
  return NextResponse.json(rows)
}

export async function POST(request: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const item = await request.json()
  try {
    db.prepare(`
      INSERT OR IGNORE INTO user_collections
        (user_id, seller_photocard_id, photocard_id, title, image_url, group_name, singer_name, price)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      user.id,
      item.seller_photocard_id,
      item.photocard_id ?? null,
      item.title ?? null,
      item.image_url ?? null,
      item.group_name ?? null,
      item.singer_name ?? null,
      item.price ?? null,
    )
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: '저장 실패' }, { status: 500 })
  }
}
