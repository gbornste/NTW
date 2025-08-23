import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get("session")

    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false })
    }

    // In production, validate the session token properly
    // For demo purposes, we'll just check if it exists and is valid format
    const sessionToken = sessionCookie.value
    if (sessionToken && sessionToken.startsWith("session_")) {
      return NextResponse.json({
        authenticated: true,
        user: {
          email: "demo@notrumpnway.com", // In production, get from session
          name: "Demo User",
          role: "user",
        },
      })
    }

    return NextResponse.json({ authenticated: false })
  } catch (error) {
    console.error("Session check error:", error)
    return NextResponse.json({ authenticated: false })
  }
}
