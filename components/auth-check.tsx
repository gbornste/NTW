"use client"

import type React from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCcw, AlertCircle } from "lucide-react"

export function AuthCheck({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, refreshSession, checkSession, status, user } = useAuth()
  const router = useRouter()
  const [showContent, setShowContent] = useState(false)
  const [loadingStartTime, setLoadingStartTime] = useState(Date.now())
  const [loadingTimedOut, setLoadingTimedOut] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Handle loading timeout
  useEffect(() => {
    // Set loading start time on mount
    setLoadingStartTime(Date.now())

    // Set a timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      if (isLoading) {
        console.warn("Auth check loading timed out after 8 seconds")
        setLoadingTimedOut(true)
      }
    }, 8000)

    // Update content visibility based on auth state
    if (!isLoading && status !== "loading") {
      console.log(`🔍 AuthCheck: Status=${status}, Authenticated=${isAuthenticated}, User=${user?.email || "none"}`)
      setShowContent(isAuthenticated)
    }

    return () => clearTimeout(loadingTimeout)
  }, [isAuthenticated, isLoading, status, user])

  // Handle manual refresh
  const handleManualRefresh = async () => {
    setIsRefreshing(true)
    setLoadingTimedOut(false)
    setLoadingStartTime(Date.now())

    try {
      console.log("🔄 Manual auth refresh triggered")
      await refreshSession()
      await checkSession()
    } catch (error) {
      console.error("Error during manual refresh:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  // Show loading state with timeout detection
  if ((isLoading || status === "loading") && !loadingTimedOut) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-500">Checking authentication...</p>
        <p className="text-xs text-gray-400 mt-1">
          (Loading for {Math.floor((Date.now() - loadingStartTime) / 1000)}s)
        </p>
        <p className="text-xs text-gray-400">Status: {status}</p>
      </div>
    )
  }

  // Show timeout message
  if (loadingTimedOut) {
    return (
      <Card className="max-w-md mx-auto my-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Authentication Check Timed Out
          </CardTitle>
          <CardDescription>We're having trouble verifying your login status.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            This could be due to a slow connection or a temporary issue with our authentication service.
          </p>
          <div className="text-xs text-gray-500 mb-4">
            Status: {status} | Authenticated: {isAuthenticated ? "Yes" : "No"} | User: {user?.email || "None"}
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleManualRefresh} disabled={isRefreshing} className="flex items-center gap-2">
              <RefreshCcw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Checking..." : "Try Again"}
            </Button>
            <Button variant="outline" onClick={() => router.push("/login")} className="w-full sm:w-auto">
              Go to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Show login required message
  if (!showContent) {
    return (
      <Card className="max-w-md mx-auto my-8">
        <CardHeader>
          <CardTitle>Login Required</CardTitle>
          <CardDescription>You need to be logged in to access this feature.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Please log in or create an account to send greeting cards.</p>
          <div className="text-xs text-gray-500 mb-4">
            Current Status: {status} | Authenticated: {isAuthenticated ? "Yes" : "No"}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            variant="outline"
            className="w-full sm:w-auto flex items-center gap-2"
          >
            <RefreshCcw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Checking..." : "Refresh Status"}
          </Button>
          <Button onClick={() => router.push("/login")} className="w-full sm:w-auto">
            Log In
          </Button>
          <Button onClick={() => router.push("/signup")} variant="outline" className="w-full sm:w-auto">
            Sign Up
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // Show content when authenticated
  return <>{children}</>
}
