import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-dark text-white/60 py-12 px-5 text-center text-sm">
      <span className="font-fredoka text-3xl text-orange block mb-3">PawPal 🐾</span>
      <p className="mb-2">Serving Philadelphia, MS and surrounding areas</p>
      <p className="mb-5">
        <a href="tel:6015758053" className="text-yellow hover:text-white transition-colors">(601) 575-8053</a>
        <span className="mx-3">·</span>
        <a href="mailto:pfpeebles@gmail.com" className="text-yellow hover:text-white transition-colors">pfpeebles@gmail.com</a>
        <span className="mx-3">·</span>
        <span>Philadelphia, MS</span>
      </p>
      <div className="flex justify-center gap-6 mb-6 flex-wrap">
        {[
          { href: '/', label: 'Home' },
          { href: '/services', label: 'Services' },
          { href: '/booking', label: 'Book Now' },
          { href: '/contact', label: 'Contact' },
        ].map(({ href, label }) => (
          <Link key={href} href={href} className="text-white/50 hover:text-yellow transition-colors font-semibold text-xs uppercase tracking-wider">
            {label}
          </Link>
        ))}
      </div>
      <p className="text-xs opacity-40">© {new Date().getFullYear()} PawPal. All rights reserved.</p>
    </footer>
  )
}
