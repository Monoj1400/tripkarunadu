import { motion } from 'framer-motion'

const FEATURES = [
  { icon: 'fa-map-marker-alt', title: '20+ Destinations', desc: 'Carefully curated treks and trips across Karnataka and beyond.' },
  { icon: 'fa-shield-alt',     title: 'No Hidden Charges', desc: 'What you see is what you pay. Fully inclusive pricing, always.' },
  { icon: 'fa-users',          title: 'Local Experts',     desc: 'Our guides are locals who know every trail, every shortcut, every sunrise spot.' },
  { icon: 'fa-headset',        title: '24/7 Support',      desc: 'Coordinator available on WhatsApp from booking to drop-off.' },
]

export default function WhyUs() {
  return (
    <section className="relative py-20 px-6 overflow-hidden">

      {/* 🔥 Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: "url('/images/treks/whyusback.jpg')" }}
      />

      {/* 🔥 Overlay (lighter than hero) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/30 to-black/40 backdrop-blur-[-1px]" />

      {/* 🔥 Content */}
      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-orange text-sm font-semibold uppercase tracking-widest mb-2">
            Why Choose Us
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            We Take Care of Everything
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 hover:border-orange/30 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-orange/10 flex items-center justify-center mb-4
                              group-hover:bg-orange/20 transition-colors">
                <i className={`fas ${f.icon} text-orange text-lg`} />
              </div>

              <h3 className="text-white font-bold mb-2">{f.title}</h3>
              <p className="text-white/45 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}