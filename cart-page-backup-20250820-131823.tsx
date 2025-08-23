"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { 
  Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Heart, 
  Star, Shield, Truck, RotateCcw, Gift, Tag, Percent 
} from "lucide-react"

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gray-50 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-8">
            <ShoppingBag className="h-16 w-16 text-gray-300" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Looks like you haven''t added anything to your cart yet. <br />
            Start shopping to fill it up with amazing products!
          </p>
          
          <div className="space-y-6">
            <Link href="/store">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Browse Our Store
              </Button>
            </Link>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
              <Link href="/create-card">
                <Button variant="outline" size="lg" className="w-full">
                  <Gift className="h-5 w-5 mr-2" />
                  Create a Card
                </Button>
              </Link>
              <Link href="/games">
                <Button variant="outline" size="lg" className="w-full">
                  <Star className="h-5 w-5 mr-2" />
                  Play Games
                </Button>
              </Link>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 pt-8 border-t">
            <div className="text-center">
              <Shield className="h-8 w-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Secure Shopping</h3>
              <p className="text-sm text-gray-600">256-bit SSL encryption for all transactions</p>
            </div>
            <div className="text-center">
              <Truck className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Free Shipping</h3>
              <p className="text-sm text-gray-600">Free delivery on orders over $50</p>
            </div>
            <div className="text-center">
              <RotateCcw className="h-8 w-8 text-purple-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Easy Returns</h3>
              <p className="text-sm text-gray-600">30-day hassle-free return policy</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <p>Cart with items functionality here...</p>
    </div>
  )
}
