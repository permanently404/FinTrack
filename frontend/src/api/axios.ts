import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'

export const apiClient = axios.create({ baseURL: API })

// Добавляем Bearer токен к каждому запросу
apiClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Очередь запросов которые ждут пока обновится токен
let isRefreshing = false
let failedQueue: Array<{
    resolve: (token: string) => void
    reject: (error: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null) {
    failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)))
    failedQueue = []
}

// При 401 — пробуем обновить токен, потом повторяем запрос
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config

        if (error.response?.status !== 401 || original._retry) {
            return Promise.reject(error)
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject })
            }).then((token) => {
                original.headers.Authorization = `Bearer ${token}`
                return apiClient(original)
            })
        }

        original._retry = true
        isRefreshing = true

        const refreshToken = localStorage.getItem('refreshToken')

        if (!refreshToken) {
            useAuthStore.getState().logout()
            window.location.href = '/login'
            return Promise.reject(error)
        }

        try {
            const { data } = await axios.post(`${API}/api/auth/refresh`, { refreshToken })
            const newToken: string = data.accessToken
            useAuthStore.getState().setToken(newToken)
            if (data.refreshToken) {
                localStorage.setItem('refreshToken', data.refreshToken)
            }
            processQueue(null, newToken)
            original.headers.Authorization = `Bearer ${newToken}`
            return apiClient(original)
        } catch (refreshError) {
            processQueue(refreshError, null)
            useAuthStore.getState().logout()
            window.location.href = '/login'
            return Promise.reject(refreshError)
        } finally {
            isRefreshing = false
        }
    }
)
