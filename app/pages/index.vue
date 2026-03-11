<template>
  <div>
    <!-- Modal for creating a ticket -->
    <Modal :show="isCreateModalOpen" @close="closeCreateModal">
      <template #header>
        Créer un nouveau ticket
      </template>
      <TicketForm @submit="handleCreateTicket" @cancel="closeCreateModal" />
    </Modal>
   

    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="mt-1 text-sm text-gray-500">Un aperçu de vos activités de support.</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <button @click="openCreateModal" class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Nouveau Ticket
        </button>
      </div>
    </div>

    <!-- Stats cards -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <!-- Card 1: Total Tickets -->
      <div class="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 text-white shadow-lg">
        <div class="absolute top-0 right-0 -mt-4 -mr-4">
            <svg class="h-24 w-24 text-white opacity-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
        </div>
        <div class="relative">
            <dt>
                <p class="text-sm font-medium uppercase tracking-wider">Total des Tickets</p>
            </dt>
            <dd class="mt-2 flex items-baseline pb-6 sm:pb-7">
                <p class="text-4xl font-semibold">{{ tickets.length }}</p>
            </dd>
        </div>
        <div class="absolute bottom-0 inset-x-0 bg-black bg-opacity-10 px-4 py-2">
            <div class="text-sm">
                <NuxtLink to="/tickets" class="font-medium hover:underline">Voir tout &rarr;</NuxtLink>
            </div>
        </div>
      </div>

      <!-- Card 2: Open Tickets -->
      <div class="relative overflow-hidden rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 p-6 text-white shadow-lg">
        <div class="absolute top-0 right-0 -mt-4 -mr-4">
            <svg class="h-24 w-24 text-white opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
        <div class="relative">
            <dt>
                <p class="text-sm font-medium uppercase tracking-wider">Tickets Ouverts</p>
            </dt>
            <dd class="mt-2 flex items-baseline pb-6 sm:pb-7">
                <p class="text-4xl font-semibold">{{ openTickets }}</p>
            </dd>
        </div>
        <div class="absolute bottom-0 inset-x-0 bg-black bg-opacity-10 px-4 py-2">
            <div class="text-sm">
                <NuxtLink to="/tickets" class="font-medium hover:underline">Voir tout &rarr;</NuxtLink>
            </div>
        </div>
      </div>

      <!-- Card 3: High Priority Tickets -->
      <div class="relative overflow-hidden rounded-xl bg-gradient-to-br from-red-500 to-red-600 p-6 text-white shadow-lg">
        <div class="absolute top-0 right-0 -mt-4 -mr-4">
            <svg class="h-24 w-24 text-white opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
        <div class="relative">
            <dt>
                <p class="text-sm font-medium uppercase tracking-wider">Haute Priorité</p>
            </dt>
            <dd class="mt-2 flex items-baseline pb-6 sm:pb-7">
                <p class="text-4xl font-semibold">{{ highPriorityTickets }}</p>
            </dd>
        </div>
        <div class="absolute bottom-0 inset-x-0 bg-black bg-opacity-10 px-4 py-2">
            <div class="text-sm">
                <NuxtLink to="/tickets" class="font-medium hover:underline">Voir tout &rarr;</NuxtLink>
            </div>
        </div>
      </div>
    </div>

    <!-- Recent Tickets -->
    <div class="mt-12">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Tickets Récents</h2>
        <div class="bg-white shadow overflow-hidden sm:rounded-md p-6">
      <div v-if="recentTickets.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="ticket in recentTickets" :key="ticket.id" class="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transform hover:-translate-y-1 transition-transform duration-300">
          <div class="p-6 flex-grow cursor-pointer" @click="router.push('/tickets')">
            <h3 class="text-base font-bold text-gray-800 truncate" :title="ticket.title">{{ ticket.title }}</h3>
            <p class="mt-2 text-sm text-gray-500">Créé le : {{ formatDate(ticket.createdAt) }}</p>
          </div>
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <span :class="statusClass(ticket.status)" class="px-2 inline-flex text-xs leading-4 font-semibold rounded-full">
              {{ ticket.status }}
            </span>
          </div>
        </div>
      </div>
      <div v-else class="p-6 text-center text-gray-500">
        <p v-if="!tickets.length">Aucun ticket pour le moment.</p>
        <p v-else>Aucun ticket récent à afficher.</p>
      </div>
    </div>
    </div>
  </div>
</template>


<script setup>
definePageMeta({
  middleware: 'auth'
})

const { tickets, fetchTickets, createTicket } = useTickets()
const router = useRouter()
const { $toast } = useNuxtApp()

// authentication / profile
const authStore = useAuthStore()
const user = computed(() => authStore.user)
const logout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  fetchTickets()
})

const isCreateModalOpen = ref(false)

const openCreateModal = () => {
  isCreateModalOpen.value = true
}

const closeCreateModal = () => {
  isCreateModalOpen.value = false
}

const handleCreateTicket = async (formData) => {
  const result = await createTicket(formData)
  if (result.success) {
    $toast.success('Ticket créé avec succès!')
    closeCreateModal()
    await fetchTickets() // Pour rafraîchir les statistiques
    router.push('/tickets')
  } else {
    $toast.error('La création du ticket a échoué: ' + result.error)
  }
}

const openTickets = computed(() => {
  const list = Array.isArray(tickets.value) ? tickets.value : []
  return list.filter(t => t.status === 'OPEN').length
})

const recentTickets = computed(() => {
  return [...tickets.value]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
})

const highPriorityTickets = computed(() => {
  const list = Array.isArray(tickets.value) ? tickets.value : []
  return list.filter(t => t.priority === 'HIGH' || t.priority === 'CRITICAL').length
})

const statusClass = (status) => {
  const classes = {
    'OPEN': 'bg-yellow-100 text-yellow-800',
    'IN_PROGRESS': 'bg-blue-100 text-blue-800',
    'RESOLVED': 'bg-green-100 text-green-800',
    'CLOSED': 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>