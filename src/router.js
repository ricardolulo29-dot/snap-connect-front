import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior() {
    return { top: 0, left: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'layout',
      component: () => import('./views/LayoutView.vue'),
      beforeEnter: (to, from, next) => {
        const token = localStorage.getItem('token')
        if (!token) {
          return next({ name: 'login' })
        }
        return next()
      },
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('./views/HomeView.vue'),
        },
        {
          path: '/profile',
          name: 'profile',
          component: () => import('./views/ProfileView.vue'),
        },
        {
          path: '/chats',
          name: 'chats',
          component: () => import('./views/ChatsView.vue'),
        },
        {
          path: '/search',
          name: 'search',
          component: () => import('./views/SearchView.vue'),
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/LoginView.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('./views/SignUpView.vue'),
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('./views/ForgotPasswordView.vue'),
    },
  ],
})

export default router
