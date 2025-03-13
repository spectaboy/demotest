import { initializeApp, getApps } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getAnalytics } from "firebase/analytics"

const firebaseConfig = {
  apiKey: "AIzaSyC7_2usemwpKFMg4KXZ2tLW-d-puAMcoMA",
  authDomain: "lithe-window-451020-m7.firebaseapp.com",
  projectId: "lithe-window-451020-m7",
  storageBucket: "lithe-window-451020-m7.firebasestorage.app",
  messagingSenderId: "1083170915792",
  appId: "1:1083170915792:web:5d6aa3ca977c11242825d5",
  measurementId: "G-V1ZC508JGZ",
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

