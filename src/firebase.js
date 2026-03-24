import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyBIQ2d6KOvVl_LjRsCuP3mBqiXA-Oq-hLY',
  authDomain: 'trip-karunadu-bce56.firebaseapp.com',
  projectId: 'trip-karunadu-bce56',
  storageBucket: 'trip-karunadu-bce56.firebasestorage.app',
  messagingSenderId: '23808496559',
  appId: '1:23808496559:web:127358255aea23253cd55a',
}

// Init
const app = initializeApp(firebaseConfig)

// Auth
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

// Firestore
export const db = getFirestore(app)