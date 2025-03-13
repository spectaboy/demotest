import { initializeApp, getApps } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getAnalytics } from "firebase/analytics"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase only if it hasn't been initialized already
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)

// Initialize Analytics
let analytics
if (typeof window !== "undefined") {
  analytics = getAnalytics(app)
}
export { analytics }

// Debug logging
if (process.env.NODE_ENV === "development") {
  console.log("Firebase initialized with config:", {
    apiKey: firebaseConfig.apiKey ? "present" : "missing",
    authDomain: firebaseConfig.authDomain ? "present" : "missing",
    projectId: firebaseConfig.projectId ? "present" : "missing",
    storageBucket: firebaseConfig.storageBucket ? "present" : "missing",
    messagingSenderId: firebaseConfig.messagingSenderId ? "present" : "missing",
    appId: firebaseConfig.appId ? "present" : "missing",
    measurementId: firebaseConfig.measurementId ? "present" : "missing",
  })
}

