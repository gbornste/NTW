"use client"

import { useEffect } from "react"

export function GlobalErrorHandler() {
  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("🚨 Unhandled Promise Rejection:", event.reason)

      // Prevent the default browser behavior
      event.preventDefault()

      // Log detailed information
      if (event.reason && typeof event.reason === "object") {
        console.error("Rejection details:", {
          reason: event.reason,
          promise: event.promise,
          type: typeof event.reason,
          constructor: event.reason.constructor?.name,
        })
      }
    }

    // Handle general errors
    const handleError = (event: ErrorEvent) => {
      console.error("🚨 Global Error:", event.error)
      console.error("Error details:", {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
      })
    }

    // Add event listeners
    window.addEventListener("unhandledrejection", handleUnhandledRejection)
    window.addEventListener("error", handleError)

    // Cleanup
    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
      window.removeEventListener("error", handleError)
    }
  }, [])

  return null
}
