'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/customers', label: 'Customers', icon: '👥' },
  { href: '/admin/bookings', label: 'Bookings', icon: '📅' },
  { href: '/admin/add-booking', label: 'Add Booking', icon: '➕' },
]

export default function Sidebar() {
  const pathname = usePathname()

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    window.location.href = '/admin'
  }

  return (
    <aside className="w-56 bg-[#1A1A2E] flex flex-col flex-shrink-0">
      <div className="px-5 py-6 border-b border-white/10">
        <p className="font-fredoka text-xl text-[#FF6B35]">PawPal 🐾</p>
        <p className="text-xs text-white/40 font-semibold uppercase tracking-wider mt-0.5">Admin</p>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {links.map((link) => {
          const active = pathname === link.href || pathname.startsWith(link.href + '/')
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                active
                  ? 'bg-[#FF6B35] text-white'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 pb-5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-white/60 hover:bg-white/10 hover:text-white transition-all duration-150"
        >
          <span>🚪</span>
          Logout
        </button>
      </div>
    </aside>
  )
}
