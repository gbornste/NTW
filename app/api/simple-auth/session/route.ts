import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 API: Checking session...")

    const cookieStore = cookies()
    const sessionCookie = cookieStore.get("session")

    if (!sessionCookie) {
      console.log("❌ API: No session cookie found")
      return NextResponse.json({ user: null, authenticated: false })
    }

    try {
      const sessionData = JSON.parse(sessionCookie.value)
      console.log("✅ API: Session found for:", sessionData.email)

      // Return user data from session
      const user = {
        id: sessionData.userId,
        email: sessionData.email,
        firstName: sessionData.firstName || sessionData.email.split("@")[0],
        lastName: sessionData.lastName || "",
        name: sessionData.firstName || sessionData.email.split("@")[0],
        isVerified: sessionData.isVerified || sessionData.email.includes("@notrumpnway.com"),
      }

      return NextResponse.json({
        user,
        authenticated: true,
        message: "Session valid",
      })
    } catch (parseError) {
      console.error("❌ API: Error parsing session cookie:", parseError)
      return NextResponse.json({ user: null, authenticated: false, error: "Invalid session" })
    }
  } catch (error) {
    console.error("❌ API: Session check error:", error)
    return NextResponse.json({ user: null, authenticated: false, error: "Session check failed" }, { status: 500 })
  }
}
