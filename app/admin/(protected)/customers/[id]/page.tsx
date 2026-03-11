import Link from 'next/link'
import { notFound } from 'next/navigation'
import { initDb, getCustomerById, getBookingsByCustomer, getAnimalsByBooking } from '@/lib/db'

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let customer: Awaited<ReturnType<typeof getCustomerById>> = null
  let bookings: Awaited<ReturnType<typeof getBookingsByCustomer>> = []
  let bookingAnimals: Record<string, Awaited<ReturnType<typeof getAnimalsByBooking>>> = {}

  try {
    await initDb()
    customer = await getCustomerById(id)
    if (!customer) notFound()
    bookings = await getBookingsByCustomer(id)
    await Promise.all(
      bookings.map(async (b) => {
        bookingAnimals[b.id] = await getAnimalsByBooking(b.id)
      })
    )
  } catch {
    notFound()
  }

  if (!customer) notFound()

  const totalSpent = bookings.reduce((sum, b) => sum + b.total_price, 0)

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/customers" className="text-sm text-gray-400 hover:text-[#FF6B35] font-semibold transition-colors">
          ← Customers
        </Link>
      </div>

      {/* Customer header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-fredoka text-3xl text-[#1A1A2E]">{customer.owner_name}</h1>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
              <span>✉️ {customer.email}</span>
              {customer.phone && <span>📞 {customer.phone}</span>}
              <span>🗓 Member since {new Date(customer.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Total Spent</p>
            <p className="font-fredoka text-3xl text-[#FF6B35]">${totalSpent}</p>
            <p className="text-xs text-gray-400">{bookings.length} booking{bookings.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      {/* Bookings */}
      <h2 className="font-extrabold text-[#1A1A2E] mb-3 text-lg">Booking History</h2>
      <div className="flex flex-col gap-4">
        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-gray-400 text-sm border border-gray-200">
            No bookings yet.
          </div>
        ) : (
          bookings.map((booking) => {
            const animals = bookingAnimals[booking.id] || []
            return (
              <div key={booking.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-extrabold text-[#1A1A2E] capitalize">{booking.package} Pack</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {booking.start_date
                        ? new Date(booking.start_date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })
                        : 'Date TBD'
                      }
                      {' · '}{booking.days} day{booking.days !== 1 ? 's' : ''}
                      {' · '}{booking.visits_per_day} visit{booking.visits_per_day !== 1 ? 's' : ''}/day
                      {booking.walks ? ' · walks' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-fredoka text-2xl text-[#FF6B35]">${booking.total_price}</p>
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-extrabold mt-1 ${
                      booking.status === 'upcoming' ? 'bg-blue-100 text-blue-700'
                      : booking.status === 'active' ? 'bg-green-100 text-green-700'
                      : booking.status === 'completed' ? 'bg-gray-100 text-gray-600'
                      : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>

                {animals.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {animals.map((a) => (
                      <div key={a.id} className="flex items-center gap-1.5 bg-gray-50 rounded-xl px-3 py-1.5 text-xs border border-gray-100">
                        <span>{a.type === 'cat' ? '🐱' : '🐶'}</span>
                        <span className="font-extrabold text-[#1A1A2E]">{a.name}</span>
                        {a.breed && <span className="text-gray-400">· {a.breed}</span>}
                        {a.age && <span className="text-gray-400">· {a.age}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
