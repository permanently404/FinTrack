'use client'

import { usePathname } from 'next/navigation'
import { SideBar } from '@/components/layout/Sidebar'
import { AuthGuard } from '@/components/providers/AuthGuard'

const AUTH_PAGES = ['/login', '/register']

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isAuthPage = AUTH_PAGES.includes(pathname)

    if (isAuthPage) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center">
                {children}
            </div>
        )
    }

    return (
        <AuthGuard>
            <div className="flex h-screen overflow-hidden">
                <SideBar />
                <main className="flex-1 bg-surface text-foreground overflow-x-hidden overflow-y-auto pt-14 md:pt-0">
                    {children}
                </main>
            </div>
        </AuthGuard>
    )
}
