'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
]

export default function Nav() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 transition-all duration-300 border-b-2 border-yellow ${
        scrolled ? 'bg-cream/95 backdrop-blur-md shadow-sm' : 'bg-cream/90 backdrop-blur-sm'
      }`}
    >
      {/* Logo */}
      <Link href="/" className="font-fredoka text-3xl tracking-wide select-none">
        <span className="text-orange">Paw</span>
        <span className="text-blue">Pal</span>
        <span className="ml-1">🐾</span>
      </Link>

      {/* Desktop links */}
      <ul className="hidden md:flex items-center gap-8 list-none">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className={`font-extrabold text-sm transition-colors duration-200 ${
                pathname === href ? 'text-orange' : 'text-dark hover:text-orange'
              }`}
            >
              {label}
            </Link>
          </li>
        ))}
        <li>
          <Link
            href="/booking"
            className="bg-orange text-white font-extrabold text-sm px-6 py-2.5 rounded-full transition-all duration-200 hover:bg-dark hover:scale-105"
          >
            Book Now
          </Link>
        </li>
      </ul>

      {/* Mobile hamburger */}
      <button
        className="md:hidden flex flex-col gap-1.5 p-2"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Toggle menu"
      >
        <span className={`block w-6 h-0.5 bg-dark transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
        <span className={`block w-6 h-0.5 bg-dark transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
        <span className={`block w-6 h-0.5 bg-dark transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-cream border-b-2 border-yellow shadow-lg py-4 flex flex-col items-center gap-4 md:hidden">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`font-extrabold text-base ${pathname === href ? 'text-orange' : 'text-dark'}`}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/booking"
            className="bg-orange text-white font-extrabold text-base px-8 py-3 rounded-full"
            onClick={() => setMenuOpen(false)}
          >
            Book Now 🐾
          </Link>
        </div>
      )}
    </nav>
  )
}
