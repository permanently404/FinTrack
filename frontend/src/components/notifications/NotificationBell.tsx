'use client'
import { useState } from 'react'
import { useNotificationStore } from '@/store/notificationStore'

export function NotificationBell() {
    const { notifications, unreadCount, markAllRead } = useNotificationStore()
    const [isOpen, setIsOpen] = useState(false)

    const typeColors = {
        info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800',
        success: 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800',
        warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-800',
        error: 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800',
    }

    const typeIcons = { info: 'ℹ️', success: '✅', warning: '⚠️', error: '❌' }

    return (
        <div className="relative">
            <button
                onClick={() => {
                    setIsOpen(!isOpen)
                    if (!isOpen) markAllRead()
                }}
                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
                🔔
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

                    {/* Mobile: full-width bottom sheet style. Desktop: dropdown */}
                    <div className="fixed inset-x-0 bottom-0 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 sm:w-80 bg-card rounded-t-xl sm:rounded-xl shadow-xl border border-border z-50 max-h-[70vh] sm:max-h-96 overflow-y-auto">
                        <div className="p-4 border-b border-border flex items-center justify-between">
                            <h3 className="font-semibold text-foreground">Уведомления</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="sm:hidden text-muted hover:text-foreground text-sm"
                            >
                                Закрыть
                            </button>
                        </div>
                        {notifications.length === 0 ? (
                            <p className="p-4 text-sm text-muted text-center">
                                Нет уведомлений
                            </p>
                        ) : (
                            notifications.map((n) => (
                                <div key={n.id} className={`p-4 border-b ${typeColors[n.type]} text-sm`}>
                                    <div className="flex gap-2 items-start">
                                        <span>{typeIcons[n.type]}</span>
                                        <div>
                                            <p className="text-foreground">{n.message}</p>
                                            <p className="text-muted text-xs mt-1">
                                                {n.timestamp.toLocaleTimeString('ru-RU')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    )
}
