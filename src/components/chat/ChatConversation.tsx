"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, ArrowLeft } from "lucide-react"
import { chatService, type ChatMessage } from "@/services/chatService"
import { formatDistanceToNow } from "date-fns"
import { getRandomProfileImage } from "@/utils/constants"

interface ChatConversationProps {
  threadId: string | null
  userId: string
  onBack: () => void
}

export function ChatConversation({ threadId, userId, onBack }: ChatConversationProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [otherParticipantId, setOtherParticipantId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!threadId) return

    // Get messages for this thread
    const threadMessages = chatService.getMessages(threadId)
    setMessages(threadMessages)

    // Mark messages as read
    chatService.markThreadAsRead(threadId, userId)

    // Get the other participant
    const thread = chatService.getThreadsForUser(userId).find((t) => t.id === threadId)
    if (thread) {
      const otherId = thread.participants.find((id) => id !== userId)
      setOtherParticipantId(otherId || null)
    }

    // Poll for new messages
    const interval = setInterval(() => {
      const updatedMessages = chatService.getMessages(threadId)
      setMessages(updatedMessages)
      chatService.markThreadAsRead(threadId, userId)
    }, 2000)

    return () => clearInterval(interval)
  }, [threadId, userId])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!threadId || !newMessage.trim()) return

    chatService.sendMessage(threadId, userId, newMessage.trim())
    setNewMessage("")

    // Update messages
    setMessages(chatService.getMessages(threadId))
  }

  const getOtherParticipantName = (): string => {
    return otherParticipantId ? `User ${otherParticipantId.substring(0, 5)}` : "Unknown User"
  }

  if (!threadId) {
    return (
      <Card className="bg-zinc-900 border-zinc-800 h-full">
        <CardContent className="p-6 flex items-center justify-center h-full">
          <p className="text-zinc-400">Select a conversation to start chatting</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800 h-full flex flex-col">
      <CardHeader className="border-b border-zinc-800 p-4">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={getRandomProfileImage()} alt={getOtherParticipantName()} />
            <AvatarFallback>{getOtherParticipantName().charAt(0)}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-white text-base">{getOtherParticipantName()}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-zinc-400 py-8">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex ${message.senderId === userId ? "justify-end" : "justify-start"}`}>
              {message.senderId !== userId && (
                <Avatar className="h-8 w-8 mr-2 mt-1">
                  <AvatarImage src={getRandomProfileImage()} alt={getOtherParticipantName()} />
                  <AvatarFallback>{getOtherParticipantName().charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  message.senderId === userId ? "bg-[#CCFF00] text-black" : "bg-zinc-800 text-white"
                }`}
              >
                <p>{message.content}</p>
                <p className={`text-xs mt-1 ${message.senderId === userId ? "text-zinc-800" : "text-zinc-400"}`}>
                  {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </CardContent>
      <div className="p-4 border-t border-zinc-800">
        <div className="flex">
          <Input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage()
              }
            }}
            className="flex-1 bg-zinc-800 border-zinc-700 text-white mr-2"
          />
          <Button onClick={handleSendMessage} className="bg-[#CCFF00] text-black hover:bg-[#CCFF00]/90">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

