<script setup>
defineProps({
  title: {
    type: String,
    default: 'Selecciona un chat para comenzar',
  },
  subtitle: {
    type: String,
    default: null,
  },
})
</script>

<template>
  <div class="flex-1 flex items-center justify-center">
    <div class="text-center">
      <div
        class="w-20 h-20 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <svg
          class="w-10 h-10 text-indigo-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </div>
      <p class="text-gray-400 text-lg">{{ title }}</p>
      <p v-if="subtitle" class="text-gray-500 text-sm mt-2">{{ subtitle }}</p>
    </div>
  </div>
</template>
