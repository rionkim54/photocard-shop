import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import db from '@/lib/db'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  db.prepare('DELETE FROM user_collections WHERE user_id = ? AND seller_photocard_id = ?').run(
    user.id, Number(id)
  )
  return NextResponse.json({ ok: true })
}
