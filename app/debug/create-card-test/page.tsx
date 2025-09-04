"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertCircle, RefreshCw, User, LogIn, UserPlus } from "lucide-react"
import Link from "next/link"

// Safe imports with fallbacks
let useAuth: any
try {
  const authModule = require("@/contexts/simple-auth-context")
  useAuth = authModule.useAuth
} catch (error: any) {
  console.warn("Auth context not available:", error?.message || "Unknown error")
  useAuth = () => ({
    isAuthenticated: false,
    user: null,
    isLoading: false,
    refreshSession: async () => {},
  })
}

export default function CreateCardTestPage() {
  const [diagnostics, setDiagnostics] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { isAuthenticated, user, isLoading: authLoading, refreshSession } = useAuth()

  useEffect(() => {
    runDiagnostics()
  }, [])

  const runDiagnostics = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/debug/create-card-diagnostics")
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      const data = await response.json()
      setDiagnostics(data)
    } catch (err: any) {
      setError(err?.message || "Diagnostics error occurred")
      console.error("Diagnostics error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const StatusIcon = ({ status }: { status: boolean | string }) => {
    if (status === true) return <CheckCircle className="h-5 w-5 text-green-500" />
    if (status === false) return <XCircle className="h-5 w-5 text-red-500" />
    return <AlertCircle className="h-5 w-5 text-yellow-500" />
  }

  if (isLoading) {
    return (
      <div className="container py-10 px-4 md:px-6">
        <h1 className="text-3xl font-bold mb-6">Create Card Diagnostics</h1>
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-sm text-gray-500">Running diagnostics...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10 px-4 md:px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Create Card Diagnostics</h1>
        <Button onClick={runDiagnostics} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Error:</strong> {error}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Authentication Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Authentication Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Loading State:</span>
              <StatusIcon status={!authLoading} />
              <span className="text-sm text-gray-500">{authLoading ? "Loading..." : "Ready"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Authenticated:</span>
              <StatusIcon status={isAuthenticated} />
              <span className="text-sm text-gray-500">{isAuthenticated ? "Yes" : "No"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>User Data:</span>
              <StatusIcon status={!!user} />
              <span className="text-sm text-gray-500">{user?.email || "None"}</span>
            </div>

            {!isAuthenticated && (
              <div className="pt-4 border-t space-y-2">
                <p className="text-sm text-gray-600">Test authentication:</p>
                <div className="flex gap-2">
                  <Link href="/login">
                    <Button size="sm" variant="outline">
                      <LogIn className="h-4 w-4 mr-2" />
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="sm">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Environment Variables */}
        {diagnostics && (
          <Card>
            <CardHeader>
              <CardTitle>Environment Variables</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(diagnostics?.environment || {}).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="font-mono text-sm">{key}:</span>
                  <StatusIcon status={Boolean(value)} />
                  <span className="text-sm text-gray-500">{value ? "Set" : "Missing"}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Module Status */}
        {diagnostics && (
          <Card>
            <CardHeader>
              <CardTitle>Module Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(diagnostics?.modules || {}).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span>{key}:</span>
                  <StatusIcon status={Boolean(value)} />
                  <span className="text-sm text-gray-500">{value ? "Available" : "Missing"}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/create-card">
              <Button className="w-full">Test Create Card Page</Button>
            </Link>
            <Link href="/store">
              <Button variant="outline" className="w-full">
                Test Store Page
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="w-full">
                Test Login Page
              </Button>
            </Link>
            <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>
              Reload Application
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      {diagnostics?.diagnostics?.recommendations && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {diagnostics.diagnostics.recommendations.map((rec: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
