interface SessionData {
  user: {
    id: string
    email: string
    name: string | null
    firstName: string
    lastName: string
    image: string | null
    isVerified?: boolean
  }
  expires: string
  isAuthenticated: boolean
}

type SessionSubscriber = (session: SessionData | null) => void

class AuthSessionManager {
  private session: SessionData | null = null
  private subscribers: Set<SessionSubscriber> = new Set()
  private initialized = false
  private storageKey = "notrumpnway_session"
  private refreshTimer: NodeJS.Timeout | null = null
  private initPromise: Promise<void> | null = null

  async initialize(): Promise<void> {
    // Prevent multiple initializations
    if (this.initPromise) {
      return this.initPromise
    }

    this.initPromise = this._initialize()
    return this.initPromise
  }

  private async _initialize(): Promise<void> {
    if (this.initialized) return

    try {
      console.log("🔄 Initializing auth session manager...")

      // Check simple auth state first (most reliable for demo accounts)
      await this.checkSimpleAuthState()

      // Load session from localStorage as backup
      if (!this.session) {
        await this.loadSessionFromStorage()
      }

      // Then try to refresh from server if we have a session
      if (this.session) {
        await this.refreshFromServer()
      }

      // Set up periodic refresh
      this.setupPeriodicRefresh()

      this.initialized = true
      console.log("✅ Auth session manager initialized with session:", this.session?.user?.email || "none")
    } catch (error) {
      console.error("❌ Error initializing auth session manager:", error)
      this.initialized = true // Mark as initialized even on error
    }
  }

  private async loadSessionFromStorage(): Promise<void> {
    try {
      if (typeof window === "undefined") return

      const stored = localStorage.getItem(this.storageKey)
      if (stored) {
        const sessionData = JSON.parse(stored)

        // Check if session is still valid
        if (sessionData.expires && new Date(sessionData.expires) > new Date()) {
          this.session = sessionData
          console.log("✅ Loaded valid session from storage:", sessionData.user?.email)
        } else {
          console.log("⚠️ Stored session expired, clearing...")
          localStorage.removeItem(this.storageKey)
        }
      }
    } catch (error) {
      console.error("❌ Error loading session from storage:", error)
      if (typeof window !== "undefined") {
        localStorage.removeItem(this.storageKey)
      }
    }
  }

  private async checkSimpleAuthState(): Promise<void> {
    try {
      if (typeof window === "undefined") return

      const isAuthenticated = localStorage.getItem("isAuthenticated")
      const userEmail = localStorage.getItem("userEmail")

      console.log("🔍 Checking simple auth state:", { isAuthenticated, userEmail })

      if (isAuthenticated === "true" && userEmail) {
        console.log("🔄 Creating session from simple auth state...")

        // Determine if this is a demo account
        const isDemoAccount = userEmail.includes("@notrumpnway.com")

        // Extract name from email for demo accounts
        const emailPrefix = userEmail.split("@")[0]
        const firstName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1)

        const sessionData: SessionData = {
          user: {
            id: isDemoAccount ? `demo-user-${Date.now()}` : `user_${Date.now()}`,
            email: userEmail,
            name: firstName,
            firstName: firstName,
            lastName: isDemoAccount ? "User" : "",
            image: null,
            isVerified: isDemoAccount, // Demo accounts are pre-verified
          },
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          isAuthenticated: true,
        }

        this.updateSession(sessionData)
        console.log("✅ Session created from simple auth state:", userEmail)
        return
      }

      console.log("⚠️ No simple auth state found")
    } catch (error) {
      console.error("❌ Error checking simple auth state:", error)
    }
  }

  private async saveSessionToStorage(session: SessionData | null): Promise<void> {
    try {
      if (typeof window === "undefined") return

      if (session) {
        localStorage.setItem(this.storageKey, JSON.stringify(session))
        console.log("💾 Session saved to storage:", session.user?.email)
      } else {
        localStorage.removeItem(this.storageKey)
        console.log("🗑️ Session removed from storage")
      }
    } catch (error) {
      console.error("❌ Error saving session to storage:", error)
    }
  }

  private async refreshFromServer(): Promise<void> {
    try {
      const response = await fetch("/api/simple-auth/session", {
        method: "GET",
        credentials: "include",
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.user) {
          const sessionData: SessionData = {
            user: {
              id: data.user.id || `user_${Date.now()}`,
              email: data.user.email,
              name: data.user.name || `${data.user.firstName || ""} ${data.user.lastName || ""}`.trim(),
              firstName: data.user.firstName || data.user.name?.split(" ")[0] || "User",
              lastName: data.user.lastName || data.user.name?.split(" ").slice(1).join(" ") || "",
              image: data.user.image || null,
              isVerified: data.user.isVerified || data.user.email?.includes("@notrumpnway.com") || false,
            },
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            isAuthenticated: true,
          }

          this.updateSession(sessionData)
          console.log("✅ Session refreshed from server:", sessionData.user.email)
          return
        }
      }

      // No valid session from server, but keep local session if it exists for demo accounts
      if (this.session?.user?.email?.includes("@notrumpnway.com")) {
        console.log("⚠️ No server session, but keeping demo session")
        return
      }

      console.log("⚠️ No valid server session found")
    } catch (error) {
      console.error("❌ Error refreshing session from server:", error)
      // Don't clear local session on network errors, especially for demo accounts
    }
  }

  private setupPeriodicRefresh(): void {
    // Refresh session every 5 minutes
    this.refreshTimer = setInterval(
      () => {
        if (this.session) {
          this.refreshFromServer()
        }
      },
      5 * 60 * 1000,
    )
  }

  private updateSession(session: SessionData | null): void {
    const previousSession = this.session
    this.session = session

    // Save to storage
    this.saveSessionToStorage(session)

    // Update simple auth state to keep in sync
    if (typeof window !== "undefined") {
      if (session) {
        localStorage.setItem("isAuthenticated", "true")
        localStorage.setItem("userEmail", session.user.email)
        console.log("🔄 Updated localStorage auth state:", session.user.email)
      } else {
        localStorage.removeItem("isAuthenticated")
        localStorage.removeItem("userEmail")
        console.log("🔄 Cleared localStorage auth state")
      }
    }

    // Notify subscribers if session changed
    if (JSON.stringify(previousSession) !== JSON.stringify(session)) {
      console.log("📢 Notifying subscribers of session change")
      this.notifySubscribers()
    }
  }

  private notifySubscribers(): void {
    this.subscribers.forEach((callback) => {
      try {
        callback(this.session)
      } catch (error) {
        console.error("❌ Error in session subscriber:", error)
      }
    })
  }

  async createSession(userData: any): Promise<SessionData> {
    try {
      const isDemoAccount = userData.email?.includes("@notrumpnway.com")

      const sessionData: SessionData = {
        user: {
          id: userData.id || (isDemoAccount ? `demo-user-${Date.now()}` : `user_${Date.now()}`),
          email: userData.email,
          name: userData.name || `${userData.firstName || ""} ${userData.lastName || ""}`.trim(),
          firstName: userData.firstName || userData.name?.split(" ")[0] || "User",
          lastName: userData.lastName || userData.name?.split(" ").slice(1).join(" ") || "",
          image: userData.image || null,
          isVerified: userData.isVerified || isDemoAccount || false,
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        isAuthenticated: true,
      }

      this.updateSession(sessionData)
      console.log("✅ Session created for:", sessionData.user.email)
      return sessionData
    } catch (error) {
      console.error("❌ Error creating session:", error)
      throw error
    }
  }

  async refreshSession(): Promise<SessionData | null> {
    console.log("🔄 Manual session refresh requested")

    // First check simple auth state (most reliable for demo accounts)
    await this.checkSimpleAuthState()

    // Then refresh from server if we have a session
    if (this.session) {
      await this.refreshFromServer()
    }

    console.log("✅ Session refresh complete:", this.session?.user?.email || "none")
    return this.session
  }

  async handleLoginRedirect(): Promise<void> {
    try {
      console.log("🔄 Handling login redirect...")
      await this.checkSimpleAuthState()
      if (this.session) {
        await this.refreshFromServer()
      }
    } catch (error) {
      console.error("❌ Error handling login redirect:", error)
    }
  }

  getSession(): SessionData | null {
    return this.session
  }

  isAuthenticated(): boolean {
    if (!this.session) {
      console.log("❌ No session found")
      return false
    }

    // Check if session is expired
    if (this.session.expires && new Date(this.session.expires) <= new Date()) {
      console.log("⚠️ Session expired, clearing...")
      this.updateSession(null)
      return false
    }

    console.log("✅ User is authenticated:", this.session.user.email)
    return this.session.isAuthenticated
  }

  subscribe(callback: SessionSubscriber): () => void {
    this.subscribers.add(callback)

    // Immediately call with current session
    try {
      callback(this.session)
    } catch (error) {
      console.error("❌ Error in initial session callback:", error)
    }

    return () => {
      this.subscribers.delete(callback)
    }
  }

  async signOut(): Promise<void> {
    try {
      // Clear server session
      await fetch("/api/simple-auth/signout", {
        method: "POST",
        credentials: "include",
      })
    } catch (error) {
      console.error("❌ Error signing out from server:", error)
    }

    // Clear local session
    this.updateSession(null)

    console.log("✅ Signed out successfully")
  }

  destroy(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer)
      this.refreshTimer = null
    }
    this.subscribers.clear()
    this.session = null
    this.initialized = false
    this.initPromise = null
  }

  // Force immediate authentication check
  async forceAuthCheck(): Promise<boolean> {
    console.log("🔍 Force auth check requested")
    await this.checkSimpleAuthState()
    const isAuth = this.isAuthenticated()
    console.log("🔍 Force auth check result:", isAuth)
    return isAuth
  }
}

export const authSessionManager = new AuthSessionManager()
