interface PostLoginVerificationData {
  email: string
  userId: string
  code: string
  type: "email" | "sms"
  expiresAt: Date
  attempts: number
  verified: boolean
  sessionToken: string
}

class PostLoginVerificationService {
  private verifications: Map<string, PostLoginVerificationData> = new Map()
  private readonly MAX_ATTEMPTS = 3
  private readonly CODE_EXPIRY_MINUTES = 10

  generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  generateSessionToken(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`
  }

  async initiatePostLoginVerification(
    email: string,
    userId: string,
    firstName: string,
  ): Promise<{ success: boolean; sessionToken?: string; code?: string; error?: string }> {
    try {
      // Check if this is a demo account (skip verification)
      const isDemoAccount = email.toLowerCase().includes("@notrumpnway.com")
      if (isDemoAccount) {
        console.log(`✅ Demo account detected, skipping verification: ${email}`)
        return { success: true, sessionToken: "demo_session" }
      }

      const code = this.generateVerificationCode()
      const sessionToken = this.generateSessionToken()
      const expiresAt = new Date(Date.now() + this.CODE_EXPIRY_MINUTES * 60 * 1000)

      // Store verification data
      this.verifications.set(sessionToken, {
        email,
        userId,
        code,
        type: "email",
        expiresAt,
        attempts: 0,
        verified: false,
        sessionToken,
      })

      // Send verification email (simulated)
      console.log(`
        ═══════════════════════════════════════════════════════════════
        📧 POST-LOGIN VERIFICATION EMAIL - DEMO MODE 📧
        ═══════════════════════════════════════════════════════════════
        
        To: ${email}
        From: security@notrumpnway.com
        Subject: Verify Your Login - NoTrumpNWay
        
        Hello ${firstName}!
        
        We detected a login to your NoTrumpNWay account. To complete the 
        sign-in process, please verify your identity using the code below:
        
        Verification Code: ${code}
        
        This code will expire in ${this.CODE_EXPIRY_MINUTES} minutes.
        
        If this wasn't you, please contact our support team immediately.
        
        Best regards,
        The NoTrumpNWay Security Team
        
        ═══════════════════════════════════════════════════════════════
      `)

      return { success: true, sessionToken, code } // Return code for demo purposes
    } catch (error) {
      console.error("Error initiating post-login verification:", error)
      return { success: false, error: "Failed to send verification code" }
    }
  }

  async verifyPostLoginCode(
    sessionToken: string,
    inputCode: string,
  ): Promise<{ success: boolean; email?: string; userId?: string; error?: string }> {
    // Handle demo session
    if (sessionToken === "demo_session") {
      return { success: true, email: "demo@notrumpnway.com", userId: "demo-user-1" }
    }

    const verification = this.verifications.get(sessionToken)

    if (!verification) {
      return { success: false, error: "Invalid or expired verification session" }
    }

    if (verification.verified) {
      return { success: true, email: verification.email, userId: verification.userId }
    }

    if (new Date() > verification.expiresAt) {
      this.verifications.delete(sessionToken)
      return { success: false, error: "Verification code has expired. Please log in again." }
    }

    if (verification.attempts >= this.MAX_ATTEMPTS) {
      this.verifications.delete(sessionToken)
      return { success: false, error: "Too many failed attempts. Please log in again." }
    }

    verification.attempts++

    if (verification.code !== inputCode) {
      return {
        success: false,
        error: `Invalid verification code. ${this.MAX_ATTEMPTS - verification.attempts} attempts remaining.`,
      }
    }

    verification.verified = true
    console.log(`✅ Post-login verification successful: ${verification.email}`)

    return { success: true, email: verification.email, userId: verification.userId }
  }

  async resendPostLoginCode(sessionToken: string): Promise<{ success: boolean; code?: string; error?: string }> {
    // Handle demo session
    if (sessionToken === "demo_session") {
      return { success: true, code: "123456" }
    }

    const verification = this.verifications.get(sessionToken)

    if (!verification) {
      return { success: false, error: "Invalid verification session" }
    }

    if (verification.verified) {
      return { success: true }
    }

    // Generate new code and reset attempts
    const newCode = this.generateVerificationCode()
    verification.code = newCode
    verification.attempts = 0
    verification.expiresAt = new Date(Date.now() + this.CODE_EXPIRY_MINUTES * 60 * 1000)

    console.log(`
      ═══════════════════════════════════════════════════════════════
      📧 RESENT POST-LOGIN VERIFICATION - DEMO MODE 📧
      ═══════════════════════════════════════════════════════════════
      
      To: ${verification.email}
      From: security@notrumpnway.com
      Subject: New Verification Code - NoTrumpNWay
      
      Your new verification code is: ${newCode}
      
      This code will expire in ${this.CODE_EXPIRY_MINUTES} minutes.
      
      ═══════════════════════════════════════════════════════════════
    `)

    return { success: true, code: newCode }
  }

  isVerified(sessionToken: string): boolean {
    if (sessionToken === "demo_session") return true
    const verification = this.verifications.get(sessionToken)
    return verification?.verified || false
  }

  cleanup(): void {
    const now = new Date()
    for (const [token, verification] of this.verifications.entries()) {
      if (now > verification.expiresAt) {
        this.verifications.delete(token)
      }
    }
  }
}

export const postLoginVerificationService = new PostLoginVerificationService()

// Cleanup expired verifications every 5 minutes
if (typeof window === "undefined") {
  setInterval(
    () => {
      postLoginVerificationService.cleanup()
    },
    5 * 60 * 1000,
  )
}
