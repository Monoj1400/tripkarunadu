const TEAM = [
  { name: 'Arjun Reddy',    role: 'Founder & Lead Trek Guide',  em: '🏔️' },
  { name: 'Priya Sharma',   role: 'Operations & Coordination',  em: '📋' },
  { name: 'Kiran Kumar',    role: 'Route Safety & Planning',    em: '🗺️' },
  { name: 'Divya Nair',     role: 'Community & Marketing',      em: '📸' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-64 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: "url('/images/hero-bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center 40%' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-[#0d1a0d]" />
        <h1 className="relative z-10 text-4xl font-black text-white">About Us</h1>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="space-y-5 text-white/60 leading-relaxed text-sm mb-16">
          <p>
            Trip Karunadu was born out of a simple idea: Bengaluru has some of India's most spectacular nature
            within a 4-hour radius, and too few people get to experience it. We started in 2021 with a group of
            10 friends hiking Nandi Hills before dawn. Word spread, and what began as a weekend hobby became
            Karnataka's most trusted community trekking platform.
          </p>
          <p>
            We organise <strong className="text-white">sunrise treks, day trips, and multi-day wilderness expeditions</strong> across
            Karnataka and neighbouring states. Every trip is led by certified guides who know the trails
            intimately — their home districts, their seasonal moods, the exact spot where the fog breaks
            at 6:23 AM in November.
          </p>
          <p>
            Our promise is simple: <strong className="text-white">no hidden charges, small groups, and genuine care for safety.</strong>{' '}
            We cap group sizes deliberately because we believe the mountains are best experienced with
            people you can actually talk to — not in a crowd of 200 strangers.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          {[
            ['2+', 'Treks Done'],
            ['5+', 'Adventurers'],
            ['5', 'Destinations'],
            ['4.9★', 'Avg Rating'],
          ].map(([v, l]) => (
            <div key={l} className="glass-card p-5 text-center">
              <div className="text-2xl font-black text-orange">{v}</div>
              <div className="text-white/40 text-xs mt-1">{l}</div>
            </div>
          ))}
        </div>

        {/* Team */}
        <h2 className="text-2xl font-black text-white mb-6">The Team</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          {TEAM.map(m => (
            <div key={m.name} className="glass-card p-5 text-center hover:border-orange/30 transition-colors">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange to-brown
                              flex items-center justify-center text-2xl mx-auto mb-3">
                {m.em}
              </div>
              <div className="text-white font-bold text-sm">{m.name}</div>
              <div className="text-white/35 text-xs mt-1 leading-tight">{m.role}</div>
            </div>
          ))}
        </div>

        {/* Contact block */}
        <div className="glass-card p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Get In Touch</h3>
          <p className="text-white/45 text-sm mb-6">Planning a group trip or have a question? We'd love to hear from you.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://wa.me/7676386711" target="_blank" rel="noreferrer"
              className="btn-primary px-8 py-3 flex items-center justify-center gap-2">
              <i className="fab fa-whatsapp" /> WhatsApp Us
            </a>
            <a href="tripkarunadu@gmail.com"
              className="btn-outline px-8 py-3 flex items-center justify-center gap-2">
              <i className="fas fa-envelope" /> Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
