"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Car, User, Calendar } from "lucide-react"
import { MouseMoveEffect } from "./MouseMoveEffect"
import type { UserRole } from "@/lib/auth"

interface RoleSelectorProps {
  onRoleSelect: (role: UserRole) => void
}

export function RoleSelector({ onRoleSelect }: RoleSelectorProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
    onRoleSelect(role)
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-zinc-900 to-zinc-800 flex flex-col items-center justify-center p-4">
      <MouseMoveEffect />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#CCFF00]">Choose your role</h2>
          <p className="mt-2 text-zinc-400">Select how you want to use URide</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Button
            className={`h-24 w-full ${
              selectedRole === "driver" ? "bg-[#CCFF00] text-black" : "bg-zinc-800 text-white hover:bg-zinc-700"
            }`}
            onClick={() => handleRoleSelect("driver")}
          >
            <Car className="mr-2 h-6 w-6" />
            <div className="text-left">
              <div className="font-semibold">Driver</div>
              <div className="text-sm opacity-80">Offer rides and earn</div>
            </div>
          </Button>

          <Button
            className={`h-24 w-full ${
              selectedRole === "rider" ? "bg-[#CCFF00] text-black" : "bg-zinc-800 text-white hover:bg-zinc-700"
            }`}
            onClick={() => handleRoleSelect("rider")}
          >
            <User className="mr-2 h-6 w-6" />
            <div className="text-left">
              <div className="font-semibold">Rider</div>
              <div className="text-sm opacity-80">Find and share rides</div>
            </div>
          </Button>

          <Button
            className={`h-24 w-full ${
              selectedRole === "organizer" ? "bg-[#CCFF00] text-black" : "bg-zinc-800 text-white hover:bg-zinc-700"
            }`}
            onClick={() => handleRoleSelect("organizer")}
          >
            <Calendar className="mr-2 h-6 w-6" />
            <div className="text-left">
              <div className="font-semibold">Event Organizer</div>
              <div className="text-sm opacity-80">Create and manage events</div>
            </div>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

