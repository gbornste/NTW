import { NextResponse } from "next/server"
import { debugListUsers } from "@/app/actions/user-actions"

export async function GET() {
  try {
    const users = await debugListUsers()

    return NextResponse.json({
      success: true,
      users: users,
      count: users.length,
      message: "User list retrieved successfully",
    })
  } catch (error) {
    console.error("Debug users error:", error)
    return NextResponse.json(
      {
        error: "Failed to retrieve users",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
