"use client"

import type React from "react"
import { useState, useEffect } from "react"

interface NotificationProps {
  message: string
  type?: "success" | "error" | "info"
  duration?: number
}

export const Notification: React.FC<NotificationProps> = ({ message, type = "info", duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  if (!isVisible) return null

  const bgColor = type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-blue-500"

  return <div className={`fixed bottom-4 right-4 ${bgColor} text-white px-4 py-2 rounded-md shadow-lg`}>{message}</div>
}

export const useNotification = () => {
  const [notification, setNotification] = useState<NotificationProps | null>(null)

  const showNotification = (props: NotificationProps) => {
    setNotification(props)
  }

  return { Notification, showNotification }
}

