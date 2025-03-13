import type { Metadata } from "next"
import { Righteous } from "next/font/google"
import "./globals.css"
import type React from "react"
import { Toaster } from "@/components/ui/toaster"

const righteous = Righteous({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-righteous",
  display: "swap",
})

export const metadata: Metadata = {
  title: "SnowConnect",
  description: "Conecta con otros riders en la nieve",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${righteous.variable} font-righteous`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}

