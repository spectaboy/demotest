import { toast } from "@/components/ui/use-toast"

export interface ChatMessage {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: number
  read: boolean
}

export interface ChatThread {
  id: string
  participants: string[]
  lastMessage?: ChatMessage
  unreadCount: number
}

class ChatService {
  private threads: ChatThread[] = []
  private messages: Record<string, ChatMessage[]> = {}

  // Create a new chat thread between two users
  createThread(userId1: string, userId2: string): ChatThread {
    const threadId = `${Date.now()}`
    const newThread: ChatThread = {
      id: threadId,
      participants: [userId1, userId2],
      unreadCount: 0,
    }
    this.threads.push(newThread)
    this.messages[threadId] = []
    return newThread
  }

  // Get all chat threads for a user
  getThreadsForUser(userId: string): ChatThread[] {
    return this.threads.filter((thread) => thread.participants.includes(userId))
  }

  // Send a message in a thread
  sendMessage(threadId: string, senderId: string, content: string): ChatMessage {
    const thread = this.threads.find((t) => t.id === threadId)
    if (!thread) {
      throw new Error("Thread not found")
    }

    const receiverId = thread.participants.find((id) => id !== senderId)
    if (!receiverId) {
      throw new Error("Receiver not found")
    }

    const newMessage: ChatMessage = {
      id: `${Date.now()}`,
      senderId,
      receiverId,
      content,
      timestamp: Date.now(),
      read: false,
    }

    if (!this.messages[threadId]) {
      this.messages[threadId] = []
    }

    this.messages[threadId].push(newMessage)

    // Update thread with last message and unread count
    thread.lastMessage = newMessage
    thread.unreadCount += 1

    // Show toast notification
    toast({
      title: "Message Sent",
      description: "Your message has been sent successfully.",
    })

    return newMessage
  }

  // Get all messages in a thread
  getMessages(threadId: string): ChatMessage[] {
    return this.messages[threadId] || []
  }

  // Mark messages as read
  markThreadAsRead(threadId: string, userId: string): void {
    const thread = this.threads.find((t) => t.id === threadId)
    if (!thread) return

    if (this.messages[threadId]) {
      this.messages[threadId] = this.messages[threadId].map((msg) => {
        if (msg.receiverId === userId && !msg.read) {
          return { ...msg, read: true }
        }
        return msg
      })
    }

    // Reset unread count
    thread.unreadCount = 0
  }

  // Get thread between two users, create if doesn't exist
  getOrCreateThreadForUsers(userId1: string, userId2: string): ChatThread {
    const existingThread = this.threads.find(
      (thread) => thread.participants.includes(userId1) && thread.participants.includes(userId2),
    )

    if (existingThread) {
      return existingThread
    }

    return this.createThread(userId1, userId2)
  }
}

export const chatService = new ChatService()

