import { Link, useLocation, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '@/firebase'
import { useStore } from '@/store/useStore'
import { useState } from 'react'

export default function Navbar() {
  const { user, isAdmin, logout } = useStore()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  const handleLogout = async () => {
    await signOut(auth)
    logout()
    navigate('/')
  }

  const navLink = (to, label) => (
    <Link
      to={to}
      onClick={() => setMenuOpen(false)}
      className={`text-sm font-semibold transition-colors px-1 pb-0.5 border-b-2 ${
        isActive(to)
          ? 'text-orange border-orange'
          : 'text-white/70 border-transparent hover:text-white'
      }`}
    >
      {label}
    </Link>
  )

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="mx-auto px-4 sm:px-8 h-16 flex items-center justify-between
                      bg-[rgba(13,26,13,0.85)] backdrop-blur-md border-b border-white/10">

        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <svg viewBox="0 0 34 34" fill="none" className="w-6 h-6">
              <polyline points="3,27 11,13 16,20 22,9 31,27"
                stroke="#E39B3A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="22" cy="7.5" r="2.2" fill="#E39B3A"/>
            </svg>
          </div>
          <span className="font-bold text-white text-lg tracking-tight group-hover:text-orange transition-colors">
            Trip Karunadu
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {navLink('/', 'Home')}
          {navLink('/trips', 'Trips')}
          {navLink('/about', 'About Us')}
          {isAdmin && navLink('/admin', 'Admin')}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/profile"
                className="flex items-center gap-2 bg-white/8 border border-white/10 rounded-full px-3 py-1.5 hover:border-orange/50 transition-colors">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange to-brown flex items-center justify-center text-xs font-bold">
                  {user.photo
                    ? <img src={user.photo} alt="" className="w-7 h-7 rounded-full object-cover"/>
                    : user.name[0].toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-white">{user.name.split(' ')[0]}</span>
              </Link>
              <button onClick={handleLogout}
                className="text-white/40 hover:text-white/70 text-xs transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-outline text-sm px-5 py-2">Login</Link>
              <Link to="/signup" className="btn-primary text-sm px-5 py-2">Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white/70 hover:text-white p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'} text-lg`}/>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[rgba(13,26,13,0.97)] border-b border-white/10 px-6 py-4 flex flex-col gap-4">
          {navLink('/', 'Home')}
          {navLink('/trips', 'Trips')}
          {navLink('/about', 'About Us')}
          {isAdmin && navLink('/admin', 'Admin')}
          <div className="pt-2 border-t border-white/10 flex gap-3">
            {user ? (
              <>
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="btn-outline text-sm px-4 py-2">Profile</Link>
                <button onClick={handleLogout} className="btn-ghost text-sm">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-outline text-sm px-4 py-2">Login</Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)} className="btn-primary text-sm px-4 py-2">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
