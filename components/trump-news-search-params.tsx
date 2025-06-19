"use client"

import { useSearchParams } from "next/navigation"

export function TrumpNewsSearchParams({
  onParamsLoaded,
}: {
  onParamsLoaded: (todayOnly: boolean) => void
}) {
  const searchParams = useSearchParams()
  const todayOnly = searchParams.get("todayOnly") !== "false" // Default to true unless explicitly set to false

  // Call the callback with the search params
  onParamsLoaded(todayOnly)

  // This component doesn't render anything
  return null
}
