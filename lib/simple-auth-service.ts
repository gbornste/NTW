"use client"

interface User {
  id: string
  name: string
  email: string
  firstName: string
  lastName: string
  image?: string
}

interface AuthSession {
  user: User
  expires: string
  token: string
}

class SimpleAuthService {
  private static instance: SimpleAuthService
  private session: AuthSession | null = null
  private listeners: Set<(session: AuthSession | null) => void> = new Set()
  private initialized = false

  static getInstance(): SimpleAuthService {
    if (!SimpleAuthService.instance) {
      SimpleAuthService.instance = new SimpleAuthService()
    }
    return SimpleAuthService.instance
  }

  async initialize(): Promise<void> {
    if (this.initialized) return

    console.log("🔄 Initializing SimpleAuthService...")

    try {
      // Check for stored session
      const storedSession = this.getStoredSession()
      if (storedSession && this.isSessionValid(storedSession)) {
        this.session = storedSession
        console.log("✅ Found valid stored session:", storedSession.user.email)
      } else {
        console.log("ℹ️ No valid stored session found")
        this.clearStoredSession()
      }

      this.initialized = true
      this.notifyListeners()
    } catch (error) {
      console.error("❌ Error initializing auth service:", error)
      this.initialized = true
    }
  }

  async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log("🔑 Attempting login for:", email)

      // Demo account validation
      if (email.toLowerCase() === "demo@notrumpnway.com" && password === "demo123") {
        const user: User = {
          id: "demo-user-id",
          name: "Demo User",
          email: "demo@notrumpnway.com",
          firstName: "Demo",
          lastName: "User",
          image: "/placeholder.svg?height=40&width=40&text=Demo",
        }

        const session: AuthSession = {
          user,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
          token: `demo-token-${Date.now()}`,
        }

        this.session = session
        this.storeSession(session)
        this.notifyListeners()

        console.log("✅ Demo login successful")
        return { success: true }
      }

      // For other accounts, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create a generic user for any other email/password combination
      const nameParts = email.split("@")[0].split(".")
      const firstName = nameParts[0] || "User"
      const lastName = nameParts[1] || ""

      const user: User = {
        id: `user-${Date.now()}`,
        name: `${firstName} ${lastName}`.trim(),
        email: email,
        firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
        lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1),
        image: `/placeholder.svg?height=40&width=40&text=${firstName.charAt(0)}`,
      }

      const session: AuthSession = {
        user,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        token: `token-${Date.now()}`,
      }

      this.session = session
      this.storeSession(session)
      this.notifyListeners()

      console.log("✅ Login successful for:", email)
      return { success: true }
    } catch (error) {
      console.error("❌ Login error:", error)
      return { success: false, error: "Login failed. Please try again." }
    }
  }

  async logout(): Promise<void> {
    console.log("🔓 Logging out...")
    this.session = null
    this.clearStoredSession()
    this.notifyListeners()
  }

  getSession(): AuthSession | null {
    return this.session
  }

  isAuthenticated(): boolean {
    return this.session !== null && this.isSessionValid(this.session)
  }

  getUser(): User | null {
    return this.session?.user || null
  }

  async refreshSession(): Promise<boolean> {
    console.log("🔄 Refreshing session...")

    try {
      const storedSession = this.getStoredSession()
      if (storedSession && this.isSessionValid(storedSession)) {
        this.session = storedSession
        this.notifyListeners()
        console.log("✅ Session refreshed from storage")
        return true
      } else {
        this.session = null
        this.clearStoredSession()
        this.notifyListeners()
        console.log("❌ No valid session to refresh")
        return false
      }
    } catch (error) {
      console.error("❌ Error refreshing session:", error)
      return false
    }
  }

  subscribe(listener: (session: AuthSession | null) => void): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private isSessionValid(session: AuthSession): boolean {
    if (!session || !session.user || !session.expires) return false

    const expiresAt = new Date(session.expires).getTime()
    const now = Date.now()
    const isValid = expiresAt > now

    if (!isValid) {
      console.log("⚠️ Session expired")
    }

    return isValid
  }

  private storeSession(session: AuthSession): void {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("simple_auth_session", JSON.stringify(session))
        localStorage.setItem("simple_auth_timestamp", Date.now().toString())
        console.log("💾 Session stored")
      }
    } catch (error) {
      console.error("❌ Error storing session:", error)
    }
  }

  private getStoredSession(): AuthSession | null {
    try {
      if (typeof window === "undefined") return null

      const stored = localStorage.getItem("simple_auth_session")
      const timestamp = localStorage.getItem("simple_auth_timestamp")

      if (!stored || !timestamp) return null

      // Check if stored session is too old (more than 24 hours)
      const storedTime = Number.parseInt(timestamp)
      const now = Date.now()
      if (now - storedTime > 24 * 60 * 60 * 1000) {
        this.clearStoredSession()
        return null
      }

      return JSON.parse(stored)
    } catch (error) {
      console.error("❌ Error getting stored session:", error)
      return null
    }
  }

  private clearStoredSession(): void {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("simple_auth_session")
        localStorage.removeItem("simple_auth_timestamp")
        console.log("🗑️ Session storage cleared")
      }
    } catch (error) {
      console.error("❌ Error clearing stored session:", error)
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this.session)
      } catch (error) {
        console.error("❌ Error in session listener:", error)
      }
    })
  }
}

export const simpleAuthService = SimpleAuthService.getInstance()
