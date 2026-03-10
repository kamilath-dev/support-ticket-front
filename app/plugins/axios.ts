export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  
  const api = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ request, options }) {
      if (process.client) {
        try {
          const authData = localStorage.getItem('auth-storage')  // Même clé !
          console.log('Auth data from localStorage:', authData ? 'Présent' : 'Null')
          
          if (authData) {
            const parsed = JSON.parse(authData)
            const token = parsed.token
            
            if (token) {
              options.headers = {
                ...options.headers,
                'Authorization': `Bearer ${token}`,
                'Origin': 'http://localhost:3000'
              }
              console.log('✅ Token envoyé')
            }
          }
        } catch (e) {
          console.error('Erreur dans onRequest:', e)
        }
      }
    },
    onResponse({ response }) {
      console.log('Réponse reçue:', response.status)
    },
    onResponseError({ response }) {
      console.error('Erreur API:', response?.status, response?._data)
      if (response?.status === 401 && process.client) {
        localStorage.removeItem('auth-storage')
        navigateTo('/login')
      }
    }
  })
  
  return {
    provide: {
      api
    }
  }
})