"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Users, MapPin, ArrowRight, Shield, DollarSign, Car } from "lucide-react"
import { MouseMoveEffect } from "./MouseMoveEffect"
import { Logo } from "./Logo"

const screens = [
  {
    id: 1,
    title: "Welcome to URide",
    description: "More than just a ride—URide helps you save money, build connections, and grow your independence.",
    color: "bg-zinc-900",
    icon: Car,
  },
  {
    id: 2,
    title: "A Student-First Platform",
    description:
      "Connect with verified university members for safe, affordable carpooling while gaining financial and social independence.",
    color: "bg-zinc-900",
    icon: Users,
  },
  {
    id: 3,
    title: "Convenient & Social Commutes",
    description:
      "Get to campus comfortably and affordably while expanding your social circle and making the most of university life.",
    color: "bg-zinc-900",
    icon: MapPin,
  },
  {
    id: 4,
    title: "A Secure, Student-Only Community",
    description:
      "Travel with fellow students in a trusted environment—because a ride should be safe, reliable, and community-driven.",
    color: "bg-zinc-900",
    icon: Shield,
  },
  {
    id: 5,
    title: "Smart Savings, Real Impact",
    description:
      "Drivers: Offset your costs effortlessly.\nRiders: Save money on every trip.\nEveryone: Learn financial skills and grow your network along the way.",
    color: "bg-zinc-900",
    icon: DollarSign,
  },
]

interface WelcomeScreensProps {
  onComplete: () => void
}

export function WelcomeScreens({ onComplete }: WelcomeScreensProps) {
  const [currentScreen, setCurrentScreen] = useState(-1)

  const handleNext = () => {
    if (currentScreen < screens.length - 1) {
      setCurrentScreen((prev) => prev + 1)
    } else {
      onComplete()
    }
  }

  if (currentScreen === -1) {
    return <Logo onComplete={() => setCurrentScreen(0)} />
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-zinc-800">
      <MouseMoveEffect />
      <div className="min-h-screen w-full bg-transparent px-6 py-12 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full max-w-md"
          >
            <div className="flex-1 flex flex-col items-center justify-center space-y-8">
              <div className="w-24 h-24 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  {React.createElement(screens[currentScreen].icon, {
                    className: "w-16 h-16 text-[#CCFF00]",
                  })}
                </div>
              </div>
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-white">{screens[currentScreen].title}</h1>
                <p className="text-lg text-zinc-400 whitespace-pre-line">
                  {screens[currentScreen].description.split("\n").map((line, lineIndex) => (
                    <React.Fragment key={lineIndex}>
                      {line.split(" ").map((word, wordIndex) =>
                        word.toLowerCase() === "drivers:" ||
                        word.toLowerCase() === "riders:" ||
                        word.toLowerCase() === "everyone:" ? (
                          <span key={wordIndex} className="font-bold text-[#CCFF00]">
                            {word}{" "}
                          </span>
                        ) : (
                          word + " "
                        ),
                      )}
                      {lineIndex < screens[currentScreen].description.split("\n").length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              </div>
            </div>

            <div className="space-y-6 w-full mt-8">
              <div className="flex justify-center space-x-2">
                {screens.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all ${
                      index === currentScreen ? "w-8 bg-[#CCFF00]" : "w-2 bg-zinc-700"
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={handleNext}
                className="w-full bg-[#CCFF00] text-black hover:bg-[#CCFF00]/90 h-12 text-lg"
              >
                {currentScreen === screens.length - 1 ? "Get Started" : "Next"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

