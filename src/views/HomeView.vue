<script setup>
import { ref, onBeforeMount } from 'vue'
import PostGrid from '../components/PostGrid.vue'
import CreatePostModal from '../components/CreatePostModal.vue'
import { useUserStore } from '../store/user.store'
import { fetchPosts } from '../api/posts.api'

const userStore = useUserStore()

// Modal state
const showCreateModal = ref(false)
const posts = ref([])
const loading = ref(true)

const openCreateModal = () => {
  showCreateModal.value = true
}

const closeCreateModal = () => {
  showCreateModal.value = false
}

const handleCreatePost = postData => {
  const post = {
    id: posts.value.length + 1,
    title: postData.title,
    content: postData.content,
    image: postData.image,
    author: {
      firstName: userStore.firstName,
      lastName: userStore.lastName,
      username: userStore.username,
      profileImage: userStore.image,
    },
  }

  posts.value.unshift(post) // Añadir al inicio
}

const handlePostDeleted = postId => {
  // Eliminar el post de la lista local
  const index = posts.value.findIndex(post => post.id === postId)
  if (index !== -1) {
    posts.value.splice(index, 1)
  }
}

const handlePostEdited = ({ id, content }) => {
  // Actualizar el contenido del post en la lista local
  const post = posts.value.find(post => post.id === id)
  if (post) {
    post.content = content
  }
}

const loadPosts = async () => {
  try {
    loading.value = true
    const postsRes = await fetchPosts()
    posts.value = postsRes || []
    console.log('Posts cargados:', posts.value)
  } catch (error) {
    console.error('Error al cargar posts:', error)
    posts.value = []
  } finally {
    loading.value = false
  }
}

onBeforeMount(async () => {
  await loadPosts()
})
</script>

<template>
  <div class="min-h-screen py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8 flex items-center justify-between gap-4">
        <div class="flex-1 min-w-0">
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">
            Últimas Publicaciones
          </h2>
          <p class="text-sm md:text-base text-gray-400 hidden sm:block">
            Descubre lo último de tu comunidad
          </p>
        </div>

        <!-- Botón para crear nueva publicación -->
        <button
          @click="openCreateModal"
          class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all shadow-lg hover:shadow-indigo-500/50 flex items-center space-x-1 md:space-x-2 text-sm md:text-base flex-shrink-0"
        >
          <span class="text-lg md:text-xl">+</span>
          <span class="hidden sm:inline">Nueva publicación</span>
          <span class="sm:hidden">Nuevo</span>
        </button>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="text-center">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"
          ></div>
          <p class="text-gray-400 mt-4">Cargando publicaciones...</p>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="posts.length === 0" class="flex items-center justify-center py-20">
        <div class="text-center max-w-md">
          <div class="mb-6">
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
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-white mb-2">No hay publicaciones aún</h3>
          <p class="text-gray-400 mb-6">
            Sé el primero en compartir algo con la comunidad. ¡Crea tu primera publicación!
          </p>
          <button
            @click="openCreateModal"
            class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg inline-flex items-center space-x-2"
          >
            <span class="text-xl">+</span>
            <span>Crear primera publicación</span>
          </button>
        </div>
      </div>

      <!-- Grid de posts -->
      <PostGrid
        v-else
        :posts="posts"
        @postDeleted="handlePostDeleted"
        @postEdited="handlePostEdited"
      />
    </div>

    <!-- Modal para crear publicación -->
    <CreatePostModal :show="showCreateModal" @close="closeCreateModal" @create="handleCreatePost" />
  </div>
</template>

<style scoped></style>
