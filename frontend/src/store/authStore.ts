'use client'

import { create } from 'zustand'
import { AuthUser } from '@/types'

interface AuthStore {
    token: string | null
    user: AuthUser | null
    isAuthenticated: boolean
    login: (token: string, refreshToken: string, user: AuthUser) => void
    logout: () => void
    setToken: (token: string) => void
}

function readLocalStorage<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback
    try {
        const item = localStorage.getItem(key)
        if (!item) return fallback
        try {
            return JSON.parse(item) as T
        } catch {
            return item as unknown as T
        }
    } catch {
        return fallback
    }
}

function setAuthCookie(token: string) {
    document.cookie = `accessToken=${token}; path=/; max-age=900; SameSite=Lax`
}

function clearAuthCookie() {
    document.cookie = 'accessToken=; path=/; max-age=0; SameSite=Lax'
}

export const useAuthStore = create<AuthStore>(() => ({
    token: readLocalStorage<string | null>('accessToken', null),
    user: readLocalStorage<AuthUser | null>('authUser', null),
    isAuthenticated: !!readLocalStorage<string | null>('accessToken', null),

    login: (token, refreshToken, user) => {
        localStorage.setItem('accessToken', token)
        localStorage.setItem('refreshToken', refreshToken)
        localStorage.setItem('authUser', JSON.stringify(user))
        setAuthCookie(token)
        useAuthStore.setState({ token, user, isAuthenticated: true })
    },

    logout: () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('authUser')
        clearAuthCookie()
        useAuthStore.setState({ token: null, user: null, isAuthenticated: false })
    },

    setToken: (token) => {
        localStorage.setItem('accessToken', token)
        setAuthCookie(token)
        useAuthStore.setState({ token })
    },
}))
