import { NotificationBell } from '@/components/notifications/NotificationBell'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export function Header() {
    return (
        <header className="flex justify-end items-center">
            <NotificationBell />
        </header>
    )
}