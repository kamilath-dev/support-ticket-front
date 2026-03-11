export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  
  const api = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ request, options }) {
      if (process.client) {
        try {
          // prefer reading from the auth store (instant, reactive)
          const auth = useAuthStore()
          let token = auth.token
          if (!token) {
            // fallback if store hasn't hydrated yet or plugin failed
            const authData = localStorage.getItem('auth-storage')
            console.log('Auth data from localStorage fallback:', authData ? 'Présent' : 'Null')
            if (authData) {
              try {
                token = JSON.parse(authData).token
              } catch {}
            }
          }
          if (token) {
            options.headers = {
              ...options.headers,
              Authorization: `Bearer ${token}`,
              Origin: 'http://localhost:3000'
            }
            console.log('✅ Token envoyé')
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
        // don't automatically logout when a ticket POST returns 401; the token
        // may still be valid but the user might simply lack privileges.
        const url = response.url || ''
        if (!url.includes('/tickets')) {
          localStorage.removeItem('auth-storage')
          navigateTo('/login')
        }
      }
    }
  })
  
  return {
    provide: {
      api
    }
  }
})