// Temporarily disabled due to NextAuth v4/v5 compatibility issues
export async function getAuthSession(): Promise<any> {
  try {
    // Return null since NextAuth is temporarily disabled
    return null
  } catch (error) {
    console.error("Error getting server session:", error)
    return null
  }
}

export async function requireAuth(): Promise<any> {
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
