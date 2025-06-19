"use client"

import { useEffect, useState } from "react"
import { getProviders } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function SocialLoginDebug() {
  const [providers, setProviders] = useState<any>(null)
  const [envVars, setEnvVars] = useState<any>({})

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const authProviders = await getProviders()
        setProviders(authProviders)
      } catch (error) {
        console.error("Error loading providers:", error)
      }
    }

    // Check environment variables (client-side accessible ones)
    setEnvVars({
      NEXTAUTH_URL: process.env.NEXT_PUBLIC_NEXTAUTH_URL || "Not set",
      NODE_ENV: process.env.NODE_ENV,
    })

    loadProviders()
  }, [])

  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-sm">🔍 Social Login Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Available Providers:</h4>
          {providers ? (
            <div className="space-y-2">
              {Object.values(providers).map((provider: any) => (
                <div key={provider.id} className="flex items-center justify-between">
                  <span className="text-sm">{provider.name}</span>
                  <Badge variant={provider.id === "credentials" ? "secondary" : "default"}>{provider.id}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Loading providers...</p>
          )}
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Environment:</h4>
          <div className="space-y-1">
            {Object.entries(envVars).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between text-xs">
                <span>{key}:</span>
                <span className="font-mono">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Social Login Status:</h4>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Google:</span>
              <Badge variant={providers?.google ? "default" : "destructive"}>
                {providers?.google ? "Available" : "Not configured"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Facebook:</span>
              <Badge variant={providers?.facebook ? "default" : "destructive"}>
                {providers?.facebook ? "Available" : "Not configured"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Apple:</span>
              <Badge variant={providers?.apple ? "default" : "destructive"}>
                {providers?.apple ? "Available" : "Not configured"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
