import { create } from 'zustand'

interface AdminState {
  isAdmin: boolean
  isLoaded: boolean
  setAdmin: (isAdmin: boolean) => void
  setLoaded: (loaded: boolean) => void
  reset: () => void
}

export const useAdminStore = create<AdminState>()((set) => ({
  isAdmin: false,
  isLoaded: false,
  setAdmin: (isAdmin) => set({ isAdmin, isLoaded: true }),
  setLoaded: (loaded) => set({ isLoaded: loaded }),
  reset: () => set({ isAdmin: false, isLoaded: false }),
}))
