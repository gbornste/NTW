import { getEnvConfig } from "@/lib/env-config"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const envConfig = getEnvConfig()

  return NextResponse.json({
    environment: {
      NEXTAUTH_URL: envConfig.NEXTAUTH_URL || "❌ NOT_SET",
      NEXTAUTH_SECRET: envConfig.NEXTAUTH_SECRET ? "✅ SET" : "❌ NOT_SET",
      NODE_ENV: envConfig.NODE_ENV,
      GOOGLE_CLIENT_ID: envConfig.GOOGLE_CLIENT_ID ? "✅ SET" : "❌ NOT_SET",
      FACEBOOK_CLIENT_ID: envConfig.FACEBOOK_CLIENT_ID ? "✅ SET" : "❌ NOT_SET",
      APPLE_CLIENT_ID: envConfig.APPLE_CLIENT_ID ? "✅ SET" : "❌ NOT_SET",
    },
  })
}
