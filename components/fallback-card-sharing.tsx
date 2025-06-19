"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Send, Mail, CheckCircle, Info } from "lucide-react"

interface FallbackCardSharingProps {
  cardData: any
}

export function FallbackCardSharing({ cardData }: FallbackCardSharingProps) {
  const [recipientEmail, setRecipientEmail] = useState("")
  const [recipientName, setRecipientName] = useState("")
  const [senderName, setSenderName] = useState("")
  const [senderEmail, setSenderEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate sending
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("📧 DEMO: Card would be sent with data:", {
        cardData,
        recipientEmail,
        recipientName,
        senderName,
        senderEmail,
        message,
      })

      setSent(true)
    } catch (error) {
      console.error("Error sending card:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (sent) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              Demo card sent successfully! In a real application, an email would be sent to {recipientEmail}.
            </AlertDescription>
          </Alert>
          <Button onClick={() => setSent(false)} variant="outline" className="mt-4 w-full">
            Send Another Card
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Send Your Card
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4 bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            This is a demo application. No actual emails will be sent.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="recipient-name">Recipient's Name</Label>
            <Input
              id="recipient-name"
              placeholder="Enter recipient's name"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="recipient-email">Recipient's Email</Label>
            <Input
              id="recipient-email"
              type="email"
              placeholder="Enter recipient's email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="sender-name">Your Name</Label>
            <Input
              id="sender-name"
              placeholder="Enter your name"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="sender-email">Your Email</Label>
            <Input
              id="sender-email"
              type="email"
              placeholder="Enter your email"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="message">Additional Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Add a personal message to include in the email"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full flex items-center gap-2">
            <Mail className="h-4 w-4" />
            {isLoading ? "Sending Demo Card..." : "Send Demo Card"}
          </Button>
        </form>

        {/* Card preview */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Card Preview:</h4>
          <div className="text-sm space-y-1">
            <p>
              <strong>Template:</strong> {cardData?.templateName || "Unknown"}
            </p>
            <p>
              <strong>Message:</strong> {cardData?.message?.substring(0, 100) || "No message"}...
            </p>
            {cardData?.recipientName && (
              <p>
                <strong>To:</strong> {cardData.recipientName}
              </p>
            )}
            {cardData?.personalMessage && (
              <p>
                <strong>Personal Note:</strong> {cardData.personalMessage.substring(0, 50)}...
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
