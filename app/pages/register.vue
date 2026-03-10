<template>
  <div class="min-h-screen bg-gray-100 text-gray-900 flex flex-col">
    <main class="flex-grow flex items-center justify-center p-4">
      <div class="max-w-screen-xl w-full m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div class="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div>
          <!-- You can put a logo here -->
          <!-- <img src="path/to/your/logo.svg" class="w-32 mx-auto" /> -->
        </div>
        <div class="mt-12 flex flex-col items-center">
          <h1 class="text-2xl xl:text-3xl font-extrabold">
            Créer un compte
          </h1>
          <div class="w-full flex-1 mt-8">
            <form class="mx-auto w-full max-w-xs sm:max-w-sm" @submit.prevent="handleRegister">
              <input v-model="formData.username"
                     class="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                     type="text" placeholder="Nom d'utilisateur" required />
              <input v-model="formData.email"
                     class="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                     type="email" placeholder="Email" required />
              <input v-model="formData.fullName"
                     class="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                     type="text" placeholder="Nom complet" />
              <div class="relative mt-5">
                <input v-model="formData.password"
                       class="w-full pl-8 pr-12 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                       :type="showPassword ? 'text' : 'password'" placeholder="Mot de passe" required />
                <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                  <svg v-if="!showPassword" class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 1.274-4.057 5.064 7 9.542 7 .847 0 1.67.127 2.452.364m-6.028 6.028A3 3 0 109.625 9.625" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.98 8.223A10.034 10.034 0 002.458 12c1.274 4.057 5.064 7 9.542 7a10.034 10.034 0 003.777-.623M12 5v.01M19.02 15.777A10.034 10.034 0 0021.542 12c-1.274-4.057-5.064 7-9.542 7a10.034 10.034 0 00-3.777.623" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18" />
                  </svg>
                </button>
              </div>
              <button type="submit"
                      class="mt-5 tracking-wide font-semibold bg-indigo-600 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                <svg class="w-6 h-6 -ml-2" fill="none" stroke="currentColor" stroke-width="2"
                     stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <path d="M20 8v6M23 11h-6" />
                </svg>
                <span class="ml-3">
                  S'inscrire
                </span>
              </button>
              <p class="mt-6 text-xs text-gray-600 text-center">
                Déjà un compte?
                <NuxtLink to="/login" class="border-b border-gray-500 border-dotted">
                  Se connecter
                </NuxtLink>
              </p>
            </form>
          </div>
        </div>
      </div>
        <div class="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div class="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
               style="background-image: url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg');">
          </div>
        </div>
      </div>
    </main>
    <footer class="text-center text-sm text-gray-500 py-4">
      &copy; {{ new Date().getFullYear() }} SupportSys. Tous droits réservés.
    </footer>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})

const formData = ref({
  username: '',
  email: '',
  password: '',
  fullName: ''
})
const showPassword = ref(false)
const { register } = useAuth()
const { $toast } = useNuxtApp()

const handleRegister = async () => {
  const result = await register(formData.value)
  if (result.success) {
    $toast.success('Inscription réussie ! Veuillez vous connecter.')
    // Attendre le prochain "tick" pour laisser le temps au toast de s'afficher
    await nextTick()
    await navigateTo('/login')
  } else {
    $toast.error("L'inscription a échoué: " + result.error)
  }
}
</script>