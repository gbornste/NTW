"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Chrome, Facebook, Apple } from "lucide-react"

interface SocialLoginButtonsProps {
  onError?: (error: string) => void
  disabled?: boolean
  className?: string
}

export function SocialLoginButtons({ onError, disabled = false, className = "" }: SocialLoginButtonsProps) {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)

  const handleSocialLogin = async (provider: string) => {
    setLoadingProvider(provider)

    try {
      // Simulate social login for demo purposes
      console.log(`🔗 Initiating ${provider} login...`)

      // In a real implementation, this would redirect to the OAuth provider
      // For now, we'll just show a message
      if (onError) {
        onError(`${provider} login is not configured yet. Please use the demo account.`)
      }
    } catch (error) {
      console.error(`❌ ${provider} login error:`, error)
      if (onError) {
        onError(`Failed to connect to ${provider}. Please try again.`)
      }
    } finally {
      setLoadingProvider(null)
    }
  }

  const isLoading = (provider: string) => loadingProvider === provider
  const isAnyLoading = loadingProvider !== null

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Google Login */}
      <Button
        type="button"
        variant="outline"
        className="w-full border-gray-300 hover:bg-gray-50 hover:border-gray-400 dark:border-gray-600 dark:hover:bg-gray-800"
        onClick={() => handleSocialLogin("Google")}
        disabled={disabled || isAnyLoading}
      >
        {isLoading("Google") ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span>Connecting to Google...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Chrome className="h-4 w-4 text-blue-600" />
            <span>Continue with Google</span>
          </div>
        )}
      </Button>

      {/* Facebook Login */}
      <Button
        type="button"
        variant="outline"
        className="w-full border-gray-300 hover:bg-blue-50 hover:border-blue-200 dark:border-gray-600 dark:hover:bg-blue-900/20"
        onClick={() => handleSocialLogin("Facebook")}
        disabled={disabled || isAnyLoading}
      >
        {isLoading("Facebook") ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
            <span>Connecting to Facebook...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Facebook className="h-4 w-4 text-blue-700" />
            <span>Continue with Facebook</span>
          </div>
        )}
      </Button>

      {/* Apple Login */}
      <Button
        type="button"
        variant="outline"
        className="w-full border-gray-300 hover:bg-gray-50 hover:border-gray-400 dark:border-gray-600 dark:hover:bg-gray-800"
        onClick={() => handleSocialLogin("Apple")}
        disabled={disabled || isAnyLoading}
      >
        {isLoading("Apple") ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 dark:border-gray-100"></div>
            <span>Connecting to Apple...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Apple className="h-4 w-4 text-gray-900 dark:text-gray-100" />
            <span>Continue with Apple</span>
          </div>
        )}
      </Button>

      <div className="text-xs text-gray-500 text-center mt-3">
        By continuing, you agree to our{" "}
        <a href="/terms" className="text-blue-600 hover:underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/privacy" className="text-blue-600 hover:underline">
          Privacy Policy
        </a>
      </div>
    </div>
  )
}
