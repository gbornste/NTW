"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface AuthUser {
  id: string
  email: string
  name?: string
}

interface GlobalAuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: AuthUser | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  refreshAuth: () => Promise<void>
}

const GlobalAuthContext = createContext<GlobalAuthContextType | undefined>(undefined)

export function GlobalAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<AuthUser | null>(null)

  // Initialize auth state
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check localStorage (for demo accounts)
        const localAuth = localStorage.getItem("isAuthenticated") === "true"
        const localEmail = localStorage.getItem("userEmail")

        if (localAuth && localEmail) {
          console.log("✅ GlobalAuth: Found auth in localStorage:", localEmail)
          setIsAuthenticated(true)
          setUser({
            id: `user_${Date.now()}`,
            email: localEmail,
            name: localEmail.split("@")[0],
          })
          setIsLoading(false)
          return
        }

        // Then try server API
        const response = await fetch("/api/auth/status", {
          credentials: "include",
          cache: "no-store",
        })

        if (response.ok) {
          const data = await response.json()
          if (data.authenticated && data.user) {
            console.log("✅ GlobalAuth: Found auth via API:", data.user.email)
            setIsAuthenticated(true)
            setUser(data.user)

            // Update localStorage for consistency
            localStorage.setItem("isAuthenticated", "true")
            localStorage.setItem("userEmail", data.user.email)

            setIsLoading(false)
            return
          }
        }

        // Finally try session API
        const sessionResponse = await fetch("/api/simple-auth/session", {
          credentials: "include",
          cache: "no-store",
        })

        if (sessionResponse.ok) {
          const sessionData = await sessionResponse.json()
          if (sessionData.user) {
            console.log("✅ GlobalAuth: Found auth via session API:", sessionData.user.email)
            setIsAuthenticated(true)
            setUser({
              id: sessionData.user.id || `user_${Date.now()}`,
              email: sessionData.user.email,
              name: sessionData.user.name || sessionData.user.email.split("@")[0],
            })

            // Update localStorage for consistency
            localStorage.setItem("isAuthenticated", "true")
            localStorage.setItem("userEmail", sessionData.user.email)

            setIsLoading(false)
            return
          }
        }

        // If we get here, user is not authenticated
        console.log("❌ GlobalAuth: User is not authenticated")
        setIsAuthenticated(false)
        setUser(null)

        // Clear localStorage
        localStorage.removeItem("isAuthenticated")
        localStorage.removeItem("userEmail")
      } catch (error) {
        console.error("❌ GlobalAuth: Error checking auth:", error)
        setIsAuthenticated(false)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)

      // Call login API
      const response = await fetch("/api/simple-auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      })

      const data = await response.json()

      if (response.ok && data.user) {
        console.log("✅ GlobalAuth: Login successful:", data.user.email)
        setIsAuthenticated(true)
        setUser({
          id: data.user.id || `user_${Date.now()}`,
          email: data.user.email,
          name: data.user.name || data.user.email.split("@")[0],
        })

        // Update localStorage
        localStorage.setItem("isAuthenticated", "true")
        localStorage.setItem("userEmail", data.user.email)

        return true
      } else {
        console.log("❌ GlobalAuth: Login failed:", data.error)
        return false
      }
    } catch (error) {
      console.error("❌ GlobalAuth: Login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true)

      // Call logout API
      await fetch("/api/simple-auth/signout", {
        method: "POST",
        credentials: "include",
      })

      console.log("✅ GlobalAuth: Logout successful")
      setIsAuthenticated(false)
      setUser(null)

      // Clear localStorage
      localStorage.removeItem("isAuthenticated")
      localStorage.removeItem("userEmail")
    } catch (error) {
      console.error("❌ GlobalAuth: Logout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Refresh auth state
  const refreshAuth = async (): Promise<void> => {
    try {
      setIsLoading(true)

      // Check localStorage first
      const localAuth = localStorage.getItem("isAuthenticated") === "true"
      const localEmail = localStorage.getItem("userEmail")

      if (localAuth && localEmail) {
        console.log("✅ GlobalAuth: Refresh found auth in localStorage:", localEmail)
        setIsAuthenticated(true)
        setUser({
          id: `user_${Date.now()}`,
          email: localEmail,
          name: localEmail.split("@")[0],
        })
        setIsLoading(false)
        return
      }

      // Then try server
      const response = await fetch("/api/auth/status", {
        credentials: "include",
        cache: "no-store",
      })

      if (response.ok) {
        const data = await response.json()
        if (data.authenticated && data.user) {
          console.log("✅ GlobalAuth: Refresh found auth via API:", data.user.email)
          setIsAuthenticated(true)
          setUser(data.user)

          // Update localStorage
          localStorage.setItem("isAuthenticated", "true")
          localStorage.setItem("userEmail", data.user.email)

          return
        }
      }

      // If we get here, user is not authenticated
      console.log("❌ GlobalAuth: Refresh found no auth")
      setIsAuthenticated(false)
      setUser(null)

      // Clear localStorage
      localStorage.removeItem("isAuthenticated")
      localStorage.removeItem("userEmail")
    } catch (error) {
      console.error("❌ GlobalAuth: Refresh error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <GlobalAuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </GlobalAuthContext.Provider>
  )
}

export function useGlobalAuth() {
  const context = useContext(GlobalAuthContext)
  if (context === undefined) {
    throw new Error("useGlobalAuth must be used within a GlobalAuthProvider")
  }
  return context
}
