"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export function Logo({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="relative w-full max-w-4xl">
        <motion.img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Dd7b0aSIlw5cNutNsXhRwosZChi7NO.png"
          alt="T-Rex Left"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64"
          animate={{
            x: [-10, 10, -10],
            transition: {
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            },
          }}
        />
        <motion.img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-RBxxlRgruXx7MRpup6djjWsr99q5uC.png"
          alt="T-Rex Right"
          className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64"
          animate={{
            x: [10, -10, 10],
            transition: {
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            },
          }}
        />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-8">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col items-center justify-center space-y-4"
          >
            <h1 className="text-6xl font-bold text-[#CCFF00]">URide</h1>
            <p className="text-2xl text-gray-400">Your Ride, Your Community</p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2, duration: 0.5 }}
          >
            <Button
              onClick={onComplete}
              className="bg-[#CCFF00] text-black hover:bg-[#98bf00] px-10 py-6 text-xl rounded-full"
            >
              Start your journey
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

