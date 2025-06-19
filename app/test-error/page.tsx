"use client"

import { useState } from "react"
import { SafeWrapper } from "@/components/safe-wrapper"

function ErrorTrigger() {
  const [shouldError, setShouldError] = useState(false)

  if (shouldError) {
    throw new Error("Test error triggered intentionally")
  }

  return (
    <button onClick={() => setShouldError(true)} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
      Trigger Error
    </button>
  )
}

export default function TestErrorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Error Handling Test</h1>

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Test SafeWrapper Error Boundary</h2>
          <SafeWrapper
            fallback={
              <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
                Custom fallback: Component failed to load
              </div>
            }
            onError={(error) => {
              console.log("Custom error handler called:", error.message)
            }}
          >
            <ErrorTrigger />
          </SafeWrapper>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Test Auth Error API</h2>
          <div className="space-x-2">
            <a
              href="/api/auth/error?error=CredentialsSignin"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Test Credentials Error
            </a>
            <a
              href="/api/auth/error?error=AccessDenied"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Test Access Denied
            </a>
            <a
              href="/api/auth/error"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Test Unknown Error
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
