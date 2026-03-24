import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebase'
import { formatPrice } from '@/utils/helpers'
import toast from 'react-hot-toast'

export default function ContactBookingPage() {
  const { state } = useLocation()
  const navigate  = useNavigate()
  const [sending, setSending] = useState(false)
  const [requested, setRequested] = useState(false)

  if (!state) { navigate('/trips'); return null }

  const { tripName, seats, total, userName, userEmail } = state
  const WA_NUMBER = '919900980260'

  const waMessage = encodeURIComponent(
    `🏔️ *New Booking Request — Trip Karunadu*\n\n` +
    `*Trip:* ${tripName}\n` +
    `*Name:* ${userName}\n` +
    `*Email:* ${userEmail}\n` +
    `*Seats:* ${seats}\n` +
    `*Total:* ${formatPrice(total)}\n\n` +
    `Please confirm and share payment details.`
  )

  const handleRequest = async () => {
    setSending(true)
    
    try {
      // 1. Create a 4-second timeout
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Firebase timeout')), 4000)
      )

      // 2. The Firebase database request
      const saveToDb = addDoc(collection(db, 'bookings'), {
        tripName,
        userName,
        userEmail,
        seats,
        amount: total, // Admin page expects 'amount'
        status: 'pending',
        createdAt: serverTimestamp(),
      })

      // 3. Race them! If Firebase hangs, the timeout will trigger an error
      await Promise.race([saveToDb, timeout])
      
      toast.success('Booking request sent to Admin!')

    } catch (err) {
      console.error('Database error:', err)
      // Even if Firebase fails, we don't block the user!
      toast.error('Redirecting you to WhatsApp...')
    } finally {
      // 4. This ALWAYS runs, un-freezing the UI and opening WhatsApp
      setSending(false)
      setRequested(true)
      window.open(`https://wa.me/${WA_NUMBER}?text=${waMessage}`, '_blank')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-orange/10 border border-orange/20
                          flex items-center justify-center mx-auto mb-4">
            <i className={`fas ${requested ? 'fa-check-circle text-green-400' : 'fa-headset text-orange'} text-2xl`} />
          </div>
          <h1 className="text-2xl font-black text-white">
            {requested ? 'Request Sent!' : 'Almost There!'}
          </h1>
          <p className="text-white/45 text-sm mt-2">
            {requested
              ? 'Our team will contact you shortly to confirm payment'
              : 'Contact our booking team to complete your payment'}
          </p>
        </div>

        {/* Booking summary */}
        <div className="glass-card p-5 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-orange rounded-full" />
            <h2 className="font-bold text-white text-sm">Your Booking Summary</h2>
          </div>
          <div className="space-y-3">
            {[
              ['Trip',         tripName],
              ['Name',         userName],
              ['Email',        userEmail],
              ['Seats',        seats],
              ['Total Amount', formatPrice(total)],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-white/45 text-sm">{label}</span>
                <span className="text-white font-semibold text-sm text-right max-w-48 truncate">{value}</span>
              </div>
            ))}
          </div>

          {/* Request button */}
          {!requested ? (
            <button
              onClick={handleRequest}
              disabled={sending}
              className="btn-primary w-full py-3 mt-5"
            >
              {sending
                ? <><i className="fas fa-spinner fa-spin mr-2" />Sending...</>
                : <><i className="fas fa-paper-plane mr-2" />Request a Booking</>}
            </button>
          ) : (
            <div className="mt-5 bg-green-500/10 border border-green-500/20 rounded-xl
                            p-4 flex items-center gap-3">
              <i className="fas fa-check-circle text-green-400" />
              <div>
                <div className="text-green-400 font-bold text-sm">Request Received!</div>
                <div className="text-white/45 text-xs mt-0.5">
                  Our team will contact you on WhatsApp within 30 minutes
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contact card */}
        <div className="glass-card p-5 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-orange rounded-full" />
            <h2 className="font-bold text-white text-sm">
              Please contact the Booking Team before Payments
            </h2>
          </div>

          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/10">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <svg viewBox="0 0 34 34" fill="none" className="w-6 h-6">
                <polyline points="3,27 11,13 16,20 22,9 31,27"
                  stroke="#E39B3A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="22" cy="7.5" r="2.2" fill="#E39B3A"/>
              </svg>
            </div>
            <div>
              <div className="text-white font-bold text-sm">Trip Karunadu</div>
              <div className="text-white/40 text-xs">Official Booking Team</div>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-white/45 text-xs uppercase tracking-wider mb-3">Our Team</div>
            <div className="space-y-2">
              {['9900980260', '7676386711'].map(num => (
                <a key={num} href={`tel:+91${num}`}
                  className="flex items-center gap-3 bg-white/5 border border-white/10
                             rounded-xl px-4 py-3 hover:border-orange/40 transition-colors group">
                  <i className="fas fa-phone-alt text-orange text-sm" />
                  <span className="text-white font-bold">+91 {num}</span>
                  <i className="fas fa-chevron-right text-white/20 text-xs ml-auto group-hover:text-orange transition-colors" />
                </a>
              ))}
            </div>
          </div>

          <a href={`https://wa.me/${WA_NUMBER}?text=${waMessage}`}
            target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-3 w-full py-3.5 rounded-xl
                       bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366]
                       font-bold hover:bg-[#25D366]/25 transition-colors">
            <i className="fab fa-whatsapp text-xl" />
            WhatsApp Us
          </a>
        </div>

        {/* Next steps */}
        <div className="glass-card p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-orange rounded-full" />
            <h2 className="font-bold text-white text-sm">Next Steps</h2>
          </div>
          <div className="space-y-3">
            {[
              ['1', 'Click "Request a Booking" above to notify our team'],
              ['2', 'Contact our team via WhatsApp or call'],
              ['3', 'Complete the payment as directed by our team'],
              ['4', 'Admin generates your QR ticket after payment confirmation'],
            ].map(([step, text]) => (
              <div key={step} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-orange/15 border border-orange/30
                                flex items-center justify-center text-orange text-xs font-bold flex-shrink-0 mt-0.5">
                  {step}
                </div>
                <span className="text-white/60 text-sm leading-relaxed">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => navigate('/trips')} className="btn-outline w-full py-3 text-sm">
          <i className="fas fa-arrow-left mr-2" /> Back to Trips
        </button>

      </div>
    </div>
  )
}