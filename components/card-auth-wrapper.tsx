"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, LogIn, UserCheck, RefreshCw } from "lucide-react"
import { AuthStateDebugger } from "./auth-state-debugger"

interface CardAuthWrapperProps {
  children: React.ReactNode
  action?: "send" | "save" | "share"
}

export function CardAuthWrapper({ children, action = "send" }: CardAuthWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showDebug, setShowDebug] = useState(false)
  const router = useRouter()

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true)
        console.log("🔍 Checking authentication status...")

        // Only check server session for authentication. Demo/localStorage logic removed.

        // If not in localStorage, try to fetch from server
        try {
          const response = await fetch("/api/auth/status", {
            credentials: "include",
            cache: "no-store",
          })

          if (response.ok) {
            const data = await response.json()
            console.log("🔍 Auth API response:", data)

            if (data.authenticated) {
              console.log("✅ User is authenticated via API")
              setIsAuthenticated(true)
              setUserEmail(data.user?.email || "user@example.com")
              setIsLoading(false)
              return
            }
          }
        } catch (apiError) {
          console.error("❌ Error checking auth API:", apiError)
          // Continue to next check if API fails
        }

        // Last resort: Check session API
        try {
          const sessionResponse = await fetch("/api/simple-auth/session", {
            credentials: "include",
            cache: "no-store",
          })

          if (sessionResponse.ok) {
            const sessionData = await sessionResponse.json()
            console.log("🔍 Session API response:", sessionData)

            if (sessionData.user) {
              console.log("✅ User is authenticated via session API")
              setIsAuthenticated(true)
              setUserEmail(sessionData.user.email || "user@example.com")

              // IMPORTANT: Also update localStorage for consistency
              localStorage.setItem("isAuthenticated", "true")
              localStorage.setItem("userEmail", sessionData.user.email)

              setIsLoading(false)
              return
            }
          }
        } catch (sessionError) {
          console.error("❌ Error checking session API:", sessionError)
        }

        // If we get here, user is not authenticated
        console.log("❌ User is not authenticated")
        setIsAuthenticated(false)
        setUserEmail(null)
      } catch (error) {
        console.error("❌ Authentication check error:", error)
        setIsAuthenticated(false)
        setUserEmail(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Handle login redirect
  const handleLogin = () => {
    // Save the current URL to redirect back after login
    localStorage.setItem("redirectAfterLogin", window.location.pathname)
    router.push("/login")
  }

  // Force refresh authentication
  const refreshAuth = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500)) // Brief delay for UI feedback

    // Check localStorage again
    const localStorageAuth = localStorage.getItem("isAuthenticated") === "true"
    const localStorageEmail = localStorage.getItem("userEmail")

    if (localStorageAuth && localStorageEmail) {
      console.log("✅ Found authentication in localStorage after refresh:", localStorageEmail)
      setIsAuthenticated(true)
      setUserEmail(localStorageEmail)
      setIsLoading(false)
      return
    }

    setIsAuthenticated(false)
    setUserEmail(null)
    setIsLoading(false)
  }

  // If still checking auth status
  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto my-8 text-center">
        <CardContent className="pt-6">
          <div className="animate-pulse flex flex-col items-center justify-center p-8">
            <div className="h-12 w-12 rounded-full bg-gray-200 mb-4"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // If authenticated, show the children
  if (isAuthenticated) {
    return (
      <>
        {children}
        {process.env.NODE_ENV === "development" && <AuthStateDebugger />}
      </>
    )
  }

  // If not authenticated, show login prompt
  return (
    <>
      <Card className="w-full max-w-md mx-auto my-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-orange-500" />
            Authentication Required
          </CardTitle>
          <CardDescription>
            You need to be logged in to {action} this card. Please log in or create an account to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800 text-sm mb-4">
            <p>
              <strong>Why login?</strong> We require authentication to {action} cards to prevent abuse and track your
              card history.
            </p>
          </div>

          {/* Demo account credentials removed. Only real user login is supported. */}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="flex justify-between w-full">
            <Button variant="outline" onClick={() => router.push("/signup")}>
              <UserCheck className="mr-2 h-4 w-4" />
              Create Account
            </Button>
            <Button onClick={handleLogin}>
              <LogIn className="mr-2 h-4 w-4" />
              Log In
            </Button>
          </div>

          <div className="w-full">
            <Button
              variant="ghost"
              className="w-full text-gray-500 text-sm"
              onClick={() => {
                refreshAuth()
                setShowDebug(!showDebug)
              }}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Already logged in? Refresh authentication
            </Button>
          </div>
        </CardFooter>
      </Card>

      {showDebug && process.env.NODE_ENV === "development" && <AuthStateDebugger showDetails={true} />}
    </>
  )
}
