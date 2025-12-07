import axios from 'axios'
import { useToast } from 'vue-toastification'

const toast = useToast()

const httpClient = axios.create({
  baseURL: 'http://' + import.meta.env.VITE_SERVER_URL + ':' + import.meta.env.VITE_SERVER_PORT,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

const getAuthToken = () => localStorage.getItem('token')

const authInterceptor = config => {
  const token = getAuthToken()
  if (token) config.headers.Authorization = `Bearer ${token}`

  return config
}

httpClient.interceptors.request.use(authInterceptor)

httpClient.interceptors.response.use(
  response => response,
  error => {
    let message = error?.response?.data?.message || 'Ha ocurrido un error inesperado'
    toast.error(message)
    return Promise.reject(error)
  }
)

export default httpClient
