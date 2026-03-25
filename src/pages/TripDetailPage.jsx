import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { TRIPS } from '@/data/trips'
import { TRIP_IMGS } from '@/data/images'
import { CCOLORS, formatPrice, diffClass, stars } from '@/utils/helpers'
import BookingModal from '@/components/booking/BookingModal'

export default function TripDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const trip = TRIPS.find(t => t.id === parseInt(id))
  const [showBooking, setShowBooking] = useState(false)

  if (!trip) return (
    <div className="min-h-screen flex items-center justify-center text-white/40 text-xl">
      Trip not found.
    </div>
  )

  const img = trip.imgKey && TRIP_IMGS[trip.imgKey]

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-72 sm:h-96 overflow-hidden">
        {img ? (
          <img src={img} alt={trip.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-8xl"
            style={{ background: `linear-gradient(${CCOLORS[trip.cat]})` }}>
            {trip.em}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1a0d] via-black/30 to-transparent" />

        {/* Back button */}
        <button onClick={() => navigate(-1)}
          className="absolute top-6 left-6 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm
                     border border-white/20 flex items-center justify-center text-white
                     hover:bg-black/60 transition-colors">
          <i className="fas fa-arrow-left text-sm" />
        </button>

        {/* Available badge */}
        {trip.available && (
          <div className="absolute top-6 right-6 badge-available">
            <i className="fas fa-check-circle" /> Available
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-12 relative z-10 pb-20">

        {/* Title block */}
        <div className="flex flex-col lg:flex-row gap-6 justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">{trip.name}</h1>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-orange">{stars(trip.rating)}</span>
              <span className="text-white/40 text-sm">{trip.rating} · {trip.reviews} reviews</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="glass-card px-3 py-1 text-xs text-white/60">📍 {trip.dist} from Bengaluru</span>
              <span className="glass-card px-3 py-1 text-xs text-white/60">⏱ {trip.dur}</span>
              <span className={diffClass(trip.diff)}>{trip.diff}</span>
              <span className="glass-card px-3 py-1 text-xs text-white/60">🎟 {trip.slots} slots left</span>
            </div>
          </div>

          {/* Sticky price block */}
          <div className="glass-card p-6 min-w-64 lg:sticky lg:top-24">
            {trip.oldPrice && (
              <div className="text-white/30 text-sm line-through">{formatPrice(trip.oldPrice)}</div>
            )}
            <div className="text-3xl font-black text-orange">{formatPrice(trip.price)}</div>
            <div className="text-white/35 text-xs mb-4">per person · breakfast Inlcuded</div>
            <button onClick={() => setShowBooking(true)} className="btn-primary w-full py-3">
              <i className="fas fa-ticket-alt mr-2" /> Book Now
            </button>
          </div>
        </div>

        {/* Key facts grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {trip.facts?.map(f => (
            <div key={f.l} className="glass-card p-4 flex items-center gap-3">
              <span className="text-2xl">{f.i}</span>
              <div>
                <div className="text-white/40 text-xs">{f.l}</div>
                <div className="text-white font-semibold text-sm">{f.v}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">

            {/* Overview */}
            <div>
              <h2 className="section-title">Overview</h2>
              <div className="space-y-4">
                {(trip.overview || [trip.desc]).map((p, i) => (
                  <p key={i} className="text-white/60 leading-relaxed text-sm">{p}</p>
                ))}
              </div>
            </div>

            {/* Highlights */}
            {trip.highlights?.length > 0 && (
              <div>
                <h2 className="section-title">Trip Highlights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {trip.highlights.map((h, i) => (
                    <div key={i} className="glass-card p-4 flex items-start gap-3">
                      <span className="text-orange text-sm mt-0.5">⭐</span>
                      <span className="text-white/75 text-sm leading-relaxed">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Itinerary */}
            {trip.itin?.length > 0 && (
              <div>
                <h2 className="section-title">Detailed Itinerary</h2>
                <div className="space-y-3">
                  {trip.itin.map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-orange flex-shrink-0 mt-1" />
                        {i < trip.itin.length - 1 && <div className="w-px flex-1 bg-orange/20 mt-1" />}
                      </div>
                      <div className="glass-card p-4 flex-1 mb-2">
                        <div className="text-orange text-xs font-bold mb-1">{item.t}</div>
                        <div className="text-white font-semibold text-sm mb-1">{item.h}</div>
                        <div className="text-white/50 text-xs leading-relaxed">{item.d}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Things to carry */}
            {trip.carry?.length > 0 && (
              <div>
                <h2 className="section-title">Things to Carry</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {trip.carry.map((c, i) => (
                    <div key={i} className="glass-card px-4 py-3 flex items-center gap-3 text-sm text-white/65">
                      <i className="fas fa-check text-orange text-xs" />{c}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Guidelines */}
            {trip.guidelines?.length > 0 && (
              <div>
                <h2 className="section-title">Guidelines & Policies</h2>
                <div className="space-y-2">
                  {trip.guidelines.map((g, i) => (
                    <div key={i} className="border-l-2 border-orange pl-4 py-2 text-white/60 text-sm">
                      {g}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Inclusions */}
            {trip.inclusions?.length > 0 && (
              <div className="glass-card p-5">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <i className="fas fa-check-circle text-green-400" /> Inclusions
                </h3>
                <ul className="space-y-2">
                  {trip.inclusions.map((x, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/65">
                      <span className="text-green-400 font-bold mt-0.5">✓</span>{x}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Exclusions */}
            {trip.exclusions?.length > 0 && (
              <div className="glass-card p-5">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <i className="fas fa-times-circle text-red-400" /> Exclusions
                </h3>
                <ul className="space-y-2">
                  {trip.exclusions.map((x, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/65">
                      <span className="text-red-400 font-bold mt-0.5">✗</span>{x}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Contact */}
            {trip.contact && (
              <div className="glass-card p-5">
                <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                  <i className="fas fa-phone text-orange" /> Contact
                </h3>
                <p className="text-white/45 text-xs leading-relaxed mb-4">{trip.contact.note}</p>
                {trip.contact.nums?.map(n => (
                  <div key={n} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 mb-2">
                    <i className="fas fa-phone-alt text-orange text-xs" />
                    <span className="text-white font-bold text-sm">{n}</span>
                  </div>
                ))}
                <a href="https://wa.me/7676386711" target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366]/15 border border-[#25D366]/30
                             text-[#25D366] font-bold text-sm py-3 rounded-xl mt-3 hover:bg-[#25D366]/25 transition-colors">
                  <i className="fab fa-whatsapp" /> WhatsApp Us
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {showBooking && <BookingModal trip={trip} onClose={() => setShowBooking(false)} />}
    </div>
  )
}
