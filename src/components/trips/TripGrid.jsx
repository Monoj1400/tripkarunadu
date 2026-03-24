import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { TRIPS } from '@/data/trips'
import { CNAMES } from '@/utils/helpers'
import TripCard from './TripCard'

const CATS = [
  { key: 'all',          label: '🗺️ All Trips' },
  { key: 'sunrise',      label: '🌅 Sunrise Treks' },
  { key: 'oneday',       label: '☀️ One Day' },
  { key: 'twoday-trek',  label: '⛺ Two Day Trek' },
  { key: 'twoday-sight', label: '🗺️ Two Day Sightseeing' },
]

export default function TripGrid({ limit }) {
  const [searchParams] = useSearchParams()
  const initialCat = searchParams.get('cat') || 'all'
  const [activeCat, setActiveCat] = useState(initialCat)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let list = activeCat === 'all' ? TRIPS : TRIPS.filter(t => t.cat === activeCat)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.desc?.toLowerCase().includes(q)
      )
    }
    return limit ? list.slice(0, limit) : list
  }, [activeCat, search, limit])

  // Group by category when showing all
  const grouped = useMemo(() => {
    if (activeCat !== 'all' || search) return null
    const g = {}
    filtered.forEach(t => { (g[t.cat] = g[t.cat] || []).push(t) })
    return g
  }, [filtered, activeCat, search])

  return (
    <div>
      {/* Search */}
      {!limit && (
        <div className="relative mb-6">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm" />
          <input
            className="form-input pl-10"
            placeholder="Search trips..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      )}

      {/* Category tabs */}
      {!limit && (
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {CATS.map(c => (
            <button
              key={c.key}
              onClick={() => { setActiveCat(c.key); setSearch('') }}
              className={`cat-tab ${activeCat === c.key ? 'active' : ''}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}

      {/* Grouped view */}
      {grouped ? (
        Object.entries(grouped).map(([cat, trips]) => (
          <div key={cat} className="mb-12">
            <h2 className="text-lg font-bold text-white/70 mb-5 flex items-center gap-2">
              <span className="w-8 h-px bg-orange/50 inline-block" />
              {CNAMES[cat] || cat}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {trips.map(t => <TripCard key={t.id} trip={t} />)}
            </div>
          </div>
        ))
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.length > 0
            ? filtered.map(t => <TripCard key={t.id} trip={t} />)
            : (
              <div className="col-span-full text-center py-20 text-white/30">
                <i className="fas fa-mountain text-4xl mb-4 block" />
                No trips found. Try a different search.
              </div>
            )
          }
        </div>
      )}
    </div>
  )
}
