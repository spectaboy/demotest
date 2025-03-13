"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNotification } from "@/components/Notification"
import { Car, User, Calendar } from "lucide-react"
import { MouseMoveEffect } from "./MouseMoveEffect"
import type { UserRole } from "../lib/auth"

interface SignUpProps {
  onSignUp: (type: UserRole, name: string, email: string) => void
  onSignInClick: () => void
}

export function SignUp({ onSignUp, onSignInClick }: SignUpProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole | null>(null)

  const { showNotification } = useNotification()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password || !role) {
      showNotification({
        message: "Please fill in all fields and select a role.",
        type: "error",
      })
      return
    }

    // Simulating account creation
    setTimeout(() => {
      const username = email.split("@")[0]
      showNotification({
        message: "Your account has been successfully created.",
        type: "success",
      })
      onSignUp(role, username, email)
    }, 1000)
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-zinc-900 to-zinc-800 flex flex-col items-center justify-center p-4">
      <MouseMoveEffect />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Create Your Account</h2>
          <p className="mt-2 text-zinc-400">
            Join URide as a driver, rider, or event organizer and start building a smarter, more connected university
            experience.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-white">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                required
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <Button
              type="button"
              className={`flex-1 ${
                role === "driver" ? "bg-[#CCFF00] text-black" : "bg-zinc-800 text-white hover:bg-zinc-700"
              }`}
              onClick={() => setRole("driver")}
            >
              <Car className="mr-2 h-4 w-4" />
              Driver
            </Button>
            <Button
              type="button"
              className={`flex-1 ${
                role === "rider" ? "bg-[#CCFF00] text-black" : "bg-zinc-800 text-white hover:bg-zinc-700"
              }`}
              onClick={() => setRole("rider")}
            >
              <User className="mr-2 h-4 w-4" />
              Rider
            </Button>
            <Button
              type="button"
              className={`flex-1 ${
                role === "organizer" ? "bg-[#CCFF00] text-black" : "bg-zinc-800 text-white hover:bg-zinc-700"
              }`}
              onClick={() => setRole("organizer")}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Organizer
            </Button>
          </div>

          <Button type="submit" className="w-full bg-[#CCFF00] text-black hover:bg-[#CCFF00]/90">
            Sign up
          </Button>
        </form>
        <div className="text-center">
          <Button variant="link" className="text-zinc-400 hover:text-[#CCFF00]" onClick={onSignInClick}>
            Already have an account? Sign in
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

