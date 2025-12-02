<script setup>
import { ref, watch } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  postId: {
    type: [Number, String],
    required: true,
  },
  initialContent: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['close', 'save'])

const content = ref(props.initialContent)

// Actualizar el contenido cuando cambie la prop
watch(
  () => props.initialContent,
  newValue => {
    content.value = newValue
  }
)

const closeModal = () => {
  emit('close')
}

const handleSubmit = () => {
  if (!content.value.trim()) {
    alert('El contenido no puede estar vacío')
    return
  }

  emit('save', { id: props.postId, content: content.value })
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
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-700">
        <h2 class="text-2xl font-bold text-white">Editar publicación</h2>
        <button
          @click="closeModal"
          class="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg"
        >
          <FontAwesomeIcon :icon="faTimes" class="text-xl" />
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <!-- Contenido -->
        <div>
          <label class="block text-gray-300 text-sm font-medium mb-2">Contenido</label>
          <textarea
            v-model="content"
            rows="8"
            class="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
            placeholder="Escribe el contenido de tu publicación..."
            required
          ></textarea>
        </div>

        <!-- Botones -->
        <div class="flex justify-end space-x-3 pt-4">
          <button
            @click="closeModal"
            type="button"
            class="px-6 py-2.5 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
          >
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
