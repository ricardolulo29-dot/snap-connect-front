<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

defineProps({
  icon: {
    type: Object,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="text-center py-12">
    <FontAwesomeIcon :icon="icon" class="text-6xl text-gray-600 mb-4" />
    <p class="text-gray-400">{{ message }}</p>
  </div>
</template>

<style scoped></style>
