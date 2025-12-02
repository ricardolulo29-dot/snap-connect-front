import { ref, computed } from 'vue'
import { useUserStore } from '../store/user.store'
import { getChatMessages, sendMessage, createChat, markMessagesAsRead } from '../api/chats.api'

export function useChat() {
  const userStore = useUserStore()

  const selectedChat = ref(null)
  const messages = ref([])
  const newMessage = ref('')
  const loading = ref(true)
  const sendingMessage = ref(false)

  // Variables para el polling
  let messagesPollingInterval = null
  let chatsPollingInterval = null
  const MESSAGES_POLLING_INTERVAL = 3000 // Consultar cada 3 segundos
  const CHATS_POLLING_INTERVAL = 5000 // Consultar lista de chats cada 5 segundos

  // Computed properties
  const chats = computed(() => userStore.chats)

  const totalUnreadCount = computed(() => {
    return chats.value.reduce((total, chat) => total + (chat.unreadCount || 0), 0)
  })

  // Obtener número de mensajes no leídos de un chat
  const getUnreadCount = chat => {
    return chat.unreadCount || 0
  }

  // Cargar chats
  const loadChats = async () => {
    try {
      loading.value = true
      await userStore.loadChats()
    } catch (error) {
      console.error('Error al cargar chats:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Cargar mensajes de un chat específico
  const loadMessages = async chatId => {
    try {
      const response = await getChatMessages(chatId)
      messages.value = response || []
      return messages.value
    } catch (error) {
      console.error('Error al cargar mensajes:', error)
      messages.value = []
      throw error
    }
  }

  // Actualizar mensajes sin mostrar loading (para polling)
  const refreshMessages = async () => {
    if (!selectedChat.value) return

    try {
      const response = await getChatMessages(selectedChat.value.id)
      const newMessages = response || []

      // Solo actualizar si hay mensajes nuevos
      if (newMessages.length > messages.value.length) {
        messages.value = newMessages
        // Marcar como leídos automáticamente
        await markMessagesAsRead(selectedChat.value.id)
      }
    } catch (error) {
      console.error('Error al refrescar mensajes:', error)
    }
  }

  // Seleccionar un chat y cargar sus mensajes
  const selectChat = async chat => {
    // Detener polling anterior si existe
    stopMessagesPolling()

    selectedChat.value = chat
    await loadMessages(chat.id)

    // Marcar mensajes como leídos si hay mensajes no leídos
    if (chat.unreadCount > 0) {
      try {
        await markMessagesAsRead(chat.id)
        userStore.updateChatUnreadCount(chat.id, 0)
      } catch (error) {
        console.error('Error al marcar mensajes como leídos:', error)
      }
    }

    // Iniciar polling de mensajes para este chat
    startMessagesPolling()
  }

  // Deseleccionar chat (útil para móvil)
  const deselectChat = () => {
    stopMessagesPolling()
    selectedChat.value = null
  }

  // Enviar un mensaje
  const sendChatMessage = async () => {
    if (!newMessage.value.trim() || !selectedChat.value) {
      return
    }

    try {
      sendingMessage.value = true
      const response = await sendMessage(selectedChat.value.id, newMessage.value)

      // Agregar mensaje a la lista local
      messages.value.push({
        id: response.id,
        content: newMessage.value,
        senderId: userStore.id,
        createdAt: new Date().toISOString(),
      })

      newMessage.value = ''
      return response
    } catch (error) {
      console.error('Error al enviar mensaje:', error)
      throw error
    } finally {
      sendingMessage.value = false
    }
  }

  // Crear un nuevo chat con un usuario
  const startChatWithUser = async user => {
    try {
      // Verificar si ya existe un chat con este usuario
      const existingChat = chats.value.find(chat => chat.participants.some(p => p.id === user.id))

      if (existingChat) {
        await selectChat(existingChat)
        return existingChat
      }

      // Crear nuevo chat
      const response = await createChat(user.id)
      const newChat = {
        id: response.id,
        participants: [userStore.$state, user],
        lastMessage: null,
        unreadCount: 0,
      }

      // Agregar al store
      userStore.chats.unshift(newChat)
      await selectChat(newChat)
      return newChat
    } catch (error) {
      console.error('Error al crear chat:', error)
      throw error
    }
  }

  // Formatear fecha del mensaje
  const formatMessageTime = dateString => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  }

  // Iniciar polling de mensajes
  const startMessagesPolling = () => {
    // Limpiar intervalo previo por seguridad
    stopMessagesPolling()

    // Configurar nuevo intervalo
    messagesPollingInterval = setInterval(() => {
      refreshMessages()
    }, MESSAGES_POLLING_INTERVAL)
  }

  // Detener polling de mensajes
  const stopMessagesPolling = () => {
    if (messagesPollingInterval) {
      clearInterval(messagesPollingInterval)
      messagesPollingInterval = null
    }
  }

  // Iniciar polling de lista de chats
  const startChatsPolling = () => {
    // Limpiar intervalo previo por seguridad
    stopChatsPolling()

    // Configurar nuevo intervalo
    chatsPollingInterval = setInterval(() => {
      // Recargar chats en segundo plano
      userStore.loadChats()
    }, CHATS_POLLING_INTERVAL)
  }

  // Detener polling de lista de chats
  const stopChatsPolling = () => {
    if (chatsPollingInterval) {
      clearInterval(chatsPollingInterval)
      chatsPollingInterval = null
    }
  }

  // Detener todos los polling
  const stopAllPolling = () => {
    stopMessagesPolling()
    stopChatsPolling()
  }

  return {
    // State
    selectedChat,
    messages,
    newMessage,
    loading,
    sendingMessage,
    chats,

    // Computed
    totalUnreadCount,

    // Methods
    getUnreadCount,
    loadChats,
    loadMessages,
    selectChat,
    deselectChat,
    sendChatMessage,
    startChatWithUser,
    formatMessageTime,

    // Polling methods
    startChatsPolling,
    stopChatsPolling,
    stopAllPolling,
  }
}
