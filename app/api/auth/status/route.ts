import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    // Check for session cookie
    const cookieStore = await cookies()
    const sessionCookie = await cookieStore.get("session")

    // Check localStorage via request headers (if client sent them)
    const authHeader = request.headers.get("x-auth-status")
    const userHeader = request.headers.get("x-auth-user")

    // For demo accounts, we'll accept either cookie or localStorage
    const isDemoUser = userHeader?.includes("@notrumpnway.com")

    if (sessionCookie || (authHeader === "true" && isDemoUser)) {
      // In a real app, we would validate the session token here
      // For demo purposes, we'll just return authenticated

      return NextResponse.json({
        authenticated: true,
        user: {
          id: `user_${Date.now()}`,
          email: userHeader || "demo@notrumpnway.com",
          name: (userHeader || "demo@notrumpnway.com").split("@")[0],
        },
      })
    }

    return NextResponse.json({
      authenticated: false,
      user: null,
    })
  } catch (error) {
    console.error("Error checking auth status:", error)

    return NextResponse.json(
      {
        authenticated: false,
        error: "Failed to check authentication status",
      },
      { status: 500 },
    )
  }
}
