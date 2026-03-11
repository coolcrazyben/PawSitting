import Link from 'next/link'
import { initDb, getCustomers, getBookings, getAnimalsByBooking } from '@/lib/db'

export default async function CustomersPage() {
  let customers: Awaited<ReturnType<typeof getCustomers>> = []
  let bookings: Awaited<ReturnType<typeof getBookings>> = []

  try {
    await initDb()
    ;[customers, bookings] = await Promise.all([getCustomers(), getBookings()])
  } catch {
    // DB not configured
  }

  // Build a map: customerId -> latest booking date & animal count
  const customerMeta: Record<string, { latestBooking: string | null; bookingCount: number }> = {}
  for (const b of bookings) {
    if (!customerMeta[b.customer_id]) {
      customerMeta[b.customer_id] = { latestBooking: b.start_date, bookingCount: 0 }
    }
    customerMeta[b.customer_id].bookingCount++
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-fredoka text-3xl text-[#1A1A2E]">Customers</h1>
        <p className="text-sm text-gray-400 mt-1">{customers.length} total customers</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {customers.length === 0 ? (
          <div className="px-6 py-16 text-center text-gray-400 text-sm">
            No customers yet. They appear automatically after a completed booking.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Phone</th>
                <th className="px-6 py-3 text-left">Bookings</th>
                <th className="px-6 py-3 text-left">Member Since</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => {
                const meta = customerMeta[c.id] || { latestBooking: null, bookingCount: 0 }
                return (
                  <tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-[#1A1A2E]">{c.owner_name}</td>
                    <td className="px-6 py-4 text-gray-600">{c.email}</td>
                    <td className="px-6 py-4 text-gray-600">{c.phone || '—'}</td>
                    <td className="px-6 py-4 font-extrabold text-[#FF6B35]">{meta.bookingCount}</td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/customers/${c.id}`}
                        className="text-xs font-extrabold text-[#FF6B35] hover:underline"
                      >
                        View →
                      </Link>
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
