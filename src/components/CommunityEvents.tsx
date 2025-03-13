"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, Users, Dumbbell, BookOpen, Car } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { LocationSearch } from "./LocationSearch"
import { CustomGoogleMap } from "./CustomGoogleMap"
import { useLoadScript } from "@react-google-maps/api"
import type { UserRole } from "@/lib/auth"
import { useEventContext } from "../contexts/EventContext"

interface Location {
  lat: number
  lng: number
  address: string
}

interface CommunityEventsProps {
  userRole: UserRole
  userName: string
}

export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: Location
  type: "workout" | "study-session" | "campus-event" | "intramurals" | "drop-in" | "club-events" | "other"
  participants: { drivers: number; riders: number }
}

export function CommunityEvents({ userRole, userName }: CommunityEventsProps) {
  const { events, addEvent, updateEvent } = useEventContext()
  const [newEvent, setNewEvent] = useState<Omit<Event, "id" | "participants">>({
    title: "",
    description: "",
    date: "",
    time: "",
    location: { lat: 0, lng: 0, address: "" },
    type: "other",
  })
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  })

  const handleCreateEvent = () => {
    if (userRole !== "organizer") {
      toast({
        title: "Permission Denied",
        description: "Only organizers can create events.",
        variant: "destructive",
      })
      return
    }

    addEvent(newEvent)
    setNewEvent({
      title: "",
      description: "",
      date: "",
      time: "",
      location: { lat: 0, lng: 0, address: "" },
      type: "other",
    })
    toast({
      title: "Event Created",
      description: "Your event has been successfully created.",
    })
  }

  const handleJoinEvent = (eventId: string, role: "driver" | "rider") => {
    if (userRole === "organizer") {
      toast({
        title: "Action Not Allowed",
        description: "Organizers cannot join events.",
        variant: "destructive",
      })
      return
    }

    if (role !== userRole) {
      toast({
        title: "Permission Denied",
        description: `You can only join events as a ${userRole}.`,
        variant: "destructive",
      })
      return
    }

    const event = events.find((e) => e.id === eventId)
    if (event) {
      updateEvent(eventId, {
        participants: {
          ...event.participants,
          [role === "driver" ? "drivers" : "riders"]: event.participants[role === "driver" ? "drivers" : "riders"] + 1,
        },
      })
      toast({
        title: "Event Joined",
        description: `You have joined this event as a ${role}.`,
      })
    }
  }

  const getEventIcon = (type: Event["type"]) => {
    switch (type) {
      case "workout":
        return <Dumbbell className="h-5 w-5 text-[#CCFF00]" />
      case "study-session":
        return <BookOpen className="h-5 w-5 text-[#CCFF00]" />
      case "campus-event":
        return <Users className="h-5 w-5 text-[#CCFF00]" />
      case "intramurals":
        return <Dumbbell className="h-5 w-5 text-[#CCFF00]" />
      case "drop-in":
        return <Clock className="h-5 w-5 text-[#CCFF00]" />
      case "club-events":
        return <Users className="h-5 w-5 text-[#CCFF00]" />
      default:
        return <Calendar className="h-5 w-5 text-[#CCFF00]" />
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Community Events</CardTitle>
          <CardDescription className="text-zinc-400">
            View community events and join as a {userRole === "organizer" ? "organizer" : userRole}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upcoming">
            <TabsList className="bg-zinc-800">
              <TabsTrigger
                value="upcoming"
                className="text-white data-[state=active]:bg-[#CCFF00] data-[state=active]:text-black"
              >
                Upcoming Events
              </TabsTrigger>
              {userRole === "organizer" && (
                <TabsTrigger
                  value="create"
                  className="text-white data-[state=active]:bg-[#CCFF00] data-[state=active]:text-black"
                >
                  Create Event
                </TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="upcoming">
              <div className="space-y-4">
                {events.length === 0 ? (
                  <p className="text-zinc-400">No events have been created yet.</p>
                ) : (
                  events.map((event) => (
                    <Card key={event.id} className="bg-zinc-800 border-zinc-700">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getEventIcon(event.type)}
                            <CardTitle className="text-white">{event.title}</CardTitle>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-zinc-400">
                            <Users className="h-4 w-4" />
                            <span>{event.participants.drivers + event.participants.riders} joined</span>
                          </div>
                        </div>
                        <CardDescription className="text-zinc-400">{event.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center text-sm text-zinc-400">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location.address}</span>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <div className="flex space-x-4 text-sm text-zinc-400">
                            <div className="flex items-center space-x-1">
                              <Car className="h-4 w-4" />
                              <span>{event.participants.drivers} drivers</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>{event.participants.riders} riders</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              className="bg-zinc-700 text-white hover:bg-zinc-600"
                              onClick={() => setSelectedEvent(event)}
                            >
                              View Map
                            </Button>
                            {userRole !== "organizer" && (
                              <Button
                                size="sm"
                                className={`${
                                  userRole === "driver" ? "bg-[#CCFF00] text-black" : "bg-zinc-700 text-white"
                                } hover:bg-[#CCFF00]/90`}
                                onClick={() => handleJoinEvent(event.id, userRole)}
                              >
                                {userRole === "driver" && <Car className="h-4 w-4 mr-2" />}
                                Join as {userRole}
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
            {userRole === "organizer" && (
              <TabsContent value="create">
                <Card className="bg-zinc-800 border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-white">Create a New Event</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-white">
                          Event Title
                        </Label>
                        <Input
                          id="title"
                          value={newEvent.title}
                          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                          className="bg-zinc-700 border-zinc-600 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-white">
                          Description
                        </Label>
                        <Input
                          id="description"
                          value={newEvent.description}
                          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                          className="bg-zinc-700 border-zinc-600 text-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="date" className="text-white">
                            Date
                          </Label>
                          <div className="relative">
                            <Input
                              id="date"
                              type="date"
                              value={newEvent.date}
                              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                              className="w-full bg-zinc-700 border-zinc-600 text-white pl-10"
                            />
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#CCFF00]" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="time" className="text-white">
                            Time
                          </Label>
                          <div className="relative">
                            <Input
                              id="time"
                              type="time"
                              value={newEvent.time}
                              onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                              className="w-full bg-zinc-700 border-zinc-600 text-white pl-10"
                            />
                            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#CCFF00]" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-white">
                          Location
                        </Label>
                        <LocationSearch
                          placeholder="Enter event location"
                          onLocationSelect={(location) => setNewEvent({ ...newEvent, location })}
                          isLoaded={isLoaded}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="type" className="text-white">
                          Event Type
                        </Label>
                        <select
                          id="type"
                          value={newEvent.type}
                          onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as Event["type"] })}
                          className="w-full bg-zinc-700 border-zinc-600 text-white rounded-md"
                        >
                          <option value="workout">Workout</option>
                          <option value="study-session">Study Session</option>
                          <option value="campus-event">Campus Event</option>
                          <option value="intramurals">Intramurals</option>
                          <option value="drop-in">Drop-in</option>
                          <option value="club-events">Club Events</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <Button
                        type="button"
                        onClick={handleCreateEvent}
                        className="w-full bg-[#CCFF00] text-black hover:bg-[#CCFF00]/90"
                      >
                        Create Event
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
      {selectedEvent && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Event Location</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomGoogleMap pickupLocation={selectedEvent.location} isLoaded={isLoaded} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

