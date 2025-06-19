"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { authSessionManager } from "@/lib/auth-session-manager"

interface User {
  id: string
  name: string | null
  email: string | null
  image: string | null
  firstName: string
  lastName: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string; requiresVerification?: boolean; email?: string }>
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
  forceAuthCheck: () => Promise<boolean>
}

const SimpleAuthContext = createContext<AuthContextType | undefined>(undefined)

// Safe user creation function
function createSafeUser(userData: any): User | null {
  if (!userData) return null

  try {
    const name = userData.name || userData.firstName || "User"
    const nameParts = name.split(" ").filter(Boolean)

    return {
      id: userData.id || `user_${Date.now()}`,
      name: name || null,
      email: userData.email || null,
      image: userData.image || userData.avatar || null,
      firstName: nameParts[0] || "User",
      lastName: nameParts.slice(1).join(" ") || "",
    }
  } catch (error) {
    console.error("Error creating safe user:", error)
    return null
  }
}

export function SimpleAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)
  const mountedRef = useRef(true)
  const router = useRouter()
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Handle session updates from auth manager
  const handleSessionUpdate = useCallback((session: any) => {
    if (!mountedRef.current) return

    try {
      if (session && session.user) {
        const safeUser = createSafeUser(session.user)
        setUser(safeUser)
        console.log("✅ Session updated from auth manager:", safeUser?.email)
      } else {
        setUser(null)
        console.log("🔄 Session cleared from auth manager")
      }
    } catch (error) {
      console.error("❌ Error handling session update:", error)
    }
  }, [])

  // Check for existing session on mount
  const checkSession = useCallback(async () => {
    if (!mountedRef.current) return

    try {
      console.log("🔍 Checking existing session...")
      setIsLoading(true)

      // Initialize auth session manager
      await authSessionManager.initialize()

      // Check for existing session
      const session = authSessionManager.getSession()
      if (session) {
        handleSessionUpdate(session)
        return
      }

      console.log("⚠️ No existing session found")
    } catch (error) {
      console.error("❌ Error checking session:", error)
    } finally {
      if (mountedRef.current) {
        setIsLoading(false)
        setInitialized(true)
      }
    }
  }, [handleSessionUpdate])

  // Sign in function
  const signIn = useCallback(
    async (email: string, password: string) => {
      if (!mountedRef.current) return { success: false, error: "Component unmounted" }

      try {
        console.log("🔑 Signing in user:", email)
        setIsLoading(true)

        const response = await fetch("/api/simple-auth/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        })

        const data = await response.json()

        if (response.ok && data.user) {
          // Check if user is verified
          if (data.requiresVerification) {
            return {
              success: false,
              error: "Please verify your email address before logging in",
              requiresVerification: true,
              email: email,
            }
          }

          // Store simple auth state immediately
          localStorage.setItem("isAuthenticated", "true")
          localStorage.setItem("userEmail", email)
          console.log("✅ Stored auth state in localStorage")

          // Create session in auth manager
          const sessionData = await authSessionManager.createSession(data.user)
          handleSessionUpdate(sessionData)

          console.log("✅ Sign in successful:", email)
          return { success: true }
        } else {
          console.log("❌ Sign in failed:", data.error)
          return { success: false, error: data.error || "Sign in failed" }
        }
      } catch (error) {
        console.error("❌ Sign in error:", error)
        return { success: false, error: "Network error occurred" }
      } finally {
        if (mountedRef.current) {
          setIsLoading(false)
        }
      }
    },
    [handleSessionUpdate],
  )

  // Sign out function
  const signOut = useCallback(async () => {
    if (!mountedRef.current) return

    try {
      console.log("🚪 Signing out user...")
      setIsLoading(true)

      // Sign out from auth manager
      await authSessionManager.signOut()

      // Clear simple auth state
      localStorage.removeItem("isAuthenticated")
      localStorage.removeItem("userEmail")

      if (mountedRef.current) {
        setUser(null)
        console.log("✅ Sign out successful")
        router.push("/")
      }
    } catch (error) {
      console.error("❌ Sign out error:", error)
    } finally {
      if (mountedRef.current) {
        setIsLoading(false)
      }
    }
  }, [router])

  // Refresh session function
  const refreshSession = useCallback(async () => {
    if (!mountedRef.current) return

    try {
      console.log("🔄 Refreshing session...")
      const session = await authSessionManager.refreshSession()
      handleSessionUpdate(session)
    } catch (error) {
      console.error("❌ Error refreshing session:", error)
    }
  }, [handleSessionUpdate])

  // Force auth check function
  const forceAuthCheck = useCallback(async () => {
    if (!mountedRef.current) return false

    try {
      console.log("🔍 Force auth check...")
      const isAuth = await authSessionManager.forceAuthCheck()
      const session = authSessionManager.getSession()
      handleSessionUpdate(session)
      return isAuth
    } catch (error) {
      console.error("❌ Error in force auth check:", error)
      return false
    }
  }, [handleSessionUpdate])

  // Initialize on mount with timeout
  useEffect(() => {
    if (!initialized) {
      // Set a timeout to prevent infinite loading
      initTimeoutRef.current = setTimeout(() => {
        if (!initialized && mountedRef.current) {
          console.warn("⚠️ Auth initialization timeout, forcing completion")
          setIsLoading(false)
          setInitialized(true)
        }
      }, 10000) // 10 second timeout

      checkSession()
    }

    return () => {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current)
      }
    }
  }, [initialized, checkSession])

  // Subscribe to auth manager updates
  useEffect(() => {
    const unsubscribe = authSessionManager.subscribe(handleSessionUpdate)
    return unsubscribe
  }, [handleSessionUpdate])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current)
      }
    }
  }, [])

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signOut,
    refreshSession,
    forceAuthCheck,
  }

  console.log(
    `🎯 SimpleAuth - Auth: ${!!user}, Loading: ${isLoading}, Init: ${initialized}, User: ${user?.email || "none"}`,
  )

  return <SimpleAuthContext.Provider value={value}>{children}</SimpleAuthContext.Provider>
}

export function useAuth() {
  const context = useContext(SimpleAuthContext)
  if (context === undefined) {
    console.warn("⚠️ useAuth called outside of SimpleAuthProvider")
    return {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      signIn: async () => ({ success: false, error: "Auth not available" }),
      signOut: async () => {},
      refreshSession: async () => {},
      forceAuthCheck: async () => false,
    }
  }
  return context
}

export default SimpleAuthProvider
