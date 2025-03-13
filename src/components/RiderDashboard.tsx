"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, ArrowRight, TrendingUp, MessageCircle } from "lucide-react"
import { CustomGoogleMap } from "./CustomGoogleMap"
import { rideService, type Ride } from "@/services/rideService"
import { format, parseISO } from "date-fns"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CommunityEvents } from "./CommunityEvents"
import { chatService } from "@/services/chatService"
import { toast } from "@/components/ui/use-toast"
import { ValidatedRideRequestForm } from "./rides/ValidatedRideRequestForm"

interface RiderDashboardProps {
  userProfile: {
    name: string
    avatar: string
  }
  isLoaded: boolean
}

interface Location {
  lat: number
  lng: number
  address: string
}

interface Achievement {
  id: string
  text: string
  completed: boolean
}

export function RiderDashboard({ userProfile, isLoaded }: RiderDashboardProps) {
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null)
  const [dropoffLocation, setDropoffLocation] = useState<Location | null>(null)
  const [availableRides, setAvailableRides] = useState<Ride[]>([])
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null)
  const [moneySaved, setMoneySaved] = useState(0)
  const [savingsPercentage, setSavingsPercentage] = useState(0)
  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: "1", text: "New people met this week: 5", completed: false },
    { id: "2", text: "Events attended: 2", completed: false },
    { id: "3", text: "Rides shared: 3", completed: false },
  ])
  const [newAchievement, setNewAchievement] = useState("")
  const [score, setScore] = useState(0)

  useEffect(() => {
    // Fetch available rides periodically
    const interval = setInterval(() => {
      setAvailableRides(rideService.getAvailableRides())
    }, 5000)

    // Simulate initial savings
    const initialSavings = Math.floor(Math.random() * 50) + 20 // Random amount between $20 and $70
    setMoneySaved(initialSavings)
    setSavingsPercentage(Math.floor(Math.random() * 30) + 10) // Random percentage between 10% and 40%

    return () => clearInterval(interval)
  }, [])

  const handleFindRides = () => {
    if (!pickupLocation || !dropoffLocation) {
      return
    }
    const newRide = {
      from: pickupLocation.address,
      to: dropoffLocation.address,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toTimeString().split(" ")[0],
      seats: 1,
      rider: userProfile.name,
    }
    rideService.requestRide(newRide)
    setSelectedRide({ ...newRide, id: Date.now().toString(), status: "requested" })
  }

  const handleJoinRide = (ride: Ride) => {
    rideService.joinRide(ride.id, userProfile.name)
    setSelectedRide(ride)
    // Simulate money saved
    const savedAmount = Math.floor(Math.random() * 10) + 5
    setMoneySaved((prev) => prev + savedAmount)
    setSavingsPercentage((prev) => prev + Math.floor(Math.random() * 5) + 1)
  }

  const toggleAchievement = (id: string) => {
    setAchievements((prev) =>
      prev.map((ach) => {
        if (ach.id === id) {
          const newCompleted = !ach.completed
          setScore((prevScore) => prevScore + (newCompleted ? 1 : -1))
          return { ...ach, completed: newCompleted }
        }
        return ach
      }),
    )
  }

  const addNewAchievement = () => {
    if (newAchievement.trim()) {
      setAchievements((prev) => [...prev, { id: Date.now().toString(), text: newAchievement, completed: false }])
      setNewAchievement("")
    }
  }

  const learningResources = [
    { title: "5 Tips for Effective Budgeting", link: "#" },
    { title: "How to Start Conversations with New People", link: "#" },
    { title: "Building a Network in a New City", link: "#" },
    { title: "Managing Your Finances as a Student", link: "#" },
  ]

  const startChatWithDriver = (driverName: string) => {
    if (!driverName) return

    // Create or get a thread between the rider and driver
    const thread = chatService.getOrCreateThreadForUsers(userProfile.name, driverName)

    // Send an initial message
    chatService.sendMessage(
      thread.id,
      userProfile.name,
      `Hi! I'm interested in your ride from ${selectedRide?.from} to ${selectedRide?.to}.`,
    )

    // Show toast notification
    toast({
      title: "Chat Started",
      description: `You can now chat with ${driverName} about this ride.`,
    })
  }

  return (
    <Tabs defaultValue="rides" className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-zinc-800">
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
      </TabsList>
      <TabsContent value="rides">
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Find a Ride</h2>
          <ValidatedRideRequestForm userProfile={userProfile} isLoaded={isLoaded} onRideRequested={setSelectedRide} />
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Available Rides</h2>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              {availableRides.map((ride) => (
                <div key={ride.id} className="mb-4 last:mb-0 border-b border-zinc-800 pb-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold text-white">
                        {ride.from} to {ride.to}
                      </h3>
                      <p className="text-sm text-zinc-400">{format(parseISO(`${ride.date}T${ride.time}`), "PPpp")}</p>
                      <p className="text-sm text-zinc-400">Driver: {ride.driver}</p>
                      <p className="text-sm text-zinc-400">Available Seats: {ride.seats}</p>
                    </div>
                    <Button
                      className="bg-[#CCFF00] text-black hover:bg-[#CCFF00]/90"
                      onClick={() => handleJoinRide(ride)}
                    >
                      Join Ride
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {selectedRide && (
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Selected Ride Details</h2>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <div className="space-y-2 mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    {selectedRide.from} to {selectedRide.to}
                  </h3>
                  <p className="text-zinc-400">
                    Date: {format(parseISO(`${selectedRide.date}T${selectedRide.time}`), "PPpp")}
                  </p>
                  <p className="text-zinc-400">Status: {selectedRide.status}</p>
                  {selectedRide.driver && <p className="text-zinc-400">Driver: {selectedRide.driver}</p>}
                </div>
                <CustomGoogleMap
                  pickupLocation={{ address: selectedRide.from }}
                  dropoffLocation={{ address: selectedRide.to }}
                  isLoaded={isLoaded}
                />
                {selectedRide && selectedRide.driver && (
                  <Button
                    className="mt-4 bg-[#CCFF00] text-black hover:bg-[#CCFF00]/90"
                    onClick={() => startChatWithDriver(selectedRide.driver!)}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Chat with Driver
                  </Button>
                )}
              </CardContent>
            </Card>
          </section>
        )}
      </TabsContent>
      <TabsContent value="events">
        <CommunityEvents userRole="rider" userName={userProfile.name} />
      </TabsContent>
      <TabsContent value="progress">
        <section>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Achievements & Savings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6 bg-zinc-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Money Saved</h3>
                <p className="text-3xl font-bold text-[#CCFF00]">${moneySaved}</p>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="text-green-500 mr-1 h-4 w-4" />
                  <span className="text-green-500 font-semibold">{savingsPercentage}% saved</span>
                  <span className="text-zinc-400 ml-2">compared to Uber</span>
                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Achievement Score</h3>
                <p className="text-2xl font-bold text-[#CCFF00]">{score}</p>
              </div>
              <div className="space-y-2 mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Achievements</h3>
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center">
                    <Checkbox
                      id={achievement.id}
                      checked={achievement.completed}
                      onCheckedChange={() => toggleAchievement(achievement.id)}
                      className="mr-2"
                    />
                    <label
                      htmlFor={achievement.id}
                      className={`text-sm ${achievement.completed ? "line-through text-zinc-500" : "text-white"}`}
                    >
                      {achievement.text}
                    </label>
                  </div>
                ))}
              </div>
              <div className="mb-6">
                <div className="flex">
                  <Input
                    type="text"
                    placeholder="Add new achievement"
                    value={newAchievement}
                    onChange={(e) => setNewAchievement(e.target.value)}
                    className="flex-grow mr-2 bg-zinc-800 border-zinc-700 text-white"
                  />
                  <Button onClick={addNewAchievement} className="bg-[#CCFF00] text-black hover:bg-[#CCFF00]/90">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Learning Resources</h3>
                <ul className="space-y-2">
                  {learningResources.map((resource, index) => (
                    <li key={index}>
                      <Button variant="link" className="text-[#CCFF00] p-0 h-auto text-left">
                        {resource.title} <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>
      </TabsContent>
    </Tabs>
  )
}

