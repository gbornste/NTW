"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"

export function AuthDebug() {
  const { data: session, status } = useSession()
  const [isExpanded, setIsExpanded] = useState(false)

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="rounded-full bg-gray-800 p-2 text-xs text-white shadow-lg"
      >
        Auth: {status}
      </button>

      {isExpanded && (
        <div className="mt-2 w-80 rounded-lg bg-gray-800 p-4 text-xs text-white shadow-xl">
          <h4 className="mb-2 font-bold">NextAuth Debug</h4>
          <div className="mb-2">
            <span className="font-semibold">Status:</span> {status}
          </div>

          {session ? (
            <div className="overflow-auto">
              <span className="font-semibold">Session:</span>
              <pre className="mt-1 max-h-60 overflow-auto rounded bg-gray-700 p-2 text-green-300">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="text-yellow-300">No active session</div>
          )}

          <div className="mt-4 flex justify-between">
            <button
              onClick={() => {
                fetch("/api/auth/session")
                  .then((res) => res.json())
                  .then((data) => console.log("Session API response:", data))
                  .catch((err) => console.error("Session API error:", err))
              }}
              className="rounded bg-blue-600 px-2 py-1 text-white"
            >
              Test Session API
            </button>

            <button onClick={() => setIsExpanded(false)} className="rounded bg-gray-600 px-2 py-1 text-white">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
