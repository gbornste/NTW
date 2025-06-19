"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AuthTestPage() {
  const sessionResult = useSession()
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted before accessing session
  useEffect(() => {
    setMounted(true)
  }, [])

  // Safe destructuring after mount
  const session = mounted ? sessionResult?.data : null
  const status = mounted ? sessionResult?.status : "loading"

  const testAuthApi = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/auth/session")
      const data = await response.json()

      setApiResponse(data)
    } catch (err) {
      setError("Failed to fetch session data")
      console.error("API test error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Only test the API after component is mounted
    if (mounted) {
      testAuthApi()
    }
  }, [mounted])

  // Show loading state until mounted
  if (!mounted) {
    return (
      <div className="container max-w-3xl py-10">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Test Page</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Loading...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-3xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Test Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-medium">Session Status</h2>
            <div className="rounded-md bg-gray-50 p-4">
              <p>
                <strong>Status:</strong> {status || "unknown"}
              </p>
              {session ? (
                <pre className="mt-2 overflow-auto rounded-md bg-gray-100 p-2 text-sm">
                  {JSON.stringify(session, null, 2)}
                </pre>
              ) : (
                <p className="text-gray-500">No active session</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-medium">API Response</h2>
            <div className="rounded-md bg-gray-50 p-4">
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <pre className="overflow-auto rounded-md bg-gray-100 p-2 text-sm">
                  {JSON.stringify(apiResponse, null, 2)}
                </pre>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button onClick={testAuthApi} disabled={loading}>
              Refresh Session Data
            </Button>

            <Button asChild variant="outline">
              <Link href="/login">Go to Login</Link>
            </Button>

            <Button asChild variant="outline">
              <Link href="/auth/error?error=Default">Test Error Page</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
