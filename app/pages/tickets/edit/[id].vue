<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Edit Ticket</h1>
    </div>

    <div v-if="loading" class="text-center py-4">
      Loading...
    </div>

    <div v-else-if="ticket" class="bg-white shadow overflow-hidden sm:rounded-lg p-6">
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="title">
            Title *
          </label>
          <input v-model="form.title" type="text" id="title" required
                 class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="description">
            Description
          </label>
          <textarea v-model="form.description" id="description" rows="4"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="priority">
            Priority
          </label>
          <select v-model="form.priority" id="priority"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="status">
            Status
          </label>
          <select v-model="form.status" id="status"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        <div class="flex items-center justify-end space-x-4">
          <NuxtLink :to="`/tickets/${ticket.id}`" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
            Cancel
          </NuxtLink>
          <button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
            Update Ticket
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const { currentTicket: ticket, loading, fetchTicketById, updateTicket } = useTickets()

const form = ref({
  title: '',
  description: '',
  priority: 'MEDIUM',
  status: 'OPEN'
})

onMounted(async () => {
  const ticketData = await fetchTicketById(route.params.id)
  if (ticketData) {
    form.value = {
      title: ticketData.title,
      description: ticketData.description,
      priority: ticketData.priority,
      status: ticketData.status
    }
  }
})

const handleSubmit = async () => {
  const result = await updateTicket(route.params.id, form.value)
  if (result.success) {
    alert('Ticket updated successfully!')
    router.push(`/tickets/${route.params.id}`)
  } else {
    alert('Failed to update ticket: ' + result.error)
  }
}
</script>