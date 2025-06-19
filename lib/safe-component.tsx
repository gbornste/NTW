"use client"

import React, { type ComponentType } from "react"
import { SafeImport } from "./safe-import"

interface SafeComponentProps {
  componentPath: string
  fallback?: React.ReactNode
  props?: Record<string, any>
}

export function SafeComponent({ componentPath, fallback = null, props = {} }: SafeComponentProps) {
  const [Component, setComponent] = React.useState<ComponentType<any> | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function loadComponent() {
      try {
        setLoading(true)
        const result = await SafeImport.getDefaultExport<ComponentType<any>>(componentPath)

        if (result) {
          setComponent(() => result)
          setError(null)
        } else {
          setError(`Component not found in ${componentPath}`)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err))
      } finally {
        setLoading(false)
      }
    }

    loadComponent()
  }, [componentPath])

  if (loading) {
    return <div className="p-4 text-center">Loading component...</div>
  }

  if (error || !Component) {
    console.error(`Error loading component from ${componentPath}:`, error)
    return fallback ? <>{fallback}</> : <div className="p-4 text-center text-red-500">Failed to load component</div>
  }

  try {
    return <Component {...props} />
  } catch (err) {
    console.error(`Error rendering component from ${componentPath}:`, err)
    return fallback ? <>{fallback}</> : <div className="p-4 text-center text-red-500">Failed to render component</div>
  }
}

export default SafeComponent
