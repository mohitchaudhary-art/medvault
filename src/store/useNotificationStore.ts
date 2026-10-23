import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NotificationItem } from '../types/medvault';

interface NotificationState {
  notifications: NotificationItem[];
  addNotification: (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],

      addNotification: (notifData) => {
        const newNotif: NotificationItem = {
          ...notifData,
          id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          timestamp: 'Just now',
          read: false
        };

        set((state) => ({
          notifications: [newNotif, ...state.notifications]
        }));
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true }))
        }));
      },

      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id)
        }));
      },

      clearAll: () => set({ notifications: [] })
    }),
    { name: 'medvault-notifications-storage' }
  )
);

