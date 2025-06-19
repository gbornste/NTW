"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ReactErrorsDebugPage() {
  const [errorLog, setErrorLog] = useState<string[]>([])

  const addToLog = (message: string) => {
    setErrorLog((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const triggerObjectError = () => {
    try {
      // This simulates the error pattern we're seeing
      const problematicObject = {
        node: {
          key: null,
          props: { response: {} },
          _owner: null,
          _store: {},
        },
      }

      // This would cause the error
      throw problematicObject
    } catch (error) {
      addToLog("Triggered object error")
      console.error("Test object error:", error)
    }
  }

  const triggerPromiseRejection = () => {
    // Create an unhandled promise rejection
    Promise.reject({
      node: {
        key: null,
        props: { response: {} },
        _owner: null,
        _store: {},
      },
    }).catch(() => {
      addToLog("Promise rejection handled")
    })
  }

  const clearLog = () => {
    setErrorLog([])
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>React Errors Debug Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={triggerObjectError} variant="destructive">
              Trigger Object Error
            </Button>
            <Button onClick={triggerPromiseRejection} variant="destructive">
              Trigger Promise Rejection
            </Button>
            <Button onClick={clearLog} variant="outline">
              Clear Log
            </Button>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Error Log:</h3>
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded max-h-60 overflow-auto">
              {errorLog.length === 0 ? (
                <p className="text-gray-500">No errors logged yet</p>
              ) : (
                errorLog.map((log, index) => (
                  <div key={index} className="text-sm font-mono">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Instructions:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Click "Trigger Object Error" to simulate the React node error</li>
              <li>Click "Trigger Promise Rejection" to simulate unhandled promise rejection</li>
              <li>Check the browser console for detailed error information</li>
              <li>The global error handler should catch and log these errors</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
