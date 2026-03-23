'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "../ui/ThemeToggle"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"

const links = [
    { href: '/dashboard', label: '📊 Аналитика' },
    { href: '/transactions', label: '💳 Транзакции' },
    { href: '/reports', label: '📋 Отчёты' },
    { href: '/tips', label: '💡 Советы' },
]

export function SideBar() {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    useEffect(() => {
        setOpen(false)
    }, [pathname])

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [open])

    return (
        <>
            {/* Mobile header bar */}
            <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between bg-sidebar px-4 py-3 md:hidden">
                <div className="flex items-center gap-2">
                    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 8C5 6.34315 6.34315 5 8 5H24C25.6569 5 27 6.34315 27 8C27 9.65685 25.6569 11 24 11H8C6.34315 11 5 9.65685 5 8Z" fill="#4cae71" />
                        <path d="M5 16C5 14.3431 6.34315 13 8 13H19C20.6569 13 22 14.3431 22 16C22 17.6569 20.6569 19 19 19H8C6.34315 19 5 17.6569 5 16Z" fill="#4cae71" />
                        <circle cx="8" cy="24" r="3" fill="#4cae71" />
                    </svg>
                    <h1 className="text-xl font-bold tracking-tight text-white">
                        <span className="text-[#4cae71]">Fin</span>Track
                    </h1>
                </div>
                <button
                    onClick={() => setOpen(!open)}
                    className="p-2 text-white rounded-lg hover:bg-white/10 transition-colors"
                    aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
                >
                    {open ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile spacer */}
            <div className="h-14 flex-none md:hidden" />

            {/* Backdrop */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed top-14 left-0 bottom-0 z-50 w-64 bg-sidebar text-sidebar-text p-6 flex flex-col
                    transform transition-transform duration-300 ease-in-out
                    md:static md:top-0 md:translate-x-0 md:min-h-screen md:z-auto
                    ${open ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                {/* Desktop logo */}
                <div className="hidden md:flex items-center gap-2.5 mb-8">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 8C5 6.34315 6.34315 5 8 5H24C25.6569 5 27 6.34315 27 8C27 9.65685 25.6569 11 24 11H8C6.34315 11 5 9.65685 5 8Z" fill="#4cae71" />
                        <path d="M5 16C5 14.3431 6.34315 13 8 13H19C20.6569 13 22 14.3431 22 16C22 17.6569 20.6569 19 19 19H8C6.34315 19 5 17.6569 5 16Z" fill="#4cae71" />
                        <circle cx="8" cy="24" r="3" fill="#4cae71" />
                    </svg>
                    <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
                        <span className="text-[#4cae71]">Fin</span>Track
                    </h1>
                </div>

                <nav className="flex flex-col gap-2 grow">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`px-4 py-3 rounded-lg transition-colors ${pathname === link.href || pathname.startsWith(link.href + '/')
                                ? 'bg-sidebar-active text-white'
                                : 'hover:bg-white/10 text-sidebar-text'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="mt-auto pt-6 border-t border-white/10 flex justify-center">
                    <ThemeToggle />
                </div>
            </aside>
        </>
    )
}
