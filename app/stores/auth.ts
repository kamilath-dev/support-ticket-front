import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    user: null,
    isAuthenticated: false
  }),
  
  persist: {
    key: 'auth-storage',  // Nom explicite
    storage: process.client ? localStorage : undefined,
    paths: ['token', 'user', 'isAuthenticated']  // Champs à persister
  },
  
  actions: {
    setToken(token) {
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
    
    setUser(user) {
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
})