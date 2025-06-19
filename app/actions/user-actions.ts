"use server"

import { verificationService } from "@/lib/verification-service"

// Enhanced demo user database with verification status
const users = [
  {
    id: "demo-user-1",
    firstName: "Demo",
    lastName: "User",
    email: "demo@notrumpnway.com",
    password: "demo123",
    address: "123 Demo Street",
    city: "Demo City",
    state: "Demo State",
    zipCode: "12345",
    birthday: "1990-01-01",
    isVerified: true, // Demo accounts are pre-verified
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "admin-user-1",
    firstName: "Admin",
    lastName: "User",
    email: "admin@notrumpnway.com",
    password: "admin123",
    address: "456 Admin Avenue",
    city: "Admin City",
    state: "Admin State",
    zipCode: "67890",
    birthday: "1985-05-15",
    isVerified: true, // Demo accounts are pre-verified
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Enhanced login function with proper error handling
export async function loginUser(email: string, password: string) {
  try {
    console.log(`🔐 Login attempt for: "${email}"`)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Validate inputs
    if (!email || !password) {
      console.log("❌ Missing email or password")
      throw new Error("Email and password are required")
    }

    // Normalize email for comparison
    const normalizedEmail = email.toLowerCase().trim()
    console.log(`🔍 Searching for user with email: "${normalizedEmail}"`)

    // Debug: Log all available users
    console.log("Available users in demo database:")
    users.forEach((user, index) => {
      console.log(`${index + 1}. Email: "${user.email}", Password: "${user.password}"`)
    })

    // Find user by email first
    const user = users.find((user) => {
      const userEmailMatch = user.email.toLowerCase() === normalizedEmail
      console.log(`👤 Checking user: ${user.email}, Email match: ${userEmailMatch}`)
      return userEmailMatch
    })

    if (!user) {
      console.log("❌ User not found with email:", normalizedEmail)
      console.log(
        "Available emails:",
        users.map((u) => u.email),
      )
      throw new Error("Invalid email or password")
    }

    console.log(`✅ User found: ${user.email} (ID: ${user.id})`)

    // Now check password
    const passwordMatch = user.password === password
    console.log(`🔐 Password check: Expected "${user.password}", Got "${password}", Match: ${passwordMatch}`)

    if (!passwordMatch) {
      console.log("❌ Invalid password for user:", user.email)
      throw new Error("Invalid email or password")
    }

    console.log(`✅ Password validated for: ${user.email}`)

    // Check if user is verified (demo accounts are auto-verified)
    const isDemoAccount = user.email.includes("@notrumpnway.com")
    if (!user.isVerified && !isDemoAccount) {
      console.log("❌ User not verified")
      return {
        success: false,
        requiresVerification: true,
        email: user.email,
        error: "Please verify your email address before logging in",
      }
    }

    console.log(`✅ Login successful for: ${user.email}`)

    // Return user data (excluding password)
    const { password: _, ...userData } = user
    return {
      success: true,
      user: userData,
      requiresVerification: false,
    }
  } catch (error) {
    console.error("❌ Error logging in user:", error)

    // Return structured error response instead of throwing
    return {
      success: false,
      requiresVerification: false,
      error: error instanceof Error ? error.message : "Login failed",
    }
  }
}

// Create a new user with verification process
export async function createUser(userData: any) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Validate required fields
  if (!userData.firstName?.trim()) {
    throw new Error("First name is required")
  }
  if (!userData.lastName?.trim()) {
    throw new Error("Last name is required")
  }
  if (!userData.email?.trim()) {
    throw new Error("Email address is required")
  }
  if (!userData.password) {
    throw new Error("Password is required")
  }

  // Check if email already exists
  if (users.some((user) => user.email.toLowerCase() === userData.email.toLowerCase())) {
    throw new Error("Email already in use. Please use a different email address or try logging in.")
  }

  // Determine if this is a demo account (auto-verify demo accounts)
  const isDemoAccount = userData.email.toLowerCase().includes("@notrumpnway.com")

  // Create new user
  const newUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    firstName: userData.firstName.trim(),
    lastName: userData.lastName.trim(),
    email: userData.email.toLowerCase().trim(),
    password: userData.password,
    address: userData.address || "",
    city: userData.city || "",
    state: userData.state || "",
    zipCode: userData.zipCode || "",
    birthday: userData.birthday || "",
    isVerified: isDemoAccount, // Auto-verify demo accounts
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  users.push(newUser)

  console.log(`✅ Demo user created: ${newUser.email}`)
  console.log(`Total users: ${users.length}`)

  // Send verification email for non-demo accounts
  if (!isDemoAccount) {
    try {
      const verificationResult = await verificationService.sendVerificationEmail(newUser.email, newUser.firstName)

      if (!verificationResult.success) {
        throw new Error("Account created but verification email failed to send. Please try again.")
      }

      return {
        success: true,
        userId: newUser.id,
        requiresVerification: true,
        verificationCode: verificationResult.code, // For demo purposes
      }
    } catch (verificationError) {
      console.error("Verification service error:", verificationError)
      // Still return success for account creation, but note verification issue
      return {
        success: true,
        userId: newUser.id,
        requiresVerification: true,
        verificationError: "Account created but verification email could not be sent",
      }
    }
  }

  return {
    success: true,
    userId: newUser.id,
    requiresVerification: false,
  }
}

// Verify user email
export async function verifyUserEmail(email: string, code: string) {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const result = await verificationService.verifyCode(email, code)

    if (result.success) {
      // Update user verification status
      const userIndex = users.findIndex((user) => user.email.toLowerCase() === email.toLowerCase())
      if (userIndex !== -1) {
        users[userIndex].isVerified = true
        users[userIndex].updatedAt = new Date().toISOString()
        console.log(`✅ User verified: ${email}`)
      }
    }

    return result
  } catch (error) {
    console.error("Error verifying user email:", error)
    throw error
  }
}

// Resend verification code
export async function resendVerificationCode(email: string) {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user = users.find((user) => user.email.toLowerCase() === email.toLowerCase())
    if (!user) {
      throw new Error("User not found")
    }

    if (user.isVerified) {
      return { success: true, message: "Email is already verified" }
    }

    const result = await verificationService.resendVerificationCode(user.email, user.firstName)

    if (result.success) {
      return {
        success: true,
        message: "Verification code sent successfully",
        verificationCode: result.code, // For demo purposes
      }
    } else {
      throw new Error(result.error || "Failed to resend verification code")
    }
  } catch (error) {
    console.error("Error resending verification code:", error)
    throw error
  }
}

// Get user by email (demo implementation)
export async function getUserByEmail(email: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const user = users.find((user) => user.email.toLowerCase() === email.toLowerCase())

  if (!user) {
    throw new Error("User not found")
  }

  // Return user data (excluding password)
  const { password, ...userData } = user
  return userData
}

// Get current authenticated user (demo implementation)
export async function getCurrentUser() {
  // In a real app, this would check the session
  // For demo, return the first demo user
  const user = users[0]
  if (!user) {
    return null
  }

  // Return user data (excluding password)
  const { password, ...userData } = user
  return userData
}

// Update user profile (demo implementation)
export async function updateUserProfile(userEmail: string, profileData: any) {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (!userEmail) {
      throw new Error("User email is required")
    }

    // Find user in demo database
    const userIndex = users.findIndex((user) => user.email.toLowerCase() === userEmail.toLowerCase())

    if (userIndex === -1) {
      throw new Error("User not found")
    }

    // Update user data
    const updatedUser = {
      ...users[userIndex],
      ...profileData,
      updatedAt: new Date().toISOString(),
    }

    users[userIndex] = updatedUser

    console.log(`✅ Profile updated for user: ${userEmail}`)

    // Return user data (excluding password)
    const { password, ...userData } = updatedUser
    return { success: true, user: userData }
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw error
  }
}

// Send card via email (demo implementation)
export async function sendCardViaEmail(
  cardData: any,
  recipientEmail: string,
  personalMessage?: string,
  senderInfo?: any,
) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  console.log("🎯 Starting demo card send process...")

  // Validate inputs
  if (!recipientEmail || !recipientEmail.includes("@")) {
    throw new Error("Please provide a valid recipient email address")
  }

  if (!cardData || !cardData.message) {
    throw new Error("Card data is incomplete")
  }

  if (!cardData.recipientName?.trim()) {
    throw new Error("Recipient name is required")
  }

  try {
    // Generate a unique card ID for tracking
    const cardId = `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const senderName = senderInfo?.name || "Demo User"
    const recipientName = cardData.recipientName.trim()

    // Generate dynamic subject line
    const subjectLine = `${senderName} sent you a ${cardData.cardType || "greeting"} card courtesy of NoTrumpNWay`

    // 🚨 DEMO SIMULATION - No real emails are sent!
    console.log(`
      ═══════════════════════════════════════════════════════════════
      📧 EMAIL SIMULATION - NO REAL EMAIL SENT 📧
      ═══════════════════════════════════════════════════════════════
      
      To: ${recipientEmail}
      From: cards@notrumpnway.com
      Subject: ${subjectLine}
      Card ID: ${cardId}
      
      Hello ${recipientName}!
      
      You've received a special ${cardData.cardType || "greeting"} card from ${senderName}!
      
      ${personalMessage ? `Personal message: "${personalMessage}"` : ""}
      
      Card Message: ${cardData.message}
      
      ${cardData.optionalText ? `Additional Note: ${cardData.optionalText}` : ""}
      
      With best wishes,
      ${senderName}
      
      ---
      This card was created with NoTrumpNWay's political greeting card creator.
      Visit: https://notrumpnway.com/create-card
      
      ═══════════════════════════════════════════════════════════════
    `)

    console.log(`✅ DEMO: Card "sent" successfully:
      - From: ${senderName}
      - To: ${recipientName} (${recipientEmail})
      - Card Type: ${cardData.cardType || "general"}
      - Card ID: ${cardId}
      
      🚨 NOTE: This is a demonstration. No real email was sent.
    `)

    return {
      success: true,
      cardId,
      message: `${cardData.cardType || "Greeting"} card sent successfully to ${recipientName}! (Demo simulation)`,
      sentAt: new Date().toISOString(),
      recipientName,
      recipientEmail,
      senderName,
      subjectLine,
      cardType: cardData.cardType || "general",
      isSimulation: true,
    }
  } catch (error) {
    console.error("❌ Error sending card email:", error)
    throw new Error("Failed to send card. Please check your connection and try again.")
  }
}

// Get user profile by ID or email (demo implementation)
export async function getUserProfile(identifier: string) {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (!identifier) {
      throw new Error("User identifier is required")
    }

    // Find user by ID or email
    const user = users.find((user) => user.id === identifier || user.email.toLowerCase() === identifier.toLowerCase())

    if (!user) {
      throw new Error("User not found")
    }

    // Return user data (excluding password)
    const { password, ...userData } = user
    return { success: true, user: userData }
  } catch (error) {
    console.error("Error getting user profile:", error)
    throw error
  }
}

// Update user password (demo implementation)
export async function updateUserPassword(userEmail: string, newPassword: string) {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (!userEmail) {
      throw new Error("User email is required")
    }

    if (!newPassword || newPassword.length < 8) {
      throw new Error("Password must be at least 8 characters long")
    }

    // Find user in demo database
    const userIndex = users.findIndex((user) => user.email.toLowerCase() === userEmail.toLowerCase())

    if (userIndex === -1) {
      throw new Error("User not found")
    }

    // Update password
    users[userIndex] = {
      ...users[userIndex],
      password: newPassword,
      updatedAt: new Date().toISOString(),
    }

    console.log(`✅ Password updated for user: ${userEmail}`)

    return { success: true, message: "Password updated successfully" }
  } catch (error) {
    console.error("Error updating password:", error)
    throw error
  }
}

// Legacy verification functions for backward compatibility
export async function verifyUserAccount(userEmail: string, verificationCode?: string) {
  return verifyUserEmail(userEmail, verificationCode || "")
}

export async function resendVerificationPin(userEmail: string) {
  return resendVerificationCode(userEmail)
}

// Debug function to list all users (for development)
export async function debugListUsers() {
  console.log("🔍 Debug: Current users in database:")
  users.forEach((user, index) => {
    console.log(`${index + 1}. Email: ${user.email}, ID: ${user.id}, Verified: ${user.isVerified}`)
  })
  return users.map(({ password, ...user }) => user)
}
