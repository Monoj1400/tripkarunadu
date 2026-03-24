import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth, db } from '@/firebase' // Make sure db is imported
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { useStore } from '@/store/useStore'
import { formatPrice } from '@/utils/helpers'

export default function ProfilePage() {
  // We removed 'tokens' and 'bookings' from useStore because we will fetch live, accurate data
  const { user, logout } = useStore()
  const navigate = useNavigate()
  
  const [myBookings, setMyBookings] = useState([])
  const[tokens, setTokens] = useState(0)

  // Fetch user's bookings live from Firestore
  useEffect(() => {
    if (!user?.email) return

    const q = query(
      collection(db, 'bookings'),
      where('userEmail', '==', user.email)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedBookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      
      // Sort so newest bookings show up first
      fetchedBookings.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
      setMyBookings(fetchedBookings)

      // CALCULATE TOKENS: Only count trips the Admin has marked as 'confirmed'
      const confirmedBookings = fetchedBookings.filter(b => b.status === 'confirmed')
      setTokens(confirmedBookings.length * 5) // 5 tokens per confirmed trip
    })

    return () => unsubscribe()
  }, [user])

  if (!user) {
    navigate('/login')
    return null
  }

  const handleLogout = async () => {
    await signOut(auth)
    logout()
    navigate('/')
  }

  // Token Math Logic
  const remainder = tokens % 50
  const hasDiscount = tokens > 0 && remainder === 0
  const tokensNeeded = 50 - remainder
  // If they have 50 tokens, progress is 100%. Otherwise, calculate percentage.
  const progress = hasDiscount ? 100 : (remainder / 50) * 100

  return (
    <div className="min-h-screen max-w-3xl mx-auto px-4 sm:px-6 py-10">

      {/* Profile hero */}
      <div className="glass-card p-6 mb-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange to-brown
                        flex items-center justify-center text-2xl font-black text-white flex-shrink-0 overflow-hidden">
          {user.photo
            ? <img src={user.photo} alt="" className="w-full h-full object-cover" />
            : user.name[0].toUpperCase()}
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-black text-white">{user.name}</h1>
          <p className="text-white/40 text-sm">{user.email}</p>
          <div className="mt-2 inline-flex items-center gap-1.5 bg-orange/10 border border-orange/20
                          text-orange text-xs font-bold px-3 py-1 rounded-full">
            <i className="fas fa-fire" /> Active Trekker
          </div>
        </div>
        <button onClick={handleLogout}
          className="btn-outline text-sm px-4 py-2 flex items-center gap-2">
          <i className="fas fa-sign-out-alt" /> Logout
        </button>
      </div>

      {/* TrailBlaze Tokens */}
      <div className="glass-card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-white/40 text-xs uppercase tracking-widest mb-1">TrailBlaze Tokens Coming Soon </div>
            <div className="text-4xl font-black text-orange">{tokens}</div>
          </div>
          <div className="text-right text-xs text-white/30">
            <div>5 tokens per trek 
            </div>
            <div className="mt-1">50 tokens = 10% off </div>
          </div>
        </div>
        
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${hasDiscount ? 'bg-green-500' : 'bg-gradient-to-r from-orange to-[#ffb86c]'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <p className={`text-xs mt-3 font-medium ${hasDiscount ? 'text-green-400 animate-pulse' : 'text-white/40'}`}>
          {hasDiscount
            ? '🎉 Loyalty discount active! Mention this on WhatsApp for 10% off your next booking.'
            : `${tokensNeeded} We’re currently in the process of building and refining these features to serve you better. They will be available very soon!

In the meantime, please keep your ticket as a reference. Once the updates are live, we’ll ensure you receive your eligible discount if you meet the criteria.

Thank you for your patience and support 🙌    `}
        </p>
      </div>
  {/* Booking history */}
      <h2 className="text-white font-bold text-lg mb-4">Trip History</h2>
      {myBookings.length === 0 ? (
        <div className="glass-card p-10 text-center text-white/30">
          <i className="fas fa-mountain text-4xl mb-4 block" />
          <p>No trips yet — start exploring! 🏔️</p>
          <button onClick={() => navigate('/trips')} className="btn-primary mt-4 px-6 py-2 text-sm">
            Browse Trips
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {myBookings.map(b => (
            <div key={b.id} className="glass-card p-5 flex items-center justify-between gap-4">
              <div>
                <div className="text-white font-semibold text-sm">{b.tripName}</div>
                <div className="text-white/40 text-xs mt-0.5">
                  {b.seats} seat{b.seats > 1 ? 's' : ''} · {formatPrice(b.amount)}
                </div>
                <div className="text-white/25 text-[10px] font-mono mt-1">ID: {b.id.slice(0,8).toUpperCase()}</div>
              </div>
              
              {/* Dynamic Status Badge */}
              {b.status === 'confirmed' ? (
                <span className="bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold px-2.5 py-1 rounded-md whitespace-nowrap">
                  ✓ Confirmed
                </span>
              ) : b.status === 'cancelled' ? (
                <span className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold px-2.5 py-1 rounded-md whitespace-nowrap">
                  ✕ Cancelled
                </span>
              ) : (
                <span className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[10px] font-bold px-2.5 py-1 rounded-md whitespace-nowrap">
                  ⏳ Pending Payment
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}