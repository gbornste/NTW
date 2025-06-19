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
import { verifyUserEmail, resendVerificationCode } from "../actions/user-actions"
import { CheckCircle, AlertCircle, Mail, RefreshCw } from "lucide-react"
import Image from "next/image"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [pinInputs, setPinInputs] = useState(["", "", "", "", "", ""])
  const [isVerified, setIsVerified] = useState(false)
  const [demoCode, setDemoCode] = useState("")

  // Get email from query parameter
  useEffect(() => {
    const emailParam = searchParams.get("email")
    const codeParam = searchParams.get("code") // For demo purposes
    if (emailParam) {
      setEmail(emailParam)
    }
    if (codeParam) {
      setDemoCode(codeParam)
    }
  }, [searchParams])

  // Handle PIN input change
  const handlePinChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return

    // Update the specific input
    const newPinInputs = [...pinInputs]
    newPinInputs[index] = value

    // Auto-focus next input if value is entered
    if (value && index < 5) {
      const nextInput = document.getElementById(`pin-${index + 1}`)
      if (nextInput) nextInput.focus()
    }

    setPinInputs(newPinInputs)
    setVerificationCode(newPinInputs.join(""))
  }

  // Handle key down for backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // If backspace is pressed and current input is empty, focus previous input
    if (e.key === "Backspace" && !pinInputs[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").trim()

    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("")
      const newPinInputs = digits.slice(0, 6)
      setPinInputs(newPinInputs)
      setVerificationCode(newPinInputs.join(""))

      // Focus the last input
      const lastInput = document.getElementById("pin-5")
      if (lastInput) lastInput.focus()
    }
  }

  // Auto-fill demo code if available
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
      const result = await verifyUserEmail(email, verificationCode)

      if (result.success) {
        setIsVerified(true)
        toast({
          title: "Email verified successfully!",
          description: "Your account is now verified. You can log in and access all features.",
        })

        // Redirect to login page after a short delay
        setTimeout(() => {
          router.push("/login?message=Email verified successfully")
        }, 2000)
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
        description: error instanceof Error ? error.message : "Please try again.",
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
      const result = await resendVerificationCode(email)

      if (result.success) {
        // Update demo code if provided
        if (result.verificationCode) {
          setDemoCode(result.verificationCode)
        }

        toast({
          title: "Verification code resent",
          description: "Please check your email for the new verification code.",
        })

        // Clear current inputs
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
        description: error instanceof Error ? error.message : "Please try again.",
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
              <CardTitle className="text-2xl font-bold text-green-800">Email Verified!</CardTitle>
              <CardDescription>Your account has been successfully verified.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">You can now log in and access all features of NoTrumpNWay.</p>
              <Button asChild className="w-full">
                <Link href="/login">Continue to Login</Link>
              </Button>
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
            <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
            <CardDescription>
              We've sent a verification code to your email address. Please enter it below to verify your account.
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
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting || verificationCode.length !== 6}>
                {isSubmitting ? (
                  <span className="flex items-center">
                    <RefreshCw className="animate-spin -ml-1 mr-3 h-4 w-4" />
                    Verifying...
                  </span>
                ) : (
                  "Verify Email"
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
