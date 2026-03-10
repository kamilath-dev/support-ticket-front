<template>
  <div>
    <div v-if="loading" class="text-center py-4">
      Loading...
    </div>

    <div v-else-if="ticket" class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Ticket Details
          </h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">
            Created on {{ formatDate(ticket.createdAt) }}
          </p>
        </div>
        <div class="flex space-x-2">
          <NuxtLink :to="`/tickets/edit/${ticket.id}`" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
            Edit
          </NuxtLink>
          <button @click="handleDelete" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Delete
          </button>
        </div>
      </div>
      <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl class="sm:divide-y sm:divide-gray-200">
          <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Title</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ ticket.title }}</dd>
          </div>
          <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Description</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ ticket.description || 'No description' }}</dd>
          </div>
          <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Status</dt>
            <dd class="mt-1 text-sm sm:mt-0 sm:col-span-2">
              <span :class="statusClass(ticket.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ ticket.status }}
              </span>
            </dd>
          </div>
          <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Priority</dt>
            <dd class="mt-1 text-sm sm:mt-0 sm:col-span-2">
              <span :class="priorityClass(ticket.priority)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ ticket.priority }}
              </span>
            </dd>
          </div>
          <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Last Updated</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ formatDate(ticket.updatedAt) }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const { currentTicket: ticket, loading, fetchTicketById, deleteTicket } = useTickets()

onMounted(() => {
  fetchTicketById(route.params.id)
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

const handleDelete = async () => {
  if (confirm('Are you sure you want to delete this ticket?')) {
    const result = await deleteTicket(route.params.id)
    if (result.success) {
      alert('Ticket deleted successfully!')
      router.push('/tickets')
    } else {
      alert('Failed to delete ticket: ' + result.error)
    }
  }
}
</script>