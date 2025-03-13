"use client"
import { CommunityEvents } from "./CommunityEvents"

interface OrganizerDashboardProps {
  userName: string
}

export function OrganizerDashboard({ userName }: OrganizerDashboardProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Event Organizer Dashboard</h2>
      <CommunityEvents userRole="organizer" userName={userName} />
    </div>
  )
}

