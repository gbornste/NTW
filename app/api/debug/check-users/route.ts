import { NextResponse } from "next/server"

// This should match the users array from user-actions.ts
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
    isVerified: true,
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
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export async function GET() {
  try {
    console.log("🔍 Debug endpoint called - checking users database")

    const usersList = users.map(({ password, ...user }) => ({
      ...user,
      password: "***", // Hide password in response
    }))

    console.log("Available users:", usersList)

    return NextResponse.json({
      success: true,
      totalUsers: users.length,
      users: usersList,
      debugInfo: {
        timestamp: new Date().toISOString(),
        message: "User database check completed",
      },
    })
  } catch (error) {
    console.error("❌ Error checking users:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to check users",
      },
      { status: 500 },
    )
  }
}
