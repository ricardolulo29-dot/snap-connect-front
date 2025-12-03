<script setup>
import { ref, computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'

const props = defineProps({
  tags: {
    type: Array,
    required: true,
    default: () => [],
  },
  selectedTags: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['tagAdded', 'tagRemoved'])

const searchQuery = ref('')

const filteredTags = computed(() => {
  if (!searchQuery.value.trim()) return []
  return props.tags.filter(
    tag =>
      tag.name.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
      !props.selectedTags.includes(tag.name)
  )
})

const clearSearch = () => {
  searchQuery.value = ''
}

const addTag = tagName => {
  emit('tagAdded', tagName)
  searchQuery.value = ''
}

const removeTag = tagName => {
  emit('tagRemoved', tagName)
}
</script>

<template>
  <div class="mb-6">
    <!-- Buscador -->
    <div class="relative">
      <FontAwesomeIcon
        :icon="faSearch"
        class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar etiquetas para filtrar..."
        class="w-full bg-gray-800 border border-gray-700 rounded-lg pl-11 pr-10 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-colors"
      />
      <button
        v-if="searchQuery"
        @click="clearSearch"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
      >
        <FontAwesomeIcon :icon="faTimes" />
      </button>
    </div>

    <!-- Tags sugeridos -->
    <div v-if="filteredTags.length > 0" class="mt-3 flex items-center gap-2 flex-wrap">
      <span class="text-gray-400 text-xs font-medium">Sugerencias:</span>
      <button
        v-for="tag in filteredTags.slice(0, 10)"
        :key="tag.name"
        @click="addTag(tag.name)"
        class="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-800 text-gray-300 hover:bg-indigo-600 hover:text-white transition-all"
      >
        #{{ tag.name }}
      </button>
    </div>

    <!-- Tags seleccionados -->
    <div v-if="selectedTags.length > 0" class="mt-3 flex items-center gap-2 flex-wrap">
      <span class="text-gray-400 text-sm font-medium">Filtros activos:</span>
      <div
        v-for="tagName in selectedTags"
        :key="tagName"
        class="bg-indigo-600 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg shadow-indigo-500/50 flex items-center gap-2"
      >
        #{{ tagName }}
        <button
          @click="removeTag(tagName)"
          class="hover:bg-indigo-700 rounded-full p-0.5 transition-colors"
        >
          <FontAwesomeIcon :icon="faTimes" class="text-xs" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
