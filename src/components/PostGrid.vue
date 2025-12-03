<script setup>
import { getUserFullName } from '../utils/formaters'
import PostComponent from './PostComponent.vue'

const emit = defineEmits(['postDeleted', 'postEdited', 'tagClicked'])

defineProps({
  posts: {
    type: Array,
    required: true,
  },
})

const handlePostDeleted = postId => {
  emit('postDeleted', postId)
}

const handlePostEdited = ({ id, content }) => {
  emit('postEdited', { id, content })
}

const handleTagClicked = tag => {
  emit('tagClicked', tag)
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
    <PostComponent
      v-for="post in posts"
      :key="post.id"
      :id="post.id"
      :image="post.image"
      :title="post.title"
      :content="post.content"
      :author="{
        id: post.author.userId,
        username: post.author.username,
        fullName: getUserFullName(post.author.firstName, post.author.lastName),
        profileImage: post.author.profileImage,
      }"
      :likesCount="post.likesCount"
      :commentsCount="post.commentsCount"
      :isLikedByUser="post.isLikedByUser"
      :createdAt="post.createdAt"
      @postDeleted="handlePostDeleted"
      @postEdited="handlePostEdited"
      @tagClicked="handleTagClicked"
    />
  </div>
</template>

<style scoped></style>
