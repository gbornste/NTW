"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function getSessionStatus() {
  try {
    const session = await getServerSession(authOptions)
    return {
      isAuthenticated: !!session,
      user: session?.user || null,
      expires: session?.expires || null,
    }
  } catch (error) {
    console.error("Error getting session status:", error)
    return {
      isAuthenticated: false,
      user: null,
      expires: null,
      error: String(error),
    }
  }
}
