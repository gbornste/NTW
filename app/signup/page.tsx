"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { SafeWrapper } from "@/components/safe-wrapper"

// Add the missing imports at the top of the file
import { UserPlus, Eye, EyeOff, ShoppingBag } from "lucide-react"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"

// List of US states for the dropdown
const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
]

// Simple user creation function (demo implementation)
async function createUser(userData: any) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Demo validation
  if (!userData.email || !userData.password) {
    throw new Error("Email and password are required")
  }

  if (userData.email === "existing@example.com") {
    throw new Error("Email already in use. Please use a different email address.")
  }

  // Simulate successful user creation
  console.log("Demo user created:", userData.email)
  return { success: true, userId: `user_${Date.now()}` }
}

function SignupContent() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    birthday: "",
  })

  // Form validation state
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validatePassword = useCallback((password: string) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    }
    return requirements
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleStateChange = (value: string) => {
    setFormData((prev) => ({ ...prev, state: value }))
    if (errors.state) {
      setErrors((prev) => ({ ...prev, state: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Required fields
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else {
      const passwordReqs = validatePassword(formData.password)
      if (!passwordReqs.length) newErrors.password = "Password must be at least 8 characters"
      if (!passwordReqs.uppercase || !passwordReqs.lowercase)
        newErrors.password = "Password must include both uppercase and lowercase letters"
      if (!passwordReqs.number) newErrors.password = "Password must include at least one number"
      if (!passwordReqs.special) newErrors.password = "Password must include at least one special character"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    // Optional field validation
    if (formData.zipCode && !/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = "Please enter a valid ZIP code"
    }

    if (formData.birthday) {
      const birthDate = new Date(formData.birthday)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      if (age < 13) {
        newErrors.birthday = "You must be at least 13 years old to create an account"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const result = await createUser(formData)

      if (result.success) {
        if (result.requiresVerification) {
          toast({
            title: "Account created successfully!",
            description: "Please check your email to verify your account before logging in.",
          })

          // Redirect to verification page with email and demo code
          const verifyUrl = `/verify-email?email=${encodeURIComponent(formData.email)}${
            result.verificationCode ? `&code=${result.verificationCode}` : ""
          }`
          router.push(verifyUrl)
        } else {
          toast({
            title: "Account created successfully!",
            description: "Welcome to NoTrumpNWay! You can now log in.",
          })

          // Redirect to login page for demo accounts
          router.push("/login?message=Account created successfully")
        }
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "There was an error creating your account.",
        variant: "destructive",
      })
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
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">Join NoTrumpNWay</h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-8 text-lg leading-relaxed">
              Create your account to access exclusive political merchandise, design custom greeting cards, and join our
              community of political enthusiasts.
            </p>

            <div className="space-y-6 w-full max-w-sm">
              <div className="flex items-center space-x-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-700">
                <ShoppingBag className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Shop exclusive political merchandise</span>
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
                <span className="text-gray-700 dark:text-gray-300">Design custom greeting cards</span>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-purple-50 dark:bg-purple-900/30 rounded-xl border border-purple-200 dark:border-purple-700">
                <svg
                  className="h-6 w-6 text-purple-600 dark:text-purple-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">Play political games and quizzes</span>
              </div>
            </div>
          </div>

          {/* Right Side - Signup Form */}
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
                <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
                <CardDescription className="text-base">
                  Join NoTrumpNWay and start your political journey
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Required Fields Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-red-600">Required Information</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm font-medium">
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`h-12 ${errors.firstName ? "border-red-500 focus:border-red-500" : ""}`}
                          required
                        />
                        {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm font-medium">
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`h-12 ${errors.lastName ? "border-red-500 focus:border-red-500" : ""}`}
                          required
                        />
                        {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
                      </div>
                    </div>

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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-sm font-medium">
                          Confirm Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className={`h-12 pr-12 ${errors.confirmPassword ? "border-red-500 focus:border-red-500" : ""}`}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Optional Fields Section */}
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-semibold text-gray-600">Optional Information</h3>

                    <div className="space-y-2">
                      <Label htmlFor="birthday" className="text-sm font-medium">
                        Birthday
                      </Label>
                      <Input
                        id="birthday"
                        name="birthday"
                        type="date"
                        value={formData.birthday}
                        onChange={handleInputChange}
                        className={`h-12 ${errors.birthday ? "border-red-500 focus:border-red-500" : ""}`}
                      />
                      {errors.birthday && <p className="text-sm text-red-500 mt-1">{errors.birthday}</p>}
                      <p className="text-xs text-gray-500">
                        We use this to send you birthday cards and age-appropriate content
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm font-medium">
                        Street Address
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        placeholder="123 Main Street"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="h-12"
                      />
                      <p className="text-xs text-gray-500">For shipping physical merchandise (optional)</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-sm font-medium">
                          City
                        </Label>
                        <Input
                          id="city"
                          name="city"
                          placeholder="New York"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-sm font-medium">
                          State
                        </Label>
                        <Select value={formData.state} onValueChange={handleStateChange}>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            {US_STATES.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="zipCode" className="text-sm font-medium">
                          ZIP Code
                        </Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          placeholder="10001"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className={`h-12 ${errors.zipCode ? "border-red-500 focus:border-red-500" : ""}`}
                        />
                        {errors.zipCode && <p className="text-sm text-red-500 mt-1">{errors.zipCode}</p>}
                      </div>
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
                        Creating Account...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <UserPlus className="mr-2 h-5 w-5" />
                        Create Account
                      </span>
                    )}
                  </Button>
                </form>

                <Separator className="my-6" />

                {/* Demo Notice */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-5">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 text-center">Demo Mode</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
                    This is a demonstration. Account creation is simulated and no real data is stored. After "creating"
                    an account, you can use the demo login credentials on the login page.
                  </p>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4 pt-6">
                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    Sign in here
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

                <div className="text-center text-xs text-gray-500">
                  By creating an account, you agree to our{" "}
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
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

export default function SignupPage() {
  return (
    <SafeWrapper
      fallback={
        <div className="container flex items-center justify-center py-8">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      }
    >
      <SignupContent />
    </SafeWrapper>
  )
}
