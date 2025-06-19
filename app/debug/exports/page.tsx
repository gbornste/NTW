"use client"

import { useState, useEffect } from "react"
import { safeImport } from "@/lib/safe-import"

interface ModuleExport {
  name: string
  type: string
}

interface ModuleInfo {
  path: string
  exports: ModuleExport[]
  error?: string
  loading: boolean
}

export default function ExportsDebugPage() {
  const [moduleInfo, setModuleInfo] = useState<ModuleInfo>({
    path: "components/footer",
    exports: [],
    loading: false,
  })
  const [modulePath, setModulePath] = useState("components/footer")

  const checkModule = async (path: string) => {
    setModuleInfo({
      path,
      exports: [],
      loading: true,
    })

    const { module, error } = await safeImport(path)

    if (error || !module) {
      setModuleInfo({
        path,
        exports: [],
        error: error || "Failed to load module",
        loading: false,
      })
      return
    }

    const exports: ModuleExport[] = []
    for (const key in module) {
      exports.push({
        name: key,
        type: typeof module[key],
      })
    }

    setModuleInfo({
      path,
      exports,
      loading: false,
    })
  }

  useEffect(() => {
    checkModule("components/footer")
  }, [])

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Module Export Diagnostics</h1>

      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={modulePath}
            onChange={(e) => setModulePath(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Module path (e.g. components/footer)"
          />
          <button
            onClick={() => checkModule(modulePath)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
            disabled={moduleInfo.loading}
          >
            {moduleInfo.loading ? "Loading..." : "Check Module"}
          </button>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-md">
        <h2 className="text-xl font-semibold mb-2">Module: @/{moduleInfo.path}</h2>

        {moduleInfo.error ? (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700">Error: {moduleInfo.error}</p>
          </div>
        ) : moduleInfo.loading ? (
          <p>Loading module information...</p>
        ) : moduleInfo.exports.length === 0 ? (
          <p>No exports found in this module.</p>
        ) : (
          <div>
            <p className="mb-2">Found {moduleInfo.exports.length} exports:</p>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Export Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                </tr>
              </thead>
              <tbody>
                {moduleInfo.exports.map((exp) => (
                  <tr key={exp.name}>
                    <td className="border border-gray-300 px-4 py-2">{exp.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{exp.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Quick Check Common Components</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => checkModule("components/footer")}
            className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Footer
          </button>
          <button
            onClick={() => checkModule("components/navbar")}
            className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Navbar
          </button>
          <button
            onClick={() => checkModule("components/auth-provider")}
            className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            AuthProvider
          </button>
          <button
            onClick={() => checkModule("components/theme-provider")}
            className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            ThemeProvider
          </button>
          <button
            onClick={() => checkModule("contexts/auth-context")}
            className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            AuthContext
          </button>
          <button
            onClick={() => checkModule("contexts/cart-context")}
            className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            CartContext
          </button>
        </div>
      </div>
    </div>
  )
}
