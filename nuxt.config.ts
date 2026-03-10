export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',  // ← Présent ?
    '@nuxtjs/tailwindcss'
  ],
  // css: ['./assets/css/main.css'],  // ← Commenté pour l'instant
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:8080/api'
    }
  },
  compatibilityDate: '2025-03-09',
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})