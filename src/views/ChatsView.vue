<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSearch, faPaperPlane, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { useUserStore } from '../store/user.store'
import { useChat } from '../composables/useChat'
import ProfileImage from '../components/ProfileImage.vue'
import ChatListItem from '../components/ChatListItem.vue'
import MessageBubble from '../components/MessageBubble.vue'
import EmptyChatState from '../components/EmptyChatState.vue'
import { getUserFullName } from '../utils/formaters'

const userStore = useUserStore()

const {
  selectedChat,
  messages,
  newMessage,
  loading,
  sendingMessage,
  chats,
  totalUnreadCount,
  loadChats,
  selectChat,
  deselectChat,
  sendChatMessage,
  startChatWithUser,
  startChatsPolling,
  stopAllPolling,
} = useChat()

const searchQuery = ref('')
const showUserSearch = ref(false)

// Filtrar usuarios seguidos para buscar
const filteredFollowing = computed(() => {
  if (!searchQuery.value) return userStore.following

  return userStore.following.filter(
    user =>
      user.username.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// Wrapper para seleccionar chat y cerrar búsqueda
const handleSelectChat = async chat => {
  showUserSearch.value = false
  await selectChat(chat)
}

// Wrapper para crear chat con usuario
const handleStartChat = async user => {
  try {
    await startChatWithUser(user)
  } catch {
    alert('Error al iniciar el chat')
  }
}

// Wrapper para enviar mensaje
const handleSendMessage = async () => {
  try {
    await sendChatMessage()
  } catch {
    alert('Error al enviar el mensaje')
  }
}

// Volver a la lista de chats (móvil)
const backToChats = () => {
  deselectChat()
}

onMounted(() => {
  loadChats()
  // Iniciar polling para actualizar lista de chats en segundo plano
  startChatsPolling()
})

// Limpiar intervalos al salir de la vista
onBeforeUnmount(() => {
  stopAllPolling()
})
</script>

<template>
  <div
    class="absolute inset-0 flex bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 overflow-hidden"
  >
    <!-- Sidebar de chats -->
    <div
      :class="[
        'w-full md:w-96 bg-gray-800/50 backdrop-blur-xl border-r border-indigo-500/30 flex flex-col',
        selectedChat ? 'hidden md:flex' : 'flex',
      ]"
    >
      <!-- Header del sidebar -->
      <div class="flex-shrink-0 p-6 border-b border-gray-700/50">
        <div class="flex items-center justify-between mb-4">
          <h1 class="text-2xl font-bold text-white">Mensajes</h1>
          <div
            v-if="totalUnreadCount > 0"
            class="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
          >
            {{ totalUnreadCount > 99 ? '99+' : totalUnreadCount }}
          </div>
        </div>

        <!-- Buscador -->
        <div class="relative">
          <input
            v-model="searchQuery"
            @focus="showUserSearch = true"
            type="text"
            placeholder="Buscar o iniciar chat..."
            class="w-full pl-10 pr-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <FontAwesomeIcon
            :icon="faSearch"
            class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
        </div>
      </div>

      <!-- Lista de chats o búsqueda de usuarios -->
      <div class="flex-1 overflow-y-auto min-h-0">
        <!-- Búsqueda de usuarios seguidos -->
        <div v-if="showUserSearch && searchQuery" class="p-4 space-y-2">
          <p class="text-gray-400 text-xs uppercase font-semibold mb-3">Usuarios seguidos</p>
          <div
            v-for="user in filteredFollowing"
            :key="user.id"
            @click="handleStartChat(user)"
            class="flex items-center space-x-3 p-3 hover:bg-gray-700/30 rounded-lg cursor-pointer transition-colors"
          >
            <ProfileImage
              :firstName="user.firstName"
              :profileImage="user.profileImage"
              class="flex-shrink-0"
            />
            <div class="flex-1 min-w-0">
              <p class="text-white text-sm font-medium truncate">
                {{ getUserFullName(user.firstName, user.lastName) }}
              </p>
              <p class="text-gray-400 text-xs truncate">@{{ user.username }}</p>
            </div>
          </div>
          <p v-if="filteredFollowing.length === 0" class="text-gray-500 text-sm text-center py-4">
            No se encontraron usuarios
          </p>
        </div>

        <!-- Lista de chats existentes -->
        <div v-else class="divide-y divide-gray-700/30">
          <div v-if="loading" class="p-8 text-center">
            <p class="text-gray-500">Cargando chats...</p>
          </div>

          <div v-else-if="chats.length === 0" class="p-8 text-center">
            <p class="text-gray-500 mb-2">No tienes conversaciones aún</p>
            <p class="text-gray-600 text-sm">Busca usuarios para iniciar un chat</p>
          </div>

          <ChatListItem
            v-else
            v-for="chat in chats"
            :key="chat.id"
            :chat="chat"
            :is-selected="selectedChat?.id === chat.id"
            :current-user-id="userStore.id"
            @select="handleSelectChat"
          />
        </div>
      </div>
    </div>

    <!-- Área de chat -->
    <div
      :class="[
        'flex-1 flex flex-col min-w-0 overflow-hidden',
        !selectedChat ? 'hidden md:flex' : 'flex',
      ]"
    >
      <EmptyChatState v-if="!selectedChat" />

      <!-- Chat seleccionado -->
      <template v-else>
        <!-- Header del chat -->
        <div
          class="flex-shrink-0 p-4 bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 flex items-center space-x-3"
        >
          <button @click="backToChats" class="md:hidden text-gray-400 hover:text-white p-2 -ml-2">
            <FontAwesomeIcon :icon="faArrowLeft" />
          </button>

          <ProfileImage
            :firstName="selectedChat.participants[1]?.firstName"
            :profileImage="selectedChat.participants[1]?.image"
            class="flex-shrink-0"
          />
          <div>
            <p class="text-white font-medium">
              {{
                getUserFullName(
                  selectedChat.participants[1]?.firstName,
                  selectedChat.participants[1]?.lastName
                )
              }}
            </p>
            <p class="text-gray-400 text-xs">@{{ selectedChat.participants[1]?.username }}</p>
          </div>
        </div>

        <!-- Mensajes -->
        <div class="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
          <div v-if="messages.length === 0" class="text-center py-8">
            <p class="text-gray-500">No hay mensajes aún</p>
            <p class="text-gray-600 text-sm">Envía un mensaje para comenzar</p>
          </div>

          <MessageBubble
            v-for="message in messages"
            :key="message.id"
            :message="message"
            :current-user-id="userStore.id"
          />
        </div>

        <!-- Input de mensaje -->
        <div class="flex-shrink-0 p-4 bg-gray-800/50 backdrop-blur-xl border-t border-gray-700/50">
          <div class="flex items-center space-x-3">
            <input
              v-model="newMessage"
              @keydown.enter="handleSendMessage"
              type="text"
              placeholder="Escribe un mensaje..."
              class="flex-1 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              @click="handleSendMessage"
              :disabled="!newMessage.trim() || sendingMessage"
              class="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FontAwesomeIcon :icon="faPaperPlane" />
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped></style>
