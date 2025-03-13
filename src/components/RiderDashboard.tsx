"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { CustomGoogleMap } from "./CustomGoogleMap"
import { rideService, type Ride } from "@/services/rideService"
import { format, parseISO } from "date-fns"
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

export function RiderDashboard({ userProfile, isLoaded }: RiderDashboardProps) {
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null)
  const [dropoffLocation, setDropoffLocation] = useState<Location | null>(null)
  const [availableRides, setAvailableRides] = useState<Ride[]>([])
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null)

  useEffect(() => {
    // Fetch available rides periodically
    const interval = setInterval(() => {
      setAvailableRides(rideService.getAvailableRides())
    }, 5000)

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
  }

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
    <div>
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
    </div>
  )
}

