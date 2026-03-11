import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

interface Animal {
  type: 'dog' | 'cat'
  name: string
  breed: string
  age: string
  notes: string
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      pkg,
      price,
      startDate,
      animals,
      ownerName,
      email,
      phone,
      days,
      visitsPerDay,
      walks,
    } = body

    if (!price || price <= 0) {
      return NextResponse.json({ error: 'Invalid price.' }, { status: 400 })
    }

    const animalList: Animal[] = Array.isArray(animals) ? animals : []

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    let packageDesc = ''
    if (pkg === 'basic') packageDesc = 'Basic Pack — 7 drop-in visits (1/day)'
    else if (pkg === 'standard') packageDesc = 'Standard Pack — 14 drop-in visits (2/day)'
    else if (pkg === 'premium') packageDesc = 'Premium Pack — 2 visits + 1 walk/day × 7 days'
    else packageDesc = `Custom Pack — ${days} day(s) × ${visitsPerDay} visit(s)/day${walks ? ' + walks' : ''}`

    // Build numbered metadata to avoid Stripe's 500-char per-value limit
    const animalMeta: Record<string, string> = {
      animal_count: String(animalList.length),
    }
    animalList.forEach((a, i) => {
      animalMeta[`animal_${i}_type`] = a.type
      animalMeta[`animal_${i}_name`] = a.name
      animalMeta[`animal_${i}_breed`] = a.breed || ''
      animalMeta[`animal_${i}_age`] = a.age || ''
      animalMeta[`animal_${i}_notes`] = (a.notes || '').substring(0, 100)
    })

    const animalNames = animalList.map((a) => a.name).join(', ')

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(price * 100),
            product_data: {
              name: `PawPal — ${packageDesc}`,
              description: `Owner: ${ownerName} | Animals: ${animalNames} | Start: ${startDate}`,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: email || undefined,
      metadata: {
        package: pkg,
        startDate,
        ownerName,
        email: email || '',
        phone: phone || '',
        days: String(days || 7),
        visitsPerDay: String(visitsPerDay || 1),
        walks: walks ? 'true' : 'false',
        ...animalMeta,
      },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/booking`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[checkout]', err)
    return NextResponse.json(
      { error: 'Failed to create checkout session. Please try again.' },
      { status: 500 }
    )
  }
}
