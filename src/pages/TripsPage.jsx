import TripGrid from '@/components/trips/TripGrid'

export default function TripsPage() {
  return (
    <div className="min-h-screen">
      {/* Header banner */}
      <div className="relative h-52 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A3A1A] to-[#0d1a0d]" />
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "url('/images/hero-bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="relative z-10 text-center">
          <p className="text-orange text-sm font-semibold uppercase tracking-widest mb-2">Explore</p>
          <h1 className="text-4xl font-black text-white">All Trips</h1>
          <p className="text-white/45 mt-2">Multiple adventures across Karnataka & beyond</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">

  {/* Availability notice */}
  <div className="flex items-start gap-3 bg-orange/10 border border-orange/25 
                  rounded-2xl px-5 py-4 mb-8">
    <span className="text-xl mt-0.5">🔔</span>
    <div>
      <p className="text-orange font-semibold text-sm">Booking Notice</p>
      <p className="text-white/60 text-sm mt-0.5 leading-relaxed">
        Please book only trips marked with a{' '}
        <span className="inline-flex items-center gap-1 bg-green-500/20 text-green-400 
                         text-xs font-bold px-2 py-0.5 rounded-full mx-0.5">
          ✓ Available
        </span>{' '}
        badge. All other trips will be marked available soon — stay tuned!
      </p>
    </div>
  </div>

  <TripGrid />
</div>
    </div>
  )
}
