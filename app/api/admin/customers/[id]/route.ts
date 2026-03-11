import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken, ADMIN_COOKIE } from '@/lib/auth'
import { initDb, getCustomerById, getBookingsByCustomer, getAnimalsByBooking } from '@/lib/db'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE)?.value
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    await initDb()
    const customer = await getCustomerById(id)
    if (!customer) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const bookings = await getBookingsByCustomer(id)
    const bookingsWithAnimals = await Promise.all(
      bookings.map(async (b) => ({
        ...b,
        animals: await getAnimalsByBooking(b.id),
      }))
    )

    return NextResponse.json({ customer, bookings: bookingsWithAnimals })
  } catch {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}
