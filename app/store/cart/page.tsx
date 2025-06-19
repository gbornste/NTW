"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { ResponsiveProductImage } from "@/components/responsive-product-image"
import { createPrintifyOrder } from "@/lib/printify-service"
import {
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  Loader2,
  CreditCard,
  Lock,
  Truck,
  Gift,
  ArrowRight,
  ArrowLeft,
  Package,
  MapPin,
  User,
  Mail,
  Phone,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface ShippingInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address1: string
  address2: string
  city: string
  region: string
  country: string
  zip: string
}

interface PaymentInfo {
  cardNumber: string
  expiryDate: string
  cvv: string
  cardholderName: string
}

export default function CartPage() {
  const [isClient, setIsClient] = useState(false)
  const { state, removeItem, updateQuantity, clearCart, isLoading: cartLoading } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [orderStatus, setOrderStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  const [orderError, setOrderError] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState<"cart" | "shipping" | "payment" | "review">("cart")
  const [specialInstructions, setSpecialInstructions] = useState("")
  const [isGift, setIsGift] = useState(false)
  const [giftMessage, setGiftMessage] = useState("")
  const [promoCode, setPromoCode] = useState("")
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    region: "",
    country: "US",
    zip: "",
  })

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  })

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Ensure component is mounted before rendering cart-dependent UI
  useEffect(() => {
    setMounted(true)
  }, [])

  // Early return for server-side rendering
  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full" />
            <p>Loading your cart...</p>
          </div>
        </div>
      </div>
    )
  }

  const subtotal = state.total
  const shipping = subtotal > 50 ? 0 : 5.99
  const discount = (subtotal * promoDiscount) / 100
  const tax = (subtotal - discount) * 0.08
  const total = subtotal + shipping - discount + tax

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(itemId)
    } else {
      updateQuantity(itemId, newQuantity)
    }
  }

  const handleShippingInfoChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePaymentInfoChange = (field: keyof PaymentInfo, value: string) => {
    setPaymentInfo((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const validateShippingInfo = (): boolean => {
    const required = ["firstName", "lastName", "email", "address1", "city", "region", "zip"]
    return required.every((field) => shippingInfo[field as keyof ShippingInfo].trim() !== "")
  }

  const validatePaymentInfo = (): boolean => {
    const required = ["cardNumber", "expiryDate", "cvv", "cardholderName"]
    return required.every((field) => paymentInfo[field as keyof PaymentInfo].trim() !== "")
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const applyPromoCode = () => {
    const validCodes = {
      SAVE10: 10,
      WELCOME15: 15,
      STUDENT20: 20,
    }

    if (validCodes[promoCode.toUpperCase()]) {
      setPromoDiscount(validCodes[promoCode.toUpperCase()])
      toast({
        title: "Promo code applied!",
        description: `You saved ${validCodes[promoCode.toUpperCase()]}%`,
      })
    } else {
      toast({
        title: "Invalid promo code",
        description: "Please check your code and try again",
        variant: "destructive",
      })
    }
  }

  const handleCheckout = async () => {
    if (!validateShippingInfo()) {
      setOrderError("Please fill in all required shipping information.")
      return
    }

    if (!validatePaymentInfo()) {
      setOrderError("Please fill in all required payment information.")
      return
    }

    if (state.items.length === 0) {
      setOrderError("Your cart is empty.")
      return
    }

    setIsCheckingOut(true)
    setOrderStatus("processing")
    setOrderError(null)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Prepare order data for Printify
      const orderData = {
        external_id: `order-${Date.now()}`,
        label: `NoTrumpNWay Order - ${new Date().toLocaleDateString()}`,
        line_items: state.items.map((item) => ({
          product_id: item.productId,
          variant_id: item.variantId,
          quantity: item.quantity,
        })),
        shipping_method: 1,
        is_printify_express: false,
        send_shipping_notification: true,
        address_to: {
          first_name: shippingInfo.firstName,
          last_name: shippingInfo.lastName,
          email: shippingInfo.email,
          phone: shippingInfo.phone,
          country: shippingInfo.country,
          region: shippingInfo.region,
          address1: shippingInfo.address1,
          address2: shippingInfo.address2,
          city: shippingInfo.city,
          zip: shippingInfo.zip,
        },
      }

      console.log("Creating Printify order with data:", orderData)

      const response = await createPrintifyOrder(orderData)

      if (response.error) {
        throw new Error(response.error)
      }

      setOrderStatus("success")
      setOrderId(response.id || `order-${Date.now()}`)
      clearCart()

      // Redirect to order confirmation
      setTimeout(() => {
        router.push(`/store/order-confirmation/${response.id || `order-${Date.now()}`}`)
      }, 3000)
    } catch (error) {
      console.error("Checkout error:", error)
      setOrderStatus("error")
      setOrderError(error instanceof Error ? error.message : "Failed to process order. Please try again.")
    } finally {
      setIsCheckingOut(false)
    }
  }

  const nextStep = () => {
    if (currentStep === "cart" && state.items.length > 0) {
      setCurrentStep("shipping")
    } else if (currentStep === "shipping" && validateShippingInfo()) {
      setCurrentStep("payment")
    } else if (currentStep === "payment" && validatePaymentInfo()) {
      setCurrentStep("review")
    }
  }

  const prevStep = () => {
    if (currentStep === "review") setCurrentStep("payment")
    else if (currentStep === "payment") setCurrentStep("shipping")
    else if (currentStep === "shipping") setCurrentStep("cart")
  }

  const getStepProgress = () => {
    const steps = ["cart", "shipping", "payment", "review"]
    return ((steps.indexOf(currentStep) + 1) / steps.length) * 100
  }

  // Show loading state while cart is loading
  if (!mounted || cartLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading your cart...</p>
          </div>
        </div>
      </div>
    )
  }

  if (orderStatus === "success") {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
            <p className="text-muted-foreground mb-4">
              Thank you for your purchase. Your order has been submitted for processing.
            </p>
            {orderId && (
              <div className="bg-muted p-3 rounded-lg mb-4">
                <p className="text-sm font-medium">Order ID: {orderId}</p>
              </div>
            )}
            <p className="text-sm text-muted-foreground mb-4">
              You will receive an email confirmation with tracking information.
            </p>
            <Button asChild>
              <Link href="/store">Continue Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">Shopping Cart</h1>
          <span className="text-sm text-muted-foreground">{Math.round(getStepProgress())}% Complete</span>
        </div>
        <Progress value={getStepProgress()} className="h-2" />
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[
          { id: "cart", title: "Cart", icon: ShoppingCart },
          { id: "shipping", title: "Shipping", icon: MapPin },
          { id: "payment", title: "Payment", icon: CreditCard },
          { id: "review", title: "Review", icon: CheckCircle },
        ].map((step, index) => {
          const Icon = step.icon
          const isActive = step.id === currentStep
          const isCompleted = ["cart", "shipping", "payment", "review"].indexOf(currentStep) > index

          return (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : isCompleted
                      ? "border-green-500 bg-green-500 text-white"
                      : "border-muted-foreground bg-background"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  isActive ? "text-primary" : isCompleted ? "text-green-500" : "text-muted-foreground"
                }`}
              >
                {step.title}
              </span>
              {index < 3 && <ArrowRight className="h-4 w-4 mx-4 text-muted-foreground" />}
            </div>
          )
        })}
      </div>

      {state.items.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-4">Add some items to get started!</p>
            <Button asChild>
              <Link href="/store">Browse Products</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {currentStep === "cart" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Cart Items ({state.itemCount})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                      <ResponsiveProductImage
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="flex-shrink-0 rounded-md"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.variant}</p>
                        {item.options &&
                          Object.entries(item.options).map(([key, value]) => (
                            <p key={key} className="text-xs text-muted-foreground">
                              {key}: {String(value)}
                            </p>
                          ))}
                        <p className="font-semibold mt-2">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, Number.parseInt(e.target.value) || 1)}
                            className="w-16 text-center"
                            min="1"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Separator />

                  {/* Promo Code */}
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                      />
                      <Button onClick={applyPromoCode} variant="outline">
                        Apply
                      </Button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="gift" checked={isGift} onCheckedChange={setIsGift} />
                      <Label htmlFor="gift" className="flex items-center gap-2">
                        <Gift className="h-4 w-4" />
                        This is a gift
                      </Label>
                    </div>

                    {isGift && (
                      <Textarea
                        placeholder="Enter gift message..."
                        value={giftMessage}
                        onChange={(e) => setGiftMessage(e.target.value)}
                        className="resize-none"
                        rows={3}
                      />
                    )}

                    <Textarea
                      placeholder="Special instructions (optional)"
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      className="resize-none"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === "shipping" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        value={shippingInfo.firstName}
                        onChange={(e) => handleShippingInfoChange("firstName", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={shippingInfo.lastName}
                        onChange={(e) => handleShippingInfoChange("lastName", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) => handleShippingInfoChange("email", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      value={shippingInfo.phone}
                      onChange={(e) => handleShippingInfoChange("phone", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="address1">Address Line 1 *</Label>
                    <Input
                      id="address1"
                      value={shippingInfo.address1}
                      onChange={(e) => handleShippingInfoChange("address1", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="address2">Address Line 2</Label>
                    <Input
                      id="address2"
                      value={shippingInfo.address2}
                      onChange={(e) => handleShippingInfoChange("address2", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={shippingInfo.city}
                        onChange={(e) => handleShippingInfoChange("city", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="region">State/Region *</Label>
                      <Input
                        id="region"
                        value={shippingInfo.region}
                        onChange={(e) => handleShippingInfoChange("region", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Input
                        id="country"
                        value={shippingInfo.country}
                        onChange={(e) => handleShippingInfoChange("country", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="zip">ZIP Code *</Label>
                      <Input
                        id="zip"
                        value={shippingInfo.zip}
                        onChange={(e) => handleShippingInfoChange("zip", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === "payment" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="cardholderName">Cardholder Name *</Label>
                    <Input
                      id="cardholderName"
                      value={paymentInfo.cardholderName}
                      onChange={(e) => handlePaymentInfoChange("cardholderName", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      value={paymentInfo.cardNumber}
                      onChange={(e) => handlePaymentInfoChange("cardNumber", formatCardNumber(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date *</Label>
                      <Input
                        id="expiryDate"
                        value={paymentInfo.expiryDate}
                        onChange={(e) => handlePaymentInfoChange("expiryDate", e.target.value)}
                        placeholder="MM/YY"
                        maxLength={5}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        value={paymentInfo.cvv}
                        onChange={(e) => handlePaymentInfoChange("cvv", e.target.value)}
                        placeholder="123"
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock className="h-4 w-4" />
                    Your payment information is secure and encrypted
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === "review" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Order Review
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Order Items */}
                  <div>
                    <h3 className="font-semibold mb-3">Order Items</h3>
                    <div className="space-y-2">
                      {state.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center py-2">
                          <div>
                            <span className="font-medium">{item.name}</span>
                            <span className="text-sm text-muted-foreground ml-2">× {item.quantity}</span>
                            {item.options && Object.entries(item.options).length > 0 && (
                              <div className="text-xs text-muted-foreground">
                                {Object.entries(item.options).map(([key, value]) => (
                                  <span key={key}>
                                    {key}: {String(value)}{" "}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Shipping Address */}
                  <div>
                    <h3 className="font-semibold mb-3">Shipping Address</h3>
                    <div className="text-sm space-y-1">
                      <div>
                        {shippingInfo.firstName} {shippingInfo.lastName}
                      </div>
                      <div>{shippingInfo.address1}</div>
                      {shippingInfo.address2 && <div>{shippingInfo.address2}</div>}
                      <div>
                        {shippingInfo.city}, {shippingInfo.region} {shippingInfo.zip}
                      </div>
                      <div>{shippingInfo.country}</div>
                      <div>{shippingInfo.email}</div>
                      {shippingInfo.phone && <div>{shippingInfo.phone}</div>}
                    </div>
                  </div>

                  <Separator />

                  {/* Payment Method */}
                  <div>
                    <h3 className="font-semibold mb-3">Payment Method</h3>
                    <div className="text-sm">
                      <div>**** **** **** {paymentInfo.cardNumber.slice(-4)}</div>
                      <div>{paymentInfo.cardholderName}</div>
                    </div>
                  </div>

                  {isGift && giftMessage && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="font-semibold mb-3">Gift Message</h3>
                        <div className="text-sm bg-muted p-3 rounded-lg">{giftMessage}</div>
                      </div>
                    </>
                  )}

                  {specialInstructions && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="font-semibold mb-3">Special Instructions</h3>
                        <div className="text-sm bg-muted p-3 rounded-lg">{specialInstructions}</div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              {currentStep !== "cart" && (
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
              )}
              <div className="ml-auto">
                {currentStep === "review" ? (
                  <Button onClick={handleCheckout} disabled={isCheckingOut} size="lg" className="min-w-[200px]">
                    {isCheckingOut ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Place Order
                      </>
                    )}
                  </Button>
                ) : (
                  <Button onClick={nextStep} size="lg">
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal ({state.itemCount} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({promoDiscount}%)</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  {shipping === 0 && <div className="text-xs text-green-600">🎉 Free shipping on orders over $50!</div>}
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {orderError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{orderError}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Lock className="h-3 w-3" />
                    Secure SSL encrypted checkout
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-3 w-3" />
                    Free shipping on orders over $50
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3" />
                    30-day money-back guarantee
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-3 w-3" />
                    Order tracking included
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
