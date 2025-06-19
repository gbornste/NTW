"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { verifyUserAccount, resendVerificationPin } from "../actions/user-actions"

export default function VerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [email, setEmail] = useState("")
  const [pin, setPin] = useState("")
  const [pinInputs, setPinInputs] = useState(["", "", "", "", ""])

  // Get email from query parameter
  useEffect(() => {
    const emailParam = searchParams.get("email")
    if (emailParam) {
      setEmail(emailParam)
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
    if (value && index < 4) {
      const nextInput = document.getElementById(`pin-${index + 1}`)
      if (nextInput) nextInput.focus()
    }

    setPinInputs(newPinInputs)
    setPin(newPinInputs.join(""))
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

    // Check if pasted content is a 5-digit number
    if (/^\d{5}$/.test(pastedData)) {
      const digits = pastedData.split("")
      const newPinInputs = digits.slice(0, 5)
      setPinInputs(newPinInputs)
      setPin(newPinInputs.join(""))

      // Focus the last input
      const lastInput = document.getElementById("pin-4")
      if (lastInput) lastInput.focus()
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (pin.length !== 5) {
      toast({
        title: "Invalid PIN",
        description: "Please enter all 5 digits of your verification PIN.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await verifyUserAccount(email, pin)

      toast({
        title: "Account verified successfully!",
        description: "You can now log in with your email and password.",
      })

      // Redirect to login page
      router.push("/login")
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

  // Handle resend verification PIN
  const handleResend = async () => {
    setIsResending(true)

    try {
      await resendVerificationPin(email)

      toast({
        title: "Verification PIN resent",
        description: "Please check your email for the new verification PIN.",
      })
    } catch (error) {
      toast({
        title: "Failed to resend verification PIN",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="container py-10 px-4 md:px-6">
      <div className="flex flex-col items-center text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Verify Your Account</h1>
        <p className="text-muted-foreground max-w-[700px]">
          We've sent a verification PIN to your email address. Please enter it below to verify your account.
        </p>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Enter Verification PIN</CardTitle>
          <CardDescription>Please check your email ({email}) for a 5-digit PIN and enter it below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="pin-0">Verification PIN</Label>
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

            <Button type="submit" className="w-full" disabled={isSubmitting || pin.length !== 5}>
              {isSubmitting ? "Verifying..." : "Verify Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Didn't receive the PIN?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="text-primary font-medium hover:underline"
            >
              {isResending ? "Resending..." : "Resend PIN"}
            </button>
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Button variant="outline" asChild>
              <Link href="/login">Back to Login</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Home</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>

      <div className="mt-8 text-center">
        <h2 className="text-xl font-semibold mb-4">Or Verify With</h2>
        <div className="flex justify-center gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
            </svg>
            Google
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
            </svg>
            Facebook
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43Zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282Z" />
            </svg>
            Apple
          </Button>
        </div>
      </div>
    </div>
  )
}
