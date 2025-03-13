"use client"

import type React from "react"
import { createContext, useState, useContext, type ReactNode } from "react"

interface Location {
  lat: number
  lng: number
  address: string
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

interface EventContextType {
  events: Event[]
  addEvent: (event: Omit<Event, "id" | "participants">) => void
  updateEvent: (eventId: string, updates: Partial<Event>) => void
}

const EventContext = createContext<EventContextType | undefined>(undefined)

export const useEventContext = () => {
  const context = useContext(EventContext)
  if (!context) {
    throw new Error("useEventContext must be used within an EventProvider")
  }
  return context
}

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([])

  const addEvent = (event: Omit<Event, "id" | "participants">) => {
    const newEvent: Event = {
      ...event,
      id: Date.now().toString(),
      participants: { drivers: 0, riders: 0 },
    }
    setEvents((prevEvents) => [...prevEvents, newEvent])
  }

  const updateEvent = (eventId: string, updates: Partial<Event>) => {
    setEvents((prevEvents) => prevEvents.map((event) => (event.id === eventId ? { ...event, ...updates } : event)))
  }

  return <EventContext.Provider value={{ events, addEvent, updateEvent }}>{children}</EventContext.Provider>
}

