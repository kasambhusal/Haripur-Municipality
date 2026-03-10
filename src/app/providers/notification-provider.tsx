"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import { CheckCircle, AlertCircle, X } from "lucide-react"

interface Notification {
  id: string
  type: "success" | "error"
  title: string
  message: string
}

interface NotificationContextType {
  showSuccess: (title: string, message: string) => void
  showError: (title: string, message: string) => void
}

const NotificationContext = createContext<NotificationContextType | null>(null)

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider")
  }
  return context
}

interface NotificationProviderProps {
  children: React.ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const addNotification = useCallback(
    (type: "success" | "error", title: string, message: string) => {
      const id = Date.now().toString()
      const notification: Notification = { id, type, title, message }

      setNotifications((prev) => [...prev, notification])

      // Auto remove after 5 seconds
      setTimeout(() => {
        removeNotification(id)
      }, 5000)
    },
    [removeNotification],
  )

  const showSuccess = useCallback(
    (title: string, message: string) => {
      addNotification("success", title, message)
    },
    [addNotification],
  )

  const showError = useCallback(
    (title: string, message: string) => {
      addNotification("error", title, message)
    },
    [addNotification],
  )

  return (
    <NotificationContext.Provider value={{ showSuccess, showError }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-3 w-80">
        {notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

interface NotificationCardProps {
  notification: Notification
  onClose: () => void
}

function NotificationCard({ notification, onClose }: NotificationCardProps) {
  const isSuccess = notification.type === "success"

  return (
    <div
      className={`
      bg-white border-l-4 rounded-lg shadow-lg p-4 
      animate-in slide-in-from-right duration-300
      ${isSuccess ? "border-l-green-500" : "border-l-red-500"}
    `}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {isSuccess ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 mb-1">{notification.title}</h4>
          <p className="text-sm text-gray-600">{notification.message}</p>
        </div>

        <button onClick={onClose} className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
