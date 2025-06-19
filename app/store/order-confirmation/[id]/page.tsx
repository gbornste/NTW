"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  CheckCircle,
  Package,
  Truck,
  MapPin,
  Calendar,
  Mail,
  Phone,
  CreditCard,
  Download,
  Share2,
  Info,
} from "lucide-react"
import Link from "next/link"

interface OrderDetails {
  id: string
  status: string
  total: number
  items: Array<{
    id: string
    name: string
    variant: string
    quantity: number
    price: number
    image: string
  }>
  shipping: {
    method: string
    address: string
    estimatedDelivery: string
  }
  payment: {
    method: string
    last4: string
  }
  tracking?: {
    number: string
    carrier: string
    status: string
    updates: Array<{
      date: string
      status: string
      location: string
    }>
  }
}

export default function OrderConfirmationPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate order data loading
    const loadOrderData = () => {
      const mockOrder: OrderDetails = {
        id: String(params.id),
        status: "confirmed",
        total: 89.97,
        items: [
          {
            id: "1",
            name: "Anti-Trump Climate Action T-Shirt",
            variant: "Large - Black",
            quantity: 2,
            price: 24.99,
            image: "/political-t-shirt.png",
          },
          {
            id: "2",
            name: "Science Over Politics Coffee Mug",
            variant: "11oz Ceramic",
            quantity: 1,
            price: 16.99,
            image: "/political-mug.png",
          },
        ],
        shipping: {
          method: "Standard Shipping",
          address: "123 Main St, Anytown, ST 12345",
          estimatedDelivery: "December 20, 2024",
        },
        payment: {
          method: "Visa",
          last4: "4242",
        },
        tracking: {
          number: "1Z999AA1234567890",
          carrier: "UPS",
          status: "Processing",
          updates: [
            {
              date: "Dec 11, 2024 2:30 PM",
              status: "Order confirmed",
              location: "Processing Center",
            },
          ],
        },
      }
      setOrder(mockOrder)
      setLoading(false)
    }

    setTimeout(loadOrderData, 1000)
  }, [params.id])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  const getStatusProgress = (status: string) => {
    switch (status) {
      case "confirmed":
        return 25
      case "processing":
        return 50
      case "shipped":
        return 75
      case "delivered":
        return 100
      default:
        return 0
    }
  }

  if (loading) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Package className="h-12 w-12 animate-pulse mx-auto text-primary" />
            <h2 className="text-2xl font-semibold">Loading Order Details</h2>
            <p className="text-muted-foreground">Please wait while we fetch your order information...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container py-10">
        <div className="max-w-md mx-auto text-center">
          <Card>
            <CardContent className="pt-6">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Order Not Found</h3>
              <p className="text-muted-foreground mb-6">We couldn't find the order you're looking for.</p>
              <Button onClick={() => router.push("/store")} className="w-full">
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6">
      {/* Header */}
      <div className="text-center space-y-4 mb-8">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-green-600">Order Confirmed!</h1>
          <p className="text-lg text-muted-foreground">Thank you for your purchase</p>
        </div>
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Your order <strong>#{order.id}</strong> has been confirmed and will be processed shortly. You'll receive
            email updates about your order status.
          </AlertDescription>
        </Alert>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Current Status:</span>
                <Badge variant="default" className="bg-blue-500">
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{getStatusProgress(order.status)}%</span>
                </div>
                <Progress value={getStatusProgress(order.status)} />
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs text-center">
                <div
                  className={`p-2 rounded ${order.status === "confirmed" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  Confirmed
                </div>
                <div
                  className={`p-2 rounded ${order.status === "processing" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  Processing
                </div>
                <div
                  className={`p-2 rounded ${order.status === "shipped" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  Shipped
                </div>
                <div
                  className={`p-2 rounded ${order.status === "delivered" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  Delivered
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.variant}</p>
                      <p className="text-sm">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                      <p className="text-sm text-muted-foreground">{formatPrice(item.price)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tracking Information */}
          {order.tracking && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Tracking Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Tracking Number:</span>
                    <p className="font-mono">{order.tracking.number}</p>
                  </div>
                  <div>
                    <span className="font-medium">Carrier:</span>
                    <p>{order.tracking.carrier}</p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-3">
                  <h4 className="font-semibold">Tracking Updates</h4>
                  {order.tracking.updates.map((update, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      <div className="flex-1">
                        <p className="font-medium">{update.status}</p>
                        <p className="text-sm text-muted-foreground">{update.location}</p>
                        <p className="text-xs text-muted-foreground">{update.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatPrice(order.items.reduce((sum, item) => sum + item.price * item.quantity, 0))}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>{formatPrice(order.total * 0.08)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="font-medium">Method:</span>
                <p className="text-sm text-muted-foreground">{order.shipping.method}</p>
              </div>
              <div>
                <span className="font-medium">Address:</span>
                <p className="text-sm text-muted-foreground">{order.shipping.address}</p>
              </div>
              <div>
                <span className="font-medium">Estimated Delivery:</span>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {order.shipping.estimatedDelivery}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span>
                  {order.payment.method} ending in {order.payment.last4}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Button className="w-full" asChild>
              <Link href="/store">Continue Shopping</Link>
            </Button>
            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
            <Button variant="outline" className="w-full">
              <Mail className="h-4 w-4 mr-2" />
              Email Receipt
            </Button>
            <Button variant="outline" className="w-full">
              <Share2 className="h-4 w-4 mr-2" />
              Share Order
            </Button>
          </div>

          {/* Customer Support */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                If you have any questions about your order, our customer support team is here to help.
              </p>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Support
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
