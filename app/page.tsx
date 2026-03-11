import Link from 'next/link'

const steps = [
  { num: 1, emoji: '📋', title: 'Book Online', desc: 'Choose your package, pick your week, and complete checkout in minutes.', color: 'bg-orange' },
  { num: 2, emoji: '🤝', title: 'We Connect', desc: "We'll text or call you to confirm details and meet your pup before the week starts.", color: 'bg-blue' },
  { num: 3, emoji: '🏠', title: 'We Come to You', desc: 'We visit your home so your dog stays comfortable in their own familiar space.', color: 'bg-green' },
  { num: 4, emoji: '📸', title: 'Photo Updates', desc: "We send you pics every visit so you know your pup is happy the whole time.", color: 'bg-pink' },
]

const testimonials = [
  { name: 'Sarah M.', dog: 'Labrador mom', quote: "PawPal took amazing care of our lab Tucker while we were on vacation! The daily photo updates gave us such peace of mind. Will absolutely book again.", stars: 5, emoji: '🐕' },
  { name: 'Jake T.', dog: 'Golden owner', quote: "Best decision we made for our trip. Bella was so happy and well-fed. Loved coming home to a happy dog instead of a stressed one!", stars: 5, emoji: '🦮' },
  { name: 'Maria R.', dog: 'Beagle parent', quote: "Super professional and clearly love dogs. Our beagle Max has separation anxiety but he was totally fine with PawPal. Cannot recommend enough.", stars: 5, emoji: '🐶' },
]

const packages = [
  {
    icon: '🥣',
    name: 'Basic Pack',
    tagline: '1 drop-in per day, 7 days',
    price: '$125',
    sub: '/ week',
    features: ['7 drop-in visits (1/day)', 'Feeding & fresh water', 'Potty break outside', 'Photo update each visit'],
    color: 'bg-orange',
    href: '/booking?pkg=basic',
  },
  {
    icon: '🦮',
    name: 'Standard Pack',
    tagline: '2 drop-ins per day, 7 days',
    price: '$220',
    sub: '/ week',
    features: ['14 drop-in visits (2/day)', 'Feeding & fresh water', 'Potty breaks & play', 'Multiple daily photo updates'],
    color: 'bg-blue',
    featured: true,
    href: '/booking?pkg=standard',
  },
  {
    icon: '⭐',
    name: 'Premium Pack',
    tagline: '2 visits + 1 walk per day',
    price: '$350',
    sub: '/ week',
    features: ['14 drop-in visits (2/day)', '7 neighborhood walks', 'Feeding & fresh water', 'Full daily photo recap'],
    color: 'bg-green',
    href: '/booking?pkg=premium',
  },
]

export default function HomePage() {
  return (
    <>
      {/* ── HERO ── */}
      <section
        className="min-h-screen flex items-center justify-center text-center px-5 py-20 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #fff8e1 0%, #ffe8d6 50%, #e8f5e9 100%)' }}
      >
        {/* Blobs */}
        <div className="absolute w-[400px] h-[400px] rounded-full blur-[60px] opacity-35 bg-yellow -top-24 -left-24 animate-float" />
        <div className="absolute w-[300px] h-[300px] rounded-full blur-[60px] opacity-35 bg-pink -bottom-20 -right-20 animate-float-2" />
        <div className="absolute w-[250px] h-[250px] rounded-full blur-[60px] opacity-35 bg-blue top-[40%] left-[60%] animate-float-4" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-block bg-yellow text-dark font-extrabold text-xs px-5 py-2 rounded-full mb-6 tracking-widest uppercase animate-pop-in">
            📍 Philadelphia, MS
          </div>
          <span className="text-8xl block mb-4 animate-waggle">🐕</span>
          <h1 className="font-fredoka leading-none mb-3 animate-pop-in-1" style={{ fontSize: 'clamp(3.5rem, 9vw, 6rem)' }}>
            <span className="text-orange">Paw</span>
            <span className="text-blue">Pal</span>
          </h1>
          <p className="font-extrabold text-gray-600 mb-2 animate-pop-in-2" style={{ fontSize: 'clamp(1.1rem, 3vw, 1.4rem)' }}>
            Your dog deserves a <strong className="text-orange">best friend</strong> when you're away.
          </p>
          <p className="text-sm font-semibold text-gray-400 mb-8 animate-pop-in-2">
            In-home drop-in visits, feeding, walks & more — right in Philadelphia.
          </p>
          <div className="flex gap-4 justify-center flex-wrap animate-pop-in-3">
            <Link href="/booking" className="btn-primary">Book a Visit 🐾</Link>
            <a href="tel:6015758053" className="btn-secondary">Call / Text Us</a>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-white py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="section-label">The Process</span>
            <h2 className="section-title">Simple as a tail wag 🐶</h2>
            <p className="section-sub mx-auto">Getting started takes two minutes. We come to your home — no kennels, no stress.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s) => (
              <div
                key={s.num}
                className="text-center px-6 py-9 rounded-3xl bg-cream border-[2.5px] border-transparent transition-all duration-200 hover:-translate-y-1.5 hover:border-yellow"
              >
                <div className={`w-12 h-12 ${s.color} rounded-full flex items-center justify-center font-fredoka text-2xl text-white mx-auto mb-4`}>
                  {s.num}
                </div>
                <span className="text-4xl block mb-3">{s.emoji}</span>
                <h3 className="font-fredoka text-xl mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PACKAGES PREVIEW ── */}
      <section className="bg-cream py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <span className="section-label">Services & Pricing</span>
            <h2 className="section-title">Pick your pack 🐾</h2>
            <p className="section-sub">One week of care, three ways to do it. All visits happen at YOUR home.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`bg-white rounded-3xl p-10 border-[3px] relative overflow-hidden transition-all duration-200 hover:-translate-y-2 hover:border-yellow hover:shadow-xl ${
                  pkg.featured ? 'border-orange shadow-[0_12px_40px_rgba(255,107,53,0.15)]' : 'border-transparent'
                }`}
              >
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${pkg.color}`} />
                {pkg.featured && (
                  <span className="absolute top-4 right-4 bg-yellow text-dark text-[0.7rem] font-extrabold px-3 py-1 rounded-full uppercase tracking-wide">
                    Most Popular
                  </span>
                )}
                <span className="text-5xl block mb-4">{pkg.icon}</span>
                <h3 className="font-fredoka text-2xl mb-1">{pkg.name}</h3>
                <p className="text-sm text-gray-500 mb-5">{pkg.tagline}</p>
                <div className="font-fredoka text-5xl text-orange leading-none mb-1">
                  {pkg.price} <span className="text-base text-gray-400 font-nunito font-semibold">{pkg.sub}</span>
                </div>
                <ul className="mt-5 flex flex-col gap-2.5">
                  {pkg.features.map((f) => (
                    <li key={f} className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-green flex items-center justify-center text-white text-[0.65rem] font-extrabold flex-shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={pkg.href}
                  className="block text-center mt-7 py-3.5 rounded-full bg-dark text-white font-extrabold text-sm transition-all duration-200 hover:bg-orange hover:scale-[1.03]"
                >
                  Book This
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center mt-7 text-gray-400 text-sm">
            Need something custom?{' '}
            <Link href="/booking?pkg=custom" className="text-orange font-bold hover:underline">Build your own package →</Link>
          </p>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="bg-dark text-white py-24 px-5">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="section-label text-yellow">Who We Are</span>
            <h2 className="section-title text-white">Your neighborhood dog lover 🐶</h2>
            <p className="section-sub text-white/70">
              We're based right here in Philadelphia, MS — so we know the area and we know dogs. Every visit is personal, attentive, and given with genuine care.
            </p>
            <div className="flex flex-col gap-5 mt-8">
              {[
                { icon: '🏡', title: 'In Your Home', desc: "Your dog stays in their safe, familiar space — no kennels or strange environments." },
                { icon: '📱', title: 'Always in Touch', desc: "You'll get photo updates and check-in texts so you never have to worry." },
                { icon: '❤️', title: 'Real Dog People', desc: "We genuinely love dogs. Your pup will actually look forward to our visits." },
              ].map((h) => (
                <div key={h.title} className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-2xl p-5">
                  <span className="text-3xl flex-shrink-0">{h.icon}</span>
                  <div>
                    <h4 className="font-extrabold text-yellow mb-1">{h.title}</h4>
                    <p className="text-sm text-white/60 leading-relaxed">{h.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            className="rounded-3xl flex items-center justify-center min-h-[380px] text-[8rem] relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #FF6B35, #FF6B9D)' }}
          >
            🐾
            <span className="absolute text-[12rem] opacity-10 -bottom-5 -right-5 rotate-[20deg]">🐾</span>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="bg-white py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="section-label">Happy Pup Parents</span>
            <h2 className="section-title">Tails are wagging 🐕</h2>
            <p className="section-sub mx-auto">Don't just take our word for it — hear from dog parents in Philadelphia.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-cream rounded-3xl p-8 border-[2.5px] border-transparent hover:border-yellow transition-all duration-200 hover:-translate-y-1">
                <div className="text-4xl mb-4">{t.emoji}</div>
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <span key={i} className="text-yellow text-lg">★</span>
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-5 italic">"{t.quote}"</p>
                <div>
                  <p className="font-extrabold text-dark text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.dog}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section
        className="py-20 px-5 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FF6B9D 100%)' }}
      >
        <div className="absolute text-[14rem] opacity-5 -top-10 -left-10 rotate-[-20deg]">🐾</div>
        <div className="absolute text-[14rem] opacity-5 -bottom-10 -right-10 rotate-[20deg]">🐾</div>
        <div className="relative z-10">
          <h2 className="font-fredoka text-4xl md:text-5xl text-white mb-4">Ready to book your week? 🐾</h2>
          <p className="text-white/80 font-semibold mb-8 text-base max-w-md mx-auto">
            Secure your spot now. One week of in-home care — your dog will love every visit.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/booking" className="bg-white text-orange font-extrabold px-9 py-4 rounded-full hover:bg-dark hover:text-white transition-all duration-200 text-base hover:scale-105">
              Book Now 🐾
            </Link>
            <a href="tel:6015758053" className="bg-white/10 border-2 border-white text-white font-extrabold px-9 py-4 rounded-full hover:bg-white hover:text-orange transition-all duration-200 text-base">
              (601) 575-8053
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
