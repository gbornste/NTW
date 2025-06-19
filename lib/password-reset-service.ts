import { randomBytes } from "crypto"

// In-memory token storage (in a real app, this would be in a database)
interface TokenData {
  email: string
  token: string
  expires: Date
}

const resetTokens: TokenData[] = []

// Generate a secure random token
export async function generateResetToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // Generate 32 random bytes and convert to hex string
      const token = randomBytes(32).toString("hex")
      resolve(token)
    } catch (error) {
      // Fallback if crypto is not available
      const fallbackToken =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15) +
        Date.now().toString(36)
      resolve(fallbackToken)
    }
  })
}

// Store a reset token with expiration (1 hour)
export async function storeResetToken(email: string, token: string): Promise<void> {
  // Set expiration to 1 hour from now
  const expires = new Date()
  expires.setHours(expires.getHours() + 1)

  // Remove any existing tokens for this email
  const existingIndex = resetTokens.findIndex((t) => t.email === email)
  if (existingIndex !== -1) {
    resetTokens.splice(existingIndex, 1)
  }

  // Store the new token
  resetTokens.push({
    email,
    token,
    expires,
  })

  console.log(`Stored reset token for ${email}, expires at ${expires.toISOString()}`)
}

// Validate a reset token
export async function validateResetToken(token: string): Promise<TokenData | null> {
  const now = new Date()

  // Find the token
  const tokenData = resetTokens.find((t) => t.token === token)

  // If token not found or expired
  if (!tokenData || tokenData.expires < now) {
    return null
  }

  return tokenData
}

// Consume a reset token (remove it so it can't be used again)
export async function consumeResetToken(token: string): Promise<void> {
  const index = resetTokens.findIndex((t) => t.token === token)

  if (index !== -1) {
    resetTokens.splice(index, 1)
    console.log(`Consumed reset token: ${token.substring(0, 8)}...`)
  }
}

// Debug function to list all active tokens
export function debugResetTokens(): void {
  console.log("Active reset tokens:")
  resetTokens.forEach((t) => {
    console.log(`- Email: ${t.email}, Token: ${t.token.substring(0, 8)}..., Expires: ${t.expires.toISOString()}`)
  })
}
