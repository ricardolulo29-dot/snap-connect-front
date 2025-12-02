<script setup>
import { ref, onBeforeMount } from 'vue'
import { useUserStore } from '../store/user.store'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faEdit,
  faHeart,
  faUserPlus,
  faUsers,
  faImage,
  faTimes,
} from '@fortawesome/free-solid-svg-icons'
import PostGrid from '../components/PostGrid.vue'
import UserList from '../components/UserList.vue'
import EmptyState from '../components/EmptyState.vue'
import { getUserProfile, updateUserImage } from '../api/users.api'

const userStore = useUserStore()

const activeTab = ref('details')
const profileData = ref(null)
const loading = ref(true)
const isHoveringImage = ref(false)
const showImageModal = ref(false)
const selectedImage = ref(null)
const imagePreview = ref(null)
const fileInput = ref(null)
const uploading = ref(false)

const likedPosts = ref([])
const posts = ref([])

const handlePostDeleted = postId => {
  // Eliminar el post de la lista local
  const postIndex = posts.value.findIndex(post => post.id === postId)
  if (postIndex !== -1) {
    posts.value.splice(postIndex, 1)
  }

  // También eliminar de los posts con like si está ahí
  const likedIndex = likedPosts.value.findIndex(post => post.id === postId)
  if (likedIndex !== -1) {
    likedPosts.value.splice(likedIndex, 1)
  }
}

const handleImageEdit = () => {
  fileInput.value?.click()
}

const onFileSelected = event => {
  const file = event.target.files?.[0]
  if (file && file.type.startsWith('image/')) {
    selectedImage.value = file
    const reader = new FileReader()
    reader.onload = e => {
      imagePreview.value = e.target?.result
      showImageModal.value = true
    }
    reader.readAsDataURL(file)
  }
}

const closeModal = () => {
  showImageModal.value = false
  selectedImage.value = null
  imagePreview.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const saveImage = async () => {
  if (!imagePreview.value) return

  try {
    uploading.value = true

    const response = await updateUserImage(userStore.id, imagePreview.value)
    // Actualizar la imagen en el store y en profileData
    if (response) {
      userStore.image = imagePreview.value
      if (profileData.value) {
        profileData.value.profileImage = imagePreview.value
      }
    }

    closeModal()
  } catch (error) {
    console.error('Error message:', error.message)
    const errorMsg = error.response?.data?.message || error.message || 'Error desconocido'
    alert(`Error al actualizar la imagen de perfil: ${errorMsg}`)
  } finally {
    uploading.value = false
  }
}

const tabs = [
  { id: 'details', label: 'Perfil', icon: faEdit },
  { id: 'posts', label: 'Publicaciones', icon: faImage },
  { id: 'likes', label: 'Me gusta', icon: faHeart },
  { id: 'following', label: 'Seguidos', icon: faUserPlus },
  { id: 'followers', label: 'Seguidores', icon: faUsers },
]

const getUserInitial = () => {
  const fullName = getFullName()
  return fullName?.charAt(0)?.toUpperCase() || userStore.firstName?.charAt(0)?.toUpperCase() || 'U'
}

const getFullName = () => {
  return (
    (profileData.value?.firstName && profileData.value?.lastName
      ? `${profileData.value.firstName} ${profileData.value.lastName}`
      : userStore.fullName || userStore.firstName) || 'Usuario'
  )
}

onBeforeMount(async () => {
  try {
    loading.value = true
    const profile = await getUserProfile(userStore.id)
    profileData.value = profile

    if (profile.likedPosts) likedPosts.value = profile.likedPosts
    if (profile.posts) posts.value = profile.posts
  } catch (error) {
    console.error('Error al cargar perfil:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen py-8">
    <!-- Input file oculto -->
    <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileSelected" />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header con imagen de perfil -->
      <div
        class="bg-gray-800/50 backdrop-blur-xl border border-indigo-500/30 rounded-2xl overflow-hidden shadow-2xl mb-8"
      >
        <!-- Banner -->
        <div class="h-48 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative">
          <div class="absolute inset-0 bg-black/20"></div>
        </div>

        <!-- Información del perfil -->
        <div class="relative px-8 pb-8">
          <!-- Imagen de perfil -->
          <div class="flex justify-between items-start -mt-20 mb-4">
            <div
              class="relative group cursor-pointer"
              @mouseenter="isHoveringImage = true"
              @mouseleave="isHoveringImage = false"
              @click="handleImageEdit"
            >
              <!-- Imagen de perfil o inicial -->
              <div
                v-if="profileData?.profileImage || userStore.image"
                class="w-32 h-32 rounded-full border-4 border-gray-800 overflow-hidden shadow-xl"
              >
                <img
                  :src="profileData?.profileImage || userStore.image"
                  :alt="profileData?.firstName || userStore.firstName"
                  class="w-full h-full object-cover"
                />
              </div>
              <div
                v-else
                class="w-32 h-32 rounded-full border-4 border-gray-800 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl"
              >
                <span class="text-white font-bold text-4xl">{{ getUserInitial() }}</span>
              </div>

              <!-- Overlay con icono de editar (aparece al hacer hover) -->
              <div
                class="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <FontAwesomeIcon :icon="faEdit" class="text-white text-2xl" />
              </div>
            </div>

            <!-- Botón editar perfil -->
            <button
              v-if="activeTab === 'details'"
              class="mt-20 text-gray-300 px-4 py-2 rounded-lg hover:bg-indigo-600/20 hover:text-white transition-all flex items-center space-x-2 border border-gray-700 hover:border-indigo-500/30"
            >
              <FontAwesomeIcon :icon="faEdit" />
              <span>Editar perfil</span>
            </button>
          </div>

          <!-- Nombre y username -->
          <div class="mb-4">
            <h1 class="text-3xl font-bold text-white mb-1">
              {{ getFullName() }}
            </h1>
            <p class="text-gray-400">@{{ profileData?.username || userStore.username }}</p>
          </div>

          <!-- Estadísticas -->
          <div class="flex space-x-6 text-sm">
            <div>
              <span class="text-white font-semibold">{{ posts.length }}</span>
              <span class="text-gray-400 ml-1">Posts</span>
            </div>
            <div>
              <span class="text-white font-semibold">{{ userStore.followers.length }}</span>
              <span class="text-gray-400 ml-1">Seguidores</span>
            </div>
            <div>
              <span class="text-white font-semibold">{{ userStore.following.length }}</span>
              <span class="text-gray-400 ml-1">Seguidos</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs de navegación -->
      <div
        class="bg-gray-800/50 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-2 mb-8 shadow-lg"
      >
        <div class="flex flex-wrap gap-2">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'flex-1 min-w-[140px] flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200',
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50',
            ]"
          >
            <FontAwesomeIcon :icon="tab.icon" />
            <span class="hidden sm:inline">{{ tab.label }}</span>
          </button>
        </div>
      </div>

      <!-- Contenido de los tabs -->
      <div
        class="bg-gray-800/50 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-8 shadow-lg"
      >
        <!-- Detalles del perfil -->
        <div v-if="activeTab === 'details'" class="space-y-6">
          <h2 class="text-2xl font-bold text-white mb-6">Información del perfil</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-gray-400 text-sm mb-2">Nombre</label>
              <div class="bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white">
                {{ profileData?.firstName || userStore.name || 'No especificado' }}
              </div>
            </div>

            <div>
              <label class="block text-gray-400 text-sm mb-2">Apellidos</label>
              <div class="bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white">
                {{ profileData?.lastName || userStore.surname || 'No especificado' }}
              </div>
            </div>

            <div>
              <label class="block text-gray-400 text-sm mb-2">Email</label>
              <div class="bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white">
                {{ profileData?.email || userStore.email || 'No especificado' }}
              </div>
            </div>

            <div>
              <label class="block text-gray-400 text-sm mb-2">Username</label>
              <div class="bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white">
                @{{ profileData?.username || userStore.username || 'No especificado' }}
              </div>
            </div>

            <div>
              <label class="block text-gray-400 text-sm mb-2">Teléfono</label>
              <div class="bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white">
                {{ profileData?.phone || userStore.phone || 'No especificado' }}
              </div>
            </div>

            <div>
              <label class="block text-gray-400 text-sm mb-2">Ciudad</label>
              <div class="bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white">
                {{ profileData?.city || userStore.city || 'No especificado' }}
              </div>
            </div>

            <div>
              <label class="block text-gray-400 text-sm mb-2">Cámara</label>
              <div class="bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white">
                {{ profileData?.camera || userStore.camera || 'No especificado' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Publicaciones -->
        <div v-else-if="activeTab === 'posts'">
          <h2 class="text-2xl font-bold text-white mb-6">Mis Publicaciones</h2>

          <EmptyState
            v-if="posts.length === 0"
            :icon="faImage"
            message="Aún no tienes ninguna publicación"
          />

          <PostGrid v-else :posts="posts" @postDeleted="handlePostDeleted" />
        </div>

        <!-- Me gusta -->
        <div v-else-if="activeTab === 'likes'">
          <h2 class="text-2xl font-bold text-white mb-6">Posts que me gustan</h2>

          <EmptyState
            v-if="likedPosts.length === 0"
            :icon="faHeart"
            message="Aún no has dado like a ninguna publicación"
          />

          <PostGrid v-else :posts="likedPosts" @postDeleted="handlePostDeleted" />
        </div>

        <!-- Seguidos -->
        <div v-else-if="activeTab === 'following'">
          <h2 class="text-2xl font-bold text-white mb-6">Personas que sigues</h2>

          <EmptyState
            v-if="userStore.following.length === 0"
            :icon="faUserPlus"
            message="Aún no sigues a nadie"
          />

          <div v-else class="space-y-4">
            <UserList v-for="user in userStore.following" :key="user.id" :user="user" />
          </div>
        </div>

        <!-- Seguidores -->
        <div v-else-if="activeTab === 'followers'">
          <h2 class="text-2xl font-bold text-white mb-6">Tus seguidores</h2>

          <EmptyState
            v-if="userStore.followers.length === 0"
            :icon="faUsers"
            message="Aún no tienes seguidores"
          />

          <div v-else class="space-y-4">
            <UserList v-for="user in userStore.followers" :key="user.id" :user="user" />
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de preview de imagen -->
    <div
      v-if="showImageModal"
      class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div
        class="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-indigo-500/30 shadow-2xl"
      >
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-white">Vista previa</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-white transition-colors">
            <FontAwesomeIcon :icon="faTimes" class="text-xl" />
          </button>
        </div>

        <!-- Preview circular de la imagen -->
        <div class="flex justify-center mb-6">
          <div
            class="w-48 h-48 rounded-full overflow-hidden border-4 border-indigo-500/30 shadow-xl"
          >
            <img
              v-if="imagePreview"
              :src="imagePreview"
              alt="Preview"
              class="w-full h-full object-cover"
            />
          </div>
        </div>

        <!-- Botones -->
        <div class="flex gap-4">
          <button
            @click="closeModal"
            class="flex-1 px-4 py-3 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="saveImage"
            :disabled="uploading"
            class="flex-1 px-4 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ uploading ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
