import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken, ADMIN_COOKIE } from '@/lib/auth'
import {
  initDb,
  getBookings,
  findCustomerByEmail,
  createCustomer,
  createBooking,
  createAnimal,
} from '@/lib/db'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE)?.value
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await initDb()
    const bookings = await getBookings()
    return NextResponse.json(bookings)
  } catch {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE)?.value
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { ownerName, email, phone, pkg, startDate, days, visitsPerDay, walks, totalPrice, animals } = body

    if (!ownerName || !email || !totalPrice) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await initDb()

    let customer = await findCustomerByEmail(email)
    if (!customer) {
      customer = await createCustomer({ ownerName, email, phone })
    }

    const booking = await createBooking({
      customerId: customer.id,
      package: pkg || 'custom',
      startDate: startDate || undefined,
      days: days || 7,
      visitsPerDay: visitsPerDay || 1,
      walks: !!walks,
      totalPrice: Number(totalPrice),
      status: 'upcoming',
    })

    if (Array.isArray(animals)) {
      for (const a of animals) {
        if (a.name) {
          await createAnimal({
            bookingId: booking.id,
            type: a.type || 'dog',
            name: a.name,
            breed: a.breed || undefined,
            age: a.age || undefined,
            notes: a.notes || undefined,
          })
        }
      }
    }

    return NextResponse.json({ ok: true, bookingId: booking.id })
  } catch (err) {
    console.error('[admin/bookings POST]', err)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}
