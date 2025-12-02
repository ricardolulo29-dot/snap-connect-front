<script setup>
import { computed } from 'vue'

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
  currentUserId: {
    type: [String, Number],
    required: true,
  },
})

// Determinar si el mensaje es del usuario actual
const isOwn = computed(() => {
  return props.message.senderId === props.currentUserId
})

// Formatear hora del mensaje
const formatTime = dateString => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div :class="['flex', isOwn ? 'justify-end' : 'justify-start']">
    <div
      :class="[
        'max-w-[70%] rounded-2xl px-4 py-2 break-words',
        isOwn ? 'bg-indigo-600 text-white' : 'bg-gray-700/50 text-gray-200',
      ]"
    >
      <p class="text-sm whitespace-pre-wrap">{{ message.content }}</p>
      <p :class="['text-xs mt-1', isOwn ? 'text-indigo-200' : 'text-gray-500']">
        {{ formatTime(message.createdAt) }}
      </p>
    </div>
  </div>
</template>
