import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionToken } = body

    if (!sessionToken) {
      return NextResponse.json({ error: "Session token required" }, { status: 400 })
    }

    try {
      // Decode session token
      const sessionData = JSON.parse(atob(sessionToken))

      // Check if session is still valid (24 hours)
      const sessionAge = Date.now() - sessionData.timestamp
      const maxAge = 24 * 60 * 60 * 1000 // 24 hours

      if (sessionAge > maxAge) {
        return NextResponse.json({ error: "Session expired" }, { status: 401 })
      }

      return NextResponse.json({
        valid: true,
        user: {
          id: sessionData.userId,
          email: sessionData.email,
          name: sessionData.name,
          firstName: sessionData.firstName,
          lastName: sessionData.lastName,
        },
      })
    } catch (decodeError) {
      return NextResponse.json({ error: "Invalid session token" }, { status: 401 })
    }
  } catch (error) {
    console.error("Session validation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
