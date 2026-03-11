import type { Metadata } from 'next'
import Link from 'next/link'
import Stripe from 'stripe'

export const metadata: Metadata = {
  title: 'Booking Confirmed - PawPal',
}

interface Animal {
  type: string
  name: string
  breed: string
  age: string
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const params = await searchParams
  const sessionId = params?.session_id
  let animals: Animal[] = []
  let ownerName = ''
  let startDate = ''

  if (sessionId) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2024-06-20',
      })
      const session = await stripe.checkout.sessions.retrieve(sessionId)
      const meta = session.metadata || {}
      ownerName = meta.ownerName || ''
      startDate = meta.startDate || ''
      const count = parseInt(meta.animal_count || '0')
      for (let i = 0; i < count; i++) {
        animals.push({
          type: meta[`animal_${i}_type`] || 'dog',
          name: meta[`animal_${i}_name`] || '',
          breed: meta[`animal_${i}_breed`] || '',
          age: meta[`animal_${i}_age`] || '',
        })
      }
    } catch {
      // Session retrieval failed — show generic confirmation
    }
  }

  return (
    <section
      className="min-h-screen flex items-center justify-center px-5 py-20 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #e8f5e9 0%, #fff8e1 50%, #ffe8d6 100%)' }}
    >
      <div className="absolute w-[350px] h-[350px] rounded-full blur-[70px] opacity-30 bg-green -top-20 -left-20 animate-float" />
      <div className="absolute w-[300px] h-[300px] rounded-full blur-[70px] opacity-25 bg-yellow -bottom-16 -right-16 animate-float-2" />

      <div className="relative z-10 max-w-lg w-full bg-white rounded-3xl p-10 shadow-xl border-[3px] border-green text-center animate-pop-in">
        <span className="text-7xl block mb-5">🎉</span>
        <span className="inline-block bg-green text-white text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider mb-5">
          Booking Confirmed!
        </span>
        <h1 className="font-fredoka text-4xl text-dark mb-3">
          {ownerName ? `Woof! You're all set, ${ownerName.split(' ')[0]}!` : "Woof! You're all set!"}
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          Your payment was processed successfully. We will reach out via text or email within a few hours
          to confirm visit times, meet-and-greet details, and collect any remaining info.
        </p>

        {/* Animals summary */}
        {animals.length > 0 && (
          <div className="bg-cream rounded-2xl p-5 mb-5 text-left">
            <h2 className="font-fredoka text-lg text-dark mb-3">
              {animals.length === 1 ? 'Your pet' : `Your ${animals.length} pets`}
              {startDate && (
                <span className="text-sm font-nunito font-normal text-gray-400 ml-2">
                  starting {new Date(startDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                </span>
              )}
            </h2>
            <div className="flex flex-col gap-2">
              {animals.map((animal, i) => (
                <div key={i} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-gray-100">
                  <span className="text-xl">{animal.type === 'cat' ? '🐱' : '🐶'}</span>
                  <div>
                    <p className="font-extrabold text-sm text-dark">{animal.name}</p>
                    <p className="text-xs text-gray-400">
                      {[animal.breed, animal.age].filter(Boolean).join(' · ') || animal.type}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-cream rounded-2xl p-6 mb-6 text-left">
          <h2 className="font-fredoka text-xl text-dark mb-4">What happens next?</h2>
          <div className="flex flex-col gap-4">
            {[
              { icon: '📱', title: "We'll text you", desc: 'Expect a confirmation text within a few hours.' },
              { icon: '🤝', title: 'Meet & greet', desc: "We'll schedule a quick meet-and-greet before the service week starts." },
              { icon: '📸', title: 'Daily updates', desc: 'During your week, you will receive photo updates after each visit.' },
            ].map((step) => (
              <div key={step.title} className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{step.icon}</span>
                <div>
                  <p className="font-extrabold text-sm text-dark">{step.title}</p>
                  <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <a
            href="tel:6015758053"
            className="flex items-center justify-center gap-2 py-3.5 bg-orange text-white rounded-full font-extrabold text-sm hover:bg-dark transition-all duration-200"
          >
            Call / Text (601) 575-8053
          </a>
          <Link
            href="/"
            className="py-3.5 border-2 border-dark text-dark rounded-full font-extrabold text-sm hover:bg-dark hover:text-white transition-all duration-200"
          >
            Back to Home
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-5">
          A receipt was sent to your email by Stripe. Questions?{' '}
          <a href="mailto:pfpeebles@gmail.com" className="text-orange hover:underline">pfpeebles@gmail.com</a>
        </p>
      </div>
    </section>
  )
}
