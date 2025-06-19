import { type NextRequest, NextResponse } from "next/server"
import { postLoginVerificationService } from "@/lib/post-login-verification-service"

export async function POST(request: NextRequest) {
  try {
    const { sessionToken } = await request.json()

    if (!sessionToken) {
      return NextResponse.json({ error: "Session token is required" }, { status: 400 })
    }

    const result = await postLoginVerificationService.resendPostLoginCode(sessionToken)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Verification code resent successfully",
        code: result.code, // For demo purposes
      })
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
  } catch (error) {
    console.error("Resend verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
