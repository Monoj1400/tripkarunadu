import { useNavigate } from 'react-router-dom'
import { TRIPS } from '@/data/trips'
import TripCard from '@/components/trips/TripCard'

export default function FeaturedTrips() {
  const navigate = useNavigate()

  const sunrise = TRIPS.filter(t => t.cat === 'sunrise').slice(0, 4)
  const weekend = TRIPS.filter(
    t => t.cat === 'twoday-trek' || t.cat === 'twoday-sight'
  ).slice(0, 4)

  const Section = ({ title, trips }) => (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="section-title">{title}</h2>
        <button
          onClick={() => navigate('/trips')}
          className="text-orange text-sm font-semibold hover:underline"
        >
          View all →
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {trips.map(t => (
          <TripCard key={t.id} trip={t} />
        ))}
      </div>
    </div>
  )

  return (
    <section className="relative px-6 py-16 overflow-hidden">

      {/* 🔥 Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: "url('/images/treks/featuredback.jpg')" }}
      />

      {/* 🔥 Overlay (lighter for cards visibility) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70 backdrop-blur-[2px]" />

      {/* 🔥 Content */}
      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-orange text-sm font-semibold uppercase tracking-widest mb-2">
            Curated For You
          </p>

          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Featured Adventures
          </h2>

          <p className="text-white/45 mt-3 max-w-xl mx-auto">
            From 4 AM sunrise drives to 2-day wilderness escapes — pick your perfect getaway.
          </p>
        </div>

        {/* Sections */}
        <Section title="🌅 Sunrise Treks" trips={sunrise} />
        <Section title="🏕️ Weekend Getaways" trips={weekend} />

      </div>
    </section>
  )
}