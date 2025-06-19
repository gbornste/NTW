"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { Send, Mail, CheckCircle, Info } from "lucide-react"
import { useAuth } from "@/contexts/simple-auth-context" // Fixed import
import { EmailPreviewModal } from "@/components/email-preview-modal"
import { FormValidationDebug } from "@/components/form-validation-debug"

// Helper function to validate email
function isValidEmail(email: string): boolean {
  if (!email) return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Helper function to validate form
function validateForm(formData: CardSharingFormData): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {}

  if (!formData.recipientEmail) {
    errors.recipientEmail = "Recipient email is required"
  } else if (!isValidEmail(formData.recipientEmail)) {
    errors.recipientEmail = "Please enter a valid email address"
  }

  if (!formData.senderName) {
    errors.senderName = "Your name is required"
  }

  if (!formData.senderEmail) {
    errors.senderEmail = "Your email is required"
  } else if (!isValidEmail(formData.senderEmail)) {
    errors.senderEmail = "Please enter a valid email address"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

// Form data type
interface CardSharingFormData {
  recipientName: string
  recipientEmail: string
  senderName: string
  senderEmail: string
  subject: string
  message: string
}

// Card data type
interface CardData {
  template: any
  message: string
  templateName: string
  templateImage: string
  recipientName: string
  personalMessage: string
  optionalNote: string
}

// Component props
interface CardSharingProps {
  cardData: CardData
}

// Form validation helper component
function ValidationMessage({ message }: { message: string }) {
  if (!message) return null
  return <p className="text-sm text-red-500 mt-1">{message}</p>
}

export function CardSharing({ cardData }: CardSharingProps) {
  const { user } = useAuth() // Fixed hook usage
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [formData, setFormData] = useState<CardSharingFormData>({
    recipientName: cardData.recipientName || "",
    recipientEmail: "",
    senderName: user?.name || user?.firstName || "",
    senderEmail: user?.email || "",
    subject: `${cardData.templateName} Card from ${user?.name || user?.firstName || "a friend"}`,
    message: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formTouched, setFormTouched] = useState(false)
  const [demoSent, setDemoSent] = useState(false)

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        senderName: user.name || user.firstName || prev.senderName,
        senderEmail: user.email || prev.senderEmail,
        subject: `${cardData.templateName} Card from ${user.name || user.firstName || "a friend"}`,
      }))
    }
  }, [user, cardData.templateName])

  // Handle form input changes
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setFormTouched(true)
  }, [])

  // Validate form and update errors
  const validateAndUpdateErrors = useCallback(() => {
    const validation = validateForm(formData)
    setErrors(validation.errors)
    return validation.isValid
  }, [formData])

  // Effect to validate form when touched
  useEffect(() => {
    if (formTouched) {
      validateAndUpdateErrors()
    }
  }, [formData, formTouched, validateAndUpdateErrors])

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setFormTouched(true)

      const isValid = validateAndUpdateErrors()
      if (!isValid) return

      setIsLoading(true)

      try {
        // In a real app, this would send the email
        console.log("📧 Sending card to:", formData.recipientEmail)
        console.log("📋 Card data:", {
          ...formData,
          cardTemplate: cardData.templateName,
          cardMessage: cardData.message,
          personalMessage: cardData.personalMessage,
          optionalNote: cardData.optionalNote,
        })

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        toast({
          title: "Card sent successfully!",
          description: `Your card has been sent to ${formData.recipientEmail}`,
        })

        // Reset form
        setFormData((prev) => ({
          ...prev,
          recipientEmail: "",
          recipientName: "",
          message: "",
        }))
        setFormTouched(false)
      } catch (error) {
        console.error("Error sending card:", error)
        toast({
          title: "Failed to send card",
          description: "There was an error sending your card. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [formData, cardData, validateAndUpdateErrors, toast],
  )

  // Handle demo send
  const handleDemoSend = useCallback(async () => {
    setFormTouched(true)

    const isValid = validateAndUpdateErrors()
    if (!isValid) return

    setIsLoading(true)

    try {
      // Log the demo email
      console.log("📧 DEMO: Sending card to:", formData.recipientEmail)
      console.log("📋 DEMO: Card data:", {
        ...formData,
        cardTemplate: cardData.templateName,
        cardMessage: cardData.message,
        personalMessage: cardData.personalMessage,
        optionalNote: cardData.optionalNote,
      })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Demo card sent!",
        description: "In a real app, this would send an email to the recipient.",
      })

      setDemoSent(true)
    } catch (error) {
      console.error("Error in demo send:", error)
      toast({
        title: "Demo failed",
        description: "There was an error in the demo. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [formData, cardData, validateAndUpdateErrors, toast])

  // Check if form is valid
  const isFormValid = Object.keys(errors).length === 0 && formTouched

  // Check if demo button should be enabled
  const isDemoEnabled = formData.recipientEmail && formData.senderName && formData.senderEmail && !isLoading

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="recipientName">Recipient's Name (Optional)</Label>
              <Input
                id="recipientName"
                name="recipientName"
                placeholder="Enter recipient's name"
                value={formData.recipientName}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="recipientEmail">
                Recipient's Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="recipientEmail"
                name="recipientEmail"
                placeholder="Enter recipient's email"
                value={formData.recipientEmail}
                onChange={handleInputChange}
                required
              />
              <ValidationMessage message={errors.recipientEmail} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="senderName">
                Your Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="senderName"
                name="senderName"
                placeholder="Enter your name"
                value={formData.senderName}
                onChange={handleInputChange}
                required
              />
              <ValidationMessage message={errors.senderName} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="senderEmail">
                Your Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="senderEmail"
                name="senderEmail"
                placeholder="Enter your email"
                value={formData.senderEmail}
                onChange={handleInputChange}
                required
              />
              <ValidationMessage message={errors.senderEmail} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                name="subject"
                placeholder="Enter email subject"
                value={formData.subject}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="message">Additional Message (Optional)</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Add a personal message to include in the email"
                value={formData.message}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                This is a demo application. No actual emails will be sent.
              </AlertDescription>
            </Alert>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1 flex items-center gap-2"
                onClick={() => setShowPreview(true)}
              >
                <Mail className="h-4 w-4" />
                Preview Email
              </Button>

              <Button
                type="button"
                className="flex-1 flex items-center gap-2"
                onClick={handleDemoSend}
                disabled={!isDemoEnabled}
              >
                <Send className="h-4 w-4" />
                Send Greeting Card (Demo) to Recipient
              </Button>
            </div>

            {demoSent && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  Demo card sent! In a real application, an email would be sent to {formData.recipientEmail}.
                </AlertDescription>
              </Alert>
            )}

            {process.env.NODE_ENV !== "production" && (
              <FormValidationDebug
                formData={formData}
                errors={errors}
                isValid={isFormValid}
                isDemoEnabled={isDemoEnabled}
              />
            )}
          </div>
        </form>

        {process.env.NODE_ENV !== "production" && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
            <h4 className="text-blue-800 font-medium text-sm mb-2">Debug: Card Message Data</h4>
            <p className="text-blue-700 text-xs">
              <strong>Card Message:</strong> "{cardData.message || "No message"}"
            </p>
            <p className="text-blue-700 text-xs">
              <strong>Template:</strong> {cardData.templateName || "No template"}
            </p>
            <p className="text-blue-700 text-xs">
              <strong>Personal Message:</strong> "{cardData.personalMessage || "None"}"
            </p>
          </div>
        )}

        {/* Email Preview Modal */}
        <EmailPreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          emailData={{
            recipientName: formData.recipientName || "Friend",
            recipientEmail: formData.recipientEmail || "recipient@example.com",
            senderName: formData.senderName || "Sender",
            senderEmail: formData.senderEmail || "sender@example.com",
            subject: formData.subject || `${cardData.templateName} Card`,
            message: formData.message || "",
            cardData: {
              ...cardData,
              message: cardData.message, // Ensure the main card message is passed
              templateName: cardData.templateName,
              templateImage: cardData.templateImage,
              recipientName: cardData.recipientName,
              personalMessage: cardData.personalMessage,
              optionalNote: cardData.optionalNote,
            },
          }}
        />
      </CardContent>
    </Card>
  )
}
