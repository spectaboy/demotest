"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"
import { getRandomProfileImage } from "@/utils/constants"

interface ProfileSettingsProps {
  userProfile: {
    name: string
    avatar: string
    email?: string
    phone?: string
    bio?: string
  }
  onUpdateProfile: (updatedProfile: any) => void
}

export function ProfileSettings({ userProfile, onUpdateProfile }: ProfileSettingsProps) {
  const [profile, setProfile] = useState({
    name: userProfile.name || "",
    email: userProfile.email || "",
    phone: userProfile.phone || "",
    bio: userProfile.bio || "",
    avatar: userProfile.avatar || getRandomProfileImage(),
  })

  const [isEditing, setIsEditing] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    onUpdateProfile(profile)
    setIsEditing(false)
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    })
  }

  const handleCancel = () => {
    setProfile({
      name: userProfile.name || "",
      email: userProfile.email || "",
      phone: userProfile.phone || "",
      bio: userProfile.bio || "",
      avatar: userProfile.avatar || getRandomProfileImage(),
    })
    setIsEditing(false)
  }

  const handleNewAvatar = () => {
    setProfile((prev) => ({ ...prev, avatar: getRandomProfileImage() }))
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-white">Profile Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile.avatar} alt={profile.name} />
            <AvatarFallback>{profile.name ? profile.name[0] : "U"}</AvatarFallback>
          </Avatar>
          {isEditing && (
            <Button variant="outline" className="bg-zinc-800 text-white hover:bg-zinc-700" onClick={handleNewAvatar}>
              Change Avatar
            </Button>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              value={profile.name}
              onChange={handleChange}
              disabled={!isEditing}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleChange}
              disabled={!isEditing}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white">
              Phone
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={profile.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-white">
              Bio
            </Label>
            <Input
              id="bio"
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              disabled={!isEditing}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button className="bg-[#CCFF00] text-black hover:bg-[#CCFF00]/90" onClick={handleSave}>
                Save Changes
              </Button>
            </>
          ) : (
            <Button className="bg-[#CCFF00] text-black hover:bg-[#CCFF00]/90" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

