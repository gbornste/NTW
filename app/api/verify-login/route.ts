import { type NextRequest, NextResponse } from "next/server"
import { postLoginVerificationService } from "@/lib/post-login-verification-service"

export async function POST(request: NextRequest) {
  try {
    const { sessionToken, code } = await request.json()

    if (!sessionToken || !code) {
      return NextResponse.json({ error: "Session token and verification code are required" }, { status: 400 })
    }

    const result = await postLoginVerificationService.verifyPostLoginCode(sessionToken, code)

    if (result.success) {
      // Create authenticated session
      const response = NextResponse.json({
        success: true,
        message: "Login verification successful",
      })

      // Set session cookie
      response.cookies.set(
        "session",
        JSON.stringify({
          email: result.email,
          userId: result.userId,
          verified: true,
          timestamp: Date.now(),
        }),
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24, // 24 hours
        },
      )

      // Update localStorage for client-side auth
      return response
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
