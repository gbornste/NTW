declare module "next-auth" {
  interface Session {
    accessToken?: string
    provider?: string
    userData?: {
      firstName: string
      lastName: string
      birthday: string
      profileImage: string
    }
  }

  interface User {
    id: string
    email: string
    name?: string
    image?: string
    firstName?: string
    lastName?: string
    birthday?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    userId?: string
    provider?: string
    userData?: {
      firstName: string
      lastName: string
      birthday: string
      profileImage: string
    }
  }
}
