import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken, ADMIN_COOKIE } from '@/lib/auth'
import { initDb, getStats } from '@/lib/db'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE)?.value
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await initDb()
    const stats = await getStats()
    return NextResponse.json(stats)
  } catch (err) {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}
