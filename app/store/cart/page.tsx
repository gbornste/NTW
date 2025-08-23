'use client'

import React from 'react'
import { useCart } from '@/contexts/cart-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export const dynamic = "force-dynamic"

export default function CartPage() {
  const cartData = useCart()
  const items = cartData?.items || []
  const updateQuantity = cartData?.updateQuantity
  const removeFromCart = cartData?.removeFromCart
  const clearCart = cartData?.clearCart
  const getTotalPrice = cartData?.getTotalPrice
  const getCartItemCount = cartData?.getCartItemCount

  const formatPrice = (price: number | string): string => {
    const numPrice: number = typeof price === 'number' ? price : parseFloat(price as string) || 0
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(numPrice)
  }

  const handleUpdateQuantity = (productId: string, variantId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart && removeFromCart(productId, variantId)
    } else {
      updateQuantity && updateQuantity(productId, variantId, newQuantity)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-lg p-12">
              <ShoppingBag className="mx-auto h-24 w-24 text-gray-300 mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
              <p className="text-gray-600 mb-8">
                Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
              </p>
              <div className="space-y-4">
                <Link href="/store">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Continue Shopping
                  </Button>
                </Link>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Link href="/create-card">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Create a Card
                    </Button>
                  </Link>
                  <Link href="/games">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Play Games
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const totalPrice = getTotalPrice ? getTotalPrice() : 0
  const itemCount = getCartItemCount ? getCartItemCount() : items.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/store">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Store
            </Button>
          </Link>
          <div className="flex items-center">
            <ShoppingCart className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-gray-600">
                {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">Cart Items</CardTitle>
                {items.length > 0 && clearCart && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Cart
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item: any, index: number) => (
                  <div key={item.productId + '-' + (item.variantId || index)}>
                    {index > 0 && <Separator />}
                    <div className="flex gap-4 py-4">
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.title || 'Product'}
                              width={96}
                              height={96}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ShoppingBag className="h-8 w-8 text-gray-300" />
                          )}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {item.title || 'Product'}
                        </h3>
                        
                        {item.description && (
                          <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                        )}

                        <div className="flex gap-2 mb-2">
                          {item.color && (
                            <Badge variant="outline" className="text-xs">
                              Color: {item.color}
                            </Badge>
                          )}
                          {item.size && (
                            <Badge variant="secondary" className="text-xs">
                              Size: {item.size}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end justify-between">
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                          <p className="text-sm text-gray-500">
                            {formatPrice(item.price)} each
                          </p>
                        </div>

                        <div className="flex items-center space-x-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateQuantity(
                              item.productId || item.id, 
                              item.variantId, 
                              item.quantity - 1
                            )}
                            disabled={item.quantity <= 1}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="text-lg font-medium px-3 py-1 bg-gray-50 rounded-md min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateQuantity(
                              item.productId || item.id, 
                              item.variantId, 
                              item.quantity + 1
                            )}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart && removeFromCart(item.productId || item.id, item.variantId)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium mt-1"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="shadow-lg sticky top-4">
              <CardHeader>
                <CardTitle className="text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                    <span className="font-medium">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">FREE</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-green-600">{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <Link href="/checkout">
                    <Button className="w-full" size="lg">
                      Proceed to Checkout
                    </Button>
                  </Link>
                  <Link href="/store">
                    <Button variant="outline" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>

                <div className="text-xs text-gray-500 pt-4 space-y-1">
                  <p> Free shipping on orders over $50</p>
                  <p> Secure checkout with SSL encryption</p>
                  <p> 30-day return policy</p>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6 bg-gray-50">
              <CardContent className="p-4 text-center">
                <div className="text-sm text-gray-600 font-medium">
                   Secure Shopping Experience
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  SSL encrypted  Safe payments  Protected data
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}