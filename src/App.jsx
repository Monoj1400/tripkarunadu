import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from '@/components/layout/Layout'
import { useAuth } from '@/hooks/useAuth'

import HomePage       from '@/pages/HomePage'
import TripsPage      from '@/pages/TripsPage'
import TripDetailPage from '@/pages/TripDetailPage'
import ProfilePage    from '@/pages/ProfilePage'
import AboutPage      from '@/pages/AboutPage'
import { Login, Signup }             from '@/components/auth/AuthForms'
import { AdminLogin, AdminDashboard } from '@/pages/AdminPages'
import ContactBookingPage from '@/pages/ContactBookingPage'

function AppRoutes() {
  useAuth() // sync Firebase auth state to Zustand

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/contact-booking" element={<ContactBookingPage />} />
        <Route path="/"              element={<HomePage />} />
        <Route path="/trips"         element={<TripsPage />} />
        <Route path="/trips/:id"     element={<TripDetailPage />} />
        <Route path="/profile"       element={<ProfilePage />} />
        <Route path="/about"         element={<AboutPage />} />
        <Route path="/login"         element={<Login />} />
        <Route path="/signup"        element={<Signup />} />
        <Route path="/admin/login"   element={<AdminLogin />} />
        <Route path="/admin"         element={<AdminDashboard />} />
        <Route path="*"              element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(30,50,30,0.95)',
            border:     '1px solid rgba(227,155,58,0.25)',
            color:      '#fff',
            fontSize:   '0.875rem',
            fontFamily: 'Poppins, sans-serif',
          },
          success: { iconTheme: { primary: '#E39B3A', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#ff6b6b', secondary: '#fff' } },
        }}
      />
    </BrowserRouter>
  )
}
