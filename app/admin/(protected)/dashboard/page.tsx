import { initDb, getStats } from '@/lib/db'

function StatCard({ label, value, icon, sub }: { label: string; value: string; icon: string; sub?: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">{label}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="font-fredoka text-4xl text-[#1A1A2E]">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

export default async function DashboardPage() {
  let stats = { totalBookings: 0, totalCustomers: 0, weekRevenue: 0, todayBookings: [] as { id: string; owner_name: string; package: string; start_date: string | null; status: string }[] }

  try {
    await initDb()
    stats = await getStats()
  } catch {
    // DB not configured yet
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-fredoka text-3xl text-[#1A1A2E]">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">Overview of PawPal bookings and revenue</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Bookings" value={String(stats.totalBookings)} icon="📅" />
        <StatCard label="Customers" value={String(stats.totalCustomers)} icon="👥" />
        <StatCard label="Revenue (7 days)" value={`$${stats.weekRevenue}`} icon="💰" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-extrabold text-[#1A1A2E]">Starting Today</h2>
        </div>
        {stats.todayBookings.length === 0 ? (
          <div className="px-6 py-10 text-center text-gray-400 text-sm">No bookings starting today.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-3 text-left">Owner</th>
                <th className="px-6 py-3 text-left">Package</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.todayBookings.map((b) => (
                <tr key={b.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-[#1A1A2E]">{b.owner_name}</td>
                  <td className="px-6 py-4 capitalize text-gray-600">{b.package}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-extrabold ${
                      b.status === 'upcoming' ? 'bg-blue-100 text-blue-700'
                      : b.status === 'active' ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
