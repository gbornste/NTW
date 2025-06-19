interface User {
  id: string
  email: string
  name: string
  image?: string
  isVerified: boolean
}

interface Session {
  user: User
  expires: string
  sessionToken: string
}

// In-memory session store (in production, use a database)
const sessions = new Map<string, Session>()
const users = new Map<string, User>()

// Initialize with demo user
users.set("demo@notrumpnway.com", {
  id: "demo-user-1",
  email: "demo@notrumpnway.com",
  name: "Demo User",
  image: "/images/logo.png",
  isVerified: true,
})

// Simple session token generation without crypto
function generateSessionToken(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2)
  return `session_${timestamp}_${random}`
}

// Simple password validation (in production, use proper hashing)
function validatePassword(email: string, password: string): boolean {
  // Demo credentials
  if (email === "demo@notrumpnway.com" && password === "demo123") {
    return true
  }
  return false
}

export async function signIn(
  email: string,
  password: string,
): Promise<{ success: boolean; session?: Session; error?: string }> {
  try {
    console.log("🔐 Simple auth sign in attempt:", email)

    if (!validatePassword(email, password)) {
      return { success: false, error: "Invalid credentials" }
    }

    const user = users.get(email)
    if (!user) {
      return { success: false, error: "User not found" }
    }

    // Create session
    const sessionToken = generateSessionToken()
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours

    const session: Session = {
      user,
      expires,
      sessionToken,
    }

    sessions.set(sessionToken, session)

    console.log("✅ Simple auth sign in successful:", email)
    return { success: true, session }
  } catch (error) {
    console.error("❌ Simple auth sign in error:", error)
    return { success: false, error: "Authentication failed" }
  }
}

export async function getSession(sessionToken: string): Promise<Session | null> {
  try {
    const session = sessions.get(sessionToken)
    if (!session) {
      return null
    }

    // Check if session is expired
    if (new Date(session.expires) < new Date()) {
      sessions.delete(sessionToken)
      return null
    }

    return session
  } catch (error) {
    console.error("❌ Get session error:", error)
    return null
  }
}

export async function signOut(sessionToken: string): Promise<{ success: boolean }> {
  try {
    sessions.delete(sessionToken)
    console.log("✅ Simple auth sign out successful")
    return { success: true }
  } catch (error) {
    console.error("❌ Simple auth sign out error:", error)
    return { success: false }
  }
}

export async function getUser(email: string): Promise<User | null> {
  return users.get(email) || null
}
