import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/providers/providers'
import { SideBar } from '@/components/layout/Sidebar'

export const metadata: Metadata = {
  title: 'FinTrack',
  description: 'Финансовый дашборд',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body>
        <Providers>
          <div className="flex h-screen overflow-hidden">
            <SideBar />
            <main className="flex-1 bg-surface text-foreground overflow-x-hidden overflow-y-auto lg:overflow-y-hidden pt-14 md:pt-0">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
