declare const process: any

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  
  const api = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ request, options }) {
      if (process.client) {
        try {
          const authData = localStorage.getItem('auth-storage')
          console.log('Auth data from localStorage:', authData ? 'Présent' : 'Null')

          if (authData) {
            const { token } = JSON.parse(authData) as { token?: string }
            if (token) {
              // merge headers using a loose type to avoid TS complaints
              // `options.headers` is typed as Headers so cast to any to avoid incompatibility
              options.headers = {
                ...((options.headers as unknown) as Record<string, string>),
                Authorization: `Bearer ${token}`
              } as any
              console.log('✅ Token envoyé:', token.slice(0, 20), '…')
              console.log('   headers after modification:', options.headers)
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