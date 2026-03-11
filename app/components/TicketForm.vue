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

    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2">
        Attachments
      </label>
      <input 
        type="file" 
        @change="handleFileUpload" 
        multiple 
        accept="image/*,.pdf,.doc,.docx"
        class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
      >
      
      <!-- Liste des fichiers sélectionnés -->
      <div v-if="selectedFiles.length > 0" class="mt-2">
        <div v-for="(file, index) in selectedFiles" :key="index" class="flex items-center space-x-2 text-sm text-gray-600">
          <span>{{ file.name }} ({{ formatFileSize(file.size) }})</span>
          <button @click="removeFile(index)" type="button" class="text-red-600 hover:text-red-800">×</button>
        </div>
      </div>
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


// file attachments
const selectedFiles = ref([])

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files)
  selectedFiles.value.push(...files)
}

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// unified submit handler
const handleSubmit = async () => {
  if (selectedFiles.value.length > 0) {
    const formData = new FormData()
    formData.append('data', JSON.stringify(form.value))
    selectedFiles.value.forEach((file) => {
      formData.append('files', file)
    })
    emit('submit', formData)
  } else {
    emit('submit', form.value)
  }
}
</script>

