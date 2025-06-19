import { type NextRequest, NextResponse } from "next/server"
import { loginUser } from "@/app/actions/user-actions"

export async function POST(request: NextRequest) {
  try {
    console.log("🔐 API: Processing login request...")

    const body = await request.json()
    const { email, password } = body

    console.log("🔐 API: Request body received:", { email: email || "missing", password: password ? "***" : "missing" })

    if (!email || !password) {
      console.log("❌ API: Missing email or password")
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    console.log(`🔐 API: Attempting login for: ${email}`)

    const result = await loginUser(email, password)
    console.log("🔐 API: Login result:", {
      success: result.success,
      requiresVerification: result.requiresVerification,
      hasUser: !!result.user,
      error: result.error,
    })

    if (result.success && result.user) {
      console.log(`✅ API: Login successful for: ${result.user.email}`)

      // Set session cookie
      const response = NextResponse.json({
        user: result.user,
        message: "Login successful",
        timestamp: new Date().toISOString(),
      })

      // Set a simple session cookie
      const sessionData = {
        email: result.user.email,
        userId: result.user.id,
        isVerified: result.user.isVerified,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        loginTime: new Date().toISOString(),
      }

      response.cookies.set("session", JSON.stringify(sessionData), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
      })

      console.log("✅ API: Session cookie set for:", result.user.email)

      return response
    } else {
      console.log(`❌ API: Login failed for: ${email}`, result.error)

      return NextResponse.json(
        {
          error: result.error || "Login failed",
          requiresVerification: result.requiresVerification || false,
          email: result.email,
          timestamp: new Date().toISOString(),
          debugInfo:
            process.env.NODE_ENV === "development"
              ? {
                  providedEmail: email,
                  normalizedEmail: email?.toLowerCase()?.trim(),
                }
              : undefined,
        },
        { status: 401 },
      )
    }
  } catch (error) {
    console.error("❌ API: Login error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
        details: "Please check your credentials and try again",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
