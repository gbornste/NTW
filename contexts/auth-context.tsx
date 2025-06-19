"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
  isDemo?: boolean
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  loginDemo: () => Promise<void>
  logout: () => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true)

      // Check localStorage for session
      const storedUser = localStorage.getItem("auth_user")
      const sessionToken = localStorage.getItem("auth_token")

      if (storedUser && sessionToken) {
        const userData = JSON.parse(storedUser)
        setUser(userData)
      }
    } catch (error) {
      console.error("Error checking auth status:", error)
      // Clear invalid session data
      localStorage.removeItem("auth_user")
      localStorage.removeItem("auth_token")
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, accept any email/password combination
      const userData: User = {
        id: `user_${Date.now()}`,
        email,
        name: email.split("@")[0],
        isDemo: false,
      }

      // Store session
      localStorage.setItem("auth_user", JSON.stringify(userData))
      localStorage.setItem("auth_token", `token_${Date.now()}`)

      setUser(userData)
    } catch (error) {
      console.error("Login error:", error)
      throw new Error("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const loginDemo = async () => {
    try {
      setIsLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const demoUser: User = {
        id: "demo_user",
        email: "demo@notrumpnway.com",
        name: "Demo User",
        isDemo: true,
      }

      // Store session
      localStorage.setItem("auth_user", JSON.stringify(demoUser))
      localStorage.setItem("auth_token", "demo_token")

      setUser(demoUser)
    } catch (error) {
      console.error("Demo login error:", error)
      throw new Error("Demo login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)

      // Clear session
      localStorage.removeItem("auth_user")
      localStorage.removeItem("auth_token")

      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const userData: User = {
        id: `user_${Date.now()}`,
        email,
        name,
        isDemo: false,
      }

      // Store session
      localStorage.setItem("auth_user", JSON.stringify(userData))
      localStorage.setItem("auth_token", `token_${Date.now()}`)

      setUser(userData)
    } catch (error) {
      console.error("Signup error:", error)
      throw new Error("Signup failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    loginDemo,
    logout,
    signup,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
