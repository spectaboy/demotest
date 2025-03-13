"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Star } from "lucide-react"
import { format, parseISO, subDays } from "date-fns"

interface HistoricalRide {
  id: string
  from: string
  to: string
  date: string
  time: string
  driver?: string
  rider?: string
  status: "completed" | "cancelled"
  rating?: number
  cost?: number
}

interface RideHistoryProps {
  userType: "driver" | "rider"
  userName: string
}

export function RideHistory({ userType, userName }: RideHistoryProps) {
  const [rides, setRides] = useState<HistoricalRide[]>([])
  const [selectedRide, setSelectedRide] = useState<HistoricalRide | null>(null)

  useEffect(() => {
    // Simulate fetching ride history
    const generateMockRides = () => {
      const mockRides: HistoricalRide[] = []
      const locations = [
        { from: "University of Calgary", to: "Downtown Calgary" },
        { from: "SAIT Campus", to: "Chinook Mall" },
        { from: "Brentwood Station", to: "Market Mall" },
        { from: "Heritage Station", to: "Foothills Hospital" },
        { from: "Mount Royal University", to: "Calgary Zoo" },
      ]

      for (let i = 0; i < 10; i++) {
        const location = locations[Math.floor(Math.random() * locations.length)]
        const daysAgo = Math.floor(Math.random() * 30) + 1
        const date = format(subDays(new Date(), daysAgo), "yyyy-MM-dd")
        const hours = Math.floor(Math.random() * 24)
        const minutes = Math.floor(Math.random() * 60)
        const time = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`

        const ride: HistoricalRide = {
          id: `hist-${i}`,
          from: location.from,
          to: location.to,
          date,
          time,
          status: Math.random() > 0.2 ? "completed" : "cancelled",
          rating: Math.floor(Math.random() * 5) + 1,
          cost: Math.floor(Math.random() * 20) + 5,
        }

        if (userType === "driver") {
          ride.rider = `Rider ${i}`
        } else {
          ride.driver = `Driver ${i}`
        }

        mockRides.push(ride)
      }

      return mockRides.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`)
        const dateB = new Date(`${b.date}T${b.time}`)
        return dateB.getTime() - dateA.getTime() // Sort by date descending
      })
    }

    setRides(generateMockRides())
  }, [userType])

  const handleRateRide = (ride: HistoricalRide, rating: number) => {
    setRides(rides.map((r) => (r.id === ride.id ? { ...r, rating } : r)))
  }

  return (
    <div className="space-y-6">
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Ride History</CardTitle>
        </CardHeader>
        <CardContent>
          {rides.length === 0 ? (
            <p className="text-zinc-400">No ride history available.</p>
          ) : (
            <div className="space-y-4">
              {rides.map((ride) => (
                <Card key={ride.id} className="bg-zinc-800 border-zinc-700">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-white">
                          {ride.from} to {ride.to}
                        </h3>
                        <div className="flex items-center text-sm text-zinc-400">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{format(parseISO(ride.date), "PPP")}</span>
                          <Clock className="h-4 w-4 ml-3 mr-1" />
                          <span>{ride.time}</span>
                        </div>
                        <div className="flex items-center text-sm text-zinc-400">
                          {userType === "rider" ? <span>Driver: {ride.driver}</span> : <span>Rider: {ride.rider}</span>}
                          <span className="ml-3">Cost: ${ride.cost}</span>
                        </div>
                        <div className="flex items-center">
                          <span
                            className={`text-sm ${ride.status === "completed" ? "text-green-500" : "text-red-500"}`}
                          >
                            {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                          </span>
                          {ride.status === "completed" && (
                            <div className="ml-3 flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 cursor-pointer ${
                                    star <= (ride.rating || 0) ? "text-[#CCFF00] fill-[#CCFF00]" : "text-zinc-500"
                                  }`}
                                  onClick={() => handleRateRide(ride, star)}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="bg-zinc-700 text-white hover:bg-zinc-600"
                        onClick={() => setSelectedRide(ride)}
                      >
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedRide && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Ride Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-zinc-400">From</p>
                <p className="text-white">{selectedRide.from}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-zinc-400">To</p>
                <p className="text-white">{selectedRide.to}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-zinc-400">Date</p>
                <p className="text-white">{format(parseISO(selectedRide.date), "PPP")}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-zinc-400">Time</p>
                <p className="text-white">{selectedRide.time}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-zinc-400">{userType === "rider" ? "Driver" : "Rider"}</p>
                <p className="text-white">{userType === "rider" ? selectedRide.driver : selectedRide.rider}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-zinc-400">Status</p>
                <p className={selectedRide.status === "completed" ? "text-green-500" : "text-red-500"}>
                  {selectedRide.status.charAt(0).toUpperCase() + selectedRide.status.slice(1)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-zinc-400">Cost</p>
                <p className="text-white">${selectedRide.cost}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-zinc-400">Rating</p>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= (selectedRide.rating || 0) ? "text-[#CCFF00] fill-[#CCFF00]" : "text-zinc-500"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

