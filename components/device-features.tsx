"use client"

import { useEffect } from "react"
import { useTouch } from "@/hooks/use-touch"

export function DeviceFeatures() {
  const isTouch = useTouch()

  useEffect(() => {
    // Add class to body based on device type
    if (isTouch) {
      document.body.classList.add("touch-device")
    } else {
      document.body.classList.add("mouse-device")
    }

    // Handle iOS viewport height issue
    const setVhProperty = () => {
      // Set CSS variable for viewport height
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty("--vh", `${vh}px`)
    }

    // Set initially and on resize
    setVhProperty()
    window.addEventListener("resize", setVhProperty)

    // Prevent double-tap zoom on iOS
    const handleTouchEnd = (e: TouchEvent) => {
      const now = Date.now()
      const lastTouch = (window as any).lastTouch || now
      const delta = now - lastTouch
      if (delta < 300 && delta > 0) {
        e.preventDefault()
      }
      ;(window as any).lastTouch = now
    }

    if (isTouch) {
      document.addEventListener("touchend", handleTouchEnd, { passive: false })
    }

    // Detect Android
    const isAndroid = /Android/i.test(navigator.userAgent)
    if (isAndroid) {
      document.body.classList.add("android-device")
    }

    // Detect iOS
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)
    if (isIOS) {
      document.body.classList.add("ios-device")
    }

    return () => {
      window.removeEventListener("resize", setVhProperty)
      if (isTouch) {
        document.removeEventListener("touchend", handleTouchEnd)
      }
    }
  }, [isTouch])

  return null
}
