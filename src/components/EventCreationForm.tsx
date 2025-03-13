"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

interface EventCreationFormProps {
  userName: string
}

const eventTypes = [
  { value: "workout", label: "Workout" },
  { value: "study-session", label: "Study Session" },
  { value: "campus-event", label: "Campus Event" },
  { value: "intramurals", label: "Intramurals" },
  { value: "drop-in", label: "Drop-in" },
  { value: "club-events", label: "Club Events" },
  { value: "other", label: "Other" },
]

export function EventCreationForm({ userName }: EventCreationFormProps) {
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    type: "workout",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEventData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setEventData((prev) => ({ ...prev, type: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the event data to your backend
    console.log("New event data:", eventData)
    toast({
      title: "Event Created",
      description: "Your new event has been successfully created.",
    })
    // Reset form after submission
    setEventData({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      type: "workout",
    })
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-white">Create a New Event</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">
              Event Title
            </Label>
            <Input
              id="title"
              name="title"
              value={eventData.title}
              onChange={handleInputChange}
              className="bg-zinc-800 border-zinc-700 text-white"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={eventData.description}
              onChange={handleInputChange}
              className="bg-zinc-800 border-zinc-700 text-white"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-white">
                Date
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={eventData.date}
                onChange={handleInputChange}
                className="bg-zinc-800 border-zinc-700 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="text-white">
                Time
              </Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={eventData.time}
                onChange={handleInputChange}
                className="bg-zinc-800 border-zinc-700 text-white"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location" className="text-white">
              Location
            </Label>
            <Input
              id="location"
              name="location"
              value={eventData.location}
              onChange={handleInputChange}
              className="bg-zinc-800 border-zinc-700 text-white"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type" className="text-white">
              Event Type
            </Label>
            <Select name="type" value={eventData.type} onValueChange={handleSelectChange}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full bg-[#CCFF00] text-black hover:bg-[#CCFF00]/90">
            Create Event
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

