import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebase'
import { useStore } from '@/store/useStore'

// ← Add your admin email here
const ADMIN_EMAILS = [
  'monojkuamar0@gmail.com',   // replace with your actual email
]

export function useAuth() {
  const { setUser, setIsAdmin, logout } = useStore()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const isAdmin = ADMIN_EMAILS.includes(firebaseUser.email)
        setUser({
          uid:   firebaseUser.uid,
          name:  firebaseUser.displayName || firebaseUser.email.split('@')[0],
          email: firebaseUser.email,
          photo: firebaseUser.photoURL,
        })
        setIsAdmin(isAdmin)
      } else {
        logout()
      }
    })
    return unsub
  }, [])
}