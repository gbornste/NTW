"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { runDevelopmentValidation } from "@/lib/export-validator"
import type { ExportValidationResult } from "@/lib/export-validator"

export default function ExportsTestPage() {
  const [validationResults, setValidationResults] = useState<{
    authProvider?: ExportValidationResult
  }>({})
  const [isLoading, setIsLoading] = useState(false)

  const runValidation = async () => {
    setIsLoading(true)
    try {
      const results = await runDevelopmentValidation()
      setValidationResults(results || {})
    } catch (error) {
      console.error("Validation error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    runValidation()
  }, [])

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Export Validation Test</h1>
        <Button onClick={runValidation} disabled={isLoading}>
          {isLoading ? "Running..." : "Run Validation"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AuthProvider Export Test</CardTitle>
        </CardHeader>
        <CardContent>
          {validationResults.authProvider ? (
            <div className="space-y-2">
              <div
                className={`p-2 rounded ${
                  validationResults.authProvider.isValid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                Status: {validationResults.authProvider.isValid ? "✅ Valid" : "❌ Invalid"}
              </div>

              <div>
                <strong>Available Exports:</strong>
                <ul className="list-disc list-inside ml-4">
                  {validationResults.authProvider.availableExports.map((exp) => (
                    <li key={exp} className="text-green-600">
                      {exp}
                    </li>
                  ))}
                </ul>
              </div>

              {validationResults.authProvider.missingExports.length > 0 && (
                <div>
                  <strong>Missing Exports:</strong>
                  <ul className="list-disc list-inside ml-4">
                    {validationResults.authProvider.missingExports.map((exp) => (
                      <li key={exp} className="text-red-600">
                        {exp}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {validationResults.authProvider.error && (
                <div className="text-red-600">
                  <strong>Error:</strong> {validationResults.authProvider.error}
                </div>
              )}
            </div>
          ) : (
            <div>Running validation...</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Import Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>Testing direct imports...</div>
            <TestImports />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function TestImports() {
  const [importResults, setImportResults] = useState<{
    namedImport?: boolean
    defaultImport?: boolean
    error?: string
  }>({})

  useEffect(() => {
    const testImports = async () => {
      try {
        // Test named import
        const { AuthProvider } = await import("@/components/auth-provider")
        const namedImportSuccess = typeof AuthProvider === "function"

        // Test default import
        const defaultImport = await import("@/components/auth-provider")
        const defaultImportSuccess = typeof defaultImport.default === "function"

        setImportResults({
          namedImport: namedImportSuccess,
          defaultImport: defaultImportSuccess,
        })
      } catch (error) {
        setImportResults({
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    testImports()
  }, [])

  return (
    <div className="space-y-2">
      <div
        className={`p-2 rounded ${
          importResults.namedImport ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
      >
        Named Import (AuthProvider): {importResults.namedImport ? "✅ Success" : "❌ Failed"}
      </div>

      <div
        className={`p-2 rounded ${
          importResults.defaultImport ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
      >
        Default Import: {importResults.defaultImport ? "✅ Success" : "❌ Failed"}
      </div>

      {importResults.error && <div className="p-2 rounded bg-red-100 text-red-800">Error: {importResults.error}</div>}
    </div>
  )
}
