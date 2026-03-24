# Trip Karunadu — React + Vite 🏔️
### Production-grade trekking booking platform

Built with **React 18 · Vite · Tailwind CSS · Firebase · Zustand · Framer Motion**

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server (hot reload)
npm run dev

# 3. Open http://localhost:5173
```

---

## Project Structure

```
src/
├── main.jsx                  ← Entry point
├── App.jsx                   ← Router + Toaster setup
├── firebase.js               ← Firebase config
├── index.css                 ← Tailwind + global styles
│
├── components/
│   ├── layout/
│   │   ├── Layout.jsx        ← Page wrapper (Navbar + Footer + WhatsApp)
│   │   ├── Navbar.jsx        ← Responsive navbar with auth state
│   │   └── Footer.jsx        ← Full footer with links
│   ├── home/
│   │   ├── Hero.jsx          ← Full-screen animated hero
│   │   ├── WhyUs.jsx         ← Feature cards section
│   │   └── FeaturedTrips.jsx ← Curated trip cards on home
│   ├── trips/
│   │   ├── TripCard.jsx      ← Individual trip card
│   │   └── TripGrid.jsx      ← Filtered + searchable grid
│   ├── auth/
│   │   └── AuthForms.jsx     ← Login + Signup (Firebase)
│   ├── booking/
│   │   └── BookingModal.jsx  ← 3-step booking → payment → QR ticket
│   └── ui/
│       └── WhatsAppFloat.jsx ← Fixed WhatsApp button
│
├── pages/
│   ├── HomePage.jsx
│   ├── TripsPage.jsx
│   ├── TripDetailPage.jsx    ← Full trip detail with booking
│   ├── ProfilePage.jsx       ← User profile + TrailBlaze tokens
│   ├── AboutPage.jsx
│   └── AdminPages.jsx        ← Admin login + dashboard
│
├── store/
│   └── useStore.js           ← Zustand global state (auth, bookings, tokens)
│
├── hooks/
│   └── useAuth.js            ← Firebase auth → Zustand sync
│
├── data/
│   ├── trips.js              ← All 21 trips data
│   └── images.js             ← Base64 embedded trip photos
│
└── utils/
    └── helpers.js            ← formatPrice, diffClass, stars, etc.
```

---

## Routes

| Path              | Page                    |
|-------------------|-------------------------|
| `/`               | Home                    |
| `/trips`          | All Trips (with filters)|
| `/trips/:id`      | Trip Detail + Booking   |
| `/profile`        | User Profile            |
| `/about`          | About Us                |
| `/login`          | Login                   |
| `/signup`         | Sign Up                 |
| `/admin/login`    | Admin Login             |
| `/admin`          | Admin Dashboard         |

---

## Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) → project `trip-karunadu-bce56`
2. **Authentication → Sign-in method** → Enable:
   - ✅ Email/Password
   - ✅ Google
3. **Authentication → Settings → Authorized domains** → Add your domain

---

## Admin Access
- **URL:** `/admin/login`
- **Username:** `admin`
- **Password:** `admin123`

---

## Build for Production

```bash
npm run build
# Output in /dist — deploy to Netlify, Vercel, Firebase Hosting
```

### Deploy to Netlify (30 seconds)
```bash
npm run build
# Drag the /dist folder to https://app.netlify.com/drop
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

---

## Replacing Base64 Images with Real Files

As you add more trip photos, move them out of `src/data/images.js` into `public/images/treks/`:

```js
// In src/data/images.js, change:
export const TRIP_IMGS = {
  'nandiHills': 'data:image/jpeg;base64,...',
  // To:
  'nandiHills': '/images/treks/nandi-hills.jpg',
}
```

This dramatically reduces the JS bundle size.

---

## Tech Stack

| Tool            | Purpose                        |
|-----------------|-------------------------------|
| React 18        | UI framework                  |
| Vite 5          | Build tool + dev server       |
| Tailwind CSS 3  | Utility-first styling         |
| Framer Motion   | Page & component animations   |
| React Router 6  | Client-side routing           |
| Zustand         | Global state management       |
| Firebase 10     | Authentication                |
| react-hot-toast | Toast notifications           |
| qrcode          | QR ticket generation          |

---

*Trip Karunadu — Built in Bengaluru 🏔️*
