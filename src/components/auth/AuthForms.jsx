import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth'
import { auth, googleProvider } from '@/firebase'
import { useStore } from '@/store/useStore'
import toast from 'react-hot-toast'

const Logo = () => (
  <div className="flex flex-col items-center mb-8">
    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
      <svg viewBox="0 0 34 34" fill="none" className="w-9 h-9">
        <polyline points="3,27 11,13 16,20 22,9 31,27"
          stroke="#E39B3A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="22" cy="7.5" r="2.2" fill="#E39B3A"/>
      </svg>
    </div>
    <h1 className="text-2xl font-black text-white">Trip Karunadu</h1>
  </div>
)

const GoogleBtn = ({ onClick, label }) => (
  <button onClick={onClick}
    className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10
               rounded-xl py-3 text-white font-semibold text-sm hover:bg-white/10
               hover:border-white/20 transition-all">
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
    {label}
  </button>
)

/* ══ LOGIN ══ */
export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { setUser } = useStore()
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!email || !password) return toast.error('Fill in all fields')
    setLoading(true)
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      setUser({ uid: cred.user.uid, name: cred.user.displayName || email.split('@')[0], email: cred.user.email, photo: cred.user.photoURL })
      toast.success('Welcome back!')
      navigate('/')
    } catch (e) {
      toast.error(e.code === 'auth/invalid-credential' ? 'Invalid email or password' : e.message)
    } finally { setLoading(false) }
  }

  const handleGoogle = async () => {
    try {
      const cred = await signInWithPopup(auth, googleProvider)
      setUser({ uid: cred.user.uid, name: cred.user.displayName, email: cred.user.email, photo: cred.user.photoURL })
      toast.success('Welcome!')
      navigate('/')
    } catch (e) { toast.error(e.message) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0d1a0d]">
      <div className="w-full max-w-sm">
        <Logo />
        <div className="glass-card p-8">
          <h2 className="text-xl font-bold text-white mb-1">Welcome Back</h2>
          <p className="text-white/40 text-sm mb-6">Sign in to your account</p>

          <div className="space-y-4 mb-6">
            <input className="form-input" type="email" placeholder="Email address"
              value={email} onChange={e => setEmail(e.target.value)} />
            <input className="form-input" type="password" placeholder="Password"
              value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          </div>

          <button onClick={handleLogin} disabled={loading} className="btn-primary w-full mb-4 py-3">
            {loading ? <i className="fas fa-spinner fa-spin mr-2" /> : null}
            {loading ? 'Signing in...' : 'Login'}
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/30 text-xs">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <GoogleBtn onClick={handleGoogle} label="Continue with Google" />

          <p className="text-center text-white/40 text-sm mt-6">
            No account?{' '}
            <Link to="/signup" className="text-orange hover:underline">Sign Up</Link>
          </p>
          <p className="text-center mt-2">
            <Link to="/admin/login" className="text-white/25 text-xs hover:text-white/50">Admin Login →</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

/* ══ SIGNUP ══ */
export function Signup() {
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { setUser } = useStore()
  const navigate = useNavigate()

  const handleSignup = async () => {
    if (!name || !email || !password) return toast.error('Fill in all fields')
    if (password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(cred.user, { displayName: name })
      setUser({ uid: cred.user.uid, name, email, photo: null })
      toast.success('Account created! Welcome to Trip Karunadu 🏔️')
      navigate('/')
    } catch (e) {
      toast.error(e.code === 'auth/email-already-in-use' ? 'Email already registered' : e.message)
    } finally { setLoading(false) }
  }

  const handleGoogle = async () => {
    try {
      const cred = await signInWithPopup(auth, googleProvider)
      setUser({ uid: cred.user.uid, name: cred.user.displayName, email: cred.user.email, photo: cred.user.photoURL })
      toast.success('Welcome to Trip Karunadu! 🏔️')
      navigate('/')
    } catch (e) { toast.error(e.message) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0d1a0d]">
      <div className="w-full max-w-sm">
        <Logo />
        <div className="glass-card p-8">
          <h2 className="text-xl font-bold text-white mb-1">Join Us</h2>
          <p className="text-white/40 text-sm mb-6">Create your Trip Karunadu account</p>

          <div className="space-y-4 mb-6">
            <input className="form-input" type="text" placeholder="Full name"
              value={name} onChange={e => setName(e.target.value)} />
            <input className="form-input" type="email" placeholder="Email address"
              value={email} onChange={e => setEmail(e.target.value)} />
            <input className="form-input" type="password" placeholder="Create a password"
              value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSignup()} />
          </div>

          <button onClick={handleSignup} disabled={loading} className="btn-primary w-full mb-4 py-3">
            {loading ? <i className="fas fa-spinner fa-spin mr-2" /> : null}
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/30 text-xs">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <GoogleBtn onClick={handleGoogle} label="Sign up with Google" />

          <p className="text-center text-white/40 text-sm mt-6">
            Have an account?{' '}
            <Link to="/login" className="text-orange hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
