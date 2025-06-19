"use client"

import { Button } from "@/components/ui/button"
import React, { Suspense } from "react"

interface SafeWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  onError?: (error: Error) => void
}

// Helper function to safely convert objects to strings
function safeStringify(obj: any): string {
  try {
    if (obj === null || obj === undefined) {
      return String(obj)
    }

    if (typeof obj === "string" || typeof obj === "number" || typeof obj === "boolean") {
      return String(obj)
    }

    if (typeof obj === "object") {
      // Handle React elements and components
      if (React.isValidElement(obj)) {
        return "[React Element]"
      }

      // Handle the specific error pattern we're seeing
      if (obj.node && typeof obj.node === "object") {
        return "[React Node Object]"
      }

      // Handle arrays
      if (Array.isArray(obj)) {
        return `[Array(${obj.length})]`
      }

      // Handle functions
      if (typeof obj === "function") {
        return `[Function: ${obj.name || "anonymous"}]`
      }

      // Handle objects with React-specific properties
      if (obj._owner !== undefined || obj.props !== undefined || obj.key !== undefined) {
        return "[React Component/Element]"
      }

      // Handle objects with circular references or complex structures
      try {
        return JSON.stringify(
          obj,
          (key, value) => {
            if (typeof value === "object" && value !== null) {
              // Handle React-specific objects
              if (value._owner !== undefined || value.props !== undefined || value.node !== undefined) {
                return "[React Object]"
              }
              // Handle functions in objects
              if (typeof value === "function") {
                return `[Function: ${value.name || "anonymous"}]`
              }
            }
            return value
          },
          2,
        )
      } catch {
        return "[Object (non-serializable)]"
      }
    }

    return String(obj)
  } catch (error) {
    return "[Object (conversion failed)]"
  }
}

// Helper function to extract meaningful error information
function extractErrorInfo(error: any): { message: string; name: string; isReactError: boolean } {
  try {
    // Handle the specific error pattern we're seeing
    if (error && typeof error === "object" && error.node) {
      return {
        message: "React component rendering error",
        name: "ReactRenderError",
        isReactError: true,
      }
    }

    // Handle standard Error objects
    if (error instanceof Error) {
      return {
        message: error.message || "Unknown error",
        name: error.name || "Error",
        isReactError: error.message?.includes("React") || error.name?.includes("React") || false,
      }
    }

    // Handle string errors
    if (typeof error === "string") {
      return {
        message: error,
        name: "StringError",
        isReactError: error.includes("React"),
      }
    }

    // Handle other object types
    if (typeof error === "object" && error !== null) {
      return {
        message: "Object error occurred",
        name: "ObjectError",
        isReactError: true,
      }
    }

    return {
      message: "Unknown error occurred",
      name: "UnknownError",
      isReactError: false,
    }
  } catch {
    return {
      message: "Error processing failed",
      name: "ProcessingError",
      isReactError: false,
    }
  }
}

class SafeErrorBoundary extends React.Component<
  SafeWrapperProps & { children: React.ReactNode },
  { hasError: boolean; error?: any; errorInfo?: React.ErrorInfo; errorDetails?: any }
> {
  constructor(props: SafeWrapperProps & { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error: any, errorInfo: React.ErrorInfo) {
    try {
      const errorDetails = extractErrorInfo(error)

      console.group("🚨 SafeWrapper Error Details")
      console.error("Raw error object:", error)
      console.error("Error details:", errorDetails)

      if (errorInfo?.componentStack) {
        console.error("Component stack:", errorInfo.componentStack)
      }

      // Log the specific error pattern we're seeing
      if (error && typeof error === "object" && error.node) {
        console.error("React node error detected:", {
          hasNode: !!error.node,
          nodeKeys: error.node ? Object.keys(error.node) : [],
          nodeProps: error.node?.props ? Object.keys(error.node.props) : [],
        })
      }

      console.groupEnd()

      // Safely update state
      this.setState({
        errorInfo: errorInfo || undefined,
        error: error,
        errorDetails,
      })

      // Safely call onError callback
      if (this.props.onError && typeof this.props.onError === "function") {
        try {
          // Convert the error to a standard Error object for the callback
          const standardError = error instanceof Error ? error : new Error(errorDetails.message)
          this.props.onError(standardError)
        } catch (callbackError) {
          console.error("Error in onError callback:", callbackError)
        }
      }
    } catch (catchError) {
      console.error("Error in componentDidCatch:", catchError)
      // Fallback error handling
      this.setState({
        hasError: true,
        error: new Error("Critical error in error boundary"),
        errorDetails: {
          message: "Critical error in error boundary",
          name: "CriticalError",
          isReactError: false,
        },
      })
    }
  }

  render() {
    if (this.state.hasError) {
      const errorDetails = this.state.errorDetails || {
        message: "Unknown error occurred",
        name: "UnknownError",
        isReactError: false,
      }

      const isObjectConversionError = errorDetails.message.includes("Cannot convert object to primitive value")
      const isModuleError = errorDetails.message.includes("does not provide an export")

      return (
        this.props.fallback || (
          <div className="p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 rounded-md">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  {isObjectConversionError
                    ? "Data Type Error"
                    : isModuleError
                      ? "Module Loading Error"
                      : errorDetails.isReactError
                        ? "Component Rendering Error"
                        : "Application Error"}
                </h3>
                <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                  {isObjectConversionError
                    ? "A component received incompatible data that couldn't be converted to a display value."
                    : isModuleError
                      ? "A required module failed to load properly."
                      : errorDetails.isReactError
                        ? "A React component failed to render. This might be due to invalid props or component structure."
                        : "An unexpected error occurred in the application."}
                </p>
                <div className="mt-3 flex gap-2">
                  <Button
                    onClick={() => window.location.reload()}
                    className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1"
                  >
                    Reload Page
                  </Button>
                  <Button onClick={() => (window.location.href = "/")} variant="outline" className="text-xs px-3 py-1">
                    Go Home
                  </Button>
                </div>
                {process.env.NODE_ENV === "development" && (
                  <details className="mt-3">
                    <summary className="text-xs text-red-600 dark:text-red-400 cursor-pointer">
                      Technical Details (Development)
                    </summary>
                    <div className="mt-1 text-xs bg-red-100 dark:bg-red-800 p-2 rounded overflow-auto max-h-40">
                      <div>
                        <strong>Error Type:</strong> {errorDetails.name}
                      </div>
                      <div>
                        <strong>Message:</strong> {errorDetails.message}
                      </div>
                      <div>
                        <strong>Is React Error:</strong> {errorDetails.isReactError ? "Yes" : "No"}
                      </div>
                      {this.state.error && (
                        <div className="mt-2">
                          <strong>Raw Error:</strong>
                          <pre className="whitespace-pre-wrap text-xs mt-1">{safeStringify(this.state.error)}</pre>
                        </div>
                      )}
                    </div>
                  </details>
                )}
              </div>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}

export function SafeWrapper({ children, fallback, onError }: SafeWrapperProps) {
  return (
    <SafeErrorBoundary fallback={fallback} onError={onError}>
      <Suspense
        fallback={
          fallback || (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          )
        }
      >
        {children}
      </Suspense>
    </SafeErrorBoundary>
  )
}

export default SafeWrapper
