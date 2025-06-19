"use client"

import { useEffect } from "react"

export function ServiceWorkerRegistration() {
  useEffect(() => {
    // Only register service worker in production and if supported
    if (typeof window !== "undefined" && "serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      const registerServiceWorker = async () => {
        try {
          const registration = await navigator.serviceWorker.register("/sw.js", {
            scope: "/",
          })

          console.log("Service Worker registration successful with scope:", registration.scope)

          // Handle updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  console.log("New service worker available")
                  // Optionally notify user about update
                }
              })
            }
          })
        } catch (error) {
          console.error("Service Worker registration failed:", error)
        }
      }

      // Register after page load to avoid blocking
      if (document.readyState === "complete") {
        registerServiceWorker()
      } else {
        window.addEventListener("load", registerServiceWorker)
      }
    }
  }, [])

  return null
}

// Also export with the shorter name for convenience
export { ServiceWorkerRegistration as ServiceWorkerRegister }
