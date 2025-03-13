import { toast } from "@/components/ui/use-toast"

export interface Ride {
  id: string
  from: string
  to: string
  date: string
  time: string
  seats: number
  driver?: string
  rider?: string
  status: "requested" | "offered" | "accepted" | "completed"
}

class RideService {
  private rides: Ride[] = []

  requestRide(ride: Omit<Ride, "id" | "status">): void {
    const newRide: Ride = {
      ...ride,
      id: Date.now().toString(),
      status: "requested",
    }
    this.rides.push(newRide)
    toast({
      title: "Ride Requested",
      description: "Your ride request has been submitted.",
    })
  }

  offerRide(ride: Omit<Ride, "id" | "status">): void {
    const newRide: Ride = {
      ...ride,
      id: Date.now().toString(),
      status: "offered",
    }
    this.rides.push(newRide)
    toast({
      title: "Ride Offered",
      description: "Your ride offer has been submitted.",
    })
  }

  getAvailableRides(): Ride[] {
    return this.rides.filter((ride) => ride.status === "offered")
  }

  getRideRequests(): Ride[] {
    return this.rides.filter((ride) => ride.status === "requested")
  }

  acceptRide(rideId: string, driverName: string): void {
    const ride = this.rides.find((r) => r.id === rideId)
    if (ride) {
      ride.status = "accepted"
      ride.driver = driverName
      toast({
        title: "Ride Accepted",
        description: "You have accepted the ride request.",
      })
    }
  }

  joinRide(rideId: string, riderName: string): void {
    const ride = this.rides.find((r) => r.id === rideId)
    if (ride) {
      ride.rider = riderName
      ride.seats -= 1
      toast({
        title: "Ride Joined",
        description: "You have joined the ride.",
      })
    }
  }
}

export const rideService = new RideService()

