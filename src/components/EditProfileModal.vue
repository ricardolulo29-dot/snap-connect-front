<script setup>
import { ref, watch } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

const emit = defineEmits(['close', 'save'])

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  userId: {
    type: [Number, String],
    required: true,
  },
  initialData: {
    type: Object,
    required: true,
  },
})

const formData = ref({
  username: '',
  firstName: '',
  lastName: '',
  email: '',
})

const errors = ref({})
const isLoading = ref(false)

// Inicializar el formulario con los datos actuales
watch(
  () => props.show,
  newVal => {
    if (newVal) {
      formData.value = {
        username: props.initialData.username || '',
        firstName: props.initialData.firstName || '',
        lastName: props.initialData.lastName || '',
        email: props.initialData.email || '',
      }
      errors.value = {}
    }
  }
)

const validateForm = () => {
  errors.value = {}

  if (!formData.value.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email))
    errors.value.email = 'El email no es válido'

  return Object.keys(errors.value).length === 0
}

const handleSave = async () => {
  if (!validateForm()) return

  isLoading.value = true
  try {
    emit('save', {
      userId: props.userId,
      updates: formData.value,
    })
  } catch (error) {
    console.error('Error en el formulario:', error)
  } finally {
    isLoading.value = false
  }
}

const handleClose = () => {
  if (!isLoading.value) {
    emit('close')
  }
}
</script>

<template>
  <Transition name="modal">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      @click.self="handleClose"
    >
      <div
        class="bg-gray-800 border border-indigo-500/30 rounded-2xl p-6 w-full max-w-md shadow-2xl shadow-indigo-500/20"
      >
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-2xl font-bold text-white">Editar Perfil</h3>
          <button
            @click="handleClose"
            :disabled="isLoading"
            class="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700/50"
            :class="{ 'opacity-50 cursor-not-allowed': isLoading }"
          >
            <FontAwesomeIcon :icon="faTimes" />
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSave" class="space-y-4">
          <!-- Username -->
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2"> Nombre de usuario </label>
            <input
              v-model="formData.username"
              type="text"
              class="w-full px-4 py-2 bg-gray-900 border rounded-lg text-white focus:outline-none focus:ring-2 transition-all"
              :class="
                errors.username
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-700 focus:ring-indigo-500'
              "
              :disabled="isLoading"
            />
            <p v-if="errors.username" class="text-red-400 text-xs mt-1">
              {{ errors.username }}
            </p>
          </div>

          <!-- First Name -->
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2"> Nombre </label>
            <input
              v-model="formData.firstName"
              type="text"
              class="w-full px-4 py-2 bg-gray-900 border rounded-lg text-white focus:outline-none focus:ring-2 transition-all"
              :class="
                errors.firstName
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-700 focus:ring-indigo-500'
              "
              :disabled="isLoading"
            />
            <p v-if="errors.firstName" class="text-red-400 text-xs mt-1">
              {{ errors.firstName }}
            </p>
          </div>

          <!-- Last Name -->
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2"> Apellido </label>
            <input
              v-model="formData.lastName"
              type="text"
              class="w-full px-4 py-2 bg-gray-900 border rounded-lg text-white focus:outline-none focus:ring-2 transition-all"
              :class="
                errors.lastName
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-700 focus:ring-indigo-500'
              "
              :disabled="isLoading"
            />
            <p v-if="errors.lastName" class="text-red-400 text-xs mt-1">
              {{ errors.lastName }}
            </p>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2"> Email </label>
            <input
              v-model="formData.email"
              type="email"
              class="w-full px-4 py-2 bg-gray-900 border rounded-lg text-white focus:outline-none focus:ring-2 transition-all"
              :class="
                errors.email
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-700 focus:ring-indigo-500'
              "
              :disabled="isLoading"
            />
            <p v-if="errors.email" class="text-red-400 text-xs mt-1">
              {{ errors.email }}
            </p>
          </div>

          <!-- Buttons -->
          <div class="flex space-x-3 pt-4">
            <button
              type="button"
              @click="handleClose"
              :disabled="isLoading"
              class="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              :class="{ 'opacity-50 cursor-not-allowed': isLoading }"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="isLoading"
              class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors font-medium"
              :class="{ 'opacity-50 cursor-not-allowed': isLoading }"
            >
              {{ isLoading ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-gray-800,
.modal-leave-active .bg-gray-800 {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-gray-800,
.modal-leave-to .bg-gray-800 {
  transform: scale(0.9);
}
</style>
