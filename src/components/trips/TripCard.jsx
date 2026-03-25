import { useNavigate } from 'react-router-dom'
import { TRIP_IMGS } from '@/data/images'
import { CCOLORS, formatPrice, diffClass, stars } from '@/utils/helpers'

export default function TripCard({ trip }) {
  const navigate = useNavigate()
  const img = trip.imgKey && TRIP_IMGS[trip.imgKey]

  return (
    <div
      onClick={() => navigate(`/trips/${trip.id}`)}
      className="glass-card overflow-hidden cursor-pointer group
                 hover:-translate-y-1 hover:border-orange/30
                 transition-all duration-300"
    >
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        {img ? (
          <img
            src={img}
            alt={trip.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-6xl"
            style={{ background: `linear-gradient(${CCOLORS[trip.cat] || '135deg,#2F4F2F,#7B4B1A'})` }}
          >
            {trip.em}
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {trip.available && (
            <span className="badge-available">
              <i className="fas fa-check-circle text-[10px]" /> Available
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <span className={diffClass(trip.diff)}>
            {trip.diff}
          </span>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
          <div className="text-white/70 text-xs flex gap-2">
            <span>📍 {trip.dist}</span>
            <span>⏱ {trip.dur}</span>
          </div>
          <div className="text-xs text-white/50">{trip.slots} slots left</div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="font-bold text-white text-sm mb-1 line-clamp-2 group-hover:text-orange transition-colors">
          {trip.name}
        </h3>

        <div className="flex items-center gap-1 mb-3">
          <span className="text-orange text-xs">{stars(trip.rating)}</span>
          <span className="text-white/40 text-xs">({trip.reviews})</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            {trip.oldPrice && (
              <div className="text-white/30 text-xs line-through">{formatPrice(trip.oldPrice)}</div>
            )}
            <div className="text-orange font-bold text-base">{formatPrice(trip.price)}</div>
            <div className="text-white/35 text-[10px]">per person Breakfast Included</div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/trips/${trip.id}`) }}
            className="btn-primary text-xs px-4 py-2"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  )
}
