"use client"

import type React from "react"
import { SimpleAuthProvider } from "@/contexts/simple-auth-context"

interface AuthProviderProps {
  children: React.ReactNode
}

function AuthProvider({ children }: AuthProviderProps) {
  return <SimpleAuthProvider>{children}</SimpleAuthProvider>
}

// Named export
export { AuthProvider }

// Default export
export default AuthProvider
