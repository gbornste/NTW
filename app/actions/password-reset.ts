"use server"

import { findUserByEmail } from "@/lib/auth-service"
import {
  generateResetToken,
  validateResetToken,
  storeResetToken,
  consumeResetToken,
} from "@/lib/password-reset-service"
import { sendPasswordResetEmail } from "@/lib/email-service"

// Request a password reset
export async function requestPasswordReset(email: string) {
  try {
    // Normalize email
    const normalizedEmail = email.toLowerCase().trim()

    // Find user by email
    const user = findUserByEmail(normalizedEmail)

    // If user doesn't exist, we still return success for security reasons
    // but we don't actually send an email
    if (!user) {
      console.log(`Password reset requested for non-existent email: ${normalizedEmail}`)
      return { success: true }
    }

    // Generate a reset token
    const token = await generateResetToken()

    // Store the token with the user's email and an expiration time
    await storeResetToken(normalizedEmail, token)

    // Send the password reset email
    await sendPasswordResetEmail(normalizedEmail, token, user.name || "")

    return { success: true }
  } catch (error) {
    console.error("Error requesting password reset:", error)
    return { success: false, error: "Failed to process password reset request" }
  }
}

// Verify a reset token
export async function verifyResetToken(token: string) {
  try {
    const isValid = await validateResetToken(token)
    return { valid: isValid }
  } catch (error) {
    console.error("Error verifying reset token:", error)
    return { valid: false }
  }
}

// Reset password with token
export async function resetPassword(token: string, newPassword: string) {
  try {
    // Validate the token first
    const tokenData = await validateResetToken(token)

    if (!tokenData) {
      return { success: false, error: "Invalid or expired reset token" }
    }

    // Get the email associated with the token
    const email = tokenData.email

    // Update the user's password
    // In a real app, you would hash the password before storing it
    const user = findUserByEmail(email)

    if (!user) {
      return { success: false, error: "User not found" }
    }

    // Update password (in a real app, this would update the database)
    user.password = newPassword

    // Consume the token so it can't be used again
    await consumeResetToken(token)

    return { success: true }
  } catch (error) {
    console.error("Error resetting password:", error)
    return { success: false, error: "Failed to reset password" }
  }
}
