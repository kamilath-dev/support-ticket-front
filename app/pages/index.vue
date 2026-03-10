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
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <!-- Card 1: Total Tickets -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Tickets</dt>
                <dd class="text-3xl font-semibold text-gray-900">{{ tickets.length }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Card 2: Open Tickets -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Open Tickets</dt>
                <dd class="text-3xl font-semibold text-gray-900">{{ openTickets }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Card 3: High Priority Tickets -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-orange-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">High Priority</dt>
                <dd class="text-3xl font-semibold text-gray-900">{{ highPriorityTickets }}</dd>
              </dl>
            </div>
          </div>
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
  return tickets.value.filter(t => t.status === 'OPEN').length
})

const highPriorityTickets = computed(() => {
  return tickets.value.filter(t => t.priority === 'HIGH' || t.priority === 'CRITICAL').length
})
</script>