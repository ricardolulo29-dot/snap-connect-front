<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '../store/user.store'
import { searchUsers } from '../api/users.api'
import UserList from '../components/UserList.vue'
import EmptyState from '../components/EmptyState.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'

const userStore = useUserStore()
const searchTerm = ref('')
const searchResults = ref([])
const loading = ref(false)
const hasSearched = ref(false)

// Ordenar usuarios: seguidos primero por orden alfabético, luego no seguidos por orden alfabético
const sortedUsers = computed(() => {
  if (!searchResults.value.length) return []

  const followedIds = new Set(userStore.following.map(user => user.id))

  // Separar usuarios seguidos y no seguidos
  const followed = []
  const notFollowed = []

  searchResults.value.forEach(user => {
    // No mostrar al usuario logueado
    if (user.id === userStore.id) return

    if (followedIds.has(user.id)) {
      followed.push(user)
    } else {
      notFollowed.push(user)
    }
  })

  // Ordenar ambos grupos alfabéticamente por nombre completo
  const sortAlphabetically = (a, b) => {
    const nameA = `${a.firstName} ${a.lastName}`.toLowerCase()
    const nameB = `${b.firstName} ${b.lastName}`.toLowerCase()
    return nameA.localeCompare(nameB)
  }

  followed.sort(sortAlphabetically)
  notFollowed.sort(sortAlphabetically)

  // Combinar: seguidos primero, luego no seguidos
  return [...followed, ...notFollowed]
})

const handleSearch = async () => {
  if (!searchTerm.value.trim()) {
    searchResults.value = []
    hasSearched.value = false
    return
  }

  try {
    loading.value = true
    hasSearched.value = true
    const results = await searchUsers(searchTerm.value)
    searchResults.value = results || []
  } catch (error) {
    console.error('Error al buscar usuarios:', error)
    searchResults.value = []
  } finally {
    loading.value = false
  }
}

const clearSearch = () => {
  searchTerm.value = ''
  searchResults.value = []
  hasSearched.value = false
}
</script>

<template>
  <div class="min-h-screen py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-white mb-2">Buscar usuarios</h2>
        <p class="text-gray-400">Encuentra y conecta con otros usuarios</p>
      </div>

      <!-- Barra de búsqueda -->
      <div
        class="bg-gray-800/50 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-6 mb-8 shadow-lg"
      >
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FontAwesomeIcon :icon="faSearch" class="text-gray-400" />
          </div>
          <input
            v-model="searchTerm"
            @input="handleSearch"
            @keyup.enter="handleSearch"
            type="text"
            placeholder="Buscar por nombre, apellido o usuario..."
            class="w-full pl-12 pr-12 py-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
          <button
            v-if="searchTerm"
            @click="clearSearch"
            class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <FontAwesomeIcon :icon="faTimes" />
          </button>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="text-center">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"
          ></div>
          <p class="text-gray-400 mt-4">Buscando usuarios...</p>
        </div>
      </div>

      <!-- Resultados -->
      <div v-else-if="sortedUsers.length > 0" class="space-y-4">
        <div class="text-gray-400 text-sm mb-4">
          {{ sortedUsers.length }} {{ sortedUsers.length === 1 ? 'resultado' : 'resultados' }}
          encontrados
        </div>
        <UserList v-for="user in sortedUsers" :key="user.id" :user="user" />
      </div>

      <!-- Estado vacío cuando no hay resultados -->
      <EmptyState
        v-else-if="hasSearched && searchTerm && !loading"
        title="No se encontraron usuarios"
        :description="`No hay resultados para '${searchTerm}'`"
      >
        <template #icon>
          <svg
            class="mx-auto h-24 w-24 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </template>
      </EmptyState>

      <!-- Estado inicial -->
      <EmptyState
        v-else-if="!hasSearched"
        title="Comienza tu búsqueda"
        description="Escribe el nombre, apellido o usuario para encontrar personas"
      >
        <template #icon>
          <svg
            class="mx-auto h-24 w-24 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </template>
      </EmptyState>
    </div>
  </div>
</template>

<style scoped></style>
