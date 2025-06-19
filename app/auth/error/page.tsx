"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default function AuthErrorPage() {
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchParams = useSearchParams()

  useEffect(() => {
    setMounted(true)
    if (searchParams) {
      setError(searchParams.get("error"))
    }
  }, [searchParams])

  if (!mounted) {
    return (
      <div className="container max-w-md py-10">
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case "Configuration":
        return "There is a problem with the server configuration."
      case "AccessDenied":
        return "Access denied. You do not have permission to sign in."
      case "Verification":
        return "The verification token has expired or has already been used."
      case "Default":
        return "An error occurred during authentication."
      case "Signin":
        return "Error occurred during sign in."
      case "OAuthSignin":
        return "Error in constructing an authorization URL."
      case "OAuthCallback":
        return "Error in handling the response from an OAuth provider."
      case "OAuthCreateAccount":
        return "Could not create OAuth account in the database."
      case "EmailCreateAccount":
        return "Could not create email account in the database."
      case "Callback":
        return "Error in the OAuth callback handler route."
      case "OAuthAccountNotLinked":
        return "The email on the account is already linked, but not with this OAuth account."
      case "EmailSignin":
        return "Sending the e-mail with the verification token failed."
      case "CredentialsSignin":
        return "The authorize callback returned null in the Credentials provider."
      case "SessionRequired":
        return "The content of this page requires you to be signed in at all times."
      default:
        return error || "An unknown error occurred during authentication."
    }
  }

  return (
    <div className="container max-w-md py-10">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-red-600">Authentication Error</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">{getErrorMessage(error)}</p>

          {error && (
            <div className="rounded-md bg-gray-50 p-3">
              <p className="text-sm text-gray-500">
                <strong>Error Code:</strong> {error}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href="/login">Try Again</Link>
            </Button>

            <Button asChild variant="outline" className="w-full">
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
