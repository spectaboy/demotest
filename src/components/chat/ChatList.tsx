"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle } from "lucide-react"
import { chatService, type ChatThread } from "@/services/chatService"
import { formatDistanceToNow } from "date-fns"
import { getRandomProfileImage } from "@/utils/constants"

interface ChatListProps {
  userId: string
  onSelectThread: (threadId: string) => void
}

export function ChatList({ userId, onSelectThread }: ChatListProps) {
  const [threads, setThreads] = useState<ChatThread[]>([])
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)

  useEffect(() => {
    // Fetch threads for the current user
    const userThreads = chatService.getThreadsForUser(userId)
    setThreads(userThreads)

    // Poll for new messages every 5 seconds
    const interval = setInterval(() => {
      setThreads(chatService.getThreadsForUser(userId))
    }, 5000)

    return () => clearInterval(interval)
  }, [userId])

  const handleSelectThread = (threadId: string) => {
    setSelectedThreadId(threadId)
    onSelectThread(threadId)
    chatService.markThreadAsRead(threadId, userId)
  }

  // Generate a display name for the other participant
  const getOtherParticipantName = (thread: ChatThread): string => {
    const otherParticipantId = thread.participants.find((id) => id !== userId)
    return otherParticipantId ? `User ${otherParticipantId.substring(0, 5)}` : "Unknown User"
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800 h-full">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <MessageCircle className="mr-2 h-5 w-5 text-[#CCFF00]" />
          Messages
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {threads.length === 0 ? (
          <div className="p-6 text-center text-zinc-400">No messages yet</div>
        ) : (
          <ul className="divide-y divide-zinc-800">
            {threads.map((thread) => (
              <li key={thread.id}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start p-4 hover:bg-zinc-800 ${
                    selectedThreadId === thread.id ? "bg-zinc-800" : ""
                  }`}
                  onClick={() => handleSelectThread(thread.id)}
                >
                  <div className="flex items-center w-full">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={getRandomProfileImage()} alt={getOtherParticipantName(thread)} />
                      <AvatarFallback>{getOtherParticipantName(thread).charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-white truncate">{getOtherParticipantName(thread)}</p>
                        {thread.lastMessage && (
                          <p className="text-xs text-zinc-400">
                            {formatDistanceToNow(thread.lastMessage.timestamp, { addSuffix: true })}
                          </p>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 truncate">
                        {thread.lastMessage ? thread.lastMessage.content : "No messages yet"}
                      </p>
                    </div>
                    {thread.unreadCount > 0 && (
                      <span className="ml-2 bg-[#CCFF00] text-black text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                        {thread.unreadCount}
                      </span>
                    )}
                  </div>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

