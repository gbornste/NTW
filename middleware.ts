import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path is protected
  const protectedPaths = ["/profile", "/create-card/send"]
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path))

  if (isProtectedPath) {
    // Temporarily allow all requests - NextAuth disabled
    // TODO: Re-enable proper authentication
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/profile/:path*", "/create-card/send/:path*"],
}
