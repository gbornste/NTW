interface VerificationData {
  email: string
  code: string
  type: "email" | "phone"
  expiresAt: Date
  attempts: number
  verified: boolean
}

class VerificationService {
  private verifications: Map<string, VerificationData> = new Map()
  private readonly MAX_ATTEMPTS = 3
  private readonly CODE_EXPIRY_MINUTES = 10

  generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  async sendVerificationEmail(
    email: string,
    firstName: string,
  ): Promise<{ success: boolean; code?: string; error?: string }> {
    try {
      const code = this.generateVerificationCode()
      const expiresAt = new Date(Date.now() + this.CODE_EXPIRY_MINUTES * 60 * 1000)

      // Store verification data
      this.verifications.set(email, {
        email,
        code,
        type: "email",
        expiresAt,
        attempts: 0,
        verified: false,
      })

      // In a real app, this would send an actual email
      console.log(`
        ═══════════════════════════════════════════════════════════════
        📧 EMAIL VERIFICATION - DEMO MODE 📧
        ═══════════════════════════════════════════════════════════════
        
        To: ${email}
        From: verify@notrumpnway.com
        Subject: Verify Your NoTrumpNWay Account
        
        Hello ${firstName}!
        
        Welcome to NoTrumpNWay! To complete your account setup, please verify 
        your email address using the code below:
        
        Verification Code: ${code}
        
        This code will expire in ${this.CODE_EXPIRY_MINUTES} minutes.
        
        If you didn't create an account with NoTrumpNWay, please ignore this email.
        
        Best regards,
        The NoTrumpNWay Team
        
        ═══════════════════════════════════════════════════════════════
      `)

      return { success: true, code } // Return code for demo purposes
    } catch (error) {
      console.error("Error sending verification email:", error)
      return { success: false, error: "Failed to send verification email" }
    }
  }

  async verifyCode(email: string, inputCode: string): Promise<{ success: boolean; error?: string }> {
    const verification = this.verifications.get(email)

    if (!verification) {
      return { success: false, error: "No verification request found for this email" }
    }

    if (verification.verified) {
      return { success: true }
    }

    if (new Date() > verification.expiresAt) {
      this.verifications.delete(email)
      return { success: false, error: "Verification code has expired. Please request a new one." }
    }

    if (verification.attempts >= this.MAX_ATTEMPTS) {
      this.verifications.delete(email)
      return { success: false, error: "Too many failed attempts. Please request a new verification code." }
    }

    verification.attempts++

    if (verification.code !== inputCode) {
      return {
        success: false,
        error: `Invalid verification code. ${this.MAX_ATTEMPTS - verification.attempts} attempts remaining.`,
      }
    }

    verification.verified = true
    console.log(`✅ Email verified successfully: ${email}`)

    return { success: true }
  }

  async resendVerificationCode(
    email: string,
    firstName: string,
  ): Promise<{ success: boolean; code?: string; error?: string }> {
    // Remove existing verification
    this.verifications.delete(email)

    // Send new verification email
    return this.sendVerificationEmail(email, firstName)
  }

  isVerified(email: string): boolean {
    const verification = this.verifications.get(email)
    return verification?.verified || false
  }

  cleanup(): void {
    // Remove expired verifications
    const now = new Date()
    for (const [email, verification] of this.verifications.entries()) {
      if (now > verification.expiresAt) {
        this.verifications.delete(email)
      }
    }
  }
}

export const verificationService = new VerificationService()

// Cleanup expired verifications every 5 minutes
if (typeof window === "undefined") {
  setInterval(
    () => {
      verificationService.cleanup()
    },
    5 * 60 * 1000,
  )
}
