<template>
  <form @submit.prevent="handleSubmit">
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="title">
        Titre *
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
        Priorité
      </label>
      <select v-model="form.priority" id="priority"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        <option value="LOW">Basse</option>
        <option value="MEDIUM">Moyenne</option>
        <option value="HIGH">Haute</option>
        <option value="CRITICAL">Critique</option>
      </select>
    </div>


    <div class="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 sm:gap-0 sm:space-x-4">
      <button type="button" @click="$emit('cancel')" class="w-full sm:w-auto bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
        Annuler
      </button>
      <button type="submit" class="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
        {{ isEditing ? 'Mettre à jour' : 'Créer le Ticket' }}
      </button>
    </div>
  </form>
</template>

<script setup>
const props = defineProps({
  ticket: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['submit', 'cancel'])

const isEditing = computed(() => !!props.ticket)
const form = ref({})

watch(
  () => props.ticket,
  (newTicket) => {
    form.value = newTicket
      ? { ...newTicket }
      : { title: '', description: '', priority: 'MEDIUM' }
  },
  { immediate: true }
)


// unified submit handler
const handleSubmit = async () => {
  emit('submit', form.value)
}
</script>

