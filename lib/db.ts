import { createClient } from '@libsql/client'
import { randomUUID } from 'crypto'

function getDb() {
  return createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  })
}

export async function initDb() {
  const db = getDb()
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      owner_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL,
      stripe_session_id TEXT UNIQUE,
      package TEXT NOT NULL,
      start_date TEXT,
      days INTEGER DEFAULT 7,
      visits_per_day INTEGER DEFAULT 1,
      walks INTEGER DEFAULT 0,
      total_price INTEGER NOT NULL,
      status TEXT DEFAULT 'upcoming',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (customer_id) REFERENCES customers(id)
    );
    CREATE TABLE IF NOT EXISTS animals (
      id TEXT PRIMARY KEY,
      booking_id TEXT NOT NULL,
      type TEXT NOT NULL,
      name TEXT NOT NULL,
      breed TEXT,
      age TEXT,
      notes TEXT,
      FOREIGN KEY (booking_id) REFERENCES bookings(id)
    );
  `)
}

export interface Customer {
  id: string
  owner_name: string
  email: string
  phone: string | null
  created_at: string
}

export interface Booking {
  id: string
  customer_id: string
  stripe_session_id: string | null
  package: string
  start_date: string | null
  days: number
  visits_per_day: number
  walks: number
  total_price: number
  status: string
  created_at: string
}

export interface Animal {
  id: string
  booking_id: string
  type: string
  name: string
  breed: string | null
  age: string | null
  notes: string | null
}

export async function findCustomerByEmail(email: string): Promise<Customer | null> {
  const db = getDb()
  const result = await db.execute({
    sql: 'SELECT * FROM customers WHERE email = ? LIMIT 1',
    args: [email],
  })
  return (result.rows[0] as unknown as Customer) || null
}

export async function createCustomer(data: {
  ownerName: string
  email: string
  phone?: string
}): Promise<Customer> {
  const db = getDb()
  const id = randomUUID()
  await db.execute({
    sql: 'INSERT INTO customers (id, owner_name, email, phone) VALUES (?, ?, ?, ?)',
    args: [id, data.ownerName, data.email, data.phone || null],
  })
  return { id, owner_name: data.ownerName, email: data.email, phone: data.phone || null, created_at: new Date().toISOString() }
}

export async function createBooking(data: {
  customerId: string
  stripeSessionId?: string
  package: string
  startDate?: string
  days?: number
  visitsPerDay?: number
  walks?: boolean
  totalPrice: number
  status?: string
}): Promise<Booking> {
  const db = getDb()
  const id = randomUUID()
  await db.execute({
    sql: `INSERT INTO bookings (id, customer_id, stripe_session_id, package, start_date, days, visits_per_day, walks, total_price, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      data.customerId,
      data.stripeSessionId || null,
      data.package,
      data.startDate || null,
      data.days ?? 7,
      data.visitsPerDay ?? 1,
      data.walks ? 1 : 0,
      data.totalPrice,
      data.status || 'upcoming',
    ],
  })
  return {
    id,
    customer_id: data.customerId,
    stripe_session_id: data.stripeSessionId || null,
    package: data.package,
    start_date: data.startDate || null,
    days: data.days ?? 7,
    visits_per_day: data.visitsPerDay ?? 1,
    walks: data.walks ? 1 : 0,
    total_price: data.totalPrice,
    status: data.status || 'upcoming',
    created_at: new Date().toISOString(),
  }
}

export async function createAnimal(data: {
  bookingId: string
  type: string
  name: string
  breed?: string
  age?: string
  notes?: string
}): Promise<Animal> {
  const db = getDb()
  const id = randomUUID()
  await db.execute({
    sql: 'INSERT INTO animals (id, booking_id, type, name, breed, age, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
    args: [id, data.bookingId, data.type, data.name, data.breed || null, data.age || null, data.notes || null],
  })
  return { id, booking_id: data.bookingId, type: data.type, name: data.name, breed: data.breed || null, age: data.age || null, notes: data.notes || null }
}

export async function getCustomers(): Promise<Customer[]> {
  const db = getDb()
  const result = await db.execute('SELECT * FROM customers ORDER BY created_at DESC')
  return result.rows as unknown as Customer[]
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  const db = getDb()
  const result = await db.execute({ sql: 'SELECT * FROM customers WHERE id = ?', args: [id] })
  return (result.rows[0] as unknown as Customer) || null
}

export async function getBookings(): Promise<(Booking & { owner_name: string; email: string })[]> {
  const db = getDb()
  const result = await db.execute(`
    SELECT b.*, c.owner_name, c.email
    FROM bookings b
    JOIN customers c ON b.customer_id = c.id
    ORDER BY b.created_at DESC
  `)
  return result.rows as unknown as (Booking & { owner_name: string; email: string })[]
}

export async function getBookingsByCustomer(customerId: string): Promise<Booking[]> {
  const db = getDb()
  const result = await db.execute({
    sql: 'SELECT * FROM bookings WHERE customer_id = ? ORDER BY created_at DESC',
    args: [customerId],
  })
  return result.rows as unknown as Booking[]
}

export async function getAnimalsByBooking(bookingId: string): Promise<Animal[]> {
  const db = getDb()
  const result = await db.execute({
    sql: 'SELECT * FROM animals WHERE booking_id = ?',
    args: [bookingId],
  })
  return result.rows as unknown as Animal[]
}

export async function getStats() {
  const db = getDb()
  const today = new Date().toISOString().split('T')[0]

  const [totalBookings, totalCustomers, weekRevenue, todayBookings] = await Promise.all([
    db.execute('SELECT COUNT(*) as count FROM bookings'),
    db.execute('SELECT COUNT(*) as count FROM customers'),
    db.execute({
      sql: `SELECT COALESCE(SUM(total_price), 0) as total FROM bookings WHERE created_at >= datetime('now', '-7 days')`,
      args: [],
    }),
    db.execute({
      sql: 'SELECT b.*, c.owner_name FROM bookings b JOIN customers c ON b.customer_id = c.id WHERE b.start_date = ? ORDER BY b.created_at',
      args: [today],
    }),
  ])

  return {
    totalBookings: Number((totalBookings.rows[0] as Record<string, unknown>).count),
    totalCustomers: Number((totalCustomers.rows[0] as Record<string, unknown>).count),
    weekRevenue: Number((weekRevenue.rows[0] as Record<string, unknown>).total),
    todayBookings: todayBookings.rows as unknown as (Booking & { owner_name: string })[],
  }
}

export async function updateBookingStatus(id: string, status: string) {
  const db = getDb()
  await db.execute({ sql: 'UPDATE bookings SET status = ? WHERE id = ?', args: [status, id] })
}
