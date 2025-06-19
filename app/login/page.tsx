"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { LogIn, ShoppingBag, Eye, EyeOff, Shield, AlertCircle } from "lucide-react"

// Safe import of card storage service
let cardStorageService: any = null
if (typeof window !== "undefined") {
  try {
    const { cardStorageService: service } = require("@/lib/card-storage-service")
    cardStorageService = service
  } catch (error) {
    console.warn("Card storage service not available:", error)
  }
}

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loginError, setLoginError] = useState<string | null>(null)
  const [hasPendingCard, setHasPendingCard] = useState(false)

  // Get redirect URL from query params
  const redirectUrl = searchParams?.get("redirect") || "/create-card"

  // Check for pending card safely
  useEffect(() => {
    if (typeof window !== "undefined" && cardStorageService) {
      try {
        setHasPendingCard(cardStorageService.hasPendingCard())
      } catch (error) {
        console.warn("Error checking pending card:", error)
        setHasPendingCard(false)
      }
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }

    // Clear login error when user types
    if (loginError) {
      setLoginError(null)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || isLoading) {
      return
    }

    setIsLoading(true)

    try {
      // Simulate login process
      const loginResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      })

      const loginData = await loginResponse.json()

      if (loginResponse.ok && loginData.success) {
        // Store auth state
        localStorage.setItem("isAuthenticated", "true")
        localStorage.setItem("userEmail", formData.email)

        // Check if there's a pending card and redirect appropriately
        if (cardStorageService && cardStorageService.hasPendingCard()) {
          const pendingCard = cardStorageService.getCard()
          console.log("✅ Pending card found after login:", pendingCard)

          toast({
            title: "Login successful!",
            description: "You can now send your card.",
          })
        } else {
          toast({
            title: "Login successful!",
            description: "Welcome back to NoTrumpNWay.",
          })
        }

        // Redirect to the original page
        router.push(redirectUrl)
      } else {
        setLoginError(loginData.error || "Invalid email or password")
      }
    } catch (error) {
      console.error("Login error:", error)
      setLoginError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setIsLoading(true)

    try {
      // Demo login with predefined credentials
      const demoCredentials = {
        email: "demo@notrumpnway.com",
        password: "demo123",
      }

      // Store auth state for demo
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("userEmail", demoCredentials.email)
      localStorage.setItem("isDemoUser", "true")

      // Check if there's a pending card
      if (cardStorageService && cardStorageService.hasPendingCard()) {
        const pendingCard = cardStorageService.getCard()
        console.log("✅ Pending card found after demo login:", pendingCard)

        toast({
          title: "Demo login successful!",
          description: "You can now send your card.",
        })
      } else {
        toast({
          title: "Demo login successful!",
          description: "Welcome to the NoTrumpNWay demo account.",
        })
      }

      // Redirect to the original page
      router.push(redirectUrl)
    } catch (error) {
      console.error("Demo login error:", error)
      setLoginError("Failed to log in with demo account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container flex items-center justify-center py-12 px-4">
        <div className="grid lg:grid-cols-2 gap-8 w-full max-w-6xl">
          {/* Left Side - Branding */}
          <div className="hidden lg:flex flex-col justify-center items-center bg-white dark:bg-gray-800 p-12 rounded-2xl shadow-xl">
            <div className="mb-8">
              <Image
                src="/images/logo.png"
                alt="NoTrumpNWay Logo"
                width={120}
                height={120}
                className="mx-auto drop-shadow-lg"
                priority
              />
            </div>
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
              Welcome to NoTrumpNWay
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-8 text-lg leading-relaxed">
              Sign in to access exclusive political merchandise, create custom greeting cards, and explore our
              collection of political content.
            </p>

            {hasPendingCard && (
              <Alert className="mb-6 bg-amber-50 border-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  You have a card waiting to be sent! Sign in to continue.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-6 w-full max-w-sm">
              <div className="flex items-center space-x-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-700">
                <ShoppingBag className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Access exclusive political merchandise</span>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-green-50 dark:bg-green-900/30 rounded-xl border border-green-200 dark:border-green-700">
                <svg
                  className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">Create custom greeting cards</span>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-purple-50 dark:bg-purple-900/30 rounded-xl border border-purple-200 dark:border-purple-700">
                <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Secure login with verification</span>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex items-center justify-center">
            <Card className="w-full max-w-md shadow-2xl border-0">
              <CardHeader className="space-y-2 text-center pb-8">
                <div className="lg:hidden mb-4">
                  <Image
                    src="/images/logo.png"
                    alt="NoTrumpNWay Logo"
                    width={80}
                    height={80}
                    className="mx-auto"
                    priority
                  />
                </div>
                <CardTitle className="text-3xl font-bold">Sign In</CardTitle>
                <CardDescription className="text-base">Enter your credentials to access your account</CardDescription>

                {hasPendingCard && (
                  <Alert className="mt-4 bg-amber-50 border-amber-200">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800">
                      You have a card waiting to be sent! Sign in to continue.
                    </AlertDescription>
                  </Alert>
                )}
              </CardHeader>

              <CardContent className="space-y-6">
                {loginError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{loginError}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`h-12 ${errors.email ? "border-red-500 focus:border-red-500" : ""}`}
                      required
                    />
                    {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`h-12 pr-12 ${errors.password ? "border-red-500 focus:border-red-500" : ""}`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}

                    <div className="text-right">
                      <Link
                        href="/password-reset/request"
                        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-12 text-base font-medium" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Signing In...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <LogIn className="mr-2 h-5 w-5" />
                        Sign In
                      </span>
                    )}
                  </Button>
                </form>

                <Separator className="my-6" />

                {/* Demo Login Button */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-5">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 text-center">Quick Demo Access</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-4 text-center">
                    Try out all features instantly with our demo account
                  </p>

                  <Button
                    onClick={handleDemoLogin}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Loading Demo...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <LogIn className="mr-2 h-5 w-5" />
                        Login as Demo User
                      </span>
                    )}
                  </Button>

                  <div className="mt-3 text-xs text-center text-blue-600 dark:text-blue-400">
                    Email: demo@notrumpnway.com | Password: demo123
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4 pt-6">
                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{" "}
                  <Link
                    href="/signup"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    Sign up here
                  </Link>
                </div>

                <div className="text-center">
                  <Link
                    href="/"
                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    ← Back to Home
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
