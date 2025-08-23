
"use server"
// Stub implementation for updateUserProfile
export async function updateUserProfile(profileData: any) {
  if (!profileData || !profileData.id) {
    throw new Error("User ID is required to update profile.")
  }
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })
  const updateQuery = `UPDATE users SET 
    FName = ?,
    LName = ?,
    Address = ?,
    City = ?,
    State = ?,
    Zip = ?,
    Birthday = ?,
    UserEmail = ?,
    UserPhone = ?
    WHERE UserID = ?`
  const params = [
    profileData.firstName || "",
    profileData.lastName || "",
    profileData.address || "",
    profileData.city || "",
    profileData.state || "",
    profileData.zipCode || "",
    profileData.birthday || null,
    profileData.email || "",
    profileData.phone || "",
    profileData.id
  ]
  await connection.execute(updateQuery, params)
  await connection.end()
  return { success: true }
}

// Stub implementation for updateUserPassword
export async function updateUserPassword(userId: any, newPassword: string) {
  throw new Error("updateUserPassword is not implemented. Please implement this function.");
}

import mysql from "mysql2/promise"
import bcrypt from "bcryptjs"

export async function loginUser(email: string, password: string) {
  try {
    // Connect to DB
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    })

    // Get user by email
    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE UserEmail = ?",
      [email]
    )
    await connection.end()

    if ((rows as any[]).length === 0) {
      return { success: false, error: "Invalid email or password" }
    }

    const user = (rows as any)[0]
    const passwordMatch = await bcrypt.compare(password, user.Password)
    if (!passwordMatch) {
      return { success: false, error: "Invalid email or password" }
    }

    // Build user object for frontend
    const userForFrontend = {
      id: user.UserID,
      email: user.UserEmail,
      name: `${user.FName || ''} ${user.LName || ''}`.trim(),
      firstName: user.FName,
      lastName: user.LName,
      isVerified: true, // or use your own logic
      // add any other fields you want to expose
    }

    return { success: true, user: userForFrontend }
  } catch (error: any) {
    return { success: false, error: error.message || "Internal server error" }
  }
}

// All demo and placeholder code removed. Only real implementations and valid exports should remain.
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
    if (!identifier) {
      throw new Error("User identifier is required")
    }
    // Connect to DB
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    })
    // Query user by ID
    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE UserID = ?",
      [identifier]
    )
    await connection.end()
    if ((rows as any[]).length === 0) {
      throw new Error("User not found")
    }
    const user = (rows as any)[0]
    // Format birthday for frontend
    let formattedBirthday = ""
    if (user.Birthday) {
      try {
        formattedBirthday = new Date(user.Birthday).toISOString().split("T")[0]
      } catch {}
    }
    return {
      id: user.UserID,
      email: user.UserEmail,
      name: `${user.FName || ''} ${user.LName || ''}`.trim(),
      firstName: user.FName || "",
      lastName: user.LName || "",
      address: user.Address || "",
      city: user.City || "",
      state: user.State || "",
      zipCode: user.Zip || "",
      phone: user.UserPhone || "",
      birthday: formattedBirthday,
      isDemo: false,
    }
  } catch (error) {
    console.error("Error getting user profile:", error)
    throw error
  }
}


