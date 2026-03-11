import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'PawPal — Dog Sitting in Philadelphia, MS',
  description:
    'In-home dog sitting, drop-in visits, and walks in Philadelphia, MS. Book online, pay securely, and get photo updates every visit.',
  keywords: 'dog sitting, pet care, dog walker, Philadelphia MS, drop-in visits',
  openGraph: {
    title: 'PawPal — Dog Sitting in Philadelphia, MS',
    description: 'In-home dog sitting and walks. No kennels, just love.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-nunito bg-cream text-dark">
        <Nav />
        <main className="pt-[72px]">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
