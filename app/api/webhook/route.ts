export const runtime = 'nodejs'

import Stripe from 'stripe'
import { initDb, findCustomerByEmail, createCustomer, createBooking, createAnimal } from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return new Response('Missing stripe-signature header', { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[webhook] signature verification failed:', message)
    return new Response(`Webhook Error: ${message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const meta = session.metadata || {}

    try {
      await initDb()

      const email = meta.email || session.customer_email || ''
      const ownerName = meta.ownerName || ''
      const phone = meta.phone || ''

      let customer = await findCustomerByEmail(email)
      if (!customer) {
        customer = await createCustomer({ ownerName, email, phone })
      }

      const booking = await createBooking({
        customerId: customer.id,
        stripeSessionId: session.id,
        package: meta.package || 'custom',
        startDate: meta.startDate || undefined,
        days: parseInt(meta.days || '7'),
        visitsPerDay: parseInt(meta.visitsPerDay || '1'),
        walks: meta.walks === 'true',
        totalPrice: Math.round((session.amount_total || 0) / 100),
        status: 'upcoming',
      })

      const count = parseInt(meta.animal_count || '0')
      for (let i = 0; i < count; i++) {
        await createAnimal({
          bookingId: booking.id,
          type: meta[`animal_${i}_type`] || 'dog',
          name: meta[`animal_${i}_name`] || `Animal ${i + 1}`,
          breed: meta[`animal_${i}_breed`] || undefined,
          age: meta[`animal_${i}_age`] || undefined,
          notes: meta[`animal_${i}_notes`] || undefined,
        })
      }

      console.log(`[webhook] Booking saved: ${booking.id} for ${email}`)
    } catch (err) {
      console.error('[webhook] DB error:', err)
      // Return 200 so Stripe doesn't retry — log the error for manual recovery
    }
  }

  return new Response('ok', { status: 200 })
}
