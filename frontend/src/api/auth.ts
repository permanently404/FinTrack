import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { AuthUser } from '@/types'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'

interface AuthResponse {
    accessToken: string
    refreshToken: string
    user: AuthUser
}

async function loginRequest(body: { email: string; password: string }): Promise<AuthResponse> {
    const { data } = await axios.post<AuthResponse>(`${API}/api/auth/login`, body)
    return data
}

async function registerRequest(body: { email: string; password: string; name?: string }): Promise<AuthResponse> {
    const { data } = await axios.post<AuthResponse>(`${API}/api/auth/register`, body)
    return data
}

export function useLogin() {
    const login = useAuthStore((s) => s.login)
    const router = useRouter()

    return useMutation({
        mutationFn: loginRequest,
        onSuccess: (data) => {
            login(data.accessToken, data.refreshToken, data.user)
            router.push('/dashboard')
        },
    })
}

export function useRegister() {
    const login = useAuthStore((s) => s.login)
    const router = useRouter()

    return useMutation({
        mutationFn: registerRequest,
        onSuccess: (data) => {
            login(data.accessToken, data.refreshToken, data.user)
            router.push('/dashboard')
        },
    })
}
