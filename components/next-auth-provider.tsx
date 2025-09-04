"use client"

import { SessionProvider } from "next-auth/react"
import type { ReactNode } from "react"

interface NextAuthProviderProps {
  children: ReactNode
  session?: any
}

export function NextAuthProvider({ children, session }: NextAuthProviderProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>
}
