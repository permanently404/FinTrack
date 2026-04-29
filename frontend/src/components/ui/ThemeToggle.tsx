'use client'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => setMounted(true), [])
    if (!mounted) return <div className="w-14 h-7" />

    const isDark = theme === 'dark'

    return (
        <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={`
                relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none
                ${isDark ? 'bg-gray-700' : 'bg-slate-500'}
            `}
            title={isDark ? 'Светлая тема' : 'Тёмная тема'}
        >
            <span
                className={`
                    inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white transition-transform
                    ${isDark ? 'translate-x-8' : 'translate-x-1'}
                `}
            >
                {isDark ? (
                    <MoonIcon className="w-3.5 h-3.5 text-gray-800" />
                ) : (
                    <SunIcon className="w-3.5 h-3.5 text-yellow-500" />
                )}
            </span>
        </button>
    )
}