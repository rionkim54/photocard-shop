import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import db from '@/lib/db'
import { createSession, COOKIE_NAME } from '@/lib/session'

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as {
    id: number; email: string; password_hash: string; nickname: string | null
  } | undefined

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return NextResponse.json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 })
  }

  const token = createSession(user.id)
  const res = NextResponse.json({ user: { id: user.id, email: user.email, nickname: user.nickname } })
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })
  return res
}
