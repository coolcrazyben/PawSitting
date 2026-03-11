'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

type Pkg = 'basic' | 'standard' | 'premium' | 'custom'

interface Animal {
  type: 'dog' | 'cat'
  name: string
  breed: string
  age: string
  notes: string
}

const PACKAGES: Record<Exclude<Pkg, 'custom'>, { name: string; price: number; icon: string; desc: string }> = {
  basic: { name: 'Basic Pack', price: 125, icon: '🥣', desc: '1 drop-in/day × 7 days' },
  standard: { name: 'Standard Pack', price: 220, icon: '🦮', desc: '2 drop-ins/day × 7 days' },
  premium: { name: 'Premium Pack', price: 350, icon: '⭐', desc: '2 visits + 1 walk/day × 7 days' },
}

function calcCustom(days: number, visitsPerDay: number, walks: boolean) {
  return days * visitsPerDay * 18 + (walks ? days * 5 : 0)
}

function newAnimal(): Animal {
  return { type: 'dog', name: '', breed: '', age: '', notes: '' }
}

interface BookingForm {
  pkg: Pkg
  days: number
  visitsPerDay: number
  walks: boolean
  startDate: string
  animals: Animal[]
  ownerName: string
  email: string
  phone: string
}

function BookingPageInner() {
  const searchParams = useSearchParams()
  const initialPkg = (searchParams.get('pkg') as Pkg) || 'standard'

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState<BookingForm>({
    pkg: initialPkg,
    days: 7,
    visitsPerDay: 1,
    walks: false,
    startDate: '',
    animals: [newAnimal()],
    ownerName: '',
    email: '',
    phone: '',
  })

  function set<K extends keyof BookingForm>(key: K, value: BookingForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function setAnimal(index: number, field: keyof Animal, value: string) {
    setForm((prev) => {
      const updated = prev.animals.map((a, i) =>
        i === index ? { ...a, [field]: value } : a
      )
      return { ...prev, animals: updated }
    })
  }

  function addAnimal() {
    setForm((prev) => ({ ...prev, animals: [...prev.animals, newAnimal()] }))
  }

  function removeAnimal(index: number) {
    setForm((prev) => ({
      ...prev,
      animals: prev.animals.filter((_, i) => i !== index),
    }))
  }

  const daysForPkg = form.pkg === 'custom' ? form.days : 7
  const basePrice =
    form.pkg === 'basic' ? 125
    : form.pkg === 'standard' ? 220
    : form.pkg === 'premium' ? 350
    : calcCustom(form.days, form.visitsPerDay, form.walks)

  const extraAnimals = Math.max(0, form.animals.length - 1)
  const surcharge = extraAnimals * daysForPkg * 10
  const totalPrice = basePrice + surcharge
  const customPrice = calcCustom(form.days, form.visitsPerDay, form.walks)

  async function handleCheckout() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, price: totalPrice }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const progressPct = ((step - 1) / 3) * 100

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div
        className="py-16 px-5 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #fff8e1 0%, #ffe8d6 100%)' }}
      >
        <div className="absolute w-[300px] h-[300px] rounded-full blur-[70px] opacity-25 bg-yellow -top-16 -left-16 animate-float" />
        <h1 className="font-fredoka text-4xl md:text-5xl text-dark relative z-10 mb-2">Book Your Week 🐾</h1>
        <p className="text-gray-500 relative z-10 text-sm">Secure, fast checkout powered by Stripe.</p>
      </div>

      <div className="max-w-2xl mx-auto px-5 pb-20">
        {/* Progress bar */}
        <div className="my-8">
          <div className="flex justify-between text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">
            {['Package', 'Your Pets', 'Contact', 'Review'].map((label, i) => (
              <span key={label} className={step > i ? 'text-orange' : ''}>
                {i + 1}. {label}
              </span>
            ))}
          </div>
          <div className="h-2 bg-white rounded-full border border-gray-100 overflow-hidden">
            <div
              className="h-full bg-orange rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Step 1: Package */}
        {step === 1 && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border-[2px] border-[#f0e8d8] animate-slide-up">
            <h2 className="font-fredoka text-2xl mb-1">Choose your package</h2>
            <p className="text-sm text-gray-400 mb-7">Select a pre-built pack or build your own.</p>

            <div className="grid grid-cols-1 gap-4 mb-6">
              {(Object.entries(PACKAGES) as [Exclude<Pkg, 'custom'>, typeof PACKAGES[keyof typeof PACKAGES]][]).map(([key, pkg]) => (
                <button
                  key={key}
                  onClick={() => set('pkg', key)}
                  className={`flex items-center gap-4 p-5 rounded-2xl border-[2.5px] text-left transition-all duration-200 hover:border-orange ${
                    form.pkg === key ? 'border-orange bg-orange/5' : 'border-gray-100 bg-cream'
                  }`}
                >
                  <span className="text-3xl">{pkg.icon}</span>
                  <div className="flex-1">
                    <p className="font-extrabold text-dark">{pkg.name}</p>
                    <p className="text-xs text-gray-400">{pkg.desc}</p>
                  </div>
                  <span className="font-fredoka text-2xl text-orange">${pkg.price}</span>
                  {form.pkg === key && <span className="w-5 h-5 rounded-full bg-orange flex items-center justify-center text-white text-xs">✓</span>}
                </button>
              ))}

              {/* Custom */}
              <button
                onClick={() => set('pkg', 'custom')}
                className={`flex items-center gap-4 p-5 rounded-2xl border-[2.5px] text-left transition-all duration-200 hover:border-orange ${
                  form.pkg === 'custom' ? 'border-orange bg-orange/5' : 'border-gray-100 bg-cream'
                }`}
              >
                <span className="text-3xl">✏️</span>
                <div className="flex-1">
                  <p className="font-extrabold text-dark">Custom Pack</p>
                  <p className="text-xs text-gray-400">Choose days, visits, and walk add-ons</p>
                </div>
                <span className="font-fredoka text-2xl text-orange">Custom</span>
                {form.pkg === 'custom' && <span className="w-5 h-5 rounded-full bg-orange flex items-center justify-center text-white text-xs">✓</span>}
              </button>
            </div>

            {/* Custom builder */}
            {form.pkg === 'custom' && (
              <div className="bg-cream rounded-2xl p-6 mb-6 border-[2px] border-yellow animate-slide-up">
                <h3 className="font-extrabold text-dark mb-4 text-sm uppercase tracking-wider">Build your pack</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="form-label">Number of days (1–7)</label>
                    <input
                      type="range" min={1} max={7} value={form.days}
                      onChange={(e) => set('days', +e.target.value)}
                      className="w-full accent-orange"
                    />
                    <p className="text-xs text-orange font-extrabold mt-1">{form.days} day{form.days !== 1 ? 's' : ''}</p>
                  </div>
                  <div>
                    <label className="form-label">Visits per day</label>
                    <div className="flex gap-3 mt-2">
                      {[1, 2].map((v) => (
                        <button
                          key={v}
                          onClick={() => set('visitsPerDay', v)}
                          className={`flex-1 py-2.5 rounded-xl border-2 font-extrabold text-sm transition-all duration-200 ${
                            form.visitsPerDay === v ? 'bg-orange text-white border-orange' : 'border-gray-200 text-dark bg-white hover:border-orange'
                          }`}
                        >
                          {v}/day
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${form.walks ? 'border-green bg-green/5' : 'border-gray-200 bg-white'}`}>
                  <input
                    type="checkbox" checked={form.walks}
                    onChange={(e) => set('walks', e.target.checked)}
                    className="accent-green w-4 h-4"
                  />
                  <div>
                    <p className="font-extrabold text-sm text-dark">Add neighborhood walk (+$5/day)</p>
                    <p className="text-xs text-gray-400">30-min walk each day</p>
                  </div>
                </label>

                <div className="mt-5 bg-dark text-white rounded-xl px-6 py-4 flex items-center justify-between">
                  <span className="font-semibold text-sm text-white/70">Estimated total:</span>
                  <span className="font-fredoka text-3xl text-yellow">${customPrice}</span>
                </div>
              </div>
            )}

            <button
              onClick={() => setStep(2)}
              className="w-full py-4 bg-orange text-white rounded-full font-extrabold text-base hover:bg-dark transition-all duration-200 hover:scale-[1.02]"
            >
              Continue → Tell us about your pets
            </button>
          </div>
        )}

        {/* Step 2: Animals */}
        {step === 2 && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border-[2px] border-[#f0e8d8] animate-slide-up">
            <h2 className="font-fredoka text-2xl mb-1">About your pets 🐾</h2>
            <p className="text-sm text-gray-400 mb-7">Tell us who we'll be taking care of.</p>

            {/* Start date */}
            <div className="mb-6">
              <label className="form-label">Service Start Date *</label>
              <input
                type="date" className="form-input"
                value={form.startDate}
                min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                onChange={(e) => set('startDate', e.target.value)}
              />
              <p className="text-xs text-gray-400 mt-1">
                {form.pkg === 'custom'
                  ? `We'll care for your pet${form.animals.length > 1 ? 's' : ''} for ${form.days} day${form.days !== 1 ? 's' : ''} starting this date.`
                  : `We'll care for your pet${form.animals.length > 1 ? 's' : ''} for 7 days starting this date.`}
              </p>
            </div>

            {/* Animal cards */}
            <div className="flex flex-col gap-5 mb-5">
              {form.animals.map((animal, i) => (
                <div key={i} className="bg-cream rounded-2xl p-5 border-[2px] border-[#f0e8d8]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-extrabold text-dark text-sm">
                      {animal.type === 'cat' ? '🐱' : '🐶'} Animal {i + 1}
                    </h3>
                    {i > 0 && (
                      <button
                        onClick={() => removeAnimal(i)}
                        className="text-xs text-red-400 hover:text-red-600 font-extrabold transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="form-label">Animal Type</label>
                      <select
                        className="form-input"
                        value={animal.type}
                        onChange={(e) => setAnimal(i, 'type', e.target.value)}
                      >
                        <option value="dog">Dog 🐶</option>
                        <option value="cat">Cat 🐱</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Name *</label>
                      <input
                        type="text" className="form-input" placeholder="Buddy"
                        value={animal.name} onChange={(e) => setAnimal(i, 'name', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="form-label">Breed</label>
                      <input
                        type="text" className="form-input" placeholder="Golden Retriever"
                        value={animal.breed} onChange={(e) => setAnimal(i, 'breed', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="form-label">Age</label>
                      <input
                        type="text" className="form-input" placeholder="3 years"
                        value={animal.age} onChange={(e) => setAnimal(i, 'age', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Special Notes</label>
                    <textarea
                      className="form-input min-h-[80px] resize-y"
                      placeholder="Feeding schedule, medications, temperament, gate code..."
                      value={animal.notes} onChange={(e) => setAnimal(i, 'notes', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Multi-animal surcharge preview */}
            {form.animals.length > 1 && (
              <div className="bg-yellow/10 border-[2px] border-yellow rounded-2xl px-5 py-3 mb-4 text-sm">
                <p className="font-extrabold text-dark">
                  Multi-animal surcharge: +${surcharge}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {extraAnimals} extra animal{extraAnimals > 1 ? 's' : ''} × {daysForPkg} days × $10/day
                </p>
              </div>
            )}

            {form.animals.length >= 4 && (
              <div className="bg-orange/10 border-[2px] border-orange rounded-2xl px-5 py-3 mb-4 text-sm font-extrabold text-orange">
                That's a full house! Make sure to note any special needs above.
              </div>
            )}

            {form.animals.length < 4 && (
              <button
                onClick={addAnimal}
                className="w-full py-3 border-2 border-dashed border-orange text-orange rounded-2xl font-extrabold text-sm hover:bg-orange/5 transition-all duration-200 mb-5"
              >
                + Add Another Animal
              </button>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-4 border-2 border-dark text-dark rounded-full font-extrabold text-base hover:bg-dark hover:text-white transition-all duration-200"
              >
                ← Back
              </button>
              <button
                onClick={() => {
                  const missing = form.animals.some((a) => !a.name.trim())
                  if (missing || !form.startDate) {
                    setError('Please fill in a name for each animal and the start date.')
                    return
                  }
                  setError('')
                  setStep(3)
                }}
                className="flex-[2] py-4 bg-orange text-white rounded-full font-extrabold text-base hover:bg-dark transition-all duration-200 hover:scale-[1.02]"
              >
                Continue → Your contact info
              </button>
            </div>
            {error && <p className="text-red-500 text-xs mt-3 font-bold">{error}</p>}
          </div>
        )}

        {/* Step 3: Contact info */}
        {step === 3 && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border-[2px] border-[#f0e8d8] animate-slide-up">
            <h2 className="font-fredoka text-2xl mb-1">Your contact info 📋</h2>
            <p className="text-sm text-gray-400 mb-7">How should we reach you?</p>

            <div className="mb-4">
              <label className="form-label">Your Name *</label>
              <input
                type="text" className="form-input" placeholder="Jane Smith"
                value={form.ownerName} onChange={(e) => set('ownerName', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="form-label">Email *</label>
                <input
                  type="email" className="form-input" placeholder="you@email.com"
                  value={form.email} onChange={(e) => set('email', e.target.value)}
                />
              </div>
              <div>
                <label className="form-label">Phone *</label>
                <input
                  type="tel" className="form-input" placeholder="601-000-0000"
                  value={form.phone} onChange={(e) => set('phone', e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-4 border-2 border-dark text-dark rounded-full font-extrabold text-base hover:bg-dark hover:text-white transition-all duration-200"
              >
                ← Back
              </button>
              <button
                onClick={() => {
                  if (!form.ownerName || !form.email || !form.phone) {
                    setError('Please fill in your name, email, and phone number.')
                    return
                  }
                  setError('')
                  setStep(4)
                }}
                className="flex-[2] py-4 bg-orange text-white rounded-full font-extrabold text-base hover:bg-dark transition-all duration-200 hover:scale-[1.02]"
              >
                Continue → Review & Pay
              </button>
            </div>
            {error && <p className="text-red-500 text-xs mt-3 font-bold">{error}</p>}
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border-[2px] border-[#f0e8d8] animate-slide-up">
            <h2 className="font-fredoka text-2xl mb-1">Review your booking ✅</h2>
            <p className="text-sm text-gray-400 mb-7">Everything look good? Complete your booking with Stripe.</p>

            <div className="bg-cream rounded-2xl p-6 mb-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">Package</span>
                <span className="font-extrabold text-dark">
                  {form.pkg === 'custom'
                    ? `Custom (${form.days}d × ${form.visitsPerDay}/day${form.walks ? ' + walks' : ''})`
                    : PACKAGES[form.pkg as Exclude<Pkg, 'custom'>].name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">Start Date</span>
                <span className="font-extrabold text-dark">
                  {form.startDate ? new Date(form.startDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }) : '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">Animals</span>
                <span className="font-extrabold text-dark">
                  {form.animals.map((a) => `${a.name} (${a.type})`).join(', ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">Owner</span>
                <span className="font-extrabold text-dark">{form.ownerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">Email</span>
                <span className="font-extrabold text-dark">{form.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">Phone</span>
                <span className="font-extrabold text-dark">{form.phone}</span>
              </div>
              <hr className="border-[#e8e0d0]" />
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">Base price</span>
                <span className="font-extrabold text-dark">${basePrice}</span>
              </div>
              {surcharge > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500 font-semibold">
                    Multi-animal surcharge
                    <span className="block text-xs font-normal text-gray-400">
                      {extraAnimals} extra × {daysForPkg} days × $10
                    </span>
                  </span>
                  <span className="font-extrabold text-dark">+${surcharge}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-1">
                <span className="text-dark font-extrabold text-base">Total</span>
                <span className="font-fredoka text-3xl text-orange">${totalPrice}</span>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 text-red-600 text-sm font-semibold">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-4 border-2 border-dark text-dark rounded-full font-extrabold text-base hover:bg-dark hover:text-white transition-all duration-200"
              >
                ← Back
              </button>
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="flex-[2] py-4 bg-orange text-white rounded-full font-extrabold text-base hover:bg-dark transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '⏳ Redirecting to Stripe...' : `Pay $${totalPrice} Securely 🔒`}
              </button>
            </div>
            <p className="text-center text-xs text-gray-400 mt-3">
              Powered by Stripe · Your payment info is never stored on our servers.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream flex items-center justify-center font-fredoka text-2xl text-orange">Loading booking...</div>}>
      <BookingPageInner />
    </Suspense>
  )
}
