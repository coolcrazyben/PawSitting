import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Services & Packages — PawPal',
  description: 'PawPal dog sitting packages for your one-week stay. Basic, Standard, Premium, and Custom options with Stripe checkout.',
}

const packages = [
  {
    icon: '🥣',
    name: 'Basic Pack',
    price: 125,
    priceStr: '$125',
    period: '/ week',
    tagline: '1 drop-in visit per day',
    desc: 'Perfect if your pup is low-maintenance. One visit per day covers feeding, a potty break, and some cuddle time.',
    features: [
      '7 drop-in visits (1 per day)',
      'Feeding & fresh water refresh',
      'Outdoor potty break',
      'Play & cuddle time',
      'Photo update after each visit',
      'Text confirmation daily',
    ],
    color: 'bg-orange',
    href: '/booking?pkg=basic',
    accentClass: 'border-orange shadow-[0_12px_40px_rgba(255,107,53,0.12)]',
  },
  {
    icon: '🦮',
    name: 'Standard Pack',
    price: 220,
    priceStr: '$220',
    period: '/ week',
    tagline: '2 drop-in visits per day',
    desc: 'Our most popular option. Twice-daily visits mean your dog is never alone for more than 8 hours.',
    features: [
      '14 drop-in visits (2 per day)',
      'Morning & afternoon visits',
      'Feeding, water & potty breaks',
      'Extended play sessions',
      'Multiple daily photo updates',
      'Priority response / check-ins',
    ],
    color: 'bg-blue',
    featured: true,
    href: '/booking?pkg=standard',
    accentClass: 'border-blue shadow-[0_12px_40px_rgba(77,150,255,0.15)]',
  },
  {
    icon: '⭐',
    name: 'Premium Pack',
    price: 350,
    priceStr: '$350',
    period: '/ week',
    tagline: '2 visits + 1 walk per day',
    desc: 'The full treatment. Two visits and a neighborhood walk every single day keeps your pup active and happy.',
    features: [
      '14 drop-in visits (2 per day)',
      '7 neighborhood walks (30 min)',
      'All feeding & water service',
      'Full daily activity recap',
      'Abundant photo & video updates',
      'Dedicated caretaker the whole week',
    ],
    color: 'bg-green',
    href: '/booking?pkg=premium',
    accentClass: 'border-green shadow-[0_12px_40px_rgba(107,203,119,0.12)]',
  },
]

const faqs = [
  {
    q: 'What does a typical visit look like?',
    a: "We arrive at your home, let ourselves in with a key or code you provide, give your dog fresh food and water, take them outside for a potty break, spend time playing or cuddling, take a photo update, and then lock up. Each visit is 30–45 minutes.",
  },
  {
    q: 'How far in advance do I need to book?',
    a: "We recommend booking at least a week in advance to guarantee your preferred dates. Last-minute bookings (24–48 hours) may be available — just call or text us at (601) 575-8053.",
  },
  {
    q: 'What is the cancellation policy?',
    a: "Cancellations made 72+ hours before the service week starts receive a full refund. Cancellations within 72 hours receive a 50% refund. No refunds for cancellations within 24 hours of the start date.",
  },
  {
    q: 'Do you care for multiple dogs?',
    a: "Absolutely! If you have more than one dog, just mention it in the booking notes. For 2+ dogs we add a small multi-dog fee (typically $10–$20/week depending on the pack size). We'll confirm pricing before checkout.",
  },
  {
    q: 'What areas do you serve?',
    a: "We serve Philadelphia, MS and surrounding areas within approximately 15 miles. If you're not sure whether we cover your area, give us a call at (601) 575-8053.",
  },
  {
    q: 'What if my dog has medical needs or special instructions?',
    a: "No problem — just let us know in the booking form. We can handle medication administration, special diets, and other specific care instructions. For complex medical needs, we'll chat with you before confirming.",
  },
  {
    q: 'How will I receive photo updates?',
    a: "We send photos and/or short video clips directly to your phone via text message after each visit. You'll always know your pup is happy and safe.",
  },
  {
    q: 'Is my home secure during visits?',
    a: "Absolutely. We treat your home with the utmost respect. Key codes or keys are kept securely and never shared. We always double-check that doors and gates are locked before leaving.",
  },
]

export default function ServicesPage() {
  return (
    <>
      {/* Header */}
      <section
        className="py-20 px-5 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #fff8e1 0%, #ffe8d6 60%, #e8f4ff 100%)' }}
      >
        <div className="absolute w-[350px] h-[350px] rounded-full blur-[70px] opacity-30 bg-yellow -top-20 -left-20 animate-float" />
        <div className="absolute w-[300px] h-[300px] rounded-full blur-[70px] opacity-25 bg-blue -bottom-16 -right-16 animate-float-2" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="section-label">Services & Pricing</span>
          <h1 className="font-fredoka leading-tight mb-4" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
            Pick your perfect pack 🐾
          </h1>
          <p className="section-sub mx-auto">
            One service week, three ways to do it — or build your own. All visits happen at YOUR home.
          </p>
        </div>
      </section>

      {/* Packages */}
      <section className="bg-cream py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`bg-white rounded-3xl p-10 border-[3px] relative overflow-hidden transition-all duration-200 hover:-translate-y-2 hover:shadow-2xl ${
                  pkg.featured ? pkg.accentClass : 'border-transparent'
                }`}
              >
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${pkg.color}`} />
                {pkg.featured && (
                  <span className="absolute top-4 right-4 bg-yellow text-dark text-[0.7rem] font-extrabold px-3 py-1 rounded-full uppercase tracking-wide">
                    Most Popular
                  </span>
                )}
                <span className="text-5xl block mb-5">{pkg.icon}</span>
                <h2 className="font-fredoka text-3xl mb-1">{pkg.name}</h2>
                <p className="text-sm text-gray-400 mb-4 font-semibold">{pkg.tagline}</p>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">{pkg.desc}</p>
                <div className="font-fredoka text-5xl text-orange leading-none mb-1">
                  {pkg.priceStr}
                  <span className="text-base text-gray-400 font-nunito font-semibold ml-1">{pkg.period}</span>
                </div>
                <ul className="mt-6 flex flex-col gap-3">
                  {pkg.features.map((f) => (
                    <li key={f} className="text-sm text-gray-600 flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-green flex items-center justify-center text-white text-[0.65rem] font-extrabold flex-shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={pkg.href}
                  className="block text-center mt-8 py-3.5 rounded-full bg-dark text-white font-extrabold text-sm transition-all duration-200 hover:bg-orange hover:scale-[1.03]"
                >
                  Book This Pack
                </Link>
              </div>
            ))}
          </div>

          {/* Custom package callout */}
          <div className="mt-10 bg-dark text-white rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-fredoka text-2xl text-yellow mb-2">Need something custom? ✏️</h3>
              <p className="text-white/60 text-sm max-w-sm leading-relaxed">
                Choose your own number of days (1–7), visits per day (1–2), and add a walk for just +$5/day. Pricing calculated live.
              </p>
            </div>
            <Link
              href="/booking?pkg=custom"
              className="bg-orange text-white font-extrabold px-8 py-4 rounded-full whitespace-nowrap hover:bg-yellow hover:text-dark transition-all duration-200 hover:scale-105"
            >
              Build Your Pack →
            </Link>
          </div>
        </div>
      </section>

      {/* What's included section */}
      <section className="bg-white py-20 px-5">
        <div className="max-w-3xl mx-auto text-center">
          <span className="section-label">Every Visit Includes</span>
          <h2 className="section-title">No extras, no surprises 🐶</h2>
          <p className="section-sub mx-auto mb-12">Every single visit — Basic through Premium — includes all of this:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {[
              { icon: '🥣', label: 'Feeding & Fresh Water' },
              { icon: '🚽', label: 'Potty Break Outside' },
              { icon: '🫂', label: 'Play & Cuddle Time' },
              { icon: '📸', label: 'Photo Update Sent' },
              { icon: '🔒', label: 'Home Secured After' },
              { icon: '💬', label: 'Visit Recap Text' },
            ].map((item) => (
              <div key={item.label} className="bg-cream rounded-2xl p-6 flex flex-col items-center gap-2 border-2 border-transparent hover:border-yellow transition-all duration-200">
                <span className="text-3xl">{item.icon}</span>
                <p className="font-extrabold text-sm text-dark text-center">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-cream py-24 px-5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <span className="section-label">Got Questions?</span>
            <h2 className="section-title">Frequently Asked Questions 🐾</h2>
            <p className="section-sub mx-auto">Everything you need to know before booking.</p>
          </div>
          <div className="flex flex-col gap-4">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="bg-white rounded-2xl border-2 border-transparent hover:border-yellow transition-all duration-200 group"
              >
                <summary className="flex items-center justify-between px-7 py-5 cursor-pointer list-none font-extrabold text-dark">
                  <span>{faq.q}</span>
                  <span className="text-orange font-fredoka text-xl ml-4 group-open:rotate-45 transition-transform duration-200">+</span>
                </summary>
                <p className="px-7 pb-6 text-sm text-gray-500 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-dark py-20 px-5 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="font-fredoka text-4xl text-white mb-4">Ready to book? 🐾</h2>
          <p className="text-white/60 mb-8 text-sm leading-relaxed">
            Secure your week online in minutes. Or reach out directly — we're happy to answer any questions.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/booking" className="bg-orange text-white font-extrabold px-9 py-4 rounded-full hover:bg-yellow hover:text-dark transition-all duration-200 hover:scale-105">
              Book Now 🐾
            </Link>
            <Link href="/contact" className="bg-white/10 border-2 border-white/30 text-white font-extrabold px-9 py-4 rounded-full hover:bg-white hover:text-dark transition-all duration-200">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
