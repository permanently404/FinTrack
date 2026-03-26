import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/providers/providers'
import { AppShell } from '@/components/layout/AppShell'

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
          <AppShell>
            {children}
          </AppShell>
        </Providers>
      </body>
    </html>
  )
}
