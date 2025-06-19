"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Application error:", error)
  }, [error])

  const handleReturnHome = () => {
    try {
      window.location.href = "/"
    } catch (e) {
      console.error("Failed to navigate home:", e)
    }
  }

  const handleReset = () => {
    try {
      reset()
    } catch (e) {
      console.error("Failed to reset:", e)
      // Fallback to page reload
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-red-600 dark:text-red-400">Something went wrong</CardTitle>
          <CardDescription>We apologize for the inconvenience. An unexpected error has occurred.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={handleReset} variant="default">
              Try Again
            </Button>
            <Button onClick={handleReturnHome} variant="outline">
              Return Home
            </Button>
          </div>

          {process.env.NODE_ENV === "development" && (
            <details className="mt-6">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Error Details (Development)
              </summary>
              <div className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto max-h-40">
                <pre className="text-red-600 dark:text-red-400 whitespace-pre-wrap">{error.message}</pre>
                {error.stack && (
                  <pre className="text-gray-600 dark:text-gray-400 mt-2 whitespace-pre-wrap">{error.stack}</pre>
                )}
                {error.digest && <p className="text-gray-500 dark:text-gray-500 mt-2">Error ID: {error.digest}</p>}
              </div>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ErrorPage
