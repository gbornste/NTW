import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import type { Session } from "next-auth"

export async function getAuthSession(): Promise<Session | null> {
  try {
    const session = await getServerSession(authOptions)
    return session
  } catch (error) {
    console.error("Error getting server session:", error)
    return null
  }
}

export async function requireAuth(): Promise<Session> {
  const session = await getAuthSession()
  if (!session) {
    throw new Error("Authentication required")
  }
  return session
}

export async function getCurrentUserId(): Promise<string | null> {
  const session = await getAuthSession()
  return session?.user?.id || null
}

export async function getCurrentUserEmail(): Promise<string | null> {
  const session = await getAuthSession()
  return session?.user?.email || null
}
