export interface User {
  id: string
  email: string
  password: string
  name: string
  firstName?: string
  lastName?: string
  image?: string
  provider: string
  providerId?: string
  isVerified: boolean
  createdAt?: string
}

// In-memory user store for demo purposes
const users: User[] = [
  {
    id: "user_demo_1",
    email: "demo@notrumpnway.com",
    password: "demo123",
    name: "Demo User",
    firstName: "Demo",
    lastName: "User",
    image: "/placeholder.svg?height=40&width=40",
    provider: "credentials",
    isVerified: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "user_demo_2",
    email: "demo@example.com",
    password: "password123",
    name: "Test User",
    firstName: "Test",
    lastName: "User",
    image: "/placeholder.svg?height=40&width=40",
    provider: "credentials",
    isVerified: true,
    createdAt: new Date().toISOString(),
  },
]

// Validate user credentials
export function validateUserCredentials(email: string, password: string): User | null {
  try {
    console.log(`🔐 Validating credentials for: "${email}"`)

    if (!email || !password) {
      console.log("❌ Missing email or password")
      return null
    }

    const normalizedEmail = email.toLowerCase().trim()
    const user = users.find((u) => u.email.toLowerCase() === normalizedEmail)

    if (!user) {
      console.log("❌ User not found")
      return null
    }

    if (!user.isVerified) {
      console.log("❌ User not verified")
      return null
    }

    // Simple password comparison (in production, use bcrypt)
    if (user.password !== password) {
      console.log("❌ Invalid password")
      return null
    }

    console.log("✅ Credentials validated successfully")
    return user
  } catch (error) {
    console.error("🚨 Error validating credentials:", error)
    return null
  }
}

// Find user by email
export function findUserByEmail(email: string): User | null {
  try {
    if (!email) return null

    const normalizedEmail = email.toLowerCase().trim()
    return users.find((u) => u.email.toLowerCase() === normalizedEmail) || null
  } catch (error) {
    console.error("🚨 Error finding user by email:", error)
    return null
  }
}

// Create a new user
export function createNewUser(userData: Partial<User>): User {
  try {
    if (!userData.email) {
      throw new Error("Email is required")
    }

    const normalizedEmail = userData.email.toLowerCase().trim()

    // Check if user already exists
    const existingUser = findUserByEmail(normalizedEmail)
    if (existingUser) {
      return existingUser
    }

    const newUser: User = {
      id: userData.id || `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      email: normalizedEmail,
      password: userData.password || "",
      name: userData.name || "",
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image || "/placeholder.svg?height=40&width=40",
      provider: userData.provider || "credentials",
      providerId: userData.providerId,
      isVerified: userData.isVerified || false,
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    console.log("✅ User created:", normalizedEmail)
    return newUser
  } catch (error) {
    console.error("🚨 Error creating user:", error)
    throw new Error("Failed to create user")
  }
}

// Update user password
export function updateUserPassword(email: string, newPassword: string): boolean {
  try {
    if (!email || !newPassword) {
      console.log("❌ Missing email or new password")
      return false
    }

    const normalizedEmail = email.toLowerCase().trim()
    const userIndex = users.findIndex((u) => u.email.toLowerCase() === normalizedEmail)

    if (userIndex === -1) {
      console.log("❌ User not found for password update")
      return false
    }

    // Update the password
    users[userIndex].password = newPassword
    console.log("✅ Password updated successfully for:", normalizedEmail)
    return true
  } catch (error) {
    console.error("🚨 Error updating user password:", error)
    return false
  }
}

// Get all users (for debugging)
export function getAllUsers(): User[] {
  return users.map(({ password, ...user }) => ({ ...user, password: "***" }) as User)
}

// Debug function
export function debugUserStore(): void {
  console.log("🔍 User store debug info:")
  console.log(`👥 Total users: ${users.length}`)
  console.log("📋 Users:", getAllUsers())
}

// Create social user
export function createSocialUser(userData: {
  email: string
  name?: string
  image?: string
  provider: string
  providerId?: string
}): User {
  return createNewUser({
    email: userData.email,
    name: userData.name || "",
    image: userData.image,
    provider: userData.provider,
    providerId: userData.providerId,
    isVerified: true, // Social users are pre-verified
  })
}
