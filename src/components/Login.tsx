"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { MouseMoveEffect } from "./MouseMoveEffect"
import type { UserRole } from "../lib/auth"
import { RoleSelector } from "./RoleSelector"

interface LoginProps {
  onComplete: (type: UserRole, name: string, email: string) => void
  onSignUpClick: () => void
}

export function Login({ onComplete, onSignUpClick }: LoginProps) {
  const [showRoleSelector, setShowRoleSelector] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [role, setRole] = useState<UserRole>("rider")

  const handleEmailPasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const username = email.split("@")[0]
    onComplete(role, username, email)
    // Simulating a sign-in process
    setTimeout(() => {
      setIsLoading(false)
      setShowRoleSelector(true)
    }, 1000)
  }

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole)
    const username = email.split("@")[0]
    onComplete(selectedRole, username, email)
  }

  if (showRoleSelector) {
    return <RoleSelector onRoleSelect={handleRoleSelect} />
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-zinc-800">
      <MouseMoveEffect />
      <div className="min-h-screen w-full bg-transparent px-6 py-12 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Welcome to URide</h2>
            <p className="mt-2 text-zinc-400">
              Your journey to independence, smarter spending, and a stronger community starts here.
            </p>
            <p className="mt-2 text-zinc-400">Sign in to continue</p>
          </div>

          <form onSubmit={handleEmailPasswordSignIn} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white"
                required
              />
              <Button
                variant="link"
                className="text-sm text-zinc-400 hover:text-[#CCFF00] mt-1 p-0"
                onClick={() => {
                  toast({
                    title: "Password Reset",
                    description: "Password reset functionality is not implemented in this demo.",
                  })
                }}
              >
                Forgot password?
              </Button>
            </div>
            <Button
              type="button"
              className="w-full bg-zinc-800 text-white hover:bg-zinc-700 mb-2"
              onClick={() => {
                // TODO: Implement university email sign-in logic
                toast({
                  title: "University Email Sign-In",
                  description: "This feature is not yet implemented.",
                })
              }}
            >
              Sign in with University Email
            </Button>
            <Button type="submit" disabled={isLoading} className="w-full bg-[#CCFF00] text-black hover:bg-[#CCFF00]/90">
              Sign In
            </Button>
          </form>

          <div className="text-center">
            <Button variant="link" className="text-zinc-400 hover:text-[#CCFF00]" onClick={onSignUpClick}>
              Don't have an account? Sign up
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

