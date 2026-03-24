import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { formatPrice } from '@/utils/helpers'

export default function BookingModal({ trip, onClose }) {
  const { user } = useStore()
  const [count, setCount] = useState(1)
  const navigate = useNavigate()

  const unitPrice = trip.price
  const total = unitPrice * count

  const handleProceed = () => {
    onClose()
    navigate('/contact-booking', {
      state: {
        tripName: trip.name,
        seats: count,
        total,
        userName: user?.name || '',
        userEmail: user?.email || '',
      }
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="glass-card w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div>
            <h2 className="font-bold text-white">Book Your Trip</h2>
            <p className="text-white/40 text-xs mt-0.5">{trip.name}</p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white p-1">
            <i className="fas fa-times" />
          </button>
        </div>

        <div className="p-5">
          {/* Trip info */}
          <div className="mb-5 p-4 bg-white/5 rounded-xl">
            <div className="text-white/50 text-xs mb-1">Selected Trip</div>
            <div className="font-bold text-white">{trip.name}</div>
            <div className="text-orange font-semibold text-sm mt-1">{formatPrice(trip.price)} per person</div>
          </div>

          {/* Ticket counter */}
          <div className="mb-5">
            <label className="text-white/50 text-xs mb-2 block">Number of Tickets</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCount(c => Math.max(1, c - 1))}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white font-bold hover:border-orange/50 transition-colors"
              >−</button>
              <span className="text-2xl font-bold text-white w-8 text-center">{count}</span>
              <button
                onClick={() => setCount(c => Math.min(trip.slots, c + 1))}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white font-bold hover:border-orange/50 transition-colors"
              >+</button>
            </div>
          </div>

          {/* Price summary */}
          <div className="bg-white/5 rounded-xl p-4 space-y-2 mb-6">
            <div className="flex justify-between text-sm text-white/60">
              <span>Unit price</span><span>{formatPrice(unitPrice)}</span>
            </div>
            <div className="flex justify-between text-sm text-white/60">
              <span>Tickets</span><span>×{count}</span>
            </div>
            <div className="flex justify-between font-bold text-white text-base pt-2 border-t border-white/10">
              <span>Total</span>
              <span className="text-orange">{formatPrice(total)}</span>
            </div>
          </div>

          {/* Info note */}
          <div className="flex items-start gap-3 bg-orange/10 border border-orange/20 rounded-xl p-4 mb-5">
            <i className="fas fa-info-circle text-orange mt-0.5" />
            <p className="text-white/70 text-xs leading-relaxed">
              After confirming your tickets, you'll be directed to contact our booking team
              to complete the payment and confirm your spot.
            </p>
          </div>

          <button onClick={handleProceed} className="btn-primary w-full py-3">
            <i className="fas fa-arrow-right mr-2" /> Confirm & Contact Booking Team
          </button>
        </div>
      </div>
    </div>
  )
}