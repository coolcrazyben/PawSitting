import { NextRequest, NextResponse } from 'next/server'
import { signToken, ADMIN_COOKIE } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  const adminPassword = (process.env.ADMIN_PASSWORD || '').trim()
  if (!adminPassword || password.trim() !== adminPassword) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
  }

  const token = signToken()
  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
  return res
}
