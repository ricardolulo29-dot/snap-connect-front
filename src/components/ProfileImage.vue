<script setup>
const props = defineProps({
  firstName: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    required: false,
  },
})

const getUserInitial = () => {
  console.log(props.profileImage)
  return props.firstName?.charAt(0)?.toUpperCase() || 'U'
}
</script>
<template>
  <div
    v-if="profileImage"
    class="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-500/30"
  >
    <img :src="profileImage" :alt="firstName" class="w-full h-full object-cover" />
  </div>
  <div
    v-else
    class="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"
  >
    <span class="text-white font-semibold">{{ getUserInitial() }}</span>
  </div>
</template>
<style scoped></style>
