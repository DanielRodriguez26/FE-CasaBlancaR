import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthUser } from '../../types'

interface AuthStore {
    user: AuthUser | null
    isAuthenticated: boolean
    login: (user: AuthUser) => void
    logout: () => void
    updateUser: (data: Partial<AuthUser>) => void
}

export const useAuthStore = create<AuthStore>()(
    persist(
        set => ({
            user: null,
            isAuthenticated: false,

            login: user => {
                set({ user, isAuthenticated: true })
            },

            logout: () => {
                set({ user: null, isAuthenticated: false })
            },

            updateUser: data => {
                set(state => ({
                    user: state.user ? { ...state.user, ...data } : null,
                }))
            },
        }),
        {
            name: 'auth-storage',
            partialize: state => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
        }
    )
)
