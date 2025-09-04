// Temporary disabled NextAuth configuration
import { NextResponse } from "next/server"

export const authOptions = {
  // Minimal config placeholder
  providers: [],
  secret: process.env.NEXTAUTH_SECRET,
}

export async function GET() {
  return NextResponse.json({ message: "NextAuth temporarily disabled" })
}

export async function POST() {
  return NextResponse.json({ message: "NextAuth temporarily disabled" })
}
