import { NotificationBell } from '@/components/notifications/NotificationBell'

export function Header() {
    return (
        <header className="flex justify-end items-center">
            <NotificationBell />
        </header>
    )
}