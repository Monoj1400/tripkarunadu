import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStore = create(
  persist(
    (set, get) => ({
      /* ── Auth ── */
      user:    null,
      isAdmin: false,
      setUser:    (user)    => set({ user }),
      setIsAdmin: (isAdmin) => set({ isAdmin }),
      logout: () => set({ user: null, isAdmin: false }),

      /* ── Bookings ── */
      bookings: [],
      addBooking: (booking) =>
        set((s) => ({ bookings: [...s.bookings, booking] })),

      /* ── Tokens (TrailBlaze loyalty) ── */
      tokens: 0,
      addTokens: (n) => set((s) => ({ tokens: s.tokens + n })),

      /* ── Active trip (for detail + booking flow) ── */
      selectedTrip: null,
      setSelectedTrip: (trip) => set({ selectedTrip: trip }),

      /* ── Cart ── */
      ticketCount: 1,
      setTicketCount: (n) => set({ ticketCount: n }),

      /* ── Computed ── */
      hasLoyaltyDiscount: () => get().tokens >= 50,
    }),
    {
      name: 'trip-karunadu-store',
      partialize: (s) => ({
        user:     s.user,
        isAdmin:  s.isAdmin,
        bookings: s.bookings,
        tokens:   s.tokens,
      }),
    }
  )
)
