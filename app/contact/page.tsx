'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // In production you'd POST to an email API here.
    // For now we just show a success state.
    setSent(true)
  }

  return (
    <>
      {/* Header */}
      <section
        className="py-20 px-5 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #fff8e1 0%, #ffe8d6 60%, #e8f4ff 100%)' }}
      >
        <div className="absolute w-[300px] h-[300px] rounded-full blur-[70px] opacity-25 bg-yellow -top-16 -right-16 animate-float-2" />
        <div className="relative z-10 max-w-xl mx-auto">
          <span className="section-label">Get in Touch</span>
          <h1 className="font-fredoka leading-tight mb-4" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
            Say hello 🐾
          </h1>
          <p className="section-sub mx-auto">
            Questions, special requests, or just want to talk dogs? We're always happy to hear from you.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="bg-cream py-20 px-5">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

          {/* Contact info */}
          <div>
            <span className="section-label">Contact Info</span>
            <h2 className="section-title mb-6">We'd love to hear from you</h2>
            <p className="section-sub mb-8">
              Reach out by phone, text, or email anytime. We typically respond within a few hours during business hours.
            </p>

            <div className="flex flex-col gap-4 mb-10">
              <a href="tel:6015758053" className="chip">
                <div className="w-10 h-10 rounded-xl bg-orange/15 flex items-center justify-center text-xl flex-shrink-0">📞</div>
                <div>
                  <p className="font-extrabold text-dark text-sm">Call or Text</p>
                  <p className="text-xs text-gray-400">(601) 575-8053</p>
                </div>
              </a>
              <a href="mailto:pfpeebles@gmail.com" className="chip">
                <div className="w-10 h-10 rounded-xl bg-blue/15 flex items-center justify-center text-xl flex-shrink-0">✉️</div>
                <div>
                  <p className="font-extrabold text-dark text-sm">Email</p>
                  <p className="text-xs text-gray-400">pfpeebles@gmail.com</p>
                </div>
              </a>
              <div className="chip cursor-default hover:border-transparent hover:translate-x-0">
                <div className="w-10 h-10 rounded-xl bg-green/15 flex items-center justify-center text-xl flex-shrink-0">📍</div>
                <div>
                  <p className="font-extrabold text-dark text-sm">Location</p>
                  <p className="text-xs text-gray-400">Philadelphia, MS and surrounding areas</p>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-white rounded-2xl p-6 border-[2px] border-[#f0e8d8]">
              <h3 className="font-fredoka text-xl mb-4">Availability 🕐</h3>
              <div className="flex flex-col gap-2 text-sm">
                {[
                  { day: 'Monday – Friday', time: '7:00 AM – 8:00 PM' },
                  { day: 'Saturday', time: '8:00 AM – 7:00 PM' },
                  { day: 'Sunday', time: '9:00 AM – 6:00 PM' },
                ].map(({ day, time }) => (
                  <div key={day} className="flex justify-between text-sm">
                    <span className="text-gray-500 font-semibold">{day}</span>
                    <span className="font-extrabold text-dark">{time}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-4 leading-relaxed">
                Texts and emails are monitored outside these hours too — we try to respond to all messages within a few hours.
              </p>
            </div>
          </div>

          {/* Contact form */}
          <div className="bg-white rounded-3xl p-10 border-[2.5px] border-[#f0e8d8]">
            {sent ? (
              <div className="text-center py-12 animate-pop-in">
                <span className="text-6xl block mb-5">🎉</span>
                <h3 className="font-fredoka text-3xl text-green mb-3">Message received!</h3>
                <p className="text-gray-500 text-sm mb-6">
                  Thanks for reaching out! We'll text or email you back within a few hours.
                </p>
                <p className="text-sm text-gray-400 mb-6">
                  For faster response, text us at <strong className="text-dark">(601) 575-8053</strong>
                </p>
                <Link
                  href="/booking"
                  className="inline-block bg-orange text-white font-extrabold px-8 py-3 rounded-full hover:bg-dark transition-all duration-200"
                >
                  Book Your Week 🐾
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 className="font-fredoka text-2xl mb-7">Send us a message</h2>

                <div className="mb-4">
                  <label className="form-label">Your Name *</label>
                  <input
                    type="text" required className="form-input" placeholder="Jane Smith"
                    value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="form-label">Email *</label>
                    <input
                      type="email" required className="form-input" placeholder="you@email.com"
                      value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="form-label">Phone</label>
                    <input
                      type="tel" className="form-input" placeholder="601-000-0000"
                      value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="form-label">Message *</label>
                  <textarea
                    required rows={5} className="form-input resize-y" placeholder="Tell us about your dog, ask a question, or just say hi!"
                    value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-orange text-white rounded-full font-extrabold text-base hover:bg-dark transition-all duration-200 hover:scale-[1.02]"
                >
                  Send Message 🐾
                </button>
                <p className="text-center text-xs text-gray-400 mt-3">We typically reply within a few hours.</p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Map / location callout */}
      <section className="bg-dark text-white py-16 px-5 text-center">
        <div className="max-w-xl mx-auto">
          <span className="text-5xl block mb-4">📍</span>
          <h2 className="font-fredoka text-3xl mb-3">Philadelphia, MS</h2>
          <p className="text-white/60 text-sm mb-6">
            We serve Philadelphia and surrounding communities within ~15 miles. If you're unsure whether we cover your area, just ask!
          </p>
          <Link
            href="/booking"
            className="inline-block bg-orange text-white font-extrabold px-8 py-3 rounded-full hover:bg-yellow hover:text-dark transition-all duration-200 hover:scale-105"
          >
            Book Your Week →
          </Link>
        </div>
      </section>
    </>
  )
}
