"use client"

import { useState, useEffect } from "react"

export function useTouch() {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    // Check if device supports touch
    const isTouchDevice = () => {
      return (
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-ignore
        navigator.msMaxTouchPoints > 0
      )
    }

    setIsTouch(isTouchDevice())

    // Add listener for touch events to handle devices that support both mouse and touch
    const handleTouchStart = () => {
      setIsTouch(true)
      // Remove listener after detecting touch
      window.removeEventListener("touchstart", handleTouchStart)
    }

    window.addEventListener("touchstart", handleTouchStart)

    return () => {
      window.removeEventListener("touchstart", handleTouchStart)
    }
  }, [])

  return isTouch
}
