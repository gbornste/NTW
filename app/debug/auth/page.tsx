"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AuthDebugPage() {
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [localStorageUser, setLocalStorageUser] = useState<any>(null)
  const [sessionApiResponse, setSessionApiResponse] = useState<any>(null)
  const [csrfApiResponse, setCsrfApiResponse] = useState<any>(null)
  const [browserInfo, setBrowserInfo] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted before accessing browser APIs
  useEffect(() => {
    setMounted(true)

    // Load user from localStorage
    try {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setLocalStorageUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error("Error loading user from localStorage:", error)
    }

    // Get browser information safely
    setBrowserInfo({
      userAgent: navigator?.userAgent || "Not available",
      platform: navigator?.platform || "Not available",
      cookieEnabled: navigator?.cookieEnabled?.toString() || "Not available",
      webCrypto: typeof window !== "undefined" && window.crypto ? "Available" : "Not available",
      localStorage: typeof window !== "undefined" && window.localStorage ? "Available" : "Not available",
    })
  }, [])

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="p-8">
            <div className="text-center">Loading debug tools...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Test session API
  const testSessionApi = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/auth/session")
      const data = await response.json()

      setSessionApiResponse(data)
    } catch (error) {
      console.error("Error testing session API:", error)
      setError("Failed to test session API")
    } finally {
      setLoading(false)
    }
  }

  // Test CSRF API
  const testCsrfApi = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/auth/csrf")
      const data = await response.json()

      setCsrfApiResponse(data)
    } catch (error) {
      console.error("Error testing CSRF API:", error)
      setError("Failed to test CSRF API")
    } finally {
      setLoading(false)
    }
  }

  // Test login API
  const testLoginApi = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "demo@notrumpnway.com", password: "demo123" }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Login failed")
        return
      }

      setUser(data.user)
      localStorage.setItem("user", JSON.stringify(data.user))
    } catch (error) {
      console.error("Error testing login API:", error)
      setError("Failed to test login API")
    } finally {
      setLoading(false)
    }
  }

  // Clear user data
  const clearUserData = () => {
    localStorage.removeItem("user")
    setUser(null)
    setLocalStorageUser(null)
  }

  return (
    <div className="container py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Authentication Debug</CardTitle>
          <CardDescription>Test and debug authentication functionality</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button onClick={testLoginApi} disabled={loading}>
                Test Login API
              </Button>
              <Button onClick={testSessionApi} disabled={loading}>
                Test Session API
              </Button>
              <Button onClick={testCsrfApi} disabled={loading}>
                Test CSRF API
              </Button>
              <Button onClick={clearUserData} variant="outline">
                Clear User Data
              </Button>
            </div>

            <Tabs defaultValue="user">
              <TabsList>
                <TabsTrigger value="user">Current User</TabsTrigger>
                <TabsTrigger value="localStorage">LocalStorage</TabsTrigger>
                <TabsTrigger value="sessionApi">Session API</TabsTrigger>
                <TabsTrigger value="csrfApi">CSRF API</TabsTrigger>
              </TabsList>

              <TabsContent value="user" className="p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium mb-2">Current User:</h3>
                <pre className="whitespace-pre-wrap overflow-auto max-h-60 p-2 bg-white border rounded">
                  {user ? JSON.stringify(user, null, 2) : "No user logged in"}
                </pre>
              </TabsContent>

              <TabsContent value="localStorage" className="p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium mb-2">LocalStorage User:</h3>
                <pre className="whitespace-pre-wrap overflow-auto max-h-60 p-2 bg-white border rounded">
                  {localStorageUser ? JSON.stringify(localStorageUser, null, 2) : "No user in localStorage"}
                </pre>
              </TabsContent>

              <TabsContent value="sessionApi" className="p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium mb-2">Session API Response:</h3>
                <pre className="whitespace-pre-wrap overflow-auto max-h-60 p-2 bg-white border rounded">
                  {sessionApiResponse ? JSON.stringify(sessionApiResponse, null, 2) : "No response yet"}
                </pre>
              </TabsContent>

              <TabsContent value="csrfApi" className="p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium mb-2">CSRF API Response:</h3>
                <pre className="whitespace-pre-wrap overflow-auto max-h-60 p-2 bg-white border rounded">
                  {csrfApiResponse ? JSON.stringify(csrfApiResponse, null, 2) : "No response yet"}
                </pre>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Browser Environment</CardTitle>
          <CardDescription>Information about the current browser environment</CardDescription>
        </CardHeader>
        <CardContent>
          {browserInfo && (
            <div className="space-y-2">
              <div>
                <span className="font-medium">User Agent:</span> {browserInfo.userAgent}
              </div>
              <div>
                <span className="font-medium">Platform:</span> {browserInfo.platform}
              </div>
              <div>
                <span className="font-medium">Cookies Enabled:</span> {browserInfo.cookieEnabled}
              </div>
              <div>
                <span className="font-medium">Web Crypto API:</span> {browserInfo.webCrypto}
              </div>
              <div>
                <span className="font-medium">LocalStorage:</span> {browserInfo.localStorage}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
