"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Car, Calendar, Clock, MessageCircle } from "lucide-react"
import { LocationSearch } from "./LocationSearch"
import { CustomGoogleMap } from "./CustomGoogleMap"
import { rideService, type Ride } from "@/services/rideService"
import { format, parseISO } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { chatService } from "@/services/chatService"
import { toast } from "@/components/ui/use-toast"

interface DriverDashboardProps {
  userProfile: {
    name: string
    avatar: string
  }
  isLoaded: boolean
}

export function DriverDashboard({ userProfile, isLoaded }: DriverDashboardProps) {
  const [pickupLocation, setPickupLocation] = useState<{ lat: number; lng: number; address: string } | null>(null)
  const [dropoffLocation, setDropoffLocation] = useState<{ lat: number; lng: number; address: string } | null>(null)
  const [rideDate, setRideDate] = useState("")
  const [rideTime, setRideTime] = useState("")
  const [availableSeats, setAvailableSeats] = useState("1")
  const [rideRequests, setRideRequests] = useState<Ride[]>([])
  const [offeredRides, setOfferedRides] = useState<Ride[]>([])
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null)

  useEffect(() => {
    const fetchData = () => {
      setRideRequests(rideService.getRideRequests())
      setOfferedRides(rideService.getAvailableRides().filter((ride) => ride.driver === userProfile.name))
    }

    fetchData()
    const interval = setInterval(fetchData, 5000)

    return () => clearInterval(interval)
  }, [userProfile.name])

  const handleOfferRide = () => {
    if (!pickupLocation || !dropoffLocation || !rideDate || !rideTime) {
      return
    }
    const newRide = {
      from: pickupLocation.address,
      to: dropoffLocation.address,
      date: rideDate,
      time: rideTime,
      seats: Number.parseInt(availableSeats),
      driver: userProfile.name,
    }
    rideService.offerRide(newRide)
    setPickupLocation(null)
    setDropoffLocation(null)
    setRideDate("")
    setRideTime("")
    setAvailableSeats("1")
    setOfferedRides(rideService.getAvailableRides().filter((ride) => ride.driver === userProfile.name))
    setSelectedRide({ ...newRide, id: Date.now().toString(), status: "offered" })
  }

  const handleAcceptRideRequest = (ride: Ride) => {
    rideService.acceptRide(ride.id, userProfile.name)
    setRideRequests(rideService.getRideRequests())
    setSelectedRide(ride)
  }

  const startChatWithRider = (riderName: string) => {
    if (!riderName) return

    // Create or get a thread between the driver and rider
    const thread = chatService.getOrCreateThreadForUsers(userProfile.name, riderName)

    // Send an initial message
    chatService.sendMessage(
      thread.id,
      userProfile.name,
      `Hi! I'm your driver for the ride from ${selectedRide?.from} to ${selectedRide?.to}.`,
    )

    // Show toast notification
    toast({
      title: "Chat Started",
      description: `You can now chat with ${riderName} about this ride.`,
    })
  }

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold text-white mb-6">Offer a Ride</h2>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="block text-sm text-zinc-400">Departure</label>
              <LocationSearch
                placeholder="Enter departure location"
                onLocationSelect={setPickupLocation}
                isLoaded={isLoaded}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm text-zinc-400">Destination</label>
              <LocationSearch
                placeholder="Enter destination"
                onLocationSelect={setDropoffLocation}
                isLoaded={isLoaded}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm text-zinc-400">Date</label>
              <div className="relative">
                <Input
                  type="date"
                  value={rideDate}
                  onChange={(e) => setRideDate(e.target.value)}
                  className="w-full bg-zinc-800 border-zinc-700 text-white hover:border-[#CCFF00] focus:border-[#CCFF00] transition-colors pl-10"
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#CCFF00]" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm text-zinc-400">Time</label>
              <div className="relative">
                <Input
                  type="time"
                  value={rideTime}
                  onChange={(e) => setRideTime(e.target.value)}
                  className="w-full bg-zinc-800 border-zinc-700 text-white hover:border-[#CCFF00] focus:border-[#CCFF00] transition-colors pl-10"
                />
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#CCFF00]" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm text-zinc-400">Available Seats</label>
              <div className="relative">
                <Input
                  type="number"
                  min="1"
                  max="8"
                  value={availableSeats}
                  onChange={(e) => setAvailableSeats(e.target.value)}
                  className="w-full bg-zinc-800 border-zinc-700 text-white pl-10"
                />
                <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#CCFF00]" />
              </div>
            </div>
            <Button className="w-full bg-[#CCFF00] text-black hover:bg-[#CCFF00]/90" onClick={handleOfferRide}>
              <Car className="mr-2 h-4 w-4" /> Offer Ride
            </Button>
          </CardContent>
        </Card>
      </section>

      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-zinc-800">
          <TabsTrigger
            value="requests"
            className="text-white data-[state=active]:bg-[#CCFF00] data-[state=active]:text-black"
          >
            Ride Requests
          </TabsTrigger>
          <TabsTrigger
            value="your-rides"
            className="text-white data-[state=active]:bg-[#CCFF00] data-[state=active]:text-black"
          >
            Your Rides
          </TabsTrigger>
        </TabsList>
        <TabsContent value="requests">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              {rideRequests.length === 0 ? (
                <p className="text-zinc-400">No ride requests at the moment.</p>
              ) : (
                rideRequests.map((ride) => (
                  <div key={ride.id} className="mb-4 last:mb-0">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-white">
                          {ride.from} to {ride.to}
                        </h3>
                        <p className="text-zinc-400">Rider: {ride.rider}</p>
                        <p className="text-sm text-zinc-500">{format(parseISO(`${ride.date}T${ride.time}`), "PPpp")}</p>
                      </div>
                      <Button
                        className="bg-[#CCFF00] text-black hover:bg-[#CCFF00]/90"
                        onClick={() => handleAcceptRideRequest(ride)}
                      >
                        Accept Request
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="your-rides">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              {offeredRides.length === 0 ? (
                <p className="text-zinc-400">You haven't offered any rides yet.</p>
              ) : (
                offeredRides.map((ride) => (
                  <div key={ride.id} className="mb-4 last:mb-0">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-white">
                          {ride.from} to {ride.to}
                        </h3>
                        <p className="text-sm text-zinc-500">{format(parseISO(`${ride.date}T${ride.time}`), "PPpp")}</p>
                        <p className="text-zinc-400">Available Seats: {ride.seats}</p>
                      </div>
                      <Button
                        className="bg-[#CCFF00] text-black hover:bg-[#CCFF00]/90"
                        onClick={() => setSelectedRide(ride)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
                {selectedRide.rider && <p className="text-zinc-400">Rider: {selectedRide.rider}</p>}
              </div>
              <CustomGoogleMap
                pickupLocation={{ address: selectedRide.from }}
                dropoffLocation={{ address: selectedRide.to }}
                isLoaded={isLoaded}
              />
              {selectedRide && selectedRide.rider && (
                <Button
                  className="mt-4 bg-[#CCFF00] text-black hover:bg-[#CCFF00]/90"
                  onClick={() => startChatWithRider(selectedRide.rider!)}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Chat with Rider
                </Button>
              )}
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  )
}

