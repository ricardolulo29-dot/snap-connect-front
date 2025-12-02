<script setup>
import { ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { getPostComments, createComment, deleteComment } from '../api/posts.api'
import { useUserStore } from '../store/user.store'
import ProfileImage from './ProfileImage.vue'
import { getUserFullName } from '../utils/formaters'

const userStore = useUserStore()

const props = defineProps({
  postId: {
    type: [Number, String],
    required: true,
  },
  postAuthorId: {
    type: [Number, String],
    required: true,
  },
  isVisible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['commentsLoaded'])

const comments = ref([])
const newComment = ref('')
const loadingComments = ref(false)
const sendingComment = ref(false)
const hasLoadedComments = ref(false)
const displayedComments = ref(5)

// Cargar comentarios cuando se hace visible
const loadComments = async () => {
  if (hasLoadedComments.value) return

  try {
    loadingComments.value = true
    const response = await getPostComments(props.postId)
    // Ordenar de más nuevo a más viejo
    comments.value = response.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    hasLoadedComments.value = true
    emit('commentsLoaded', comments.value.length)
  } catch (error) {
    console.error('Error al cargar comentarios:', error)
  } finally {
    loadingComments.value = false
  }
}

// Función para formatear la fecha
const formatDate = dateString => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Ahora'
  if (minutes < 60) return `${minutes}m`
  if (hours < 24) return `${hours}h`
  if (days < 7) return `${days}d`

  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

// Función para cargar más comentarios
const loadMoreComments = () => {
  displayedComments.value += 5
}

// Verificar si el usuario puede borrar el comentario
const canDeleteComment = comment => {
  // Puede borrar si es su comentario o si es el autor del post
  console.log('userStore.id:', userStore.id)
  console.log('comment.author.id:', comment.author.userId)
  console.log('props.postAuthorId:', props.postAuthorId)
  return comment.author.userId === userStore.id || props.postAuthorId === userStore.id
}

// Función para borrar comentario
const handleDeleteComment = async commentId => {
  try {
    await deleteComment(props.postId, commentId)
    // Eliminar el comentario de la lista local
    const index = comments.value.findIndex(c => c.id === commentId)
    if (index !== -1) {
      comments.value.splice(index, 1)
      emit('commentsLoaded', comments.value.length)
    }
  } catch (error) {
    console.error('Error al borrar comentario:', error)
    alert('Error al borrar el comentario')
  }
}

// Exponer la función para que el componente padre pueda llamarla
defineExpose({
  loadComments,
})

const handleSendComment = async () => {
  if (!newComment.value.trim()) return

  try {
    sendingComment.value = true
    const response = await createComment(props.postId, newComment.value)

    // Añadir el comentario a la lista local
    comments.value.unshift({
      id: response.id,
      content: newComment.value,
      author: {
        username: userStore.username,
        firstName: userStore.firstName,
        lastName: userStore.lastName,
        profileImage: userStore.image,
      },
      createdAt: new Date().toISOString(),
    })

    emit('commentsLoaded', comments.value.length)
    newComment.value = ''
  } catch (error) {
    console.error('Error al enviar comentario:', error)
    alert('Error al enviar el comentario')
  } finally {
    sendingComment.value = false
  }
}
</script>

<template>
  <div v-if="isVisible" class="mt-4 pt-4 border-t border-gray-700/50">
    <!-- Formulario para nuevo comentario -->
    <div class="flex items-center space-x-3 mb-4">
      <ProfileImage
        :firstName="userStore.fullName"
        :profileImage="userStore.image"
        class="flex-shrink-0"
      />
      <div class="flex-1 relative">
        <input
          v-model="newComment"
          type="text"
          placeholder="Escribe un comentario..."
          class="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 pr-10 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
          @keydown.enter="handleSendComment"
        />
        <button
          @click="handleSendComment"
          :disabled="!newComment.trim() || sendingComment"
          class="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-indigo-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          :title="sendingComment ? 'Enviando...' : 'Enviar comentario'"
        >
          <FontAwesomeIcon :icon="faPaperPlane" />
        </button>
      </div>
    </div>

    <!-- Lista de comentarios -->
    <div v-if="loadingComments" class="text-center py-4">
      <span class="text-gray-500 text-sm">Cargando comentarios...</span>
    </div>

    <div v-else-if="comments.length === 0" class="text-center py-4">
      <span class="text-gray-500 text-sm">No hay comentarios aún. ¡Sé el primero en comentar!</span>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="comment in comments.slice(0, displayedComments)"
        :key="comment.id"
        class="flex items-start space-x-3"
      >
        <ProfileImage
          :firstName="comment.author.firstName"
          :profileImage="comment.author.profileImage"
          class="flex-shrink-0"
        />
        <div class="flex-1 bg-gray-900/30 rounded-lg px-3 py-2 relative group">
          <div class="flex items-baseline space-x-2 mb-1">
            <span class="text-gray-200 font-medium text-sm">{{
              getUserFullName(comment.author.firstName, comment.author.lastName)
            }}</span>
            <span class="text-gray-500 text-xs">@{{ comment.author.username }}</span>
            <span class="text-gray-500 text-xs">· {{ formatDate(comment.createdAt) }}</span>
          </div>
          <p class="text-gray-300 text-sm">{{ comment.content }}</p>

          <!-- Botón de eliminar (solo visible si tienes permisos) -->
          <button
            v-if="canDeleteComment(comment)"
            @click="handleDeleteComment(comment.id)"
            class="absolute top-2 right-2 p-1 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
            title="Eliminar comentario"
          >
            <FontAwesomeIcon :icon="faTrash" class="text-xs" />
          </button>
        </div>
      </div>

      <!-- Botón para cargar más comentarios -->
      <div v-if="comments.length > displayedComments" class="text-center pt-2">
        <button
          @click="loadMoreComments"
          class="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
        >
          Cargar más comentarios ({{ comments.length - displayedComments }} restantes)
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
