"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"

interface TestResult {
  name: string
  status: "success" | "error" | "warning"
  message: string
  details?: any
}

export default function AuthDebugPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const runTests = async () => {
    setIsRunning(true)
    const results: TestResult[] = []

    // Test 1: Crypto API availability
    try {
      const response = await fetch("/api/auth/test-crypto")
      const data = await response.json()

      if (data.success) {
        results.push({
          name: "Crypto Implementation",
          status: "success",
          message: "Crypto functions are working correctly",
          details: data.results,
        })
      } else {
        results.push({
          name: "Crypto Implementation",
          status: "error",
          message: "Crypto functions failed",
          details: data.error,
        })
      }
    } catch (error) {
      results.push({
        name: "Crypto Implementation",
        status: "error",
        message: "Failed to test crypto functions",
        details: error,
      })
    }

    // Test 2: NextAuth configuration
    try {
      const response = await fetch("/api/auth/session")

      if (response.ok) {
        results.push({
          name: "NextAuth Session",
          status: "success",
          message: "NextAuth is responding correctly",
        })
      } else {
        results.push({
          name: "NextAuth Session",
          status: "error",
          message: `NextAuth returned ${response.status}`,
        })
      }
    } catch (error) {
      results.push({
        name: "NextAuth Session",
        status: "error",
        message: "NextAuth is not responding",
        details: error,
      })
    }

    // Test 3: Environment variables
    const envTests = {
      hasNextAuthSecret: !!process.env.NEXT_PUBLIC_NEXTAUTH_URL,
      nodeEnv: process.env.NODE_ENV,
    }

    results.push({
      name: "Environment Configuration",
      status: envTests.hasNextAuthSecret ? "success" : "warning",
      message: envTests.hasNextAuthSecret
        ? "Environment variables are configured"
        : "Some environment variables may be missing",
      details: envTests,
    })

    // Test 4: Browser crypto support
    const browserCrypto = {
      crypto: !!window.crypto,
      subtle: !!window.crypto?.subtle,
      getRandomValues: !!window.crypto?.getRandomValues,
    }

    results.push({
      name: "Browser Crypto Support",
      status: browserCrypto.crypto ? "success" : "warning",
      message: browserCrypto.crypto ? "Browser crypto is available" : "Browser crypto is limited",
      details: browserCrypto,
    })

    setTestResults(results)
    setIsRunning(false)
  }

  useEffect(() => {
    runTests()
  }, [])

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusColor = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return "border-green-200 bg-green-50"
      case "error":
        return "border-red-200 bg-red-50"
      case "warning":
        return "border-yellow-200 bg-yellow-50"
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Authentication Debug</h1>
          <p className="text-gray-600">This page helps diagnose authentication and crypto implementation issues.</p>
        </div>

        <div className="mb-6">
          <Button onClick={runTests} disabled={isRunning}>
            {isRunning ? "Running Tests..." : "Run Tests Again"}
          </Button>
        </div>

        <div className="space-y-4">
          {testResults.map((result, index) => (
            <Card key={index} className={`${getStatusColor(result.status)}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(result.status)}
                  {result.name}
                </CardTitle>
                <CardDescription>{result.message}</CardDescription>
              </CardHeader>
              {result.details && (
                <CardContent>
                  <details>
                    <summary className="cursor-pointer font-medium mb-2">View Details</summary>
                    <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {testResults.length === 0 && !isRunning && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>No test results available. Click "Run Tests" to start diagnostics.</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
