import axios, { AxiosInstance, AxiosError } from 'axios'
import toast from 'react-hot-toast'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
})

declare global {
  interface ImportMetaEnv {
    readonly VITE_API_URL: string
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}

// Request interceptor to inject JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ detail?: string }>) => {
    const status = error.response?.status
    // Only treat 401 as "session expired" when the failing request actually carried a
    // token — a bare login/register attempt returning 401 is just "wrong credentials"
    // and should be handled by the calling page, not force a logout + redirect.
    const hadAuthHeader = Boolean(error.config?.headers?.Authorization)

    if (status === 401 && hadAuthHeader) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      toast.error('Session expired. Please login again.')
      window.location.href = '/login'
    } else if (status === 403) {
      toast.error('Access denied.')
    } else if (status === 400) {
      toast.error(error.response?.data?.detail || 'Something went wrong.')
    } else if (typeof status === 'number' && status >= 500) {
      toast.error('Server error. Please try again later.')
    } else if (error.message === 'Network Error') {
      toast.error('Network error. Please check your connection.')
    }
    return Promise.reject(error)
  }
)

export default api
