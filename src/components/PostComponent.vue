<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faHeart as faHeartSolid,
  faCommentDots,
  faEllipsisV,
  faEdit,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'
import { likePost, unlikePost } from '../api/posts.api'
import { useUserStore } from '../store/user.store'
import ProfileImage from './ProfileImage.vue'
import CommentsSection from './CommentsSection.vue'
import EditPostModal from './EditPostModal.vue'
import { deletePost, editPostContent } from '../api/posts.api'
import { formatDate } from '../utils/formaters'

const userStore = useUserStore()

const emit = defineEmits(['postDeleted', 'postEdited', 'tagClicked'])

const props = defineProps({
  id: {
    type: [Number, String],
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: Object,
    required: true,
    validator: value => {
      console.log('Author recibido:', value)
      return value.username && value.fullName
    },
  },
  likesCount: {
    type: Number,
    required: false,
    default: 0,
  },
  commentsCount: {
    type: Number,
    required: false,
    default: 0,
  },
  isLikedByUser: {
    type: Boolean,
    required: false,
    default: false,
  },
  createdAt: {
    type: String,
    required: false,
    default: null,
  },
})

const localLikesCount = ref(props.likesCount)
const localIsLiked = ref(props.isLikedByUser)
const showComments = ref(false)
const commentsCount = ref(props.commentsCount)
const commentsSection = ref(null)
const showMenu = ref(false)
const showEditModal = ref(false)
const localContent = ref(props.content)
const showImageModal = ref(false)

const isOwner = () => props.author.id === userStore.id
const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const handleEdit = () => {
  showMenu.value = false
  showEditModal.value = true
}

const handleSaveEdit = async ({ id, content }) => {
  try {
    await editPostContent(id, content)
    localContent.value = content
    emit('postEdited', { id, content })
  } catch (error) {
    console.error('Error al editar el post:', error)
    alert('Error al editar el post')
  }
}

const closeEditModal = () => {
  showEditModal.value = false
}

const handleDeletePost = async () => {
  if (confirm('¿Estás seguro de que quieres eliminar este post?')) {
    try {
      showMenu.value = false
      await deletePost(props.id)
      // Emitir evento al componente padre para que actualice la lista
      emit('postDeleted', props.id)
    } catch (error) {
      console.error('Error al eliminar el post:', error)
      alert('Error al eliminar el post')
    }
  }
}

// Sincronizar con las props si cambian
watch(
  () => props.likesCount,
  newVal => {
    localLikesCount.value = newVal
  }
)

watch(
  () => props.isLikedByUser,
  newVal => {
    localIsLiked.value = newVal
  }
)

const handleLike = async () => {
  if (localIsLiked.value) {
    await unlikePost(props.id)
    localLikesCount.value--
    localIsLiked.value = false
  } else {
    await likePost(props.id)
    localLikesCount.value++
    localIsLiked.value = true
  }
}

const toggleComments = async () => {
  showComments.value = !showComments.value

  if (showComments.value && commentsSection.value) {
    await commentsSection.value.loadComments()
  }
}

const handleCommentsLoaded = count => {
  commentsCount.value = count
}

const formattedContent = computed(() => {
  if (!localContent.value) return ''
  return localContent.value.replace(
    /#(\w+)/g,
    '<span class="text-indigo-400 hover:text-indigo-300 cursor-pointer font-medium" data-tag="$1">#$1</span>'
  )
})

// Cerrar el menú al hacer clic fuera
const closeMenu = event => {
  if (showMenu.value && !event.target.closest('.relative')) {
    showMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', closeMenu)
})

const handleContentClick = event => {
  if (event.target.dataset.tag) emit('tagClicked', event.target.dataset.tag)
}

const openImageModal = () => {
  showImageModal.value = true
}

const closeImageModal = () => {
  showImageModal.value = false
}
</script>

<template>
  <article
    class="bg-gray-800/50 backdrop-blur-xl border border-indigo-500/20 rounded-2xl overflow-hidden hover:border-indigo-500/40 transition-all duration-300 shadow-lg hover:shadow-indigo-500/20"
  >
    <!-- Imagen del post -->
    <div
      class="relative h-64 overflow-hidden bg-gray-900 cursor-pointer group"
      @click="openImageModal"
    >
      <img
        :src="image"
        :alt="title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div
        class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center"
      >
        <svg
          class="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
          />
        </svg>
      </div>
    </div>

    <!-- Contenido del post -->
    <div class="p-6">
      <!-- Autor -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-3">
          <ProfileImage :firstName="author.fullName" :profileImage="author.profileImage" />
          <div>
            <p class="text-gray-200 font-medium text-sm">{{ author.fullName }}</p>
            <div class="flex items-center space-x-2">
              <p class="text-gray-500 text-xs">@{{ author.username }}</p>
              <span v-if="createdAt" class="text-gray-600 text-xs">•</span>
              <p v-if="createdAt" class="text-gray-500 text-xs">{{ formatDate(createdAt) }}</p>
            </div>
          </div>
        </div>

        <!-- Menú de opciones (solo para posts propios) -->
        <div v-if="isOwner()" class="relative">
          <button
            @click="toggleMenu"
            class="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700/50"
            title="Opciones"
          >
            <FontAwesomeIcon :icon="faEllipsisV" />
          </button>

          <!-- Dropdown menu -->
          <div
            v-if="showMenu"
            class="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-10"
          >
            <button
              @click="handleEdit"
              class="w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-800 transition-colors flex items-center space-x-3 rounded-t-lg"
            >
              <FontAwesomeIcon :icon="faEdit" class="text-indigo-400" />
              <span>Editar</span>
            </button>
            <button
              @click="handleDeletePost"
              class="w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-800 transition-colors flex items-center space-x-3 rounded-b-lg"
            >
              <FontAwesomeIcon :icon="faTrash" class="text-red-400" />
              <span>Eliminar</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Título -->
      <h3 class="text-xl font-bold text-white mb-2 line-clamp-2">
        {{ title }}
      </h3>

      <!-- Contenido -->
      <p
        class="text-gray-400 text-sm line-clamp-3 mb-4"
        v-html="formattedContent"
        @click="handleContentClick"
      ></p>

      <!-- Acciones -->
      <div
        class="flex items-center space-x-4 text-gray-500 text-sm pt-4 border-t border-gray-700/50"
      >
        <button
          @click="handleLike"
          :class="[
            'flex items-center space-x-2 transition-colors',
            localIsLiked ? 'text-red-500 hover:text-red-600' : 'hover:text-indigo-400',
          ]"
        >
          <FontAwesomeIcon :icon="localIsLiked ? faHeartSolid : faHeartRegular" />
          <span>{{ localLikesCount }}</span>
        </button>
        <button
          @click="toggleComments"
          :class="[
            'flex items-center space-x-2 transition-colors',
            showComments ? 'text-indigo-400' : 'hover:text-indigo-400',
          ]"
        >
          <FontAwesomeIcon :icon="faCommentDots" />
          <span>{{ commentsCount > 0 ? commentsCount : 'Comentar' }}</span>
        </button>
      </div>

      <!-- Sección de comentarios -->
      <CommentsSection
        ref="commentsSection"
        :postId="id"
        :postAuthorId="author.id"
        :isVisible="showComments"
        @commentsLoaded="handleCommentsLoaded"
      />
    </div>

    <!-- Modal de edición -->
    <EditPostModal
      :show="showEditModal"
      :postId="id"
      :initialContent="localContent"
      @close="closeEditModal"
      @save="handleSaveEdit"
    />

    <!-- Modal de imagen completa -->
    <div
      v-if="showImageModal"
      class="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center"
      @click="closeImageModal"
    >
      <button
        @click="closeImageModal"
        class="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors p-2 rounded-full bg-black/50 hover:bg-black/70 z-10"
        title="Cerrar"
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <div class="w-full h-full flex items-center justify-center p-4">
        <img :src="image" :alt="title" class="max-w-full max-h-full object-contain" @click.stop />
      </div>
    </div>
  </article>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
