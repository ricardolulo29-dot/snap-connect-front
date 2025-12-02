<script setup>
import { onBeforeMount, ref } from 'vue'
import { login } from '../api/auth.api.js'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user.store'
import { jwtDecode } from 'jwt-decode'
import { getUserImage } from '@/api/users.api.js'
// Definimos los datos del formulario
const email = ref('')
const password = ref('')
const router = useRouter()
const remember = ref(false)
const userStore = useUserStore()

// Función para manejar el inicio de sesión
const submitLogin = async () => {
  let response = await login({ email: email.value, password: password.value })
  if (response && response.data && response.data.token) {
    const token = response.data.token
    localStorage.setItem('token', token)
    if (remember.value) localStorage.setItem('email', email.value)

    const tokenDecoded = jwtDecode(token)
    userStore.setUser(tokenDecoded)
    const userId = tokenDecoded.id

    await userStore.loadFollowers(userId)
    await userStore.loadFollowing(userId)

    const profileImage = await getUserImage(userId)
    userStore.setUserImage(profileImage)

    router.push({ name: 'home' })
  }
}

onBeforeMount(() => {
  if (localStorage.getItem('token')) router.push({ name: 'home' })
  else if (localStorage.getItem('email')) email.value = localStorage.getItem('email')
})
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 p-4"
  >
    <!-- Card con efecto glassmorphism -->
    <div class="w-full max-w-md">
      <!-- Logo y título -->
      <div class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl mb-4"
        >
          <span class="text-white font-bold text-3xl">S</span>
        </div>
        <h1 class="text-3xl font-bold text-white mb-2">SnapConnect</h1>
      </div>

      <!-- Card del formulario -->
      <div
        class="bg-gray-800/50 backdrop-blur-xl border border-indigo-500/30 shadow-2xl rounded-2xl p-8"
      >
        <form @submit.prevent="submitLogin" class="space-y-6">
          <!-- Email -->
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2"> Email </label>
            <input
              v-model="email"
              type="email"
              class="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="tu@email.com"
              required
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2"> Contraseña </label>
            <input
              v-model="password"
              type="password"
              class="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <!-- Remember + Forgot -->
          <div class="flex items-center justify-between">
            <label class="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                v-model="remember"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-gray-900/50"
              />
              <span class="ml-2 text-gray-400 text-sm group-hover:text-gray-300 transition-colors"
                >Recordarme</span
              >
            </label>

            <router-link
              to="/forgot-password"
              class="text-indigo-400 text-sm hover:text-indigo-300 transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </router-link>
          </div>

          <!-- Button -->
          <button
            type="submit"
            class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all shadow-lg hover:shadow-indigo-500/50"
          >
            Iniciar sesión
          </button>
        </form>

        <!-- Register Link -->
        <div class="mt-6 text-center">
          <p class="text-gray-400 text-sm">
            ¿No tienes cuenta?
            <router-link
              to="/signup"
              class="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              Regístrate aquí
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type='checkbox'] {
  @apply cursor-pointer;
}
</style>
