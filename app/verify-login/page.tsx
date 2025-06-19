"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, AlertCircle, Mail, RefreshCw, Shield, ArrowRight } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/contexts/simple-auth-context"

export default function VerifyLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { refreshSession } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [email, setEmail] = useState("")
  const [sessionToken, setSessionToken] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [pinInputs, setPinInputs] = useState(["", "", "", "", "", ""])
  const [isVerified, setIsVerified] = useState(false)
  const [demoCode, setDemoCode] = useState("")
  const [redirectUrl, setRedirectUrl] = useState("/create-card")

  // Get parameters from query
  useEffect(() => {
    const emailParam = searchParams.get("email")
    const tokenParam = searchParams.get("token")
    const codeParam = searchParams.get("code")
    const redirectParam = searchParams.get("redirect")

    if (emailParam) setEmail(emailParam)
    if (tokenParam) setSessionToken(tokenParam)
    if (codeParam) setDemoCode(codeParam)
    if (redirectParam) setRedirectUrl(redirectParam)

    // Auto-verify demo accounts
    if (tokenParam === "demo_session") {
      handleDemoVerification()
    }
  }, [searchParams])

  // Handle demo account auto-verification
  const handleDemoVerification = async () => {
    try {
      setIsVerified(true)
      toast({
        title: "Demo account verified!",
        description: "Welcome back! Redirecting to create cards...",
      })

      // Refresh session to ensure auth state is updated
      await refreshSession()

      // Redirect after a short delay
      setTimeout(() => {
        router.push(redirectUrl)
      }, 1500)
    } catch (error) {
      console.error("Demo verification error:", error)
    }
  }

  // Handle PIN input change
  const handlePinChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return

    const newPinInputs = [...pinInputs]
    newPinInputs[index] = value

    if (value && index < 5) {
      const nextInput = document.getElementById(`pin-${index + 1}`)
      if (nextInput) nextInput.focus()
    }

    setPinInputs(newPinInputs)
    setVerificationCode(newPinInputs.join(""))
  }

  // Handle key down for backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !pinInputs[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").trim()

    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("")
      const newPinInputs = digits.slice(0, 6)
      setPinInputs(newPinInputs)
      setVerificationCode(newPinInputs.join(""))

      const lastInput = document.getElementById("pin-5")
      if (lastInput) lastInput.focus()
    }
  }

  // Auto-fill demo code
  const handleUseDemoCode = () => {
    if (demoCode) {
      const digits = demoCode.split("")
      const newPinInputs = digits.slice(0, 6)
      setPinInputs(newPinInputs)
      setVerificationCode(newPinInputs.join(""))

      toast({
        title: "Demo code filled",
        description: "Demo verification code has been entered for you.",
      })
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (verificationCode.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter all 6 digits of your verification code.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/verify-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionToken,
          code: verificationCode,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setIsVerified(true)
        toast({
          title: "Login verified successfully!",
          description: "Welcome back! Redirecting to create cards...",
        })

        // Refresh session to ensure auth state is updated
        await refreshSession()

        // Redirect after a short delay
        setTimeout(() => {
          router.push(redirectUrl)
        }, 1500)
      } else {
        toast({
          title: "Verification failed",
          description: result.error || "Please check your code and try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Verification failed",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle resend verification code
  const handleResend = async () => {
    setIsResending(true)

    try {
      const response = await fetch("/api/resend-login-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionToken }),
      })

      const result = await response.json()

      if (result.success) {
        if (result.code) {
          setDemoCode(result.code)
        }

        toast({
          title: "Verification code resent",
          description: "Please check your email for the new verification code.",
        })

        setPinInputs(["", "", "", "", "", ""])
        setVerificationCode("")
      } else {
        toast({
          title: "Failed to resend code",
          description: result.error || "Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Failed to resend verification code",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsResending(false)
    }
  }

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container flex items-center justify-center py-12 px-4">
          <Card className="w-full max-w-md shadow-2xl border-0">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-green-800">Login Verified!</CardTitle>
              <CardDescription>Your identity has been successfully verified.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">Redirecting you to create cards...</p>
              <div className="flex items-center justify-center gap-2 text-blue-600">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span className="text-sm">Taking you to card creation</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md shadow-2xl border-0">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto mb-4">
              <Image
                src="/images/logo.png"
                alt="NoTrumpNWay Logo"
                width={80}
                height={80}
                className="mx-auto"
                priority
              />
            </div>
            <div className="mx-auto mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Verify Your Login</CardTitle>
            <CardDescription>
              For your security, we've sent a verification code to your email address. Please enter it below to complete
              your login.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{email}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pin-0">6-Digit Verification Code</Label>
                  <div className="flex justify-center gap-2">
                    {pinInputs.map((digit, index) => (
                      <Input
                        key={index}
                        id={`pin-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handlePinChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={index === 0 ? handlePaste : undefined}
                        className="w-12 h-12 text-center text-lg"
                        autoFocus={index === 0}
                      />
                    ))}
                  </div>
                </div>

                {/* Demo code helper */}
                {demoCode && (
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="flex items-center justify-between">
                      <span className="text-sm">
                        <strong>Demo Mode:</strong> Your verification code is{" "}
                        <code className="font-mono bg-blue-100 px-1 rounded">{demoCode}</code>
                      </span>
                      <Button type="button" variant="outline" size="sm" onClick={handleUseDemoCode} className="ml-2">
                        Use Code
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Security notice */}
                <Alert className="bg-amber-50 border-amber-200">
                  <Shield className="h-4 w-4" />
                  <AlertDescription className="text-sm text-amber-800">
                    This additional verification step helps protect your account from unauthorized access.
                  </AlertDescription>
                </Alert>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting || verificationCode.length !== 6}>
                {isSubmitting ? (
                  <span className="flex items-center">
                    <RefreshCw className="animate-spin -ml-1 mr-3 h-4 w-4" />
                    Verifying...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Shield className="mr-2 h-4 w-4" />
                    Verify & Continue
                  </span>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col items-center justify-center space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
              <Button
                type="button"
                variant="outline"
                onClick={handleResend}
                disabled={isResending}
                className="flex items-center gap-2"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="animate-spin h-4 w-4" />
                    Resending...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    Resend Code
                  </>
                )}
              </Button>
            </div>

            <div className="flex items-center justify-center gap-4">
              <Button variant="ghost" asChild>
                <Link href="/login">Back to Login</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/">Home</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
