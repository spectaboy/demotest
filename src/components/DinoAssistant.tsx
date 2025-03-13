"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Message {
  text: string
  isUser: boolean
}

export function DinoAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isJumping, setIsJumping] = useState(false)
  const [isFlipping, setIsFlipping] = useState(false)

  const dinoResponses = [
    "RAWR! I mean... How can I help you today? 🦖",
    "That's DINO-mite! Need anything else? 🦖",
    "Let me use my tiny arms to help you with that! 🦖",
    "Stomping my way to assist you! 🦖",
    "Even meteors couldn't stop me from helping! 🦖",
  ]

  const handleUserMessage = async (message: string) => {
    setMessages((prev) => [...prev, { text: message, isUser: true }])

    try {
      console.log("Sending request to API...");
      const response = await fetch(`http://127.0.0.1:8000/ask/?question=${encodeURIComponent(message)}`)
      console.log("Received response from API:", response);
      const data = await response.json()
      const aiResponse = data.answer

      setMessages((prev) => [...prev, { text: aiResponse, isUser: false }])

      // Trigger random animation
      if (Math.random() > 0.5) {
        setIsJumping(true)
        setTimeout(() => setIsJumping(false), 1000)
      } else {
        setIsFlipping(true)
        setTimeout(() => setIsFlipping(false), 1000)
      }
    } catch (error) {
      console.error("Error fetching AI response:", error)
      setMessages((prev) => [...prev, { text: "Sorry, I couldn't fetch a response.", isUser: false }])
    }
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (!isOpen && messages.length === 0) {
      handleUserMessage("Hello!")
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="mb-4"
          >
            <Card className="w-80 bg-zinc-900 border-zinc-800">
              <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Dino Assistant</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-zinc-400 hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4 h-80 overflow-y-auto space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                    {!message.isUser && (
                      <motion.img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-RBxxlRgruXx7MRpup6djjWsr99q5uC.png"
                        alt="Dino Assistant"
                        className="w-8 h-8 mr-2"
                        animate={{
                          rotate: isFlipping ? 360 : 0,
                          y: isJumping ? -20 : 0,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 10,
                        }}
                      />
                    )}
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        message.isUser ? "bg-[#CCFF00] text-black" : "bg-zinc-800 text-white"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-zinc-800">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CCFF00]"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value.trim()) {
                      handleUserMessage(e.currentTarget.value)
                      e.currentTarget.value = ""
                    }
                  }}
                />
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={toggleChat}
        className="bg-[#CCFF00] rounded-full p-3 shadow-lg hover:bg-[#CCFF00]/90 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {!isOpen && (
          <motion.img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-RBxxlRgruXx7MRpup6djjWsr99q5uC.png"
            alt="Dino Assistant"
            className="w-12 h-12"
            animate={{
              rotate: isFlipping ? 360 : 0,
              y: isJumping ? -20 : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 10,
            }}
          />
        )}
        {isOpen && <MessageCircle className="w-6 h-6 text-black" />}
      </motion.button>
    </div>
  )
}

