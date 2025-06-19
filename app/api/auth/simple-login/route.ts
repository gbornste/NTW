import { type NextRequest, NextResponse } from "next/server"

// Simple user database (in production, this would be a real database)
const users = [
  {
    id: "1",
    email: "demo@notrumpnway.com",
    password: "demo123",
    name: "Demo User",
    firstName: "Demo",
    lastName: "User",
  },
  {
    id: "2",
    email: "test@example.com",
    password: "password123",
    name: "Test User",
    firstName: "Test",
    lastName: "User",
  },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user
    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create session token (simple implementation)
    const sessionToken = btoa(
      JSON.stringify({
        userId: user.id,
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        timestamp: Date.now(),
      }),
    )

    // Return user data and session token
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      sessionToken,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
