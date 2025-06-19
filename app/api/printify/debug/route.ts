import { NextResponse } from "next/server"

export async function GET() {
  try {
    const apiKey = process.env.PRINTIFY_API_TOKEN
    const shopId = process.env.PRINTIFY_SHOP_ID

    return NextResponse.json({
      hasCredentials: !!(apiKey && shopId),
      apiKeyStatus: apiKey ? `Present (${apiKey.substring(0, 8)}...)` : "Missing",
      shopIdStatus: shopId ? `Present (${shopId})` : "Missing",
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to check debug info",
        hasCredentials: false,
        apiKeyStatus: "Error",
        shopIdStatus: "Error",
      },
      { status: 500 },
    )
  }
}
