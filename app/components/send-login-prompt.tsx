"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/simple-auth-context"
import { useToast } from "@/hooks/use-toast"

export function SendLoginPrompt() {
  const router = useRouter()
  const { refreshSession, forceAuthCheck } = useAuth()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  // ... (rest of the SendLoginPrompt logic)

  return (
    <div className="p-4 border rounded bg-card">
      <h3 className="font-semibold mb-2">Login Required</h3>
      <p className="text-muted-foreground mb-4">Please log in to continue.</p>
      <button 
        className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        onClick={() => router.push('/auth/login')}
      >
        Go to Login
      </button>
    </div>
  )
}
