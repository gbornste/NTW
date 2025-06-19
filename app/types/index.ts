export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  birthday?: string
  isVerified?: boolean
  socialProvider?: string | null
  socialId?: string | null
  profileImage?: string
  createdAt?: string
  updatedAt?: string
}

export interface CardData {
  templateName?: string
  templateImage?: string
  message: string
  recipientName?: string
}

export interface AuthSession {
  user: {
    id: string
    email: string
    name?: string
    image?: string
    firstName?: string
    lastName?: string
  }
  accessToken?: string
  provider?: string
  userData?: any
}
