<script setup lang="js">
import { RouterView, useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faHome,
  faUser,
  faSignOutAlt,
  faComments,

} from '@fortawesome/free-solid-svg-icons'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

import {  computed, onBeforeMount, onMounted, onUnmounted, watch } from 'vue'
import { useUserStore } from '../store/user.store'
import { jwtDecode } from 'jwt-decode'
import { useRoute } from 'vue-router'
import { getUserImage } from '@/api/users.api.js'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

let unreadInterval = null

// Contar total de mensajes no leídos desde el store
const totalUnreadCount = computed(() => userStore.unreadMessagesCount)

// Cargar chats y contador de no leídos
const loadUnreadCount = async () => {
  await userStore.loadChats()
}

const logout = () => {
  localStorage.removeItem('token')
  router.push({ name: 'login' })
}

const goToProfile = () => {
  router.push({ name: 'profile', params: { id: userStore.id } })
  if (route.name === 'profile') setTimeout(() => router.go(0), 100)
}

onBeforeMount(async () => {
  if (!localStorage.getItem('token')) {
    router.push({ name: 'login' })
  } else {
    let token = localStorage.getItem('token')
    const isExpired = Date.now() >= jwtDecode(token).exp * 1000

    if (isExpired) {
      localStorage.removeItem('token')
      router.push({ name: 'login' })
    } else {
      const tokenDecoded = jwtDecode(token)
      userStore.setUser(tokenDecoded)
      const userId = tokenDecoded.id

      await userStore.loadFollowers(userId)
      await userStore.loadFollowing(userId)

      const profileImage = await getUserImage(userId)
      userStore.setUserImage(profileImage)

      // Cargar contador de mensajes no leídos
      await loadUnreadCount()
    }
  }
})

onMounted(() => {
  // Actualizar contador cada 30 segundos
  unreadInterval = setInterval(loadUnreadCount, 30000)
})

onUnmounted(() => {
  if (unreadInterval) {
    clearInterval(unreadInterval)
  }
})

// Recargar contador cuando se navega (especialmente al salir de chats)
watch(() => route.path, (newPath, oldPath) => {
  // Si venimos de la vista de chats, recargar el contador
  if (oldPath === '/chats' || newPath === '/chats') {
    loadUnreadCount()
  }
})
</script>

<template>
  <div
    class="h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 flex flex-col overflow-hidden"
  >
    <!-- NAVBAR MOBILE (arriba) - Solo logo -->
    <header
      class="md:hidden w-full fixed top-0 left-0 z-30 backdrop-blur-md bg-gray-900/80 border-b border-indigo-500/30 shadow-xl"
    >
      <div class="flex justify-center items-center px-6 py-3">
        <div class="flex items-center space-x-2">
          <div
            class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg flex items-center justify-center"
          >
            <span class="text-white font-bold text-lg">S</span>
          </div>
          <h1 class="text-lg font-bold text-white drop-shadow-lg">SnapConnect</h1>
        </div>
      </div>
    </header>

    <!-- NAVBAR DESKTOP (arriba) -->
    <header
      class="hidden md:block w-full fixed top-0 left-0 z-30 backdrop-blur-md bg-gray-900/80 border-b border-indigo-500/30 shadow-xl transition-all duration-300"
    >
      <div class="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <!-- LOGO -->
        <div class="flex items-center space-x-3">
          <div
            class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg flex items-center justify-center"
          >
            <span class="text-white font-bold text-xl">S</span>
          </div>
          <h1 class="text-xl md:text-2xl font-bold text-white drop-shadow-lg">SnapConnect</h1>
        </div>

        <!-- DESKTOP MENU -->
        <nav class="flex items-center space-x-2">
          <router-link to="/" class="nav-btn">
            <FontAwesomeIcon :icon="faHome" />
            <span>Home</span>
          </router-link>

          <router-link to="/search" class="nav-btn">
            <FontAwesomeIcon :icon="faMagnifyingGlass" />
            <span>Buscar</span>
          </router-link>

          <router-link to="/chats" class="nav-btn relative">
            <FontAwesomeIcon :icon="faComments" />
            <span>Chat</span>
            <div
              v-if="totalUnreadCount > 0"
              class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center"
            >
              {{ totalUnreadCount > 99 ? '99+' : totalUnreadCount }}
            </div>
          </router-link>

          <div class="w-px h-8 bg-gray-600 mx-2"></div>

          <a @click="goToProfile()" class="nav-btn-icon cursor-pointer" title="Profile">
            <FontAwesomeIcon :icon="faUser" />
          </a>

          <a @click="logout()" class="nav-btn-icon" title="Logout">
            <FontAwesomeIcon :icon="faSignOutAlt" />
          </a>
        </nav>
      </div>
    </header>

    <!-- CONTENT -->
    <main class="pt-[60px] md:pt-[90px] pb-[70px] md:pb-0 flex-1 flex flex-col overflow-y-auto">
      <router-view />
    </main>

    <!-- NAVBAR MOBILE (abajo) -->
    <nav
      class="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-gray-900/95 backdrop-blur-lg border-t border-indigo-500/30 shadow-2xl"
    >
      <div class="flex items-center justify-around px-4 py-3">
        <router-link to="/" class="mobile-nav-btn">
          <FontAwesomeIcon :icon="faHome" class="text-xl" />
          <span class="text-xs mt-1">Home</span>
        </router-link>

        <router-link to="/search" class="mobile-nav-btn">
          <FontAwesomeIcon :icon="faMagnifyingGlass" class="text-xl" />
          <span class="text-xs mt-1">Buscar</span>
        </router-link>

        <router-link to="/chats" class="mobile-nav-btn relative">
          <FontAwesomeIcon :icon="faComments" class="text-xl" />
          <span class="text-xs mt-1">Chat</span>
          <div
            v-if="totalUnreadCount > 0"
            class="absolute top-0 right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center"
          >
            {{ totalUnreadCount > 9 ? '9+' : totalUnreadCount }}
          </div>
        </router-link>

        <a @click="goToProfile()" class="mobile-nav-btn cursor-pointer">
          <FontAwesomeIcon :icon="faUser" class="text-xl" />
          <span class="text-xs mt-1">Perfil</span>
        </a>

        <a @click="logout()" class="mobile-nav-btn cursor-pointer">
          <FontAwesomeIcon :icon="faSignOutAlt" class="text-xl" />
          <span class="text-xs mt-1">Salir</span>
        </a>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.nav-btn {
  @apply flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-300
         transition-all duration-200 hover:bg-indigo-600/20 hover:text-white cursor-pointer;
}

.nav-btn-icon {
  @apply flex items-center justify-center w-10 h-10 rounded-lg text-gray-300
         transition-all duration-200 hover:bg-gray-700/50 hover:text-white cursor-pointer;
}

.mobile-nav-btn {
  @apply flex flex-col items-center justify-center text-gray-300 transition-all duration-200
         hover:text-white min-w-[60px] py-1;
}

.mobile-nav-btn.router-link-active {
  @apply text-indigo-400;
}
</style>
