import { randomUUID } from 'crypto'
import { cookies } from 'next/headers'
import db from './db'

const SESSION_DAYS = 30
const COOKIE_NAME = 'ks_session'

interface SessionUser {
  id: number
  email: string
  nickname: string | null
}

export function createSession(userId: number): string {
  const token = randomUUID()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + SESSION_DAYS)
  db.prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)').run(
    token, userId, expiresAt.toISOString()
  )
  return token
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null

  const row = db.prepare(`
    SELECT u.id, u.email, u.nickname
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.token = ? AND s.expires_at > datetime('now')
  `).get(token) as SessionUser | undefined

  return row ?? null
}

export async function deleteSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (token) db.prepare('DELETE FROM sessions WHERE token = ?').run(token)
}

export function setSessionCookie(response: Response & { cookies: { set: Function } }, token: string) {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * SESSION_DAYS,
    path: '/',
  })
}

export { COOKIE_NAME }
