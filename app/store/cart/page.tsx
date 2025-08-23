"use client"

import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ShoppingCart, Minus, Plus, Trash2, Heart, Star } from "lucide-react"

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart()

  const subtotal = getTotalPrice()
  const shipping = subtotal > 50 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleQuantityChange = (productId: string, variantId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, variantId)
    } else {
      updateQuantity(productId, variantId, newQuantity)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <Link href="/store" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          </div>

          <div className="flex items-center justify-center h-96">
            <Card className="w-full max-w-md text-center">
              <CardContent className="pt-6">
                <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
                <p className="text-gray-600 mb-6">Looks like you haven'"'"'t added anything to your cart yet.</p>
                <Link href="/store">
                  <Button className="w-full">Start Shopping</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/store" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {items.length} {items.length === 1 ? '"'"'item'"'"' : '"'"'items'"'"'}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={`${item.productId}-${item.variantId}`} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Product Image */}
                    <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title || "Product"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-400">
                          <ShoppingCart className="h-8 w-8" />
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {item.title || `Product ${item.productId}`}
                          </h3>
                          
                          {/* Product Options */}
                          <div className="space-y-1">
                            {Object.entries(item.options || {}).map(([key, value]) => (
                              <div key={key} className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500 capitalize">{key}:</span>
                                <Badge variant="outline" className="text-xs">
                                  {value}
                                </Badge>
                              </div>
                            ))}
                          </div>

                          {/* Product Description */}
                          {item.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                          {item.quantity > 1 && (
                            <div className="text-sm text-gray-500">
                              ${item.price.toFixed(2)} each
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls and Actions */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-3">
                          {/* Quantity Selector */}
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-l-lg"
                              onClick={() => handleQuantityChange(item.productId, item.variantId, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => {
                                const qty = parseInt(e.target.value, 10)
                                if (qty >= 0) handleQuantityChange(item.productId, item.variantId, qty)
                              }}
                              className="w-16 h-8 text-center border-0 text-sm font-semibold"
                              min="0"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-r-lg"
                              onClick={() => handleQuantityChange(item.productId, item.variantId, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-500 hover:text-red-600"
                            onClick={() => removeFromCart(item.productId, item.variantId)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Clear Cart Button */}
            <div className="pt-4">
              <Button
                variant="outline"
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>Review your order details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({items.length} {items.length === 1 ? '"'"'item'"'"' : '"'"'items'"'"'})</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className="flex items-center space-x-2">
                      {shipping === 0 ? (
                        <>
                          <span className="line-through text-gray-400">$9.99</span>
                          <span className="text-green-600 font-medium">FREE</span>
                        </>
                      ) : (
                        <span>${shipping.toFixed(2)}</span>
                      )}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                      Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="space-y-4">
                <Link href="/store/checkout" className="w-full">
                  <Button className="w-full h-12 text-lg font-semibold">
                    Proceed to Checkout
                  </Button>
                </Link>
                <div className="text-xs text-gray-500 text-center">
                  Secure checkout powered by SSL encryption
                </div>
              </CardFooter>
            </Card>

            {/* Trust Badges */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">4.9/5 from 2,847 reviews</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Free shipping on orders over $50</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>30-day money-back guarantee</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Secure payment processing</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
