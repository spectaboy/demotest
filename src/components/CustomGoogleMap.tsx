"use client"

import { useEffect, useState, useCallback } from "react"
import { GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api"

interface Location {
  lat?: number
  lng?: number
  address?: string
}

interface CustomGoogleMapProps {
  pickupLocation?: Location | null
  dropoffLocation?: Location | null
  onRouteUpdate?: (distance: string, duration: string) => void
  isLoaded: boolean
}

export function CustomGoogleMap({ pickupLocation, dropoffLocation, onRouteUpdate, isLoaded }: CustomGoogleMapProps) {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({ lat: 51.0447, lng: -114.0719 }) // Default to Calgary

  const geocodeAddress = useCallback(async (address: string): Promise<google.maps.LatLngLiteral> => {
    if (!window.google) throw new Error("Google Maps not loaded")
    const geocoder = new window.google.maps.Geocoder()
    const result = await geocoder.geocode({ address })
    if (result.results[0]) {
      return result.results[0].geometry.location.toJSON()
    }
    throw new Error("Unable to geocode address")
  }, [])

  const calculateRoute = useCallback(async () => {
    if (!pickupLocation || !dropoffLocation || !isLoaded || !window.google) return

    const directionsService = new window.google.maps.DirectionsService()

    try {
      const origin =
        pickupLocation.lat && pickupLocation.lng
          ? { lat: pickupLocation.lat, lng: pickupLocation.lng }
          : await geocodeAddress(pickupLocation.address!)

      const destination =
        dropoffLocation.lat && dropoffLocation.lng
          ? { lat: dropoffLocation.lat, lng: dropoffLocation.lng }
          : await geocodeAddress(dropoffLocation.address!)

      const result = await directionsService.route({
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      })

      setDirections(result)
      setCenter(origin) // Set the center to the origin (pickup location)

      if (onRouteUpdate && result.routes[0]?.legs[0]) {
        const { distance, duration } = result.routes[0].legs[0]
        onRouteUpdate(distance?.text || "", duration?.text || "")
      }
    } catch (err) {
      console.error("Error calculating route:", err)
      setError("Could not calculate route between these locations")
    }
  }, [pickupLocation, dropoffLocation, onRouteUpdate, isLoaded, geocodeAddress])

  useEffect(() => {
    if (!window.google) {
      setError("Google Maps not loaded")
      return
    }
    if (isLoaded && pickupLocation && dropoffLocation) {
      calculateRoute()
    } else if (pickupLocation && pickupLocation.lat && pickupLocation.lng) {
      setCenter({ lat: pickupLocation.lat, lng: pickupLocation.lng })
    } else if (dropoffLocation && dropoffLocation.lat && dropoffLocation.lng) {
      setCenter({ lat: dropoffLocation.lat, lng: dropoffLocation.lng })
    }
  }, [isLoaded, pickupLocation, dropoffLocation, calculateRoute])

  if (!isLoaded) {
    return (
      <div className="w-full h-[300px] rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900 flex items-center justify-center">
        <div className="text-zinc-400">Loading map...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-[300px] rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900 flex flex-col items-center justify-center p-4">
        <div className="text-red-500 mb-2">Failed to load route</div>
        <div className="text-zinc-400 text-sm text-center">{error}</div>
      </div>
    )
  }

  return (
    <div className="w-full h-[300px] rounded-lg overflow-hidden border border-zinc-800">
      <GoogleMap
        zoom={13}
        center={center}
        mapContainerClassName="w-full h-full"
        options={{
          disableDefaultUI: false,
          clickableIcons: true,
          scrollwheel: true,
          styles: [
            {
              featureType: "all",
              elementType: "geometry",
              stylers: [{ color: "#242f3e" }],
            },
            {
              featureType: "all",
              elementType: "labels.text.stroke",
              stylers: [{ lightness: -80 }],
            },
            {
              featureType: "administrative",
              elementType: "labels.text.fill",
              stylers: [{ color: "#746855" }],
            },
            {
              featureType: "road",
              elementType: "geometry.stroke",
              stylers: [{ color: "#1f2835" }],
            },
            {
              featureType: "road",
              elementType: "labels.text.fill",
              stylers: [{ color: "#9ca5b3" }],
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#17263c" }],
            },
          ],
        }}
        onLoad={(map) => setMap(map)}
      >
        {pickupLocation && pickupLocation.lat !== undefined && pickupLocation.lng !== undefined && (
          <Marker position={{ lat: pickupLocation.lat, lng: pickupLocation.lng }} />
        )}
        {dropoffLocation && dropoffLocation.lat !== undefined && dropoffLocation.lng !== undefined && (
          <Marker position={{ lat: dropoffLocation.lat, lng: dropoffLocation.lng }} />
        )}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </div>
  )
}

export default CustomGoogleMap

