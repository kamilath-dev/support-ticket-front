<template>
  <div>
    <!-- Modal for Create/Edit -->
    <Modal :show="isFormModalOpen" @close="closeFormModal">
      <template #header>
        {{ editingTicket ? 'Modifier le Ticket' : 'Créer un nouveau Ticket' }}
      </template>
      <TicketForm :ticket="editingTicket" @submit="handleFormSubmit" @cancel="closeFormModal" />
    </Modal>

    <!-- Modal for View Details -->
    <Modal :show="!!viewingTicket" @close="closeViewModal">
      <template #header>
        Détails du Ticket
      </template>
      <div v-if="viewingTicket" class="space-y-4">
        <div>
          <h3 class="text-lg font-bold text-gray-800">{{ viewingTicket.title }}</h3>
          <p class="mt-1 text-sm text-gray-600">{{ viewingTicket.description }}</p>
        </div>
        <div class="text-sm space-y-1">
          <p><span class="font-semibold">Priorité:</span> <span :class="priorityClass(viewingTicket.priority)" class="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full">{{ viewingTicket.priority }}</span></p>
          <p><span class="font-semibold">Statut:</span> <span :class="statusClass(viewingTicket.status)" class="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full">{{ viewingTicket.status }}</span></p>
          <p><span class="font-semibold">Créé le:</span> <span class="ml-2">{{ formatDate(viewingTicket.createdAt) }}</span></p>
          <p><span class="font-semibold">Mis à jour le:</span> <span class="ml-2">{{ formatDate(viewingTicket.updatedAt) }}</span></p>
        </div>
      </div>
    </Modal>
    <div class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 sm:gap-0">
      <h1 class="text-2xl font-bold">My Tickets</h1>
      <button @click="openCreateModal" class="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
        Create New Ticket
      </button>
    </div>

    <!-- Barre de recherche et filtres -->
    <div class="mb-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Rechercher..." 
        class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        @input="debouncedSearch"
      >
      
      <select v-model="statusFilter" class="px-3 py-2 border border-gray-300 rounded-md">
        <option value="">Tous les statuts</option>
        <option value="OPEN">Ouvert</option>
        <option value="IN_PROGRESS">En cours</option>
        <option value="RESOLVED">Résolu</option>
        <option value="CLOSED">Fermé</option>
      </select>
      
      <select v-model="priorityFilter" class="px-3 py-2 border border-gray-300 rounded-md">
        <option value="">Toutes priorités</option>
        <option value="LOW">Basse</option>
        <option value="MEDIUM">Moyenne</option>
        <option value="HIGH">Haute</option>
        <option value="CRITICAL">Critique</option>
      </select>
    </div>

    <!-- Pagination -->
    <div class="mt-4 flex items-center justify-between">
      <button 
        @click="changePage(currentPage - 1)" 
        :disabled="currentPage === 0"
        class="px-3 py-1 border rounded-md disabled:opacity-50"
      >
        Précédent
      </button>
      <span>Page {{ currentPage + 1 }} / {{ totalPages }}</span>
      <button 
        @click="changePage(currentPage + 1)" 
        :disabled="currentPage >= totalPages - 1"
        class="px-3 py-1 border rounded-md disabled:opacity-50"
      >
        Suivant
      </button>
    </div>  

    <div v-if="loading" class="text-center py-4">
      Loading...
    </div>

    <div v-else-if="tickets.length === 0" class="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
      <p class="text-gray-500">No tickets yet. Create your first ticket!</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="ticket in tickets" :key="ticket.id" class="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transform hover:-translate-y-1 transition-transform duration-300">
        <div class="p-6 flex-grow cursor-pointer" @click="openViewModal(ticket)">
          <div class="flex items-start justify-between mb-3">
            <h3 class="text-base font-bold text-gray-800 truncate pr-4" :title="ticket.title">
              {{ ticket.title }}
            </h3>
            <span :class="statusClass(ticket.status)" class="px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full flex-shrink-0">
              {{ ticket.status }}
            </span>
          </div>
          <p class="text-sm text-gray-600 h-20">
            {{ truncatedDescription(ticket.description) }}
          </p>
        </div>
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <span :class="priorityClass(ticket.priority)" class="px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full">
              {{ ticket.priority }}
            </span>
            <span class="text-xs text-gray-500">
              {{ formatDate(ticket.createdAt) }}
            </span>
          </div>
          <div class="relative action-menu-container">
            <button @click="toggleActionMenu(ticket.id)" class="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500">
              <span class="sr-only">Open options</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
            <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
              <div v-if="openActionMenuId === ticket.id" class="origin-top-right absolute right-0 bottom-full mb-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  <a href="#" @click.prevent="editAction(ticket)" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                    <svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" /></svg>
                    Modifier
                  </a>
                  <a href="#" @click.prevent="deleteAction(ticket.id)" class="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50" role="menuitem">
                    <svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Supprimer
                  </a>
                </div>
              </div>
            </transition>
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

// search, filters and pagination state
const searchQuery = ref('')
const statusFilter = ref('')
const priorityFilter = ref('')
const currentPage = ref(0)
const totalPages = ref(1)
const pageSize = ref(10)

const { tickets, loading, fetchTickets, deleteTicket, createTicket, updateTicket } = useTickets()
const { $toast, $api } = useNuxtApp()  // add $api for manual requests in this page

// tiny debounce utility (could be replaced with lodash or vueuse)
function useDebounce(fn, delay = 300) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

// helper to actually fetch tickets with all params; keeps page component
// independent from the composable (you can also move this logic into useTickets)
const loadTickets = async () => {
  const ticketStore = useTicketStore()
  ticketStore.setLoading(true)
  try {
    const params = new URLSearchParams({
      page: currentPage.value,
      size: pageSize.value,
      search: searchQuery.value,
      status: statusFilter.value,
      priority: priorityFilter.value
    })

    // use $api imported from useNuxtApp; previous error came from undefined
    const response = await $api(`/tickets?${params}`)
    ticketStore.setTickets(response.content)
    totalPages.value = response.totalPages
  } catch (error) {
    console.error('Error fetching tickets:', error)
  } finally {
    ticketStore.setLoading(false)
  }
}

// debounce helper (you can import from lodash or implement your own composable)
const debouncedSearch = useDebounce(() => {
  currentPage.value = 0
  loadTickets()
}, 300)

watch([statusFilter, priorityFilter], () => {
  currentPage.value = 0
  loadTickets()
})

onMounted(() => {
  loadTickets(); // initial load with filters/pagination
  window.addEventListener('click', closeActionMenuOnClickOutside);
})

// pagination control
const changePage = (page) => {
  if (page < 0 || page >= totalPages.value) return
  currentPage.value = page
  loadTickets()
}

onUnmounted(() => {
  window.removeEventListener('click', closeActionMenuOnClickOutside);
})

const isFormModalOpen = ref(false)
const editingTicket = ref(null)
const viewingTicket = ref(null)
const openActionMenuId = ref(null)

const openCreateModal = () => {
  editingTicket.value = null
  isFormModalOpen.value = true
}

const toggleActionMenu = (ticketId) => {
  openActionMenuId.value = openActionMenuId.value === ticketId ? null : ticketId
}

const closeActionMenu = () => {
  openActionMenuId.value = null
}

const closeActionMenuOnClickOutside = (event) => {
  if (!event.target.closest('.action-menu-container')) {
    closeActionMenu()
  }
}

const openEditModal = (ticket) => {
  editingTicket.value = ticket
  isFormModalOpen.value = true
}

const closeFormModal = () => {
  isFormModalOpen.value = false
  editingTicket.value = null
}

const openViewModal = (ticket) => {
  viewingTicket.value = ticket
}

const closeViewModal = () => {
  viewingTicket.value = null
}

const editAction = (ticket) => {
  openEditModal(ticket)
  closeActionMenu()
}

const deleteAction = async (id) => {
  closeActionMenu()
  await nextTick()
  handleDelete(id)
}

const handleFormSubmit = async (formData) => {
  const isEditing = !!editingTicket.value
  const action = isEditing ? updateTicket : createTicket
  const payload = isEditing ? { ...formData, id: editingTicket.value.id } : formData

  const result = await action(payload)

  if (result.success) {
    $toast.success(`Ticket ${isEditing ? 'mis à jour' : 'créé'} avec succès!`)
    closeFormModal()
    await loadTickets()
  } else {
    $toast.error(`La ${isEditing ? 'mise à jour' : 'création'} du ticket a échoué: ${result.error}`)
  }
}

const statusClass = (status) => {
  const classes = {
    'OPEN': 'bg-yellow-100 text-yellow-800',
    'IN_PROGRESS': 'bg-blue-100 text-blue-800',
    'RESOLVED': 'bg-green-100 text-green-800',
    'CLOSED': 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const priorityClass = (priority) => {
  const classes = {
    'LOW': 'bg-gray-100 text-gray-800',
    'MEDIUM': 'bg-blue-100 text-blue-800',
    'HIGH': 'bg-orange-100 text-orange-800',
    'CRITICAL': 'bg-red-100 text-red-800'
  }
  return classes[priority] || 'bg-gray-100 text-gray-800'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

const truncatedDescription = (description) => {
  if (!description) return ''
  const limit = 120
  if (description.length <= limit) {
    return description
  }
  return description.substring(0, limit) + '...'
}

const handleDelete = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce ticket ?')) {
    const result = await deleteTicket(id)
    if (!result.success) {
      $toast.error('La suppression du ticket a échoué: ' + result.error)
      return
    }
    $toast.success('Ticket supprimé avec succès!')
    await fetchTickets()
  }
}
</script>