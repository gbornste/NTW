"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/simple-auth-context"
import { useToast } from "@/hooks/use-toast"

export function AuthStatusIndicator() {
  const { isAuthenticated, user, isLoading, refreshSession, forceAuthCheck } = useAuth()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  // ... (rest of the AuthStatusIndicator logic)

  return (
    <div className="p-4 border rounded bg-card">
      <h3 className="font-semibold mb-2">Authentication Status</h3>
      <div className="space-y-2">
        <div>Loading: {isLoading ? "Yes" : "No"}</div>
        <div>Authenticated: {isAuthenticated ? "Yes" : "No"}</div>
        {user && <div>User: {user.email}</div>}
      </div>
    </div>
  )
}
