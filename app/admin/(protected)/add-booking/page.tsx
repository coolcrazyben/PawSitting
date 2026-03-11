'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Animal {
  type: 'dog' | 'cat'
  name: string
  breed: string
  age: string
  notes: string
}

function newAnimal(): Animal {
  return { type: 'dog', name: '', breed: '', age: '', notes: '' }
}

export default function AddBookingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    ownerName: '',
    email: '',
    phone: '',
    pkg: 'basic' as 'basic' | 'standard' | 'premium' | 'custom',
    startDate: '',
    days: 7,
    visitsPerDay: 1,
    walks: false,
    totalPrice: 125,
    animals: [newAnimal()] as Animal[],
  })

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function setAnimal(i: number, field: keyof Animal, value: string) {
    setForm((prev) => ({
      ...prev,
      animals: prev.animals.map((a, idx) => (idx === i ? { ...a, [field]: value } : a)),
    }))
  }

  function addAnimal() {
    setForm((prev) => ({ ...prev, animals: [...prev.animals, newAnimal()] }))
  }

  function removeAnimal(i: number) {
    setForm((prev) => ({ ...prev, animals: prev.animals.filter((_, idx) => idx !== i) }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.ownerName || !form.email || form.animals.some((a) => !a.name.trim())) {
      setError('Please fill in owner name, email, and a name for each animal.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        router.push('/admin/bookings')
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to create booking.')
      }
    } catch {
      setError('Network error.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="font-fredoka text-3xl text-[#1A1A2E]">Add Manual Booking</h1>
        <p className="text-sm text-gray-400 mt-1">Record a walk-up or phone booking</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Owner info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h2 className="font-extrabold text-[#1A1A2E] mb-4">Owner Info</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-1.5">Name *</label>
              <input
                type="text" required
                value={form.ownerName} onChange={(e) => set('ownerName', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm focus:border-[#FF6B35] focus:outline-none transition-colors"
                placeholder="Jane Smith"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-1.5">Email *</label>
              <input
                type="email" required
                value={form.email} onChange={(e) => set('email', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm focus:border-[#FF6B35] focus:outline-none transition-colors"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-1.5">Phone</label>
              <input
                type="tel"
                value={form.phone} onChange={(e) => set('phone', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm focus:border-[#FF6B35] focus:outline-none transition-colors"
                placeholder="601-000-0000"
              />
            </div>
          </div>
        </div>

        {/* Booking details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h2 className="font-extrabold text-[#1A1A2E] mb-4">Booking Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-1.5">Package</label>
              <select
                value={form.pkg} onChange={(e) => set('pkg', e.target.value as typeof form.pkg)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm focus:border-[#FF6B35] focus:outline-none transition-colors"
              >
                <option value="basic">Basic ($125)</option>
                <option value="standard">Standard ($220)</option>
                <option value="premium">Premium ($350)</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-1.5">Start Date</label>
              <input
                type="date"
                value={form.startDate} onChange={(e) => set('startDate', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm focus:border-[#FF6B35] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-1.5">Days</label>
              <input
                type="number" min={1} max={30}
                value={form.days} onChange={(e) => set('days', +e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm focus:border-[#FF6B35] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-1.5">Total Price ($)</label>
              <input
                type="number" min={0}
                value={form.totalPrice} onChange={(e) => set('totalPrice', +e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm focus:border-[#FF6B35] focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Animals */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h2 className="font-extrabold text-[#1A1A2E] mb-4">Animals</h2>
          <div className="flex flex-col gap-4">
            {form.animals.map((a, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-extrabold text-gray-500 uppercase">Animal {i + 1}</p>
                  {i > 0 && (
                    <button type="button" onClick={() => removeAnimal(i)} className="text-xs text-red-400 hover:text-red-600 font-extrabold">
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-1">Type</label>
                    <select value={a.type} onChange={(e) => setAnimal(i, 'type', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 text-sm focus:border-[#FF6B35] focus:outline-none">
                      <option value="dog">Dog 🐶</option>
                      <option value="cat">Cat 🐱</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-1">Name *</label>
                    <input type="text" value={a.name} onChange={(e) => setAnimal(i, 'name', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 text-sm focus:border-[#FF6B35] focus:outline-none"
                      placeholder="Buddy" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-1">Breed</label>
                    <input type="text" value={a.breed} onChange={(e) => setAnimal(i, 'breed', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 text-sm focus:border-[#FF6B35] focus:outline-none"
                      placeholder="Golden Retriever" />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-1">Age</label>
                    <input type="text" value={a.age} onChange={(e) => setAnimal(i, 'age', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 text-sm focus:border-[#FF6B35] focus:outline-none"
                      placeholder="3 years" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {form.animals.length < 4 && (
            <button type="button" onClick={addAnimal}
              className="mt-3 w-full py-2.5 border-2 border-dashed border-[#FF6B35] text-[#FF6B35] rounded-xl font-extrabold text-sm hover:bg-orange-50 transition-colors">
              + Add Another Animal
            </button>
          )}
        </div>

        {error && <p className="text-red-500 text-sm font-bold">{error}</p>}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/bookings')}
            className="flex-1 py-3.5 border-2 border-gray-300 text-gray-600 rounded-full font-extrabold text-sm hover:border-[#1A1A2E] hover:text-[#1A1A2E] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-[2] py-3.5 bg-[#FF6B35] text-white rounded-full font-extrabold text-sm hover:bg-[#1A1A2E] transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Booking'}
          </button>
        </div>
      </form>
    </div>
  )
}
