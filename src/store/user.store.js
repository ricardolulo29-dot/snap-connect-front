import { defineStore } from 'pinia'
import { getUserFollowers, getUserFollowing } from '@/api/users.api.js'
import { getChats } from '@/api/chats.api.js'

export const useUserStore = defineStore('user', {
  state: () => ({
    id: null,
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    image: '',
    followers: [],
    following: [],
    chats: [],
    iat: null,
    exp: null,
  }),

  getters: {
    fullName(state) {
      return `${state.firstName} ${state.lastName}`
    },
    unreadMessagesCount(state) {
      return state.chats.reduce((total, chat) => total + (chat.unreadCount || 0), 0)
    },
  },

  actions: {
    setUser(userData) {
      this.id = userData.id
      this.firstName = userData.firstName
      this.lastName = userData.lastName
      this.email = userData.email
      this.username = userData.username
      this.iat = userData.iat
      this.exp = userData.exp
    },
    async loadFollowers(userId) {
      const followersData = await getUserFollowers(userId)
      this.followers = followersData && followersData.length ? followersData : []
    },

    async loadFollowing(userId) {
      const followingData = await getUserFollowing(userId)
      this.following = followingData && followingData.length ? followingData : []
    },

    async loadChats() {
      try {
        const chatsData = await getChats()
        this.chats = chatsData || []
      } catch (error) {
        console.error('Error al cargar chats:', error)
        this.chats = []
      }
    },

    updateChatUnreadCount(chatId, unreadCount) {
      const chatIndex = this.chats.findIndex(c => c.id === chatId)
      if (chatIndex !== -1) {
        this.chats[chatIndex].unreadCount = unreadCount
      }
    },

    setUserImage(image) {
      this.image = image
    },
    clearUser() {
      this.id = null
      this.firstName = ''
      this.lastName = ''
      this.email = ''
      this.username = ''
      this.image = ''
      this.followers = []
      this.following = []
      this.chats = []
      this.iat = null
      this.exp = null
    },
    setImageProfile(image) {
      this.image = image
    },
  },
})
