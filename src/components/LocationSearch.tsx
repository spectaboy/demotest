"use client"

import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { MapPin } from "lucide-react"

interface LocationSearchProps {
  placeholder: string
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void
  value?: string
  className?: string
  isLoaded: boolean
}

export function LocationSearch({
  placeholder,
  onLocationSelect,
  value = "",
  className = "",
  isLoaded,
}: LocationSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [inputValue, setInputValue] = useState(value)

  useEffect(() => {
    if (!inputRef.current || !isLoaded || !window.google) return

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      fields: ["formatted_address", "geometry"],
      types: ["geocode", "establishment"],
    })

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace()
      if (place.geometry?.location && place.formatted_address) {
        onLocationSelect({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          address: place.formatted_address,
        })
        setInputValue(place.formatted_address)
      }
    })

    return () => {
      if (window.google) {
        window.google.maps.event.clearInstanceListeners(autocomplete)
      }
    }
  }, [onLocationSelect, isLoaded])

  return (
    <div className="relative">
      <MapPin className="absolute left-3 top-3 h-4 w-4 text-[#CCFF00]" />
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className={`pl-10 bg-zinc-800 border-zinc-700 text-white hover:border-[#CCFF00] focus:border-[#CCFF00] transition-colors ${className}`}
      />
    </div>
  )
}

