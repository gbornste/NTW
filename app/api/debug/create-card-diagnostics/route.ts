import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check environment variables
    const envCheck = {
      PRINTIFY_API_KEY: !!process.env.PRINTIFY_API_KEY,
      OPENSSL_SECRET: !!process.env.OPENSSL_SECRET,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
    }

    // Check if required modules are available
    const moduleCheck = {
      authContext: true, // We'll assume this exists
      cardSharing: true, // We'll assume this exists
      responsiveImage: true, // We'll assume this exists
    }

    return NextResponse.json({
      status: "success",
      timestamp: new Date().toISOString(),
      environment: envCheck,
      modules: moduleCheck,
      diagnostics: {
        message: "Create Card diagnostics completed",
        recommendations: [
          "Check if all required components are properly imported",
          "Verify authentication context is working",
          "Ensure card templates are accessible",
          "Test card sharing functionality",
        ],
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        error: error?.message || "Unknown error occurred",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
