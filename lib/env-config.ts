export interface EnvConfig {
  NEXTAUTH_URL: string
  NEXTAUTH_SECRET: string
  NODE_ENV: string
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
  FACEBOOK_CLIENT_ID: string
  FACEBOOK_CLIENT_SECRET: string
  APPLE_CLIENT_ID: string
  APPLE_CLIENT_SECRET: string
}

export function getEnvConfig(): EnvConfig {
  // Get the base URL for the current environment
  const getBaseUrl = (): string => {
    // In production, use the deployed URL
    if (process.env.NODE_ENV === "production") {
      return process.env.NEXTAUTH_URL || "https://notrumpnway.com"
    }

    // In development, use localhost
    if (typeof window !== "undefined") {
      // Client-side: use current origin
      return window.location.origin
    }

    // Server-side: use environment variable or default
    return process.env.NEXTAUTH_URL || "http://localhost:3000"
  }

  const config: EnvConfig = {
    NEXTAUTH_URL: getBaseUrl(),
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "development-secret-key-notrumpnway-2024",
    NODE_ENV: process.env.NODE_ENV || "development",
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "demo-google-client-id",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "demo-google-client-secret",
    FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID || "demo-facebook-client-id",
    FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET || "demo-facebook-client-secret",
    APPLE_CLIENT_ID: process.env.APPLE_CLIENT_ID || "demo-apple-client-id",
    APPLE_CLIENT_SECRET: process.env.APPLE_CLIENT_SECRET || "demo-apple-client-secret",
  }

  // Log configuration in development
  if (config.NODE_ENV === "development") {
    console.log("🔧 Environment Configuration:")
    console.log(`📍 NEXTAUTH_URL: ${config.NEXTAUTH_URL}`)
    console.log(`🔐 NEXTAUTH_SECRET: ${config.NEXTAUTH_SECRET ? "✅ Set" : "❌ Missing"}`)
    console.log(`🌐 NODE_ENV: ${config.NODE_ENV}`)
  }

  return config
}

// Validate required environment variables
export function validateEnvConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  const config = getEnvConfig()

  if (!config.NEXTAUTH_URL) {
    errors.push("NEXTAUTH_URL is required")
  }

  if (!config.NEXTAUTH_SECRET || config.NEXTAUTH_SECRET.length < 32) {
    errors.push("NEXTAUTH_SECRET must be at least 32 characters long")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
