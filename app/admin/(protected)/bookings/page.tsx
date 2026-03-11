import Link from 'next/link'
import { initDb, getBookings, getAnimalsByBooking } from '@/lib/db'

export default async function BookingsPage() {
  let bookings: Awaited<ReturnType<typeof getBookings>> = []
  let bookingAnimals: Record<string, Awaited<ReturnType<typeof getAnimalsByBooking>>> = {}

  try {
    await initDb()
    bookings = await getBookings()
    await Promise.all(
      bookings.map(async (b) => {
        bookingAnimals[b.id] = await getAnimalsByBooking(b.id)
      })
    )
  } catch {
    // DB not configured
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-fredoka text-3xl text-[#1A1A2E]">Bookings</h1>
          <p className="text-sm text-gray-400 mt-1">{bookings.length} total bookings</p>
        </div>
        <Link
          href="/admin/add-booking"
          className="px-5 py-2.5 bg-[#FF6B35] text-white rounded-full font-extrabold text-sm hover:bg-[#1A1A2E] transition-colors"
        >
          + Add Booking
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {bookings.length === 0 ? (
          <div className="px-6 py-16 text-center text-gray-400 text-sm">
            No bookings yet. Complete a checkout or add one manually.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-3 text-left">Owner</th>
                <th className="px-6 py-3 text-left">Package</th>
                <th className="px-6 py-3 text-left">Animals</th>
                <th className="px-6 py-3 text-left">Start Date</th>
                <th className="px-6 py-3 text-left">Total</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Booked</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => {
                const animals = bookingAnimals[b.id] || []
                return (
                  <tr key={b.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/customers/${b.customer_id}`}
                        className="font-semibold text-[#1A1A2E] hover:text-[#FF6B35] transition-colors"
                      >
                        {b.owner_name}
                      </Link>
                      <p className="text-xs text-gray-400">{b.email}</p>
                    </td>
                    <td className="px-6 py-4 capitalize text-gray-600">{b.package}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {animals.map((a) => (
                          <span key={a.id} className="text-xs bg-gray-100 rounded-full px-2 py-0.5 font-semibold">
                            {a.type === 'cat' ? '🐱' : '🐶'} {a.name}
                          </span>
                        ))}
                        {animals.length === 0 && <span className="text-gray-400">—</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {b.start_date
                        ? new Date(b.start_date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : '—'}
                    </td>
                    <td className="px-6 py-4 font-extrabold text-[#FF6B35]">${b.total_price}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-extrabold ${
                        b.status === 'upcoming' ? 'bg-blue-100 text-blue-700'
                        : b.status === 'active' ? 'bg-green-100 text-green-700'
                        : b.status === 'completed' ? 'bg-gray-100 text-gray-600'
                        : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs">
                      {new Date(b.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
