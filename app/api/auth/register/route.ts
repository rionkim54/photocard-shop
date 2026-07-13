import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import db from '@/lib/db'
import { createSession, COOKIE_NAME } from '@/lib/session'

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()

  if (!email || !password || password.length < 6) {
    return NextResponse.json({ error: '이메일과 비밀번호(6자 이상)를 입력해주세요.' }, { status: 400 })
  }

  const hash = await bcrypt.hash(password, 10)

  try {
    const result = db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)').run(email, hash)
    const userId = result.lastInsertRowid as number
    const token = createSession(userId)

    const res = NextResponse.json({ user: { id: userId, email, nickname: null } })
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })
    return res
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : ''
    if (msg.includes('UNIQUE')) {
      return NextResponse.json({ error: '이미 사용 중인 이메일입니다.' }, { status: 409 })
    }
    return NextResponse.json({ error: '오류가 발생했습니다.' }, { status: 500 })
  }
}
