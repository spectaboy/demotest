import type React from "react"

interface LayoutProps {
  children: React.ReactNode
  onLogout?: () => void
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-black">
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}

