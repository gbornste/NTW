"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { SafeWrapper } from "@/components/safe-wrapper"
import { requestPasswordReset } from "@/app/actions/password-reset"
import { AlertCircle, ArrowLeft, CheckCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function PasswordResetRequestPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const result = await requestPasswordReset(email)

      if (result.success) {
        setIsSubmitted(true)
        toast({
          title: "Reset link sent",
          description: "If an account exists with this email, you will receive a password reset link.",
        })
      } else {
        // For security reasons, we don't want to reveal if the email exists or not
        // So we still show success message but log the error
        console.error("Password reset request failed:", result.error)
        setIsSubmitted(true)
      }
    } catch (err) {
      console.error("Error requesting password reset:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SafeWrapper>
      <div className="container flex items-center justify-center py-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Reset Your Password</CardTitle>
            <CardDescription className="text-center">
              Enter your email address and we'll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className="space-y-4">
                <Alert variant="default" className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Email sent</AlertTitle>
                  <AlertDescription className="text-green-700">
                    If an account exists with the email {email}, you will receive a password reset link shortly. Please
                    check your inbox and spam folder.
                  </AlertDescription>
                </Alert>
                <div className="text-center mt-4">
                  <Button variant="outline" onClick={() => router.push("/login")} className="mx-auto">
                    Return to login
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/login" className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
              <ArrowLeft className="mr-1 h-4 w-4" /> Back to login
            </Link>
          </CardFooter>
        </Card>
      </div>
    </SafeWrapper>
  )
}
