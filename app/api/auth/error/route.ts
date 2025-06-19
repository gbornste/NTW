import { type NextRequest, NextResponse } from "next/server"

// Define error types and their descriptions
const ERROR_DESCRIPTIONS = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "Access was denied. You do not have permission to sign in.",
  Verification: "The verification token has expired or has already been used.",
  Default: "An unexpected error occurred during authentication.",
  Signin: "There was an error during the sign-in process.",
  OAuthSignin: "There was an error during OAuth sign-in.",
  OAuthCallback: "There was an error in the OAuth callback.",
  OAuthCreateAccount: "Could not create OAuth account.",
  EmailCreateAccount: "Could not create email account.",
  Callback: "There was an error in the callback handler.",
  OAuthAccountNotLinked: "The OAuth account is not linked to an existing account.",
  EmailSignin: "Check your email address.",
  CredentialsSignin: "Sign in failed. Check the details you provided are correct.",
  SessionRequired: "Please sign in to access this page.",
} as const

type ErrorType = keyof typeof ERROR_DESCRIPTIONS

function getErrorInfo(error: string | null): { type: ErrorType; message: string; suggestion: string } {
  const errorType = (error as ErrorType) || "Default"
  const knownError = ERROR_DESCRIPTIONS[errorType]

  if (knownError) {
    let suggestion = "Please try again."

    switch (errorType) {
      case "AccessDenied":
        suggestion = "Contact your administrator if you believe this is an error."
        break
      case "Verification":
        suggestion = "Please request a new verification email."
        break
      case "CredentialsSignin":
        suggestion = "Please check your email and password and try again."
        break
      case "EmailSignin":
        suggestion = "Please check your email address and try again."
        break
      case "OAuthAccountNotLinked":
        suggestion = "Try signing in with a different method or contact support."
        break
      case "SessionRequired":
        suggestion = "Please sign in to continue."
        break
      default:
        suggestion = "Please try again or contact support if the problem persists."
    }

    return {
      type: errorType,
      message: knownError,
      suggestion,
    }
  }

  return {
    type: "Default",
    message: ERROR_DESCRIPTIONS.Default,
    suggestion: "Please try again or contact support if the problem persists.",
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const error = searchParams.get("error")
    const errorInfo = getErrorInfo(error)

    return NextResponse.json(
      {
        success: false,
        error: {
          type: errorInfo.type,
          message: errorInfo.message,
          suggestion: errorInfo.suggestion,
          code: error || "UNKNOWN_ERROR",
        },
        timestamp: new Date().toISOString(),
      },
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      },
    )
  } catch (err) {
    console.error("Error in auth error API:", err)

    return NextResponse.json(
      {
        success: false,
        error: {
          type: "Configuration",
          message: "Internal server error occurred while processing the authentication error.",
          suggestion: "Please try again later or contact support.",
          code: "INTERNAL_ERROR",
        },
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      },
    )
  }
}

export async function POST(request: NextRequest) {
  return GET(request) // Handle POST requests the same way
}
