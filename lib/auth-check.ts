"use client"

import { useEffect, useState } from "react"

export function useAuthCheck() {
  const [authState, setAuthState] = useState<{
    isChecking: boolean
    isAuthenticated: boolean
    user: any
    error: any
  }>({
    isChecking: true,
    isAuthenticated: false,
    user: null,
    error: null,
  })

  useEffect(() => {
    async function checkAuth() {
      try {
        // Check for session in localStorage first (for demo accounts)
        const isAuthenticatedInStorage = localStorage.getItem("isAuthenticated") === "true"
        const userEmail = localStorage.getItem("userEmail")

        if (isAuthenticatedInStorage && userEmail) {
          console.log("✅ Found authentication in localStorage:", userEmail)

          // For demo purposes, we'll create a basic user object
          setAuthState({
            isChecking: false,
            isAuthenticated: true,
            user: {
              id: `demo_${Date.now()}`,
              email: userEmail,
              name: userEmail.split("@")[0],
              firstName: userEmail.split("@")[0],
              lastName: "",
            },
            error: null,
          })
          return
        }

        // If not in localStorage, check with the server
        const response = await fetch("/api/simple-auth/session", {
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error("Failed to check authentication status")
        }

        const data = await response.json()

        if (data.authenticated && data.user) {
          console.log("✅ Found authentication from server:", data.user.email)
          setAuthState({
            isChecking: false,
            isAuthenticated: true,
            user: data.user,
            error: null,
          })
        } else {
          console.log("❌ No authentication found")
          setAuthState({
            isChecking: false,
            isAuthenticated: false,
            user: null,
            error: null,
          })
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
        setAuthState({
          isChecking: false,
          isAuthenticated: false,
          user: null,
          error: error instanceof Error ? error.message : "Authentication check failed",
        })
      }
    }

    checkAuth()
  }, [])

  return authState
}
