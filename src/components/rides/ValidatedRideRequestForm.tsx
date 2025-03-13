"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, MapPin } from "lucide-react"
import { LocationSearch } from "../LocationSearch"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { rideService } from "@/services/rideService"

interface ValidatedRideRequestFormProps {
  userProfile: {
    name: string
    avatar: string
  }
  isLoaded: boolean
  onRideRequested: (ride: any) => void
}

const formSchema = z.object({
  from: z.string().min(3, { message: "Pickup location is required" }),
  to: z.string().min(3, { message: "Dropoff location is required" }),
  date: z.string().min(1, { message: "Date is required" }),
  time: z.string().min(1, { message: "Time is required" }),
})

export function ValidatedRideRequestForm({ userProfile, isLoaded, onRideRequested }: ValidatedRideRequestFormProps) {
  const [pickupLocation, setPickupLocation] = useState<{ lat: number; lng: number; address: string } | null>(null)
  const [dropoffLocation, setDropoffLocation] = useState<{ lat: number; lng: number; address: string } | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      from: "",
      to: "",
      date: "",
      time: "",
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const newRide = {
      from: values.from,
      to: values.to,
      date: values.date,
      time: values.time,
      seats: 1,
      rider: userProfile.name,
    }

    rideService.requestRide(newRide)
    onRideRequested({
      ...newRide,
      id: Date.now().toString(),
      status: "requested",
    })

    form.reset()
  }

  const handlePickupLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setPickupLocation(location)
    form.setValue("from", location.address)
  }

  const handleDropoffLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setDropoffLocation(location)
    form.setValue("to", location.address)
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="from"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-white">Pickup Location</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <LocationSearch
                        placeholder="Enter pickup location"
                        onLocationSelect={handlePickupLocationSelect}
                        isLoaded={isLoaded}
                        value={field.value}
                      />
                      <Input type="hidden" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="to"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-white">Dropoff Location</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <LocationSearch
                        placeholder="Enter dropoff location"
                        onLocationSelect={handleDropoffLocationSelect}
                        isLoaded={isLoaded}
                        value={field.value}
                      />
                      <Input type="hidden" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-white">Date</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type="date" className="w-full bg-zinc-800 border-zinc-700 text-white pl-10" {...field} />
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#CCFF00]" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-white">Time</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type="time" className="w-full bg-zinc-800 border-zinc-700 text-white pl-10" {...field} />
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#CCFF00]" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-[#CCFF00] text-black hover:bg-[#CCFF00]/90">
              <MapPin className="mr-2 h-4 w-4" /> Request Ride
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

