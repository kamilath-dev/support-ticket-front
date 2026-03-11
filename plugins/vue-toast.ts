import { defineNuxtPlugin } from '#app'
import Toast, { type PluginOptions, useToast } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

export default defineNuxtPlugin((nuxtApp) => {
  const options: PluginOptions = {
    position: 'top-right',
    timeout: 5000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: 'button',
    icon: true,
    rtl: false,
    transition: 'Vue-Toastification__bounce',
    maxToasts: 10,
    newestOnTop: true,
  }

  nuxtApp.vueApp.use(Toast, options)

  return {
    provide: {
      toast: useToast(),
    },
  }
})