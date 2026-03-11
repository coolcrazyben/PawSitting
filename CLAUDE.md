# PawPal — Dog Sitting Website

Full-stack Next.js 14 website for PawPal, a dog sitting service based in Philadelphia, MS.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS 3 with custom design tokens
- **Payments**: Stripe Checkout (dynamic pricing via `price_data`)
- **Database**: Turso (libSQL) — free tier, no monthly fees
- **Admin CRM**: Native `/admin` route, HMAC-auth, no external services
- **Deployment**: Vercel

## Project Structure

```
pawpal/
├── app/
│   ├── layout.tsx              # Root layout (Nav + Footer on all pages)
│   ├── globals.css             # Tailwind + Google Fonts + custom animations
│   ├── page.tsx                # / — Home: hero, how it works, packages, testimonials, CTA
│   ├── not-found.tsx           # /404 — Custom 404 page
│   ├── services/page.tsx       # /services — Full packages + FAQ
│   ├── booking/page.tsx        # /booking — Multi-step booking form → Stripe
│   ├── contact/page.tsx        # /contact — Contact form + info
│   ├── success/page.tsx        # /success — Post-payment confirmation
│   └── api/checkout/route.ts   # POST /api/checkout — Creates Stripe session
├── components/
│   ├── Nav.tsx                 # Sticky nav with mobile hamburger + active link
│   └── Footer.tsx              # Footer with contact info + nav links
├── tailwind.config.js          # Custom colors, fonts, animations
├── CLAUDE.md                   # This file
└── .env.example                # Required environment variables
```

## Environment Variables

Create a `.env.local` file (never commit this — it's in `.gitignore`):

```env
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
ADMIN_PASSWORD=choose_a_strong_password
DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...
```

### Setting Up Each Variable

1. **Stripe keys** — https://dashboard.stripe.com/apikeys
2. **Stripe webhook secret** — Dashboard → Webhooks → Add endpoint → `https://yoursite.vercel.app/api/webhook` → select `checkout.session.completed` → copy signing secret
3. **Turso DB** — https://turso.tech → create DB → `turso db show --url` for `DATABASE_URL`, `turso db tokens create <db-name>` for `TURSO_AUTH_TOKEN`
4. **ADMIN_PASSWORD** — choose any strong password; this gates `/admin`
5. **Vercel** — Settings → Environment Variables → add all 7 vars

## Packages & Pricing

| Package    | Price | Details                                    |
|------------|-------|--------------------------------------------|
| Basic      | $125  | 1 drop-in/day × 7 days = 7 visits          |
| Standard   | $220  | 2 drop-ins/day × 7 days = 14 visits        |
| Premium    | $350  | 2 visits + 1 walk/day × 7 days = 21 total |
| Custom     | Calc  | 1-7 days, 1-2 visits/day, +$5/day walks    |

Custom pricing formula: `days × visitsPerDay × $18 + (walks ? days × $5 : 0)`

Multi-animal surcharge: `+$10 × extraAnimals × days` (presets = 7 days, custom = chosen days)

## Stripe Checkout Flow

1. User completes 4-step booking form at `/booking` (supports multiple dogs/cats)
2. On "Pay" click → `POST /api/checkout` with `animals[]` array + surcharge price
3. API creates a Stripe Checkout session with numbered metadata (`animal_0_name`, etc.)
4. User redirected to Stripe's hosted checkout page
5. On success → redirected to `/success?session_id=cs_...` (fetches session server-side to display animals)
6. Stripe webhook `POST /api/webhook` fires → saves customer + booking + animals to Turso DB

## Admin CRM

Visit `/admin` to access the CRM. Protected by an HMAC-signed HttpOnly cookie.

| Route | Purpose |
|-------|---------|
| `/admin` | Login form |
| `/admin/dashboard` | Stats + today's bookings |
| `/admin/customers` | Customer list |
| `/admin/customers/[id]` | Full history + animals |
| `/admin/bookings` | All bookings with status |
| `/admin/add-booking` | Manual/walk-up booking form |

## Contact Info

- **Phone**: (601) 575-8053
- **Email**: pfpeebles@gmail.com
- **Location**: Philadelphia, MS

## Local Development

```bash
npm install
cp .env.example .env.local
# Fill in your Stripe test keys in .env.local
npm run dev
# Open http://localhost:3000
```

## Deploy to Vercel

```bash
# Install Vercel CLI if needed
npm i -g vercel

# First deploy (follow prompts to link/create project)
vercel

# Set env vars on Vercel
vercel env add STRIPE_SECRET_KEY
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
vercel env add NEXT_PUBLIC_BASE_URL

# Production deploy
vercel --prod
```

After first deploy, update `NEXT_PUBLIC_BASE_URL` to your production URL.

## Branding

- **Colors**: orange `#FF6B35`, yellow `#FFD93D`, blue `#4D96FF`, green `#6BCB77`, pink `#FF6B9D`, cream `#FFFBF0`, dark `#1A1A2E`
- **Fonts**: Fredoka One (headings), Nunito (body/UI)
- **Style**: Playful, warm, dog-themed with paw emoji motifs and blob animations
