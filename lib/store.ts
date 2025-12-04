import { create } from 'zustand'

interface User {
    id: string
    email: string
    name?: string
}

interface AuthStore {
    user: User | null
    isAuthenticated: boolean
    setUser: (user: User | null) => void
    logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    isAuthenticated: false,
    setUser: (user) => set({ user, isAuthenticated: !!user }),
    logout: () => set({ user: null, isAuthenticated: false }),
}))

interface AppStore {
    sidebarOpen: boolean
    toggleSidebar: () => void
    theme: 'light' | 'dark'
    setTheme: (theme: 'light' | 'dark') => void
}

export const useAppStore = create<AppStore>((set) => ({
    sidebarOpen: false,
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    theme: 'dark',
    setTheme: (theme) => set({ theme }),
}))
