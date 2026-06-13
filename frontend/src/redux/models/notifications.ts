import { createModel } from '@rematch/core'
import type { NotificationsState } from './types'

type Notification = {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

const initialState: NotificationsState = {
  notifications: [],
}

export const notificationsModel = createModel<NotificationsState>()({
  state: initialState,
  reducers: {
    addNotification(state: NotificationsState, payload: Notification) {
      return {
        ...state,
        notifications: [...state.notifications, payload],
      }
    },
    removeNotification(state: NotificationsState, payload: string) {
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== payload),
      }
    },
    clearNotifications() {
      return initialState
    },
  },
})
