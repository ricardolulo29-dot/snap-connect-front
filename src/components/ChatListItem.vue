<script setup>
import { computed } from 'vue'
import ProfileImage from './ProfileImage.vue'
import { getUserFullName } from '../utils/formaters'

const props = defineProps({
  chat: {
    type: Object,
    required: true,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
  currentUserId: {
    type: [String, Number],
    required: true,
  },
})

const emit = defineEmits(['select'])

// Obtener el otro participante del chat (no el usuario actual)
const otherParticipant = computed(
  () => props.chat.participants?.find(p => p.id !== props.currentUserId) || {}
)

// Devuelve el numero de mensajes no leídos
const unreadCount = computed(() => props.chat.unreadCount || 0)

const handleClick = () => {
  emit('select', props.chat)
}
</script>

<template>
  <div
    @click="handleClick"
    :class="[
      'p-4 hover:bg-gray-700/30 cursor-pointer transition-colors',
      isSelected ? 'bg-gray-700/50' : '',
    ]"
  >
    <div class="flex items-center space-x-3">
      <!-- Profile Image con badge de no leídos -->
      <div class="relative">
        <ProfileImage
          :firstName="otherParticipant.firstName"
          :profileImage="otherParticipant.image"
          class="flex-shrink-0"
        />
        <!-- Indicador de mensajes no leídos -->
        <div
          v-if="unreadCount > 0"
          class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-gray-800"
        ></div>
      </div>

      <!-- Info del chat -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between mb-0.5">
          <!-- Nombre del usuario -->
          <p
            :class="[
              'text-sm truncate',
              unreadCount > 0 ? 'text-white font-semibold' : 'text-white font-medium',
            ]"
          >
            {{ getUserFullName(otherParticipant.firstName, otherParticipant.lastName) }}
          </p>

          <!-- Badge numérico de mensajes no leídos -->
          <div
            v-if="unreadCount > 0"
            class="ml-2 bg-indigo-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center"
          >
            {{ unreadCount > 99 ? '99+' : unreadCount }}
          </div>
        </div>

        <!-- Username -->
        <p class="text-xs text-gray-400 truncate">@{{ otherParticipant.username }}</p>
      </div>
    </div>
  </div>
</template>
