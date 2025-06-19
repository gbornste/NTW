import { type NextRequest, NextResponse } from "next/server"
import { postLoginVerificationService } from "@/lib/post-login-verification-service"

export async function POST(request: NextRequest) {
  try {
    const { email, userId, firstName } = await request.json()

    if (!email || !userId || !firstName) {
      return NextResponse.json({ error: "Email, user ID, and first name are required" }, { status: 400 })
    }

    const result = await postLoginVerificationService.initiatePostLoginVerification(email, userId, firstName)

    if (result.success) {
      return NextResponse.json({
        success: true,
        sessionToken: result.sessionToken,
        code: result.code, // For demo purposes
        message: "Verification initiated successfully",
      })
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
  } catch (error) {
    console.error("Initiate verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
