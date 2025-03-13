"use client"

import { useState } from "react"
import { SignUp } from "../components/SignUp"
import { Login } from "../components/Login"
import { Dashboard } from "../components/Dashboard"
import { WelcomeScreens } from "../components/WelcomeScreens"
import { getRandomProfileImage } from "../utils/constants"
import type { UserRole } from "../lib/auth"
import { useRouter } from "next/navigation"
import Layout from "../components/shared/Layout/Layout"
import { useNotification } from "@/components/Notification"
import { LoadingScreen } from "../components/LoadingScreen"
import ErrorBoundary from "../components/ErrorBoundary"

type AuthState = "welcome" | "login" | "signUp" | "dashboard"

interface UserProfile {
  name: string
  avatar: string
  rating?: number
}

export default function Home() {
  const [authState, setAuthState] = useState<AuthState>("welcome")
  const [userType, setUserType] = useState<UserRole | null>(null)
  const [userData, setUserData] = useState<UserProfile>({
    name: "",
    avatar: "",
    rating: 0,
  })
  const [availableRoles, setAvailableRoles] = useState<UserRole[]>([])
  const router = useRouter()
  const { Notification, showNotification } = useNotification()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = (type: UserRole, username: string, email: string) => {
    setIsLoading(true)
    console.log("Sign in successful:", { type, username, email })
    setTimeout(() => {
      setUserType(type)
      setAuthState("dashboard")
      setAvailableRoles([type])
      setUserData({
        name: username,
        avatar: getRandomProfileImage(),
        rating: type === "driver" ? 4.5 : undefined,
      })
      setIsLoading(false)
    }, 1500) // Simulate loading for 1.5 seconds
  }

  const handleSignUp = (type: UserRole, username: string, email: string) => {
    setIsLoading(true)
    console.log("Sign up successful:", { type, username, email })
    setTimeout(() => {
      setUserType(type)
      setAuthState("dashboard")
      setAvailableRoles([type])
      setUserData({
        name: username,
        avatar: getRandomProfileImage(),
        rating: type === "driver" ? 5 : undefined,
      })
      setIsLoading(false)
    }, 1500) // Simulate loading for 1.5 seconds
  }

  const handleLogout = () => {
    setAuthState("welcome")
    setUserType(null)
    setUserData({
      name: "",
      avatar: "",
      rating: 0,
    })
    setAvailableRoles([])
    router.push("/")
  }

  const handleRoleSwitch = (newRole: UserRole) => {
    setUserType(newRole)
  }

  const handleRoleSignup = (newRole: UserRole) => {
    setAvailableRoles((prev) => [...prev, newRole])
    setUserType(newRole)
  }

  const renderContent = () => {
    if (authState === "welcome") {
      return <WelcomeScreens onComplete={() => setAuthState("login")} />
    }

    if (authState === "login") {
      return <Login onComplete={handleSignIn} onSignUpClick={() => setAuthState("signUp")} />
    }

    if (authState === "signUp") {
      return <SignUp onSignUp={handleSignUp} onSignInClick={() => setAuthState("login")} />
    }

    if (authState === "dashboard" && userType) {
      return (
        <Layout onLogout={handleLogout}>
          <ErrorBoundary>
            <Dashboard
              userType={userType}
              availableRoles={availableRoles}
              onLogout={handleLogout}
              onRoleSwitch={handleRoleSwitch}
              onRoleSignup={handleRoleSignup}
              userProfile={userData}
            />
          </ErrorBoundary>
        </Layout>
      )
    }

    return null
  }

  return (
    <>
      {isLoading && <LoadingScreen />}
      {renderContent()}
      <Notification message="" type="info" />
    </>
  )
}

