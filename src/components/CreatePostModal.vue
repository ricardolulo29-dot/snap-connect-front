<script setup>
import { ref } from 'vue'
import { createPost } from '../api/posts.api'

defineProps({
  show: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['close', 'create'])

const newPost = ref({
  title: '',
  content: '',
  image: '',
})

const imagePreview = ref(null)
const fileInput = ref(null)

const closeModal = () => {
  newPost.value = {
    title: '',
    content: '',
    image: '',
  }
  imagePreview.value = null
  emit('close')
}

const handleFileUpload = event => {
  const file = event.target.files[0]
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = e => {
      imagePreview.value = e.target.result
      newPost.value.image = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const removeImage = () => {
  imagePreview.value = null
  newPost.value.image = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleSubmit = async () => {
  if (!newPost.value.title || !newPost.value.content || !newPost.value.image) {
    alert('Por favor, completa todos los campos incluyendo la imagen')
    return
  }

  await createPost(newPost.value)

  emit('create', { ...newPost.value })
  closeModal()
}
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    @click.self="closeModal"
  >
    <div
      class="bg-gray-800/95 backdrop-blur-xl border border-indigo-500/30 rounded-2xl overflow-hidden max-w-2xl w-full shadow-2xl"
    >
      <!-- Área de imagen (arriba del todo) -->
      <div class="relative bg-gray-900 border-b border-gray-700">
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleFileUpload"
        />

        <div v-if="!imagePreview" class="h-64 flex items-center justify-center">
          <button
            @click="triggerFileInput"
            type="button"
            class="flex flex-col items-center space-y-3 text-gray-400 hover:text-indigo-400 transition-colors"
          >
            <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span class="text-lg">Haz clic para subir una imagen</span>
            <span class="text-sm text-gray-500">JPG, PNG, GIF hasta 10MB</span>
          </button>
        </div>

        <div v-else class="relative">
          <img :src="imagePreview" alt="Preview" class="w-full h-64 object-cover" />
          <button
            @click="removeImage"
            type="button"
            class="absolute top-4 right-4 bg-red-600/80 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
            title="Eliminar imagen"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <button
            @click="triggerFileInput"
            type="button"
            class="absolute top-4 left-4 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-lg px-3 py-2 text-sm transition-colors"
          >
            Cambiar imagen
          </button>
        </div>
      </div>

      <!-- Contenido del modal -->
      <div class="p-8">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-2xl font-bold text-white">Crear nueva publicación</h3>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-white transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Título -->
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2">Título</label>
            <input
              v-model="newPost.title"
              type="text"
              class="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Título de tu publicación"
              required
            />
          </div>

          <!-- Contenido -->
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2">Contenido</label>
            <textarea
              v-model="newPost.content"
              rows="5"
              class="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
              placeholder="Cuéntanos tu historia..."
              required
            ></textarea>
          </div>

          <!-- Botones -->
          <div class="flex space-x-4">
            <button
              type="submit"
              class="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all shadow-lg"
            >
              Publicar
            </button>
            <button
              type="button"
              @click="closeModal"
              class="px-6 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
