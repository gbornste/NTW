"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Send, User, CheckCircle, AlertCircle, Loader2, MessageSquare, LogIn, Mail } from "lucide-react"
import { cardStorageService } from "@/lib/card-storage-service"
import { cardSendingService, type CardSendingData } from "@/lib/card-sending-service"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

// Define CardSendingInterfaceProps if not already defined
interface CardSendingInterfaceProps {
  cardData: any
  onSendComplete?: () => void
  onCancel?: () => void
}

export function CardSendingInterface({ cardData, onSendComplete, onCancel }: CardSendingInterfaceProps) {
  const { user, isAuthenticated } = useAuth()
  const isLoading = false // Context is ready
  const router = useRouter()

  const [recipientEmail, setRecipientEmail] = useState("")
  const [recipientName, setRecipientName] = useState(cardData.recipientName || "")
  const [senderName, setSenderName] = useState("")
  const [emailSubject, setEmailSubject] = useState("")
  const [personalMessage, setPersonalMessage] = useState(cardData.personalMessage || "")
  const [additionalMessage, setAdditionalMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [sendResult, setSendResult] = useState<any>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Update form fields when user data is available
  useEffect(() => {
    if (user) {
      setSenderName(user.name || user.email.split("@")[0])
      setEmailSubject(`${user.name || "Someone"} sent you a ${cardData?.templateName || "greeting"} card!`)
    }
  }, [user, cardData?.templateName])

  // Save card data when not authenticated
  useEffect(() => {
    if (!isAuthenticated && !isLoading && cardData) {
      cardStorageService.saveCard({
        ...cardData,
        createdAt: new Date().toISOString(),
      })
    }
  }, [isAuthenticated, isLoading, cardData])

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {}

    if (!recipientEmail.trim()) {
      newErrors.recipientEmail = "Recipient email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)) {
      newErrors.recipientEmail = "Please enter a valid email address"
    }

    if (!senderName.trim()) {
      newErrors.senderName = "Your name is required"
    }

    if (!emailSubject.trim()) {
      newErrors.emailSubject = "Email subject is required"
    }

    if (!cardData?.message?.trim()) {
      newErrors.message = "Card message is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [recipientEmail, senderName, emailSubject, cardData?.message])

  const handleSend = useCallback(async () => {
    console.log("🎯 Send button clicked")
    console.log("Authentication status:", { isAuthenticated, user })

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      console.log("❌ User not authenticated, redirecting to login")

      // Save current card data
      cardStorageService.saveCard({
        ...cardData,
        createdAt: new Date().toISOString(),
      })

      // Redirect to login with return URL
      const currentPath = window.location.pathname
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`)
      return
    }

    if (!validateForm() || isSending) {
      console.log("❌ Form validation failed or already sending")
      return
    }

    setIsSending(true)
    setSendResult(null)

    try {
      console.log("✅ User authenticated, proceeding with card sending")
      console.log("Card data:", cardData)
      console.log("Form data:", { recipientEmail, senderName, emailSubject })

      // Prepare card sending data
      const sendingData: CardSendingData = cardSendingService.prepareCardForSending(
        cardData,
        { email: recipientEmail, name: recipientName },
        { name: senderName, email: user?.email ?? "" },
        {
          subject: emailSubject,
          personalMessage: personalMessage,
          additionalMessage: additionalMessage,
        },
      )

      console.log("📤 Sending card with data:", sendingData)

      // Send the card
      const result = await cardSendingService.sendCard(sendingData, user?.isDemo ?? false)

      console.log("📬 Card sending result:", result)

      if (result.success) {
        // Clear any saved card data
        cardStorageService.clearCard()

        setSendResult(result)
        if (onSendComplete) {
          onSendComplete()
        }
      } else {
        throw new Error(result.error || "Failed to send card")
      }
    } catch (error) {
      console.error("❌ Error sending card:", error)

      setSendResult({
        success: false,
        error: error instanceof Error ? error.message : "Failed to send card",
      })
    } finally {
      setIsSending(false)
    }
  }, [
    cardData,
    recipientEmail,
    recipientName,
    senderName,
    user,
    emailSubject,
    personalMessage,
    additionalMessage,
    validateForm,
    isSending,
    onSendComplete,
    isAuthenticated,
    router,
  ])
      // No need to throw if user is not defined; UI already blocks unauthenticated users

  // If still checking authentication
  if (isLoading) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400 mb-4" />
          <p className="text-gray-500">Checking authentication status...</p>
        </CardContent>
      </Card>
    )
  }

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Membership Required</CardTitle>
          <CardDescription>You must sign up as a member to send cards.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4 bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              Your card has been saved. Please log in or sign up to send it.
            </AlertDescription>
          </Alert>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-medium mb-2">Card Preview</h4>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Type:</strong> {cardData.cardType}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Message:</strong> {cardData.message.substring(0, 50)}
              {cardData.message.length > 50 ? "..." : ""}
            </p>
            {cardData.recipientName && (
              <p className="text-sm text-gray-600">
                <strong>To:</strong> {cardData.recipientName}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex gap-4">
          <Button asChild className="flex-1">
            <Link href={`/signup`}>
              <LogIn className="mr-2 h-4 w-4" />
              Sign Up to Send
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href={`/login?redirect=${encodeURIComponent(window.location.pathname)}`}>
              Log In
            </Link>
          </Button>
          {onCancel && (
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          )}
        </CardFooter>
      </Card>
    )
  }

  // If card sent successfully
  if (sendResult?.success) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-4 rounded-full">
              <Mail className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-green-700">Card Sent Successfully!</CardTitle>
          <CardDescription className="text-lg">Your {cardData.templateName} has been delivered</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Your card has been sent to <strong>{recipientEmail}</strong>
              {sendResult.isDemo && " (Demo Mode - No actual email sent)"}
            </AlertDescription>
          </Alert>

          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <h4 className="font-semibold text-gray-900">Delivery Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Card ID:</span>
                <p className="font-mono text-xs">{sendResult.cardId}</p>
              </div>
              <div>
                <span className="text-gray-600">Sent At:</span>
                <p>{new Date(sendResult.sentAt).toLocaleString()}</p>
              </div>
              <div>
                <span className="text-gray-600">Recipient:</span>
                <p>{recipientEmail}</p>
              </div>
              <div>
                <span className="text-gray-600">Subject:</span>
                <p className="text-xs">{emailSubject}</p>
              </div>
            </div>
          </div>

          {sendResult.isDemo && (
            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Demo Mode:</strong> This was a test send. In production, the recipient would receive an actual
                email with your card.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4 justify-center pt-4">
            <Button onClick={() => (window.location.href = "/create-card")} variant="outline">
              Create Another Card
            </Button>
            <Button onClick={() => setSendResult(null)}>Send to Another Recipient</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Main card sending form
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Authentication Status */}
      <Alert variant="default" className="bg-green-50 border-green-200">
        <User className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Logged in as <strong>{user?.name || user?.email}</strong>
          {user?.isDemo && " (Demo Account)"}
        </AlertDescription>
      </Alert>

      {/* Card Summary */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Card Summary
          </h3>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded border overflow-hidden">
              <img
                src={cardData.templateImage || "/placeholder.svg?height=64&width=64&text=Card"}
                alt={cardData.templateName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg?height=64&width=64&text=Card"
                }}
              />
            </div>
            <div className="flex-1">
              <p className="font-medium">{cardData.templateName}</p>
              <p className="text-sm text-gray-600 line-clamp-2">
                {cardData.recipientName && `Dear ${cardData.recipientName}, `}
                {cardData.message?.substring(0, 100)}
                {cardData.message?.length > 100 && "..."}
              </p>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline">{cardData.cardType}</Badge>
                <Badge variant="outline">{cardData.fontStyle}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sending Form */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold flex items-center gap-2">
            <Send className="h-5 w-5" />
            Send Card
          </h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="recipient-email">Recipient Email *</Label>
            <Input
              id="recipient-email"
              type="email"
              placeholder="Enter recipient's email address"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className={errors.recipientEmail ? "border-red-500" : ""}
            />
            {errors.recipientEmail && <p className="text-sm text-red-500">{errors.recipientEmail}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="recipient-name">Recipient Name (Optional)</Label>
            <Input
              id="recipient-name"
              placeholder="Enter recipient's name"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="sender-name">Your Name *</Label>
            <Input
              id="sender-name"
              placeholder="Enter your name"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className={errors.senderName ? "border-red-500" : ""}
            />
            {errors.senderName && <p className="text-sm text-red-500">{errors.senderName}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email-subject">Email Subject *</Label>
            <Input
              id="email-subject"
              placeholder="Enter email subject"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              className={errors.emailSubject ? "border-red-500" : ""}
            />
            {errors.emailSubject && <p className="text-sm text-red-500">{errors.emailSubject}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="additional-message">Additional Email Message (Optional)</Label>
            <Textarea
              id="additional-message"
              placeholder="Add a personal message to include in the email"
              value={additionalMessage}
              onChange={(e) => setAdditionalMessage(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-gray-500">This message will appear in the email along with your card</p>
          </div>

          {errors.message && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.message}</AlertDescription>
            </Alert>
          )}

          {sendResult?.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{sendResult.error}</AlertDescription>
            </Alert>
          )}

          {user?.isDemo && (
            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Demo Mode:</strong> This will simulate sending the card. No actual email will be sent.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4">
            <Button
              onClick={handleSend}
              disabled={isSending}
              className="flex-1 items-center gap-2"
              id="send-card-submit-button"
              data-testid="send-card-submit-button"
            >
              {isSending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending Card...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Card Now
                </>
              )}
            </Button>

            {onCancel && (
              <Button variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
