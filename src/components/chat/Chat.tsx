"use client"

import { useState } from "react"
import { ChatList } from "./ChatList"
import { ChatConversation } from "./ChatConversation"

interface ChatProps {
  userId: string
}

export function Chat({ userId }: ChatProps) {
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)
  const [isMobileListVisible, setIsMobileListVisible] = useState(true)

  const handleSelectThread = (threadId: string) => {
    setSelectedThreadId(threadId)
    setIsMobileListVisible(false)
  }

  const handleBack = () => {
    setIsMobileListVisible(true)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
      <div className={`md:block ${isMobileListVisible ? "block" : "hidden"} md:col-span-1`}>
        <ChatList userId={userId} onSelectThread={handleSelectThread} />
      </div>
      <div className={`md:block ${isMobileListVisible ? "hidden" : "block"} md:col-span-2`}>
        <ChatConversation threadId={selectedThreadId} userId={userId} onBack={handleBack} />
      </div>
    </div>
  )
}

