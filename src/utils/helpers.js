/** Format a number as Indian currency */
export const formatPrice = (n) =>
  '₹' + Number(n).toLocaleString('en-IN')

/** Generate a random booking ID */
export const genBookingId = () =>
  'TK' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2,5).toUpperCase()

/** Get difficulty badge class */
export const diffClass = (diff) => ({
  easy:     'badge-easy',
  moderate: 'badge-moderate',
  hard:     'badge-hard',
}[diff] || 'badge-moderate')

/** Star string from rating */
export const stars = (rating = 5) =>
  '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating))

/** Category gradient for fallback cards */
export const CCOLORS = {
  sunrise:       '135deg,#7B4B1A,#E39B3A',
  oneday:        '135deg,#2F4F2F,#5a9e5a',
  'twoday-trek': '135deg,#1a3a5e,#2F6BAF',
  'twoday-sight':'135deg,#4a1a4a,#8a3a8a',
}

export const CNAMES = {
  sunrise:       '🌅 Sunrise Treks',
  oneday:        '☀️ One Day Sightseeing',
  'twoday-trek': '⛺ Two Day Treks',
  'twoday-sight':'🗺️ Two Day Sightseeing',
}
