"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

export function SocialLoginStatus() {
  // Check environment variables for social login configuration
  const googleConfigured = !!(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
  const facebookConfigured = !!(process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET)
  const appleConfigured = !!(process.env.NEXT_PUBLIC_APPLE_CLIENT_ID && process.env.APPLE_CLIENT_SECRET)

  const providers = [
    { name: "Google", configured: googleConfigured },
    { name: "Facebook", configured: facebookConfigured },
    { name: "Apple", configured: appleConfigured },
  ]

  const configuredCount = providers.filter((p) => p.configured).length
  const totalProviders = providers.length

  return (
    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Social Login Configuration Status</h4>

      <div className="space-y-2">
        {providers.map((provider) => (
          <div key={provider.name} className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">{provider.name}</span>
            <div className="flex items-center space-x-2">
              {provider.configured ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                    Configured
                  </Badge>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-red-500" />
                  <Badge variant="secondary" className="text-xs bg-red-100 text-red-800">
                    Not Configured
                  </Badge>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          {configuredCount === totalProviders ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : configuredCount > 0 ? (
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          ) : (
            <XCircle className="h-4 w-4 text-red-500" />
          )}
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {configuredCount} of {totalProviders} providers configured
          </span>
        </div>
      </div>

      {configuredCount === 0 && (
        <Alert className="mt-3">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            No social login providers are configured. Add environment variables to enable social authentication.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
