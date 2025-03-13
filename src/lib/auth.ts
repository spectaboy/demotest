export type UserRole = "rider" | "driver" | "organizer"

export interface UserData {
  uid: string
  email: string | null
  name: string | null
  role?: UserRole
  createdAt: number
  lastLoginAt: number
}

// Simulated authentication functions
export const signInWithEmailPassword = async (email: string, password: string) => {
  // Simulating a sign-in process
  return new Promise<UserData>((resolve) => {
    setTimeout(() => {
      resolve({
        uid: "simulated-user-id",
        email,
        name: "Simulated User",
        role: "rider",
        createdAt: Date.now(),
        lastLoginAt: Date.now(),
      })
    }, 1000)
  })
}

export const createUser = async (email: string, password: string, role: UserRole) => {
  // Simulating user creation
  return new Promise<UserData>((resolve) => {
    setTimeout(() => {
      resolve({
        uid: "simulated-user-id",
        email,
        name: "New User",
        role,
        createdAt: Date.now(),
        lastLoginAt: Date.now(),
      })
    }, 1000)
  })
}

export const logOut = async () => {
  // Simulating logout
  return new Promise<void>((resolve) => {
    setTimeout(resolve, 500)
  })
}

export const getCurrentUser = () => {
  // Simulating getting current user
  return new Promise<UserData | null>((resolve) => {
    setTimeout(() => {
      resolve({
        uid: "simulated-user-id",
        email: "user@example.com",
        name: "Simulated User",
        role: "rider",
        createdAt: Date.now(),
        lastLoginAt: Date.now(),
      })
    }, 500)
  })
}

export const getUserData = async (uid: string): Promise<UserData | null> => {
  // Simulating fetching user data
  return new Promise<UserData | null>((resolve) => {
    setTimeout(() => {
      resolve({
        uid,
        email: "user@example.com",
        name: "Simulated User",
        role: "rider",
        createdAt: Date.now(),
        lastLoginAt: Date.now(),
      })
    }, 500)
  })
}

