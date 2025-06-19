"use client"

import { useEffect } from "react"

export function DebugImports() {
  useEffect(() => {
    // Debug import issues in development
    if (process.env.NODE_ENV === "development") {
      import("@/app/actions/export-check")
        .then((module) => {
          console.log("Export check module loaded successfully")
          module.verifyExports()
        })
        .catch((error) => {
          console.error("Error loading export check module:", error)
        })
    }
  }, [])

  return null // This component doesn't render anything
}
