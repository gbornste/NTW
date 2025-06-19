"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { handleOAuthCallback } from "@/app/actions/social-auth"
import { useAuth } from "@/contexts/simple-auth-context"
import { Loader2, CheckCircle, XCircle, ArrowLeft } from "lucide-react"

interface OAuthPageProps {
  params: {
    provider: string
  }
}

export default function OAuthPage({ params }: OAuthPageProps) {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const [userEmail, setUserEmail] = useState("")

  const router = useRouter()
  const searchParams = useSearchParams()
  const { refreshSession } = useAuth()

  const { provider } = params
  const callbackUrl = searchParams.get("callbackUrl") || "/create-card"

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log(`🔐 Processing ${provider} OAuth callback...`)

        // Simulate OAuth data (in real app, this would come from the provider)
        const mockUserData = {
          id: `${provider}_${Date.now()}`,
          email: `demo@${provider}.com`,
          name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
          firstName: `${provider.charAt(0).toUpperCase() + provider.slice(1)}`,
          lastName: "User",
          image: `/placeholder.svg?height=40&width=40&text=${provider.charAt(0).toUpperCase()}`,
        }

        const result = await handleOAuthCallback(provider, mockUserData)

        if (result.success) {
          setStatus("success")
          setUserEmail(result.email || mockUserData.email)
          setMessage(
            result.isNewUser
              ? "Account created successfully! Welcome to NoTrumpNWay!"
              : "Welcome back! You have been signed in successfully.",
          )

          // Refresh the auth session
          await refreshSession()

          // Redirect after a short delay
          setTimeout(() => {
            router.push(callbackUrl)
          }, 2000)
        } else {
          throw new Error(result.error || "OAuth callback failed")
        }
      } catch (error) {
        console.error(`❌ ${provider} OAuth error:`, error)
        setStatus("error")
        setMessage(error instanceof Error ? error.message : "Authentication failed")
      }
    }

    handleCallback()
  }, [provider, callbackUrl, router, refreshSession])

  const getProviderName = (provider: string) => {
    switch (provider) {
      case "google":
        return "Google"
      case "facebook":
        return "Facebook"
      case "apple":
        return "Apple"
      default:
        return provider.charAt(0).toUpperCase() + provider.slice(1)
    }
  }

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case "google":
        return "text-blue-600"
      case "facebook":
        return "text-blue-700"
      case "apple":
        return "text-gray-900 dark:text-white"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {status === "loading" && "Signing you in..."}
            {status === "success" && "Welcome!"}
            {status === "error" && "Authentication Failed"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "loading" && (
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
              <p className="text-gray-600 dark:text-gray-400">Completing your {getProviderName(provider)} sign-in...</p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center space-y-4">
              <CheckCircle className="h-8 w-8 mx-auto text-green-600" />
              <div className="space-y-2">
                <p className="text-green-600 font-medium">{message}</p>
                {userEmail && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Signed in as: <span className="font-medium">{userEmail}</span>
                  </p>
                )}
                <p className="text-sm text-gray-500">Redirecting you to the application...</p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <div className="text-center">
                <XCircle className="h-8 w-8 mx-auto text-red-600 mb-2" />
                <p className="text-red-600 font-medium">Authentication Error</p>
              </div>

              <Alert variant="destructive">
                <AlertDescription>{message}</AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Button onClick={() => router.push("/login")} className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()} className="w-full">
                  Try Again
                </Button>
              </div>
            </div>
          )}

          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            <p>
              Having trouble?{" "}
              <a href="/contact" className="text-blue-600 hover:underline">
                Contact support
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
