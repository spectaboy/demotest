import type React from "react"
import { motion } from "framer-motion"
import { Car } from "lucide-react"

export const AnimatedCar: React.FC = () => {
  return (
    <motion.div
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: "0%", opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <Car className="w-12 h-12 text-[#CCFF00]" />
    </motion.div>
  )
}

