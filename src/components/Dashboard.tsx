"use client"

import React, { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CommunityEvents } from "./CommunityEvents"
import { RiderDashboard } from "./RiderDashboard"
import { DriverDashboard } from "./DriverDashboard"
import { OrganizerDashboard } from "./OrganizerDashboard"
import { useLoadScript } from "@react-google-maps/api"
import { LoadingScreen } from "./LoadingScreen"
import { ReLoginModal } from "./ReLoginModal"
import { EventProvider } from "../contexts/EventContext"
import { EarningsSpendingOverview } from "./EarningsSpendingOverview"
import { DinoAssistant } from "./DinoAssistant"
import { Chat } from "./chat/Chat"
import { ProfileSettings } from "./profile/ProfileSettings"
import { RideHistory } from "./rides/RideHistory"

interface DashboardProps {
  userType: "driver" | "rider" | "organizer"
  availableRoles: ("driver" | "rider" | "organizer")[]
  onLogout: () => void
  onRoleSwitch: (role: "driver" | "rider" | "organizer") => void
  onRoleSignup: (role: "driver" | "rider" | "organizer") => void
  userProfile: UserProfile
}

interface UserProfile {
  name: string
  avatar: string
  rating?: number
}

const generatePlaceholderUsername = () => {
  const adjectives = ["Cool", "Swift", "Clever", "Bright", "Witty", "Brave", "Kind", "Calm", "Wise", "Jolly"]
  const nouns = [
    "Rider",
    "Driver",
    "Organizer",
    "Explorer",
    "Voyager",
    "Adventurer",
    "Journeyer",
    "Wanderer",
    "Nomad",
    "Pioneer",
  ]
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)]
  return `${randomAdjective}${randomNoun}`
}

export function Dashboard({
  userType,
  availableRoles,
  onLogout,
  onRoleSwitch,
  onRoleSignup,
  userProfile,
}: DashboardProps) {
  const [notifications, setNotifications] = React.useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isReLoginModalOpen, setIsReLoginModalOpen] = useState(false)
  const [pendingRoleChange, setPendingRoleChange] = useState<"driver" | "rider" | "organizer" | null>(null)
  const isFirstMount = useRef(true)
  const [expandedUserProfile, setExpandedUserProfile] = useState({
    ...userProfile,
    email: "user@example.com",
    phone: "",
    bio: "",
  })

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  })

  useEffect(() => {
    if (isFirstMount.current) {
      const username = userProfile.name.includes("@") ? userProfile.name.split("@")[0] : userProfile.name

      isFirstMount.current = false
    }
  }, [userProfile.name])

  const handleRoleChangeClick = (newRole: "driver" | "rider" | "organizer") => {
    setPendingRoleChange(newRole)
    setIsReLoginModalOpen(true)
  }

  const handleReLogin = async (username: string, password: string) => {
    if (!pendingRoleChange) return

    setIsReLoginModalOpen(false)
    setIsLoading(true)

    // Simulating a login/signup process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Extract username from email before the @ symbol
    const emailUsername = username.split("@")[0]

    if (availableRoles.includes(pendingRoleChange)) {
      onRoleSwitch(pendingRoleChange)
    } else {
      onRoleSignup(pendingRoleChange)
    }

    setIsLoading(false)
    setPendingRoleChange(null)
  }

  const handleUpdateProfile = (updatedProfile: any) => {
    setExpandedUserProfile(updatedProfile)
    // Update the main userProfile with relevant fields
    const updatedMainProfile = {
      ...userProfile,
      name: updatedProfile.name,
      avatar: updatedProfile.avatar,
    }
    // This would typically update the profile in a database
    console.log("Profile updated:", updatedProfile)
  }

  const renderDashboard = () => {
    switch (userType) {
      case "rider":
        return (
          <Tabs defaultValue="rides" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-zinc-800">
              <TabsTrigger
                value="rides"
                className="text-white font-semibold data-[state=active]:bg-[#CCFF00] data-[state=active]:text-black"
              >
                Rides
              </TabsTrigger>
              <TabsTrigger
                value="events"
                className="text-white font-semibold data-[state=active]:bg-[#CCFF00] data-[state=active]:text-black"
              >
                Community Events
              </TabsTrigger>
              <TabsTrigger
                value="progress"
                className="text-white font-semibold data-[state=active]:bg-[#CCFF00] data-[state=active]:text-black"
              >
                Your Progress
              </TabsTrigger>
              <TabsTrigger
                value="messages"
                className="text-white font-semibold data-[state=active]:bg-[#CCFF00] data-[state=active]:text-black"
              >
                Messages
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className="text-white font-semibold data-[state=active]:bg-[#CCFF00] data-[state=active]:text-black"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="text-white font-semibold data-[state=active]:bg-[#CCFF00] data-[state=active]:text-black"
              >
                History
              </TabsTrigger>
            </TabsList>
            <TabsContent value="rides">
              <RiderDashboard userProfile={userProfile} isLoaded={isLoaded} />
            </TabsContent>
            <TabsContent value="events">
              <CommunityEvents userRole={userType} userName={userProfile.name} />
            </TabsContent>
            <TabsContent value="messages">
              <Chat userId={userProfile.name} />
            </TabsContent>
            <TabsContent value="profile">
              <ProfileSettings userProfile={expandedUserProfile} onUpdateProfile={handleUpdateProfile} />
            </TabsContent>
            <TabsContent value="history">
              <RideHistory userType={userType} userName={userProfile.name} />
            </TabsContent>
          </Tabs>
        )
      case "driver":
        return (
          <Tabs defaultValue="rides" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-zinc-800">
              <TabsTrigger
                value="rides"
                className="text-white font-semibold data-[state=active]:bg-[#CCFF00] data-[state=active]:text-black"
              >
                Rides
              </TabsTrigger>
              <TabsTrigger
                value="events"
                className="text-white font-semibold data-[state=active]:bg-[#CCFF00] data-[state=active]:text-black"
              >
                Community Events
              </TabsTrigger>
              <TabsTrigger
                value="earnings"
                className="text-white font-semibold data-[state=active]:bg-[#CCFF00] data-[state=active]:text-black"
              >
                Earnings
              </TabsTrigger>
              <TabsTrigger
                value="messages"
                className="text-white font-semibold data-[state=active]:bg-[#CCFF00] data-[state=active]:text-black"
              >
                Messages
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className="text-white font-semibold data-[state=active]:bg-[#CCFF00] data-[state=active]:text-black"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="text-white font-semibold data-[state=active]:bg-[#CCFF00] data-[state=active]:text-black"
              >
                History
              </TabsTrigger>
            </TabsList>
            <TabsContent value="rides">
              <DriverDashboard userProfile={userProfile} isLoaded={isLoaded} />
            </TabsContent>
            <TabsContent value="events">
              <CommunityEvents userRole={userType} userName={userProfile.name} />
            </TabsContent>
            <TabsContent value="earnings">
              <EarningsSpendingOverview userType="driver" />
            </TabsContent>
            <TabsContent value="messages">
              <Chat userId={userProfile.name} />
            </TabsContent>
            <TabsContent value="profile">
              <ProfileSettings userProfile={expandedUserProfile} onUpdateProfile={handleUpdateProfile} />
            </TabsContent>
            <TabsContent value="history">
              <RideHistory userType={userType} userName={userProfile.name} />
            </TabsContent>
          </Tabs>
        )
      case "organizer":
        return <OrganizerDashboard userName={userProfile.name} />
      default:
        return null
    }
  }

  return (
    <EventProvider>
      <div className="min-h-screen bg-black p-6">
        {isLoading && <LoadingScreen />}
        <ReLoginModal
          isOpen={isReLoginModalOpen}
          onClose={() => setIsReLoginModalOpen(false)}
          onLogin={handleReLogin}
        />
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={userProfile.avatar || ""} alt={userProfile.name || ""} />
                <AvatarFallback>{userProfile.name ? userProfile.name[0] : ""}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-4xl font-extrabold text-[#CCFF00]">{userProfile.name || "User"}</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="bg-zinc-800 text-white hover:bg-zinc-700 relative">
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </Button>
              <Button
                onClick={onLogout}
                variant="outline"
                className="bg-zinc-800 text-[#CCFF00] hover:bg-zinc-700 border-[#CCFF00] font-semibold"
              >
                Logout
              </Button>
            </div>
          </div>
          <div className="mb-6">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4 flex justify-between items-center">
                <div className="text-white font-semibold">
                  Current Role:{" "}
                  <span className="font-extrabold text-[#CCFF00] bg-zinc-800 px-2 py-1 rounded">
                    {userType.charAt(0).toUpperCase() + userType.slice(1)}
                  </span>
                </div>
                <div className="flex space-x-2">
                  {["driver", "rider", "organizer"].map((role) => (
                    <Button
                      key={role}
                      onClick={() => handleRoleChangeClick(role as "driver" | "rider" | "organizer")}
                      className={`${
                        userType === role
                          ? "bg-[#CCFF00] text-black font-bold"
                          : "bg-zinc-800 text-white hover:bg-zinc-700"
                      } ${userType === role ? "ring-2 ring-white" : ""}`}
                      disabled={userType === role}
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          {renderDashboard()}
          <DinoAssistant />
        </div>
      </div>
    </EventProvider>
  )
}

