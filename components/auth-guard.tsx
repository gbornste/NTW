"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, LogIn, UserPlus } from "lucide-react"
import Link from "next/link"

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  redirectTo?: string
}

export function AuthGuard({ children, fallback, redirectTo = "/login" }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [showFallback, setShowFallback] = useState(false)

  useEffect(() => {
    // If not loading and not authenticated, either show fallback or redirect
    if (!isLoading && !isAuthenticated) {
      if (fallback) {
        setShowFallback(true)
      } else {
        // Get current path to redirect back after login
        const currentPath = window.location.pathname
        router.push(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`)
      }
    }
  }, [isAuthenticated, isLoading, fallback, redirectTo, router])

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  // Show fallback if provided and user is not authenticated
  if (showFallback && fallback) {
    return <>{fallback}</>
  }

  // Show children if authenticated
  if (isAuthenticated) {
    return <>{children}</>
  }

  // Default fallback if no custom fallback provided
  return (
    <Card className="max-w-md mx-auto my-8">
      <CardHeader>
        <CardTitle>Authentication Required</CardTitle>
        <CardDescription>You need to be logged in to access this content</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Please log in or create an account to continue.</p>
      </CardContent>
      <CardFooter className="flex gap-4">
        <Button asChild>
          <Link href={`${redirectTo}?redirect=${encodeURIComponent(window.location.pathname)}`}>
            <LogIn className="mr-2 h-4 w-4" />
            Log In
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/signup">
            <UserPlus className="mr-2 h-4 w-4" />
            Sign Up
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
