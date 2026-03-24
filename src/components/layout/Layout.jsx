import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './Navbar'
import Footer from './Footer'
import WhatsAppFloat from '@/components/ui/WhatsAppFloat'

const AUTH_ROUTES = ['/login', '/signup', '/admin/login']

export default function Layout() {
  const location = useLocation()
  const isAuth = AUTH_ROUTES.includes(location.pathname)

  return (
    <div className="min-h-screen bg-[#0d1a0d] font-poppins">
      {!isAuth && <Navbar />}
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className={isAuth ? '' : 'pt-16'}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      {!isAuth && <Footer />}
      {!isAuth && <WhatsAppFloat />}
    </div>
  )
}
