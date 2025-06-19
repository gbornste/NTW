"use client"

import { CartProvider } from "@/contexts/cart-context"
import type React from "react"

interface CartProviderWrapperProps {
  children: React.ReactNode
}

export function CartProviderWrapper({ children }: CartProviderWrapperProps) {
  return <CartProvider>{children}</CartProvider>
}
