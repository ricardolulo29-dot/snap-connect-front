<script setup>
import { ref } from 'vue'
import { signup } from '../api/auth.api.js'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user.store'
import { jwtDecode } from 'jwt-decode'

const router = useRouter()
const userStore = useUserStore()

// Datos del formulario
const formData = ref({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const error = ref('')
const loading = ref(false)

// Función para validar el formulario
const validateForm = () => {
  if (!formData.value.firstName || !formData.value.lastName) {
    error.value = 'Por favor completa todos los campos'
    return false
  }

  if (formData.value.username.length < 3) {
    error.value = 'El nombre de usuario debe tener al menos 3 caracteres'
    return false
  }

  if (!formData.value.email.includes('@')) {
    error.value = 'Por favor ingresa un email válido'
    return false
  }

  if (formData.value.password.length < 5) {
    error.value = 'La contraseña debe tener al menos 5 caracteres'
    return false
  }

  if (formData.value.password !== formData.value.confirmPassword) {
    error.value = 'Las contraseñas no coinciden'
    return false
  }

  error.value = ''
  return true
}

// Función para manejar el registro
const submitRegister = async () => {
  if (!validateForm()) return

  try {
    loading.value = true
    error.value = ''

    // eslint-disable-next-line no-unused-vars
    const { confirmPassword, ...dataToSend } = formData.value

    const response = await signup(dataToSend)

    if (response && response.data && response.data.token) {
      const token = response.data.token
      localStorage.setItem('token', token)

      const tokenDecoded = jwtDecode(token)
      userStore.setUser(tokenDecoded)
      const userId = tokenDecoded.id

      await userStore.loadFollowers(userId)
      await userStore.loadFollowing(userId)

      router.push({ name: 'home' })
    }
  } catch (err) {
    console.error('Error en registro:', err)
    error.value =
      err.response?.data?.message || 'Error al crear la cuenta. Por favor intenta de nuevo.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 p-4"
  >
    <!-- Card con efecto glassmorphism -->
    <div class="w-full max-w-2xl">
      <!-- Logo y título -->
      <div class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl mb-4"
        >
          <span class="text-white font-bold text-3xl">S</span>
        </div>
        <h1 class="text-3xl font-bold text-white mb-2">Únete a SnapConnect</h1>
        <p class="text-gray-400">Crea tu cuenta y comienza a compartir</p>
      </div>

      <!-- Card del formulario -->
      <div
        class="bg-gray-800/50 backdrop-blur-xl border border-indigo-500/30 shadow-2xl rounded-2xl p-8"
      >
        <form @submit.prevent="submitRegister" class="space-y-6">
          <!-- Mensaje de error -->
          <div
            v-if="error"
            class="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm"
          >
            {{ error }}
          </div>

          <!-- Nombre y Apellidos en grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Nombre -->
            <div>
              <label class="block text-gray-300 text-sm font-medium mb-2"> Nombre </label>
              <input
                v-model="formData.firstName"
                type="text"
                class="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Tu nombre"
                required
              />
            </div>

            <!-- Apellidos -->
            <div>
              <label class="block text-gray-300 text-sm font-medium mb-2"> Apellidos </label>
              <input
                v-model="formData.lastName"
                type="text"
                class="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Tus apellidos"
                required
              />
            </div>
          </div>

          <!-- Username -->
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2"> Nombre de usuario </label>
            <input
              v-model="formData.username"
              type="text"
              class="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="tuusername"
              required
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2"> Email </label>
            <input
              v-model="formData.email"
              type="email"
              class="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="tu@email.com"
              required
            />
          </div>

          <!-- Contraseñas en grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Password -->
            <div>
              <label class="block text-gray-300 text-sm font-medium mb-2"> Contraseña </label>
              <input
                v-model="formData.password"
                type="password"
                class="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <!-- Confirm Password -->
            <div>
              <label class="block text-gray-300 text-sm font-medium mb-2">
                Confirmar contraseña
              </label>
              <input
                v-model="formData.confirmPassword"
                type="password"
                class="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <!-- Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all shadow-lg hover:shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {{ loading ? 'Creando cuenta...' : 'Crear cuenta' }}
          </button>
        </form>

        <!-- Login Link -->
        <div class="mt-6 text-center">
          <p class="text-gray-400 text-sm">
            ¿Ya tienes cuenta?
            <router-link
              to="/login"
              class="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              Inicia sesión aquí
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
