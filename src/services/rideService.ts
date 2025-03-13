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
  status: "requested" | "offered" | "accepted"
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
    this.showToast("Ride Requested", "Your ride request has been submitted.")
  }

  offerRide(ride: Omit<Ride, "id" | "status">): void {
    const newRide: Ride = {
      ...ride,
      id: Date.now().toString(),
      status: "offered",
    }
    this.rides.push(newRide)
    this.showToast("Ride Offered", "Your ride offer has been submitted.")
  }

  getAvailableRides(): Ride[] {
    return this.rides.filter((ride) => ride.status === "offered")
  }

  getRideRequests(): Ride[] {
    return this.rides.filter((ride) => ride.status === "requested")
  }

  acceptRide(rideId: string, driverName: string): void {
    const rideIndex = this.rides.findIndex((r) => r.id === rideId)
    if (rideIndex !== -1) {
      this.rides[rideIndex] = { ...this.rides[rideIndex], status: "accepted", driver: driverName }
      this.showToast("Ride Accepted", "You have accepted the ride request.")
    }
  }

  joinRide(rideId: string, riderName: string): void {
    const ride = this.rides.find((r) => r.id === rideId)
    if (ride) {
      ride.rider = riderName
      ride.seats -= 1
      this.showToast("Ride Joined", "You have joined the ride.")
    }
  }

  private showToast(title: string, description: string): void {
    toast({
      title,
      description,
      duration: 5000,
      style: {
        background: "#333",
        color: "#fff",
        border: "1px solid #CCFF00",
      },
    })
  }
}

export const rideService = new RideService()

