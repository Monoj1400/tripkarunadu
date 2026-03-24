import { useState, useEffect } from 'react'
import { useNavigate, Link }   from 'react-router-dom'
import { useStore }            from '@/store/useStore'
import { TRIPS }               from '@/data/trips'
import { TRIP_IMGS }           from '@/data/images'
import { CCOLORS, formatPrice } from '@/utils/helpers'
import toast                   from 'react-hot-toast'
import QRCode                  from 'qrcode'
import {
  collection, onSnapshot,
  doc, updateDoc, query,
} from 'firebase/firestore'
import { db } from '@/firebase'

/* ══════════════════════════════════════════
   ADMIN LOGIN
══════════════════════════════════════════ */
export function AdminLogin() {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const { setIsAdmin }  = useStore()
  const navigate        = useNavigate()

  const handleLogin = () => {
    if (user === 'admin' && pass === 'admin123') {
      setIsAdmin(true)
      toast.success('Admin access granted')
      navigate('/admin')
    } else {
      toast.error('Invalid admin credentials')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0d1a0d]">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-orange/10 border border-orange/20
                          flex items-center justify-center mb-4">
            <i className="fas fa-shield-alt text-orange text-xl" />
          </div>
          <h1 className="text-2xl font-black text-white">Admin Login</h1>
          <p className="text-white/35 text-sm mt-1">Trip Karunadu Dashboard</p>
        </div>
        <div className="glass-card p-8">
          <div className="space-y-4 mb-6">
            <input className="form-input" placeholder="Username"
              value={user} onChange={e => setUser(e.target.value)} />
            <input className="form-input" type="password" placeholder="Password"
              value={pass} onChange={e => setPass(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          </div>
          <button onClick={handleLogin} className="btn-primary w-full py-3">
            <i className="fas fa-sign-in-alt mr-2" /> Login as Admin
          </button>
          <p className="text-center mt-4">
            <Link to="/login" className="text-white/30 text-xs hover:text-white/50">← Back to login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   STATUS BADGE
══════════════════════════════════════════ */
function StatusBadge({ status }) {
  const map = {
    pending:   { cls: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30', label: '⏳ Pending' },
    confirmed: { cls: 'bg-green-500/20  text-green-400  border border-green-500/30',  label: '✓ Confirmed' },
    cancelled: { cls: 'bg-red-500/20    text-red-400    border border-red-500/30',    label: '✕ Cancelled' },
  }
  const { cls, label } = map[status] ?? map.pending
  return (
    <span className={`${cls} text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap`}>
      {label}
    </span>
  )
}

/* ══════════════════════════════════════════
   ADMIN DASHBOARD
══════════════════════════════════════════ */
export function AdminDashboard() {
  const { isAdmin } = useStore()
  const navigate    = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [bookings,  setBookings]  = useState([])
  const [loading,   setLoading]   = useState(true)

  // ── Real-time Firestore listener ──────────────────────────────────────────
  // NO orderBy — we sort client-side to avoid needing a Firestore composite index
  useEffect(() => {
    const q    = query(collection(db, 'bookings'))
    const unsub = onSnapshot(q,
      snap => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        // Sort newest first on the client
        data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
        setBookings(data)
        setLoading(false)
      },
      err => {
        console.error('Firestore error:', err)
        toast.error('Could not load bookings — check Firestore rules')
        setLoading(false)
      }
    )
    return unsub
  }, [])

  useEffect(() => {
    if (!isAdmin) navigate('/admin/login')
  }, [isAdmin, navigate])

  if (!isAdmin) return null

  // ── KPI calculations ──────────────────────────────────────────────────────
  const pending   = bookings.filter(b => b.status === 'pending')
  const confirmed = bookings.filter(b => b.status === 'confirmed')
  const revenue   = confirmed.reduce((s, b) => s + (Number(b.amount) || 0), 0)

  const now  = new Date()
  const week = bookings.filter(b => {
    if (!b.createdAt?.seconds) return false
    return (now - new Date(b.createdAt.seconds * 1000)) / 86400000 <= 7
  }).length

  const KPI = [
    { label: 'Total Bookings', value: bookings.length,    icon: 'fa-ticket-alt',    color: 'text-orange' },
    { label: 'Pending',        value: pending.length,     icon: 'fa-clock',         color: 'text-yellow-400' },
    { label: 'Confirmed',      value: confirmed.length,   icon: 'fa-check-circle',  color: 'text-green-400' },
    { label: 'Revenue',        value: formatPrice(revenue),icon: 'fa-rupee-sign',   color: 'text-blue-400' },
  ]

  const TABS = ['overview', 'bookings', 'trips', 'generate ticket']
  const TAB_ICONS = {
    overview:          'fa-chart-bar',
    bookings:          'fa-list',
    trips:             'fa-mountain',
    'generate ticket': 'fa-qrcode',
  }

  // ── Confirm / Cancel ──────────────────────────────────────────────────────
  const updateStatus = async (bookingId, status) => {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), { status })
      toast.success(`Booking ${status}!`)
    } catch (e) {
      console.error(e)
      toast.error('Update failed — check Firestore rules')
    }
  }

  // ── Token display helper ──────────────────────────────────────────────────
  const TokenInfo = ({ email }) => {
    const confirmedForUser = bookings.filter(
      b => b.userEmail === email && b.status === 'confirmed'
    ).length
    const tokens    = confirmedForUser * 5
    const eligible  = tokens > 0 && tokens % 50 === 0
    if (tokens === 0) return <span className="text-[10px] text-white/30">0 tokens</span>
    return (
      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 w-fit ${
        eligible
          ? 'bg-green-500/20 text-green-400 border border-green-500/30 animate-pulse'
          : 'bg-orange/10 text-orange border border-orange/20'
      }`}>
        <i className="fas fa-fire" /> {tokens} tokens {eligible && '🎁 10% OFF'}
      </span>
    )
  }

  const formatDate = (ts) =>
    ts?.seconds ? new Date(ts.seconds * 1000).toLocaleDateString('en-IN') : '—'

  return (
    <div className="min-h-screen flex">
      {/* ── Sidebar ── */}
      <aside className="w-56 bg-[#080f08] border-r border-white/8 flex-col pt-8 px-4 hidden md:flex">
        <div className="flex items-center gap-2 mb-10 px-2">
          <i className="fas fa-shield-alt text-orange" />
          <span className="font-bold text-white text-sm">Admin Panel</span>
        </div>

        {TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-1
                        transition-colors capitalize ${
              activeTab === t
                ? 'bg-orange/10 text-orange border border-orange/20'
                : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}>
            <i className={`fas ${TAB_ICONS[t]} text-xs w-4`} />
            {t}
            {/* Pending badge on bookings tab */}
            {t === 'bookings' && pending.length > 0 && (
              <span className="ml-auto bg-yellow-500 text-black text-[10px] font-black
                               w-5 h-5 rounded-full flex items-center justify-center">
                {pending.length}
              </span>
            )}
          </button>
        ))}

        <div className="mt-auto pb-6">
          <Link to="/" className="flex items-center gap-2 text-white/30 hover:text-white/60 text-xs px-3 transition-colors">
            <i className="fas fa-arrow-left text-xs" /> Back to site
          </Link>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-black text-white mb-1 capitalize">
          {activeTab === 'overview' ? 'Dashboard' : activeTab}
        </h1>
        <p className="text-white/30 text-sm mb-8">Trip Karunadu Admin</p>

        {/* ════ OVERVIEW ════ */}
        {activeTab === 'overview' && (
          <>
            {/* KPI cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {KPI.map(k => (
                <div key={k.label} className="glass-card p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/35 text-xs uppercase tracking-wider">{k.label}</span>
                    <i className={`fas ${k.icon} ${k.color} text-sm`} />
                  </div>
                  <div className={`text-2xl font-black ${k.color}`}>{k.value}</div>
                </div>
              ))}
            </div>

            {/* Chart — weekly bar */}
            <div className="glass-card p-5 mb-6">
              <h2 className="font-bold text-white text-sm mb-4">Booking Activity (Last 7 Days)</h2>
              {(() => {
                const days = Array.from({ length: 7 }, (_, i) => {
                  const d = new Date()
                  d.setDate(d.getDate() - (6 - i))
                  return d
                })
                const counts = days.map(day =>
                  bookings.filter(b => {
                    if (!b.createdAt?.seconds) return false
                    const bd = new Date(b.createdAt.seconds * 1000)
                    return bd.toDateString() === day.toDateString()
                  }).length
                )
                const maxCount = Math.max(...counts, 1)
                const dayLabels = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
                return (
                  <div className="flex items-end gap-2 h-32">
                    {days.map((day, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="text-white/50 text-[10px] font-bold">{counts[i] || ''}</div>
                        <div className="w-full rounded-t-md bg-orange/20 relative overflow-hidden"
                          style={{ height: `${(counts[i] / maxCount) * 90 + 8}px` }}>
                          <div className="absolute inset-0 bg-gradient-to-t from-orange to-orange-l opacity-80 rounded-t-md" />
                        </div>
                        <div className="text-white/30 text-[10px]">{dayLabels[day.getDay()]}</div>
                      </div>
                    ))}
                  </div>
                )
              })()}
            </div>

            {/* Recent bookings table */}
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-white">Recent Bookings</h2>
                <button onClick={() => setActiveTab('bookings')}
                  className="text-orange text-xs hover:underline">View all →</button>
              </div>
              {loading ? (
                <p className="text-white/30 text-sm">Loading...</p>
              ) : bookings.length === 0 ? (
                <p className="text-white/30 text-sm">No bookings yet.</p>
              ) : (
                <div className="space-y-3">
                  {bookings.slice(0, 5).map(b => (
                    <div key={b.id} className="flex items-center justify-between p-3 bg-white/3 rounded-xl">
                      <div>
                        <div className="text-white text-sm font-semibold">{b.tripName}</div>
                        <div className="text-white/40 text-xs mt-0.5">{b.userName} · {b.seats} seat{b.seats > 1 ? 's' : ''}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-orange font-bold text-sm">{formatPrice(b.amount)}</span>
                        <StatusBadge status={b.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ════ BOOKINGS ════ */}
        {activeTab === 'bookings' && (
          <div>
            {/* Pending alert banner */}
            {pending.length > 0 && (
              <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/20
                              rounded-2xl px-5 py-4 mb-6">
                <i className="fas fa-bell text-yellow-400 animate-pulse" />
                <p className="text-yellow-400 font-semibold text-sm">
                  {pending.length} booking{pending.length > 1 ? 's' : ''} waiting for confirmation
                </p>
              </div>
            )}

            {loading ? (
              <div className="glass-card p-10 text-center text-white/30">
                <i className="fas fa-spinner fa-spin text-2xl" />
              </div>
            ) : bookings.length === 0 ? (
              <div className="glass-card p-10 text-center text-white/30">
                <i className="fas fa-inbox text-4xl mb-3 block" />
                No booking requests yet.
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map(b => (
                  <div key={b.id}
                    className={`glass-card p-5 border transition-colors ${
                      b.status === 'pending'
                        ? 'border-yellow-500/20 bg-yellow-500/3'
                        : b.status === 'confirmed'
                        ? 'border-green-500/15'
                        : 'border-white/8'
                    }`}>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      {/* Left: info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <StatusBadge status={b.status} />
                          <span className="text-white/25 text-xs font-mono">
                            #{b.id?.slice(0, 8).toUpperCase()}
                          </span>
                          <span className="text-white/25 text-xs">{formatDate(b.createdAt)}</span>
                        </div>

                        <div className="text-white font-bold text-base mb-1">{b.tripName}</div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1 text-xs text-white/50 mb-2">
                          <span>👤 {b.userName}</span>
                          <span>✉️ {b.userEmail}</span>
                          <span>🎟 {b.seats} seat{b.seats > 1 ? 's' : ''}</span>
                          <span>💰 {formatPrice(b.amount)}</span>
                        </div>

                        {/* Token info */}
                        <TokenInfo email={b.userEmail} />
                      </div>

                      {/* Right: action buttons */}
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        {b.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateStatus(b.id, 'confirmed')}
                              className="flex items-center gap-2 px-4 py-2 rounded-xl
                                         bg-green-500/15 border border-green-500/30 text-green-400
                                         text-sm font-bold hover:bg-green-500/25 transition-colors">
                              <i className="fas fa-check" /> Confirm
                            </button>
                            <button
                              onClick={() => updateStatus(b.id, 'cancelled')}
                              className="flex items-center gap-2 px-4 py-2 rounded-xl
                                         bg-red-500/10 border border-red-500/20 text-red-400
                                         text-sm font-bold hover:bg-red-500/20 transition-colors">
                              <i className="fas fa-times" /> Cancel
                            </button>
                          </>
                        )}
                        {b.status === 'confirmed' && (
                          <button
                            onClick={() => updateStatus(b.id, 'cancelled')}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl
                                       bg-red-500/10 border border-red-500/20 text-red-400
                                       text-sm font-bold hover:bg-red-500/20 transition-colors">
                            <i className="fas fa-times" /> Cancel
                          </button>
                        )}
                        {b.status === 'cancelled' && (
                          <button
                            onClick={() => updateStatus(b.id, 'confirmed')}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl
                                       bg-green-500/15 border border-green-500/30 text-green-400
                                       text-sm font-bold hover:bg-green-500/25 transition-colors">
                            <i className="fas fa-undo" /> Re-confirm
                          </button>
                        )}
                        {/* Generate ticket shortcut */}
                        {b.status === 'confirmed' && (
                          <button
                            onClick={() => {
                              setActiveTab('generate ticket')
                              // Pass booking id via sessionStorage for auto-fill
                              sessionStorage.setItem('prefillBookingId', b.id)
                            }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl
                                       bg-orange/10 border border-orange/20 text-orange
                                       text-sm font-bold hover:bg-orange/20 transition-colors">
                            <i className="fas fa-qrcode" /> Generate Ticket
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ════ TRIPS ════ */}
        {activeTab === 'trips' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TRIPS.map(t => {
              const img = t.imgKey && TRIP_IMGS[t.imgKey]
              return (
                <div key={t.id} className="glass-card overflow-hidden">
                  <div className="h-28 relative overflow-hidden">
                    {img
                      ? <img src={img} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-4xl"
                          style={{ background: `linear-gradient(${CCOLORS[t.cat]})` }}>{t.em}</div>
                    }
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    {t.available && (
                      <div className="absolute top-2 left-2 badge-available text-[10px] px-2 py-0.5">
                        <i className="fas fa-check-circle" /> Live
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="font-bold text-white text-sm mb-1">{t.name}</div>
                    <div className="flex justify-between items-center">
                      <span className="text-orange font-bold text-sm">{formatPrice(t.price)}</span>
                      <span className="text-white/40 text-xs">{t.slots} slots</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => toast('Edit coming in v2 🛠️')}
                        className="flex-1 text-xs py-1.5 rounded-lg bg-white/5 border border-white/10
                                   text-white/60 hover:border-orange/50 hover:text-orange transition-colors">
                        Edit
                      </button>
                      <button onClick={() => toast('Delete coming in v2 🛠️')}
                        className="flex-1 text-xs py-1.5 rounded-lg bg-red-500/10 border border-red-500/20
                                   text-red-400 hover:bg-red-500/20 transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ════ GENERATE TICKET ════ */}
        {activeTab === 'generate ticket' && (
          <AdminTicketGenerator bookings={bookings} />
        )}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   ADMIN TICKET GENERATOR
══════════════════════════════════════════ */
function AdminTicketGenerator({ bookings }) {
  const [form, setForm] = useState({
    name: '', trip: '', seats: '', amount: '', date: '', phone: '',
  })
  const [qrUrl,          setQrUrl]          = useState('')
  const [ticketId,       setTicketId]       = useState('')
  const [generated,      setGenerated]      = useState(false)
  const [selectedBooking,setSelectedBooking]= useState('')

  // Auto-fill from bookings page "Generate Ticket" shortcut
  useEffect(() => {
    const prefillId = sessionStorage.getItem('prefillBookingId')
    if (prefillId && bookings.length > 0) {
      sessionStorage.removeItem('prefillBookingId')
      handleSelectBooking(prefillId)
    }
  }, [bookings])

  const handleSelectBooking = (id) => {
    setSelectedBooking(id)
    if (!id) return
    const b = bookings.find(b => b.id === id)
    if (b) setForm({
      name:   b.userName  || '',
      trip:   b.tripName  || '',
      seats:  String(b.seats  || ''),
      amount: String(b.amount || ''),
      date:   b.tripDate  || '',
      phone:  b.userPhone || '',
    })
    setGenerated(false)
    setQrUrl('')
    setTicketId('')
  }

  const genId = () => 'TK' + Date.now().toString(36).toUpperCase()

  const handleGenerate = async () => {
    if (!form.name || !form.trip || !form.seats || !form.amount) {
      toast.error('Please fill all required fields')
      return
    }
    const id = genId()
    setTicketId(id)
    const qrData =
      `TRIP KARUNADU | ID:${id} | Trip:${form.trip} | ` +
      `Name:${form.name} | Seats:${form.seats} | ` +
      `Amount:₹${form.amount} | Date:${form.date}`
    const url = await QRCode.toDataURL(qrData, { width: 300, margin: 2 })
    setQrUrl(url)
    setGenerated(true)

    // Mark the source booking as confirmed
    if (selectedBooking) {
      try {
        await updateDoc(doc(db, 'bookings', selectedBooking), { status: 'confirmed' })
        toast.success('Booking marked as confirmed!')
      } catch { /* non-fatal */ }
    }
  }

  const handleDownloadPDF = () => {
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Trip Karunadu Ticket — ${ticketId}</title>
  <style>
    * { box-sizing:border-box; margin:0; padding:0; }
    body { font-family:'Segoe UI',Arial,sans-serif; background:#fff; color:#111; }
    .ticket { max-width:420px; margin:40px auto; border:2px solid #E39B3A; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,.12); }
    .header { background:#0d1a0d; color:#E39B3A; padding:24px; text-align:center; }
    .header h1 { font-size:22px; font-weight:900; letter-spacing:1px; }
    .header p  { font-size:11px; color:rgba(255,255,255,.4); margin-top:4px; }
    .body { padding:24px; }
    .row { display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #f0f0f0; font-size:14px; }
    .row:last-child { border-bottom:none; }
    .label { color:#888; }
    .value { font-weight:700; }
    .qr-wrap { text-align:center; padding:16px 0 8px; }
    .qr-wrap img { width:160px; height:160px; }
    .booking-id { text-align:center; font-size:11px; color:#888; margin-bottom:4px; }
    .booking-id span { font-weight:900; color:#E39B3A; font-family:monospace; font-size:13px; }
    .footer { background:#f9f9f9; padding:14px 24px; text-align:center; font-size:11px; color:#999; border-top:1px solid #eee; }
    .badge { display:inline-block; background:#E39B3A; color:#fff; font-size:10px; font-weight:900; padding:3px 10px; border-radius:999px; margin-bottom:12px; }
  </style>
</head>
<body>
  <div class="ticket">
    <div class="header">
      <div class="badge">CONFIRMED TICKET</div>
      <h1>Trip Karunadu</h1>
      <p>Official Booking Confirmation</p>
    </div>
    <div class="body">
      <div class="row"><span class="label">Trip</span><span class="value">${form.trip}</span></div>
      <div class="row"><span class="label">Name</span><span class="value">${form.name}</span></div>
      <div class="row"><span class="label">Phone</span><span class="value">${form.phone || '—'}</span></div>
      <div class="row"><span class="label">Seats</span><span class="value">${form.seats}</span></div>
      <div class="row"><span class="label">Amount Paid</span><span class="value">₹${form.amount}</span></div>
      <div class="row"><span class="label">Trip Date</span><span class="value">${form.date || '—'}</span></div>
      <div class="qr-wrap"><img src="${qrUrl}" alt="QR Code" /></div>
      <div class="booking-id">Booking ID: <span>${ticketId}</span></div>
    </div>
    <div class="footer">
      Scan QR at pickup point &nbsp;•&nbsp; Carry valid Govt ID<br/>
      +91 9900980260 &nbsp;|&nbsp; +91 7676386711
    </div>
  </div>
  <script>window.onload = () => window.print()</script>
</body>
</html>`
    const win = window.open('', '_blank')
    win.document.write(html)
    win.document.close()
  }

  const reset = () => {
    setForm({ name: '', trip: '', seats: '', amount: '', date: '', phone: '' })
    setQrUrl('')
    setTicketId('')
    setGenerated(false)
    setSelectedBooking('')
  }

  const Field = ({ label, field, placeholder, type = 'text' }) => (
    <div>
      <label className="text-white/40 text-xs mb-1 block">{label}</label>
      <input type={type} className="form-input" placeholder={placeholder}
        value={form[field]}
        onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} />
    </div>
  )

  const pendingBookings = bookings.filter(b => b.status === 'pending')

  return (
    <div className="max-w-lg">
      <div className="glass-card p-6 mb-6">
        <h2 className="font-bold text-white mb-1">Generate QR Ticket</h2>
        <p className="text-white/35 text-xs mb-6">
          Create a ticket after receiving payment. This auto-confirms the booking.
        </p>

        {/* Auto-fill from pending booking */}
        {pendingBookings.length > 0 && (
          <div className="mb-5">
            <label className="text-white/40 text-xs mb-1 block">
              Auto-fill from Pending Booking
            </label>
            <select className="form-input" value={selectedBooking}
              onChange={e => handleSelectBooking(e.target.value)}>
              <option value="">— Select a pending booking —</option>
              {pendingBookings.map(b => (
                <option key={b.id} value={b.id}>
                  {b.userName} · {b.tripName} · {formatPrice(b.amount)}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="space-y-4 mb-6">
          <Field label="Customer Name *"     field="name"   placeholder="Full name" />
          <Field label="Phone Number"        field="phone"  placeholder="+91 XXXXXXXXXX" />
          <Field label="Trip Name *"         field="trip"   placeholder="e.g. Nandi Hills Sunrise Trek" />
          <Field label="Number of Seats *"   field="seats"  placeholder="e.g. 2"    type="number" />
          <Field label="Total Amount Paid *" field="amount" placeholder="e.g. 1598" type="number" />
          <Field label="Trip Date"           field="date"   placeholder="e.g. 29 Mar 2025" />
        </div>

        {!generated ? (
          <button onClick={handleGenerate} className="btn-primary w-full py-3">
            <i className="fas fa-qrcode mr-2" /> Generate QR Ticket
          </button>
        ) : (
          <div className="text-center">
            <div className="bg-white p-4 rounded-2xl inline-block mb-4">
              <img src={qrUrl} alt="QR" className="w-44 h-44" />
            </div>
            <div className="text-white/50 text-xs mb-1">Booking ID</div>
            <div className="text-orange font-bold font-mono mb-5">{ticketId}</div>
            <div className="glass-card p-4 text-left space-y-2 mb-5">
              {[
                ['Trip',    form.trip],
                ['Name',    form.name],
                ['Phone',   form.phone],
                ['Seats',   form.seats],
                ['Amount',  `₹${form.amount}`],
                ['Date',    form.date],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between text-sm">
                  <span className="text-white/40">{l}</span>
                  <span className="text-white font-semibold">{v || '—'}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={handleDownloadPDF} className="btn-outline flex-1 py-2.5 text-sm">
                <i className="fas fa-download mr-2" /> Download PDF
              </button>
              <button onClick={reset} className="btn-primary flex-1 py-2.5 text-sm">
                <i className="fas fa-plus mr-2" /> New Ticket
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}