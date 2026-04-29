'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { useLogin } from '@/api/auth'
import { Card } from '@/components/ui/Card'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const { mutate: login, isPending, error } = useLogin()

    const errorMessage = error
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error ?? 'Ошибка входа'
        : null

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        login({ email, password })
    }

    return (
        <Card className="w-full max-w-sm p-8">
            <div className="flex items-center gap-2 mb-8">
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                    <path d="M5 8C5 6.34315 6.34315 5 8 5H24C25.6569 5 27 6.34315 27 8C27 9.65685 25.6569 11 24 11H8C6.34315 11 5 9.65685 5 8Z" fill="#4cae71" />
                    <path d="M5 16C5 14.3431 6.34315 13 8 13H19C20.6569 13 22 14.3431 22 16C22 17.6569 20.6569 19 19 19H8C6.34315 19 5 17.6569 5 16Z" fill="#4cae71" />
                    <circle cx="8" cy="24" r="3" fill="#4cae71" />
                </svg>
                <h1 className="text-2xl font-bold text-foreground">
                    <span className="text-[#4cae71]">Fin</span>Track
                </h1>
            </div>

            <h2 className="text-lg font-semibold text-foreground mb-6">Вход в аккаунт</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="test@test.com"
                        required
                        className="px-3 py-2 rounded-lg border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#4cae71]"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label htmlFor="password" className="text-sm font-medium text-foreground">Пароль</label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full px-3 py-2 pr-10 rounded-lg border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#4cae71]"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                {errorMessage && (
                    <p className="text-sm text-red-500">{errorMessage}</p>
                )}

                <button
                    type="submit"
                    disabled={isPending}
                    className="mt-2 py-2 px-4 bg-[#4cae71] hover:bg-[#3d9460] disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
                >
                    {isPending ? 'Вход...' : 'Войти'}
                </button>
            </form>

            <p className="mt-6 text-sm text-center text-muted">
                Нет аккаунта?{' '}
                <Link href="/register" className="text-[#4cae71] hover:underline">
                    Зарегистрироваться
                </Link>
            </p>
        </Card>
    )
}
