import { create } from 'zustand'
import { Notification } from '@/types'

interface NotificationStore {
    notifications: Notification[]
    unreadCount: number
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
    markAllRead: () => void
}

export const useNotificationStore = create<NotificationStore>((set) => ({
    notifications: [],
    unreadCount: 0,

    addNotification: (notif) =>
        set((state) => {
            const newNotification: Notification = {
                ...notif,
                id: crypto.randomUUID(),
                timestamp: new Date(),
                read: false,
            }
            return {
                notifications: [newNotification, ...state.notifications].slice(0, 20),
                unreadCount: state.unreadCount + 1,
            }
        }),

    markAllRead: () =>
        set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, read: true })),
            unreadCount: 0,
        })),
}))