export const useAuth = () => {
  const authStore = useAuthStore()
  const { $api } = useNuxtApp()
  
  const login = async (username, password) => {
    try {
      const response = await $api('/auth/login', {
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
          const stored = localStorage.getItem('pinia-auth')
          console.log('📦 Contenu du localStorage après login:', stored)
        }, 100)
      }
      
      return { success: true }
    } catch (error) {
      console.error('❌ Login error:', error)
      return { success: false, error: 'Invalid credentials' }
    }
  }
  
  const register = async (userData) => {
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