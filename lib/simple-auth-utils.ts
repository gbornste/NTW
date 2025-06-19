export interface SimpleUser {
  id: string
  email: string
  name?: string
  firstName?: string
  lastName?: string
  image?: string
}

export interface SimpleSession {
  user: SimpleUser
  expires: string
}

// Get session from localStorage (client-side only)
export function getClientSession(): SimpleSession | null {
  if (typeof window === "undefined") return null

  try {
    const sessionData = localStorage.getItem("simple-auth-session")
    if (!sessionData) return null

    const session = JSON.parse(sessionData)

    // Check if session is expired
    if (new Date(session.expires) < new Date()) {
      localStorage.removeItem("simple-auth-session")
      return null
    }

    return session
  } catch (error) {
    console.error("Error getting client session:", error)
    return null
  }
}

// Store session in localStorage
export function storeClientSession(session: SimpleSession): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem("simple-auth-session", JSON.stringify(session))
  } catch (error) {
    console.error("Error storing client session:", error)
  }
}

// Remove session from localStorage
export function removeClientSession(): void {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem("simple-auth-session")
  } catch (error) {
    console.error("Error removing client session:", error)
  }
}

// Check if user is authenticated (client-side)
export function isClientAuthenticated(): boolean {
  return getClientSession() !== null
}

// Get current user from session (client-side)
export function getCurrentClientUser(): SimpleUser | null {
  const session = getClientSession()
  return session?.user || null
}
