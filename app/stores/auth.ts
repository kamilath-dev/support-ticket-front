import { defineStore } from 'pinia'

declare const process: any

// define state and action types for the auth store
interface AuthState {
  token: string | null
  user: Record<string, any> | null
  isAuthenticated: boolean
}

interface AuthActions {
  setToken(token: string): void
  setUser(user: Record<string, any>): void
  logout(): void
}

export const useAuthStore = defineStore<'auth', AuthState, {}, AuthActions>(
  'auth',
  {
    state: (): AuthState => ({
      token: null,
      user: null,
      isAuthenticated: false
    }),

    // pinia‑persist options are loosely typed; cast to any
    persist: {
      key: 'auth-storage', // Nom explicite
      storage: (process.client ? localStorage : undefined) as any,
      paths: ['token', 'user', 'isAuthenticated'] as any
    } as any,

    actions: {
      setToken(token: string) {
        this.token = token
        this.isAuthenticated = true
        if (process.client) {
          console.log('Token set in store:', token.substring(0, 20) + '...')
          // Vérification immédiate
          setTimeout(() => {
            const stored = localStorage.getItem('auth-storage')
            console.log('Vérification localStorage:', stored ? 'OK' : 'NULL')
          }, 0)
        }
      },

      setUser(user: Record<string, any>) {
        this.user = user
      },

      logout() {
        this.token = null
        this.user = null
        this.isAuthenticated = false
        if (process.client) {
          localStorage.removeItem('auth-storage')
        }
      }
    }
  }
)
