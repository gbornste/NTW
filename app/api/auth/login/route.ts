import { type NextRequest, NextResponse } from "next/server"

// Demo users for testing
const DEMO_USERS = [
  {
    email: "demo@notrumpnway.com",
    password: "demo123",
    name: "Demo User",
    role: "user",
  },
  {
    email: "admin@notrumpnway.com",
    password: "admin123",
    name: "Admin User",
    role: "admin",
  },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 })
    }

    // Check demo users
    const user = DEMO_USERS.find((u) => u.email === email && u.password === password)

    if (user) {
      // Create session token (in production, use proper JWT)
      const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Set session cookie
      const response = NextResponse.json({
        success: true,
        user: {
          email: user.email,
          name: user.name,
          role: user.role,
        },
        sessionToken,
      })

      // Set HTTP-only cookie for session
      response.cookies.set("session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })

      return response
    }

    // Invalid credentials
    return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
