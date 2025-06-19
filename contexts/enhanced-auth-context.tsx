"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { authSessionManager } from "@/lib/auth-session-manager"

interface AuthUser {
  id: string
  name: string | null
  email: string | null
  image: string | null
  firstName: string
  lastName: string
}

interface EnhancedAuthContextType {
  isLoading: boolean
  isAuthenticated: boolean
  user: AuthUser | null
  refreshAuth: () => Promise<void>
  handleLoginReturn: () => Promise<void>
}

const EnhancedAuthContext = createContext<EnhancedAuthContextType | undefined>(undefined)

function createSafeUser(sessionUser: any): AuthUser | null {
  if (!sessionUser) return null

  try {
    const name = sessionUser.name || ""
    const nameParts = name.split(" ").filter(Boolean)

    return {
      id: sessionUser.id || `user_${Date.now()}`,
      name: sessionUser.name || null,
      email: sessionUser.email || null,
      image: sessionUser.image || null,
      firstName: nameParts[0] || "User",
      lastName: nameParts.slice(1).join(" ") || "",
    }
  } catch (error) {
    console.error("Error creating safe user:", error)
    return null
  }
}

export function EnhancedAuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [sessionData, setSessionData] = useState<any>(null)

  const updateAuthState = useCallback((session: any) => {
    console.log("🔄 Updating auth state:", session?.user?.email || "no session")
    setSessionData(session)
    setUser(session ? createSafeUser(session.user) : null)
    setIsLoading(false)
  }, [])

  const refreshAuth = useCallback(async () => {
    console.log("🔄 Refreshing authentication...")
    setIsLoading(true)
    try {
      const session = await authSessionManager.refreshSession()
      updateAuthState(session)
    } catch (error) {
      console.error("Error refreshing auth:", error)
      updateAuthState(null)
    }
  }, [updateAuthState])

  const handleLoginReturn = useCallback(async () => {
    console.log("🔄 Handling login return...")
    setIsLoading(true)
    try {
      await authSessionManager.handleLoginRedirect()
      const session = authSessionManager.getSession()
      updateAuthState(session)
    } catch (error) {
      console.error("Error handling login return:", error)
      updateAuthState(null)
    }
  }, [updateAuthState])

  // Initialize auth manager and subscribe to changes
  useEffect(() => {
    let unsubscribe: (() => void) | null = null

    const initializeAuth = async () => {
      try {
        await authSessionManager.initialize()

        // Subscribe to session changes
        unsubscribe = authSessionManager.subscribe(updateAuthState)

        // Get initial session
        const session = authSessionManager.getSession()
        updateAuthState(session)
      } catch (error) {
        console.error("Error initializing auth:", error)
        updateAuthState(null)
      }
    }

    initializeAuth()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [updateAuthState])

  // Check for login redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get("login") === "success") {
      console.log("🔍 Detected login success, handling redirect...")
      handleLoginReturn()

      // Clean up URL
      const newUrl = window.location.pathname
      window.history.replaceState({}, "", newUrl)
    }
  }, [handleLoginReturn])

  const isAuthenticated = authSessionManager.isAuthenticated() && !!user

  const value: EnhancedAuthContextType = {
    isLoading,
    isAuthenticated,
    user,
    refreshAuth,
    handleLoginReturn,
  }

  console.log(
    `🎯 Enhanced Auth State - Loading: ${isLoading}, Authenticated: ${isAuthenticated}, User: ${user?.email || "none"}`,
  )

  return <EnhancedAuthContext.Provider value={value}>{children}</EnhancedAuthContext.Provider>
}

export function useEnhancedAuth() {
  const context = useContext(EnhancedAuthContext)
  if (context === undefined) {
    throw new Error("useEnhancedAuth must be used within an EnhancedAuthProvider")
  }
  return context
}
