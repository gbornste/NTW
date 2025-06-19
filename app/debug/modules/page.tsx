"use client"

import { useState, useEffect } from "react"
import { ModuleDiagnostics, type ModuleDiagnostic } from "@/lib/module-diagnostics"
import { SafeImport } from "@/lib/safe-import"

const CRITICAL_MODULES = [
  "@/components/footer",
  "@/components/navbar",
  "@/components/auth-provider",
  "@/components/theme-provider",
  "@/contexts/auth-context",
  "@/contexts/cart-context",
  "@/lib/auth-service",
  "@/lib/env-config",
]

export default function ModulesDebugPage() {
  const [diagnostics, setDiagnostics] = useState<ModuleDiagnostic[]>([])
  const [loading, setLoading] = useState(false)
  const [customModule, setCustomModule] = useState("")
  const [testResults, setTestResults] = useState<Record<string, any>>({})

  const runDiagnostics = async () => {
    setLoading(true)
    try {
      const results = await ModuleDiagnostics.checkMultipleModules(CRITICAL_MODULES)
      setDiagnostics(results)
    } catch (error) {
      console.error("Failed to run diagnostics:", error)
    } finally {
      setLoading(false)
    }
  }

  const testCustomModule = async () => {
    if (!customModule.trim()) return

    setLoading(true)
    try {
      const result = await ModuleDiagnostics.checkModule(customModule)
      setDiagnostics((prev) => [result, ...prev.filter((d) => d.path !== customModule)])
    } catch (error) {
      console.error("Failed to test custom module:", error)
    } finally {
      setLoading(false)
    }
  }

  const testSafeImport = async (modulePath: string) => {
    try {
      const defaultExport = await SafeImport.getDefaultExport(modulePath)
      const namedExports = await SafeImport.importWithFallback(modulePath)

      setTestResults((prev) => ({
        ...prev,
        [modulePath]: {
          defaultExport: !!defaultExport,
          defaultType: typeof defaultExport,
          namedExports: namedExports ? Object.keys(namedExports).filter((k) => k !== "default") : [],
          success: true,
        },
      }))
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        [modulePath]: {
          error: error instanceof Error ? error.message : String(error),
          success: false,
        },
      }))
    }
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Module Diagnostics</h1>

      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">About This Tool</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          This tool helps diagnose module import issues by checking if modules can be loaded and what exports they
          provide. Use it to troubleshoot "does not provide an export" errors.
        </p>
      </div>

      <div className="mb-6">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={customModule}
            onChange={(e) => setCustomModule(e.target.value)}
            placeholder="Enter module path (e.g., @/components/footer)"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
          />
          <button
            onClick={testCustomModule}
            disabled={loading || !customModule.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Test Module
          </button>
        </div>

        <button
          onClick={runDiagnostics}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Running..." : "Run Full Diagnostics"}
        </button>
      </div>

      <div className="space-y-4">
        {diagnostics.map((diagnostic) => (
          <div
            key={diagnostic.path}
            className={`p-4 rounded-lg border ${
              diagnostic.success
                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{diagnostic.path}</h3>
              <div className="flex gap-2">
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    diagnostic.success
                      ? "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100"
                      : "bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100"
                  }`}
                >
                  {diagnostic.success ? "✅ Success" : "❌ Failed"}
                </span>
                <button
                  onClick={() => testSafeImport(diagnostic.path)}
                  className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 rounded hover:bg-blue-200 dark:hover:bg-blue-700"
                >
                  Test Safe Import
                </button>
              </div>
            </div>

            {diagnostic.error && (
              <div className="mb-2 p-2 bg-red-100 dark:bg-red-900/30 rounded text-sm">
                <strong>Error:</strong> {diagnostic.error}
              </div>
            )}

            {diagnostic.success && (
              <div>
                <p className="text-sm mb-2">
                  <strong>Has Default Export:</strong> {diagnostic.hasDefault ? "Yes" : "No"}
                </p>

                {diagnostic.exports.length > 0 && (
                  <div>
                    <strong className="text-sm">Exports:</strong>
                    <ul className="mt-1 space-y-1">
                      {diagnostic.exports.map((exp) => (
                        <li key={exp.name} className="text-sm ml-4">
                          • <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">{exp.name}</code>: {exp.type}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {testResults[diagnostic.path] && (
              <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm">
                <strong>Safe Import Test:</strong>
                {testResults[diagnostic.path].success ? (
                  <div>
                    <p>
                      ✅ Default Export: {testResults[diagnostic.path].defaultExport ? "Available" : "Not Available"}
                    </p>
                    {testResults[diagnostic.path].defaultType && (
                      <p>Type: {testResults[diagnostic.path].defaultType}</p>
                    )}
                    {testResults[diagnostic.path].namedExports.length > 0 && (
                      <p>Named Exports: {testResults[diagnostic.path].namedExports.join(", ")}</p>
                    )}
                  </div>
                ) : (
                  <p>❌ Error: {testResults[diagnostic.path].error}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {diagnostics.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No diagnostics run yet. Click "Run Full Diagnostics" to start.
        </div>
      )}
    </div>
  )
}
