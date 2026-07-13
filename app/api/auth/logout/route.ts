import { NextResponse } from 'next/server'
import { deleteSession, COOKIE_NAME } from '@/lib/session'

export async function POST() {
  await deleteSession()
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_NAME, '', { maxAge: 0, path: '/' })
  return res
}
