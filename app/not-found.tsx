import Link from 'next/link'

export default function NotFound() {
  return (
    <section
      className="min-h-screen flex items-center justify-center px-5 py-20 text-center relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #fff8e1 0%, #ffe8d6 50%, #e8f4ff 100%)' }}
    >
      <div className="absolute w-[350px] h-[350px] rounded-full blur-[70px] opacity-30 bg-yellow -top-20 -right-20 animate-float-2" />
      <div className="relative z-10 max-w-md">
        <span className="text-8xl block mb-4 animate-waggle">🐕</span>
        <div className="font-fredoka text-[8rem] text-orange/20 leading-none mb-0 -mb-4">404</div>
        <h1 className="font-fredoka text-4xl text-dark mb-4">Uh oh, this page ran off!</h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          Looks like this page fetched a stick and never came back. Let's get you back on the trail.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/"
            className="btn-primary"
          >
            Back to Home 🐾
          </Link>
          <Link
            href="/booking"
            className="btn-secondary"
          >
            Book a Visit
          </Link>
        </div>
      </div>
    </section>
  )
}
