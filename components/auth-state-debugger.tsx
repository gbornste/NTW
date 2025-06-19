"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react"

export function AuthStateDebugger({ showDetails = false }: { showDetails?: boolean }) {
  const [authState, setAuthState] = useState({
    localStorage: {
      isAuthenticated: null as boolean | null,
      userEmail: null as string | null,
      redirectAfterLogin: null as string | null,
    },
    cookies: [] as { name: string; value: string }[],
    sessionAPI: {
      status: "pending" as "pending" | "success" | "error",
      data: null as any,
      error: null as string | null,
    },
    authManager: {
      status: "pending" as "pending" | "success" | "error",
      data: null as any,
      error: null as string | null,
    },
  })

  const checkAuthState = async () => {
    try {
      // Check localStorage
      const localStorageState = {
        isAuthenticated: localStorage.getItem("isAuthenticated") === "true",
        userEmail: localStorage.getItem("userEmail"),
        redirectAfterLogin: localStorage.getItem("redirectAfterLogin"),
      }

      // Get all cookies
      const cookies = document.cookie.split(";").map((cookie) => {
        const [name, value] = cookie.trim().split("=")
        return { name, value }
      })

      // Check session API
      let sessionAPIState = {
        status: "pending" as "pending" | "success" | "error",
        data: null as any,
        error: null as string | null,
      }

      try {
        const response = await fetch("/api/auth/status", {
          credentials: "include",
          cache: "no-store",
        })
        const data = await response.json()
        sessionAPIState = {
          status: "success",
          data,
          error: null,
        }
      } catch (error) {
        sessionAPIState = {
          status: "error",
          data: null,
          error: error instanceof Error ? error.message : "Unknown error",
        }
      }

      // Check auth manager if available
      let authManagerState = {
        status: "pending" as "pending" | "success" | "error",
        data: null as any,
        error: null as string | null,
      }

      try {
        if (typeof window !== "undefined" && (window as any).authSessionManager) {
          const authManager = (window as any).authSessionManager
          const session = authManager.getSession()
          const isAuthenticated = authManager.isAuthenticated()

          authManagerState = {
            status: "success",
            data: {
              session,
              isAuthenticated,
            },
            error: null,
          }
        } else {
          authManagerState = {
            status: "error",
            data: null,
            error: "Auth manager not available",
          }
        }
      } catch (error) {
        authManagerState = {
          status: "error",
          data: null,
          error: error instanceof Error ? error.message : "Unknown error",
        }
      }

      setAuthState({
        localStorage: localStorageState,
        cookies,
        sessionAPI: sessionAPIState,
        authManager: authManagerState,
      })
    } catch (error) {
      console.error("Error checking auth state:", error)
    }
  }

  useEffect(() => {
    checkAuthState()
  }, [])

  if (!showDetails) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button size="sm" variant="outline" className="bg-white dark:bg-gray-800" onClick={() => checkAuthState()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Check Auth
        </Button>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto my-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Authentication State Debugger
          <Button size="sm" variant="outline" onClick={checkAuthState}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardTitle>
        <CardDescription>Analyzing authentication state across different storage mechanisms</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">LocalStorage Authentication</h3>
          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              {authState.localStorage.isAuthenticated ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
              <span className="font-medium">
                Status: {authState.localStorage.isAuthenticated ? "Authenticated" : "Not Authenticated"}
              </span>
            </div>
            {authState.localStorage.userEmail && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                User Email: {authState.localStorage.userEmail}
              </div>
            )}
            {authState.localStorage.redirectAfterLogin && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Redirect After Login: {authState.localStorage.redirectAfterLogin}
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Session API Check</h3>
          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              {authState.sessionAPI.status === "success" ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Success
                </Badge>
              ) : authState.sessionAPI.status === "error" ? (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  Error
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  Pending
                </Badge>
              )}
              <span className="font-medium">API Response</span>
            </div>
            {authState.sessionAPI.data && (
              <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto max-h-40">
                {JSON.stringify(authState.sessionAPI.data, null, 2)}
              </pre>
            )}
            {authState.sessionAPI.error && (
              <div className="text-sm text-red-600 dark:text-red-400">{authState.sessionAPI.error}</div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Auth Manager State</h3>
          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              {authState.authManager.status === "success" ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Success
                </Badge>
              ) : authState.authManager.status === "error" ? (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  Error
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  Pending
                </Badge>
              )}
              <span className="font-medium">Auth Manager</span>
            </div>
            {authState.authManager.data && (
              <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto max-h-40">
                {JSON.stringify(authState.authManager.data, null, 2)}
              </pre>
            )}
            {authState.authManager.error && (
              <div className="text-sm text-red-600 dark:text-red-400">{authState.authManager.error}</div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Cookies ({authState.cookies.length})</h3>
          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
            {authState.cookies.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-auto">
                {authState.cookies.map((cookie, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-medium">{cookie.name}</span>: {cookie.value.substring(0, 20)}
                    {cookie.value.length > 20 ? "..." : ""}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-600 dark:text-gray-400">No cookies found</div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-gray-500">
        Authentication data refreshed at: {new Date().toLocaleTimeString()}
      </CardFooter>
    </Card>
  )
}
