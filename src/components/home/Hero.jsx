import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Hero() {
  const navigate = useNavigate()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* 🔥 Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: "url('/images/treks/heroback.jpg')" }}
      />

      {/* 🔥 Dark + Blur Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/40 to-black/50 backdrop-blur-[1px]" />

      {/* Mountain SVG */}
      <svg
        className="absolute bottom-0 left-0 right-0 w-full opacity-25 z-10"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
      >
        <path
          d="M0,200 L240,60 L480,140 L720,20 L960,100 L1200,50 L1440,120 L1440,200 Z"
          fill="#0d1a0d"
        />
      </svg>

      {/* Content */}
      <div className="relative z-20 text-center px-6 max-w-3xl mx-auto">

        {/* Logo glass box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-3 glass-card px-6 py-3 mb-8"
        >
          <svg viewBox="0 0 34 34" fill="none" className="w-8 h-8">
            <polyline
              points="3,27 11,13 16,20 22,9 31,27"
              stroke="#E39B3A"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="22" cy="7.5" r="2.2" fill="#E39B3A" />
          </svg>
          <span className="text-white font-bold text-lg tracking-wide">
            Trip Karunadu
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-tight mb-4"
        >
          Escape The
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange to-orange-l">
            Ordinary
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-white/60 text-lg mb-10 max-w-xl mx-auto"
        >
          Bengaluru's most trusted trekking community. Sunrise treks, weekend getaways
          and adventures — all within reach.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => navigate('/trips')}
            className="btn-primary text-base px-8 py-4"
          >
            <i className="fas fa-mountain mr-2" /> Explore Trips
          </button>

          <a
            href="https://wa.me/7676386711"
            target="_blank"
            rel="noreferrer"
            className="btn-outline text-base px-8 py-4 flex items-center justify-center gap-2"
          >
            <i className="fab fa-whatsapp text-[#25D366]" /> WhatsApp Us
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.6 }}
          className="mt-16 flex flex-wrap justify-center gap-8"
        >
          {[
            ['2+', 'Treks Completed'],
            ['5+', 'Adventurers'],
            ['5', 'Destinations'],
            ['4.9★', 'Avg Rating'],
          ].map(([v, l]) => (
            <div key={l} className="text-center">
              <div className="text-2xl font-black text-orange">{v}</div>
              <div className="text-white/45 text-xs mt-0.5">{l}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white/30"
      >
        <i className="fas fa-chevron-down text-xl" />
      </motion.div>
    </section>
  )
}