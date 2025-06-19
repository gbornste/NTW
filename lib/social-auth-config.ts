export interface SocialAuthConfig {
  google: {
    clientId: string
    clientSecret: string
    enabled: boolean
  }
  facebook: {
    clientId: string
    clientSecret: string
    enabled: boolean
  }
  apple: {
    clientId: string
    clientSecret: string
    enabled: boolean
  }
}

export function getSocialAuthConfig(): SocialAuthConfig {
  return {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      enabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
      enabled: !!(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET),
    },
    apple: {
      clientId: process.env.APPLE_CLIENT_ID || "",
      clientSecret: process.env.APPLE_CLIENT_SECRET || "",
      enabled: !!(process.env.APPLE_CLIENT_ID && process.env.APPLE_CLIENT_SECRET),
    },
  }
}

export function validateSocialAuthConfig(): {
  isValid: boolean
  errors: string[]
  warnings: string[]
} {
  const config = getSocialAuthConfig()
  const errors: string[] = []
  const warnings: string[] = []

  // Check NextAuth configuration
  if (!process.env.NEXTAUTH_SECRET) {
    errors.push("NEXTAUTH_SECRET is required")
  }

  if (!process.env.NEXTAUTH_URL) {
    warnings.push("NEXTAUTH_URL is not set (may cause issues in production)")
  }

  // Check individual providers
  if (!config.google.enabled) {
    warnings.push("Google OAuth not configured (missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET)")
  }

  if (!config.facebook.enabled) {
    warnings.push("Facebook OAuth not configured (missing FACEBOOK_CLIENT_ID or FACEBOOK_CLIENT_SECRET)")
  }

  if (!config.apple.enabled) {
    warnings.push("Apple OAuth not configured (missing APPLE_CLIENT_ID or APPLE_CLIENT_SECRET)")
  }

  // Check if at least one social provider is configured
  const enabledProviders = Object.values(config).filter((provider) => provider.enabled)
  if (enabledProviders.length === 0) {
    warnings.push("No social authentication providers are configured")
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

export function logSocialAuthStatus() {
  const config = getSocialAuthConfig()
  const validation = validateSocialAuthConfig()

  console.log("🔐 Social Authentication Configuration:")
  console.log("Google:", config.google.enabled ? "✅ Enabled" : "❌ Disabled")
  console.log("Facebook:", config.facebook.enabled ? "✅ Enabled" : "❌ Disabled")
  console.log("Apple:", config.apple.enabled ? "✅ Enabled" : "❌ Disabled")

  if (validation.errors.length > 0) {
    console.error("❌ Configuration Errors:")
    validation.errors.forEach((error) => console.error(`  - ${error}`))
  }

  if (validation.warnings.length > 0) {
    console.warn("⚠️ Configuration Warnings:")
    validation.warnings.forEach((warning) => console.warn(`  - ${warning}`))
  }

  return validation
}
