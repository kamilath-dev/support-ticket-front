declare const process: any

export const useAuth = () => {
  const authStore = useAuthStore()
  const { $api } = useNuxtApp()

  interface AuthResponse {
    token: string
    id: string
    username: string
    email: string
  }

  const login = async (username: string, password: string) => {
    try {
      const response = await $api<AuthResponse>('/auth/login', {
        method: 'POST',
        body: { username, password }
      })

      if (process.client) {
        console.log('✅ Login réussi, token reçu:', response.token.substring(0, 20) + '...')
      }

      authStore.setToken(response.token)
      authStore.setUser({
        id: response.id,
        username: response.username,
        email: response.email
      })

      // Vérification côté client seulement
      if (process.client) {
        setTimeout(() => {
          const stored = localStorage.getItem('auth-storage') // correct key
          console.log('📦 Contenu du localStorage après login:', stored)
        }, 100)
      }

      return { success: true }
    } catch (error) {
      console.error('❌ Login error:', error)
      return { success: false, error: 'Invalid credentials' }
    }
  }
  
  const register = async (userData: Record<string, any>) => {
    try {
      await $api('/auth/register', {
        method: 'POST',
        body: userData
      })

      return { success: true }
    } catch (error) {
      console.error('Register error:', error)
      return { success: false, error: 'Registration failed' }
    }
  }
  
  const logout = () => {
    authStore.logout()
    navigateTo('/login')
  }
  
  return {
    login,
    register,
    logout,
    isAuthenticated: computed(() => authStore.isAuthenticated),
    user: computed(() => authStore.user)
  }
}