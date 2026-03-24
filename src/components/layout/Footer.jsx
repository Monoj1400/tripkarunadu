import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#060f06] border-t border-white/8 pt-14 pb-8 mt-20">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <svg viewBox="0 0 34 34" fill="none" className="w-6 h-6">
                <polyline points="3,27 11,13 16,20 22,9 31,27"
                  stroke="#E39B3A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="22" cy="7.5" r="2.2" fill="#E39B3A"/>
              </svg>
            </div>
            <span className="font-bold text-white text-lg">Trip Karunadu</span>
          </div>
          <p className="text-white/40 text-sm leading-relaxed mb-5">
            Bengaluru's premier trekking & travel community. We take you off the beaten path.
          </p>
          <div className="flex gap-3">
            {[
              ['fab fa-instagram', 'https://instagram.com'],
              ['fab fa-whatsapp', 'https://wa.me/919900980260'],
              ['fab fa-youtube', 'https://youtube.com'],
            ].map(([icon, href]) => (
              <a key={icon} href={href} target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center
                           text-white/50 hover:text-orange hover:border-orange/50 transition-colors">
                <i className={icon}/>
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-2.5">
            {[['/', 'Home'], ['/trips', 'All Trips'], ['/about', 'About Us'], ['/login', 'Login']].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="text-white/45 hover:text-orange text-sm transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Trip Categories */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Trip Types</h4>
          <ul className="space-y-2.5">
            {[
              ['🌅 Sunrise Treks', 'sunrise'],
              ['☀️ One Day Trips', 'oneday'],
              ['⛺ Two Day Treks', 'twoday-trek'],
              ['🗺️ Two Day Sightseeing', 'twoday-sight'],
            ].map(([label, cat]) => (
              <li key={cat}>
                <Link to={`/trips?cat=${cat}`} className="text-white/45 hover:text-orange text-sm transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact Us</h4>
          <ul className="space-y-3">
            <li className="flex items-center gap-2 text-white/45 text-sm">
              <i className="fas fa-phone-alt text-orange text-xs w-4"/>
              +91 7204890439
            </li>
            <li className="flex items-center gap-2 text-white/45 text-sm">
              <i className="fas fa-phone-alt text-orange text-xs w-4"/>
              +91 9900980260
            </li>
            <li className="flex items-center gap-2 text-white/45 text-sm">
              <i className="fas fa-envelope text-orange text-xs w-4"/>
              hello@tripkarunadu.in
            </li>
            <li className="flex items-center gap-2 text-white/45 text-sm">
              <i className="fas fa-map-marker-alt text-orange text-xs w-4"/>
              Bengaluru, Karnataka
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-12 pt-6 border-t border-white/8 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p className="text-white/25 text-xs">© 2025 Trip Karunadu. All rights reserved.</p>
        <p className="text-white/25 text-xs">Made with ❤️ in Bengaluru</p>
      </div>
    </footer>
  )
}
