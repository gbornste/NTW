"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

interface EmailPreviewModalProps {
  recipientName?: string
  recipientEmail?: string
  senderName?: string
  senderEmail?: string
  message?: string
  personalMessage?: string
  optionalText?: string
  cardType?: string
  templateName?: string
  templateImage?: string
  cardId?: string
  sentAt?: string
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  emailData?: any // For backward compatibility
  cardData?: any // Direct card data access
}

export function EmailPreviewModal({
  recipientName,
  recipientEmail,
  senderName,
  senderEmail,
  message,
  personalMessage,
  optionalText,
  cardType = "greeting",
  templateName = "Custom Card",
  templateImage,
  cardId = `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  sentAt = new Date().toLocaleString(),
  isOpen,
  onOpenChange,
  emailData,
  cardData,
}: EmailPreviewModalProps) {
  const [open, setOpen] = useState(isOpen || false)

  // Enhanced data handling with multiple fallback sources
  const data = emailData || {
    recipientName,
    recipientEmail,
    senderName,
    senderEmail,
    message,
    personalMessage,
    optionalText,
    cardType,
    templateName,
    templateImage,
    cardId,
    sentAt,
  }

  // Enhanced message extraction with better prioritization
  const getEffectiveMessage = () => {
    // Priority order: cardData.message (main card message), then other sources
    const sources = [
      cardData?.message, // Highest priority - main card message
      emailData?.cardData?.message, // Second priority - card message from emailData
      data.message, // Third priority - direct message prop
      emailData?.message, // Fourth priority - email message
      message, // Fifth priority - component prop message
    ]

    console.log("🔍 Email Preview - Message Sources:", {
      "cardData?.message": cardData?.message,
      "emailData?.cardData?.message": emailData?.cardData?.message,
      "data.message": data.message,
      "emailData?.message": emailData?.message,
      "message prop": message,
    })

    for (const source of sources) {
      if (source && typeof source === "string" && source.trim().length > 0) {
        console.log("✅ Email Preview - Using message:", source.trim())
        return source.trim()
      }
    }

    // Default message based on card type
    const defaultMessages = {
      birthday:
        "Wishing you a very happy birthday! May this special day bring you joy, laughter, and wonderful memories.",
      holiday: "Wishing you and your loved ones a wonderful holiday season filled with joy, peace, and happiness.",
      congratulations:
        "Congratulations on your amazing achievement! Your hard work and dedication have truly paid off.",
      "thank-you": "Thank you so much for your kindness and support. It means more to me than words can express.",
      graduation: "Congratulations on your graduation! This is just the beginning of your amazing journey ahead.",
      wedding: "Wishing you both a lifetime of love, happiness, and beautiful memories together.",
      valentine: "Happy Valentine's Day! You bring so much love and joy into my life.",
      christmas: "Merry Christmas! May your holiday season be filled with love, laughter, and magical moments.",
      thanksgiving: "Happy Thanksgiving! Grateful for all the wonderful people and blessings in our lives.",
      "new-year": "Happy New Year! May this year bring you new opportunities, adventures, and happiness.",
      political: "Making a statement with style! Here's to standing up for what we believe in.",
      custom: "Sending you warm wishes and positive thoughts on this special occasion.",
      general: "Thinking of you and sending warm wishes your way!",
      default: "This is a special greeting card created just for you with love and best wishes.",
    }

    const fallbackMessage =
      defaultMessages[effectiveCardType as keyof typeof defaultMessages] || defaultMessages.default
    console.log("⚠️ Email Preview - Using fallback message for card type:", effectiveCardType, fallbackMessage)
    return fallbackMessage
  }

  // Ensure we have fallbacks for all required fields
  const effectiveRecipientName = data.recipientName || cardData?.recipientName || "Friend"
  const effectiveRecipientEmail = data.recipientEmail || cardData?.recipientEmail || "recipient@example.com"
  const effectiveSenderName = data.senderName || cardData?.senderName || "Demo Card"
  const effectiveSenderEmail = data.senderEmail || cardData?.senderEmail || "sender@example.com"
  const effectiveMessage = getEffectiveMessage()
  const effectiveCardType = data.cardType || cardData?.cardType || cardType
  const effectiveTemplateName = data.templateName || cardData?.templateName || templateName

  // Enhanced template image handling
  const getEffectiveTemplateImage = () => {
    const sources = [data.templateImage, cardData?.templateImage, emailData?.cardData?.templateImage, templateImage]

    for (const source of sources) {
      if (source && typeof source === "string" && source.trim().length > 0) {
        return source.trim()
      }
    }

    return "/placeholder.svg?height=300&width=500&text=Political+Greeting+Card"
  }

  const effectiveTemplateImage = getEffectiveTemplateImage()
  const effectivePersonalMessage = data.personalMessage || cardData?.personalMessage
  const effectiveOptionalText = data.optionalText || cardData?.optionalNote || cardData?.optionalText

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (onOpenChange) onOpenChange(newOpen)
  }

  // Generate appropriate greeting based on time of day
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  // Generate dynamic subject line based on card type
  const getSubjectLine = () => {
    const cardTypeMap: { [key: string]: string } = {
      holiday: "holiday card",
      birthday: "birthday card",
      anniversary: "anniversary card",
      congratulations: "congratulations card",
      "thank-you": "thank you card",
      sympathy: "sympathy card",
      graduation: "graduation card",
      wedding: "wedding card",
      valentine: "Valentine's Day card",
      christmas: "Christmas card",
      thanksgiving: "Thanksgiving card",
      "new-year": "New Year's card",
      political: "political card",
      custom: "greeting card",
      general: "greeting card",
      default: "greeting card",
    }

    const cardTypeText = cardTypeMap[effectiveCardType.toLowerCase()] || "greeting card"
    return `${effectiveSenderName} sent you a ${cardTypeText} courtesy of NoTrumpNWay`
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Preview Email
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Email Preview</DialogTitle>
        </DialogHeader>

        <div className="border rounded-md p-1 bg-white">
          {/* Email Header */}
          <div className="bg-gray-100 p-4 rounded-t-md">
            <div className="grid grid-cols-[auto_1fr] gap-2 text-sm">
              <div className="font-semibold">From:</div>
              <div>
                cards@notrumpnway.com <span className="text-gray-500">on behalf of {effectiveSenderName}</span>
              </div>

              <div className="font-semibold">To:</div>
              <div>{effectiveRecipientEmail}</div>

              <div className="font-semibold">Subject:</div>
              <div className="font-medium">{getSubjectLine()}</div>
            </div>
          </div>

          {/* Email Body */}
          <div className="p-6 text-sm" style={{ fontFamily: "Arial, sans-serif" }}>
            {/* Email Header Logo */}
            <div
              style={{
                backgroundColor: "#0070f3",
                padding: "24px 20px",
                textAlign: "center",
                marginBottom: "24px",
                borderRadius: "8px 8px 0 0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px" }}>
                <img
                  src="/images/logo.png"
                  alt="NoTrumpNWay Logo"
                  style={{
                    height: "48px",
                    width: "auto",
                    objectFit: "contain",
                    filter: "brightness(0) invert(1)",
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                    if (e.currentTarget.nextElementSibling) {
                      ;(e.currentTarget.nextElementSibling as HTMLElement).style.display = "block"
                    }
                  }}
                />
                <div
                  style={{
                    display: "none",
                    color: "white",
                    fontSize: "32px",
                    fontWeight: "bold",
                    letterSpacing: "-0.025em",
                  }}
                >
                  NoTrumpNWay
                </div>
                <h1
                  style={{
                    color: "white",
                    fontSize: "28px",
                    margin: "0",
                    fontWeight: "700",
                    letterSpacing: "-0.025em",
                  }}
                >
                  Political Greeting Cards
                </h1>
              </div>
            </div>

            {/* Personalized Greeting */}
            <div style={{ marginBottom: "24px" }}>
              <h2
                style={{
                  fontSize: "20px",
                  color: "#333",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                {getTimeBasedGreeting()}, {effectiveRecipientName}! 👋
              </h2>
              <p style={{ marginBottom: "16px", fontSize: "16px", lineHeight: "1.5" }}>
                You have a special surprise waiting for you! <strong>{effectiveSenderName}</strong> has created a
                personalized{" "}
                {effectiveCardType === "custom" || effectiveCardType === "general"
                  ? "greeting card"
                  : `${effectiveCardType} card`}{" "}
                just for you.
              </p>
              <p style={{ marginBottom: "0", color: "#666", fontSize: "14px" }}>
                From: {effectiveSenderName} ({effectiveSenderEmail})
              </p>
            </div>

            {/* Greeting Card Section */}
            <div
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "24px",
                marginBottom: "24px",
                backgroundColor: "#ffffff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                  borderBottom: "2px solid #0070f3",
                  paddingBottom: "16px",
                  gap: "12px",
                }}
              >
                <img
                  src="/images/logo.png"
                  alt="NoTrumpNWay Logo"
                  style={{
                    height: "32px",
                    width: "auto",
                    objectFit: "contain",
                  }}
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=32&width=32&text=NTW"
                  }}
                />
                <h2
                  style={{
                    fontSize: "24px",
                    color: "#0070f3",
                    margin: "0",
                    fontWeight: "600",
                    letterSpacing: "-0.025em",
                  }}
                >
                  Greetings from NoTrumpNWay
                </h2>
              </div>

              {/* Card Content */}
              <div
                style={{
                  backgroundColor: "#f8f9fa",
                  padding: "20px",
                  borderRadius: "8px",
                  border: "2px solid #e9ecef",
                  marginBottom: "16px",
                }}
              >
                {/* Recipient's name in the card */}
                <p style={{ marginBottom: "16px", fontWeight: "bold", fontSize: "16px" }}>
                  Dear {effectiveRecipientName},
                </p>

                {/* MAIN CARD MESSAGE - ENHANCED WITH BETTER STYLING */}
                <div
                  style={{
                    marginBottom: "24px",
                    padding: "20px",
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    border: "1px solid #dee2e6",
                    borderLeft: "4px solid #0070f3",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  <p
                    style={{
                      fontSize: "16px",
                      lineHeight: "1.7",
                      color: "#333",
                      margin: "0",
                      fontWeight: "500",
                      textAlign: "center",
                      fontStyle: "italic",
                    }}
                  >
                    "{effectiveMessage}"
                  </p>
                </div>

                {/* Card Image - POSITIONED AFTER MESSAGE */}
                <div style={{ textAlign: "center", margin: "24px 0" }}>
                  <div style={{ position: "relative", width: "100%", maxWidth: "500px", margin: "0 auto" }}>
                    <img
                      src={effectiveTemplateImage || "/placeholder.svg"}
                      alt={`${effectiveTemplateName} Greeting Card`}
                      style={{
                        width: "100%",
                        height: "auto",
                        maxHeight: "300px",
                        objectFit: "contain",
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        backgroundColor: "#ffffff",
                      }}
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=300&width=500&text=Greeting+Card+Image"
                        console.error("Failed to load card image:", effectiveTemplateImage)
                      }}
                    />
                  </div>
                  <p style={{ marginTop: "12px", fontSize: "14px", color: "#666", fontStyle: "italic" }}>
                    Template: {effectiveTemplateName}
                  </p>
                </div>

                {/* Personal Message at bottom of card */}
                {effectivePersonalMessage && (
                  <div
                    style={{
                      marginTop: "24px",
                      paddingTop: "16px",
                      borderTop: "1px solid #dee2e6",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "14px",
                        fontStyle: "italic",
                        color: "#495057",
                        marginBottom: "8px",
                      }}
                    >
                      {effectivePersonalMessage}
                    </p>
                  </div>
                )}

                {/* Optional Note underneath personal message */}
                {effectiveOptionalText && (
                  <div
                    style={{
                      marginTop: "12px",
                      paddingTop: "12px",
                      borderTop: "1px solid #e9ecef",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#6c757d",
                        marginBottom: "0",
                      }}
                    >
                      {effectiveOptionalText}
                    </p>
                  </div>
                )}

                <p style={{ marginTop: "24px", fontStyle: "italic", textAlign: "right", fontSize: "15px" }}>
                  With best wishes,
                  <br />
                  <strong>{effectiveSenderName}</strong>
                </p>
              </div>
            </div>

            {/* Personal Message Section - Positioned AFTER the card */}
            {effectivePersonalMessage && (
              <div
                style={{
                  marginBottom: "24px",
                  padding: "20px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "8px",
                  border: "1px solid #e9ecef",
                  borderLeft: "4px solid #0070f3",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "12px",
                    gap: "8px",
                  }}
                >
                  <span style={{ fontSize: "18px" }}>💌</span>
                  <h3
                    style={{
                      margin: "0",
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#0070f3",
                    }}
                  >
                    Personal Message from {effectiveSenderName}
                  </h3>
                </div>
                <div
                  style={{
                    backgroundColor: "white",
                    padding: "16px",
                    borderRadius: "6px",
                    border: "1px solid #e9ecef",
                    fontStyle: "italic",
                    fontSize: "15px",
                    lineHeight: "1.5",
                    color: "#333",
                  }}
                >
                  "{effectivePersonalMessage}"
                </div>
                <p
                  style={{
                    margin: "12px 0 0 0",
                    fontSize: "13px",
                    color: "#666",
                    textAlign: "right",
                  }}
                >
                  — {effectiveSenderName}
                </p>
              </div>
            )}

            {/* Optional Text Section */}
            {effectiveOptionalText && (
              <div
                style={{
                  marginBottom: "24px",
                  padding: "20px",
                  backgroundColor: "#f0f8ff",
                  borderRadius: "8px",
                  border: "1px solid #b3d9ff",
                  borderLeft: "4px solid #0070f3",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "12px",
                    gap: "8px",
                  }}
                >
                  <span style={{ fontSize: "18px" }}>📝</span>
                  <h3
                    style={{
                      margin: "0",
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#0070f3",
                    }}
                  >
                    Additional Note
                  </h3>
                </div>
                <div
                  style={{
                    backgroundColor: "white",
                    padding: "16px",
                    borderRadius: "6px",
                    border: "1px solid #b3d9ff",
                    fontSize: "15px",
                    lineHeight: "1.5",
                    color: "#333",
                  }}
                >
                  {effectiveOptionalText}
                </div>
                <p
                  style={{
                    margin: "12px 0 0 0",
                    fontSize: "13px",
                    color: "#666",
                    textAlign: "right",
                    fontStyle: "italic",
                  }}
                >
                  Additional content provided by {effectiveSenderName}
                </p>
              </div>
            )}

            {/* Call to Action */}
            <div
              style={{
                backgroundColor: "#f0f8ff",
                padding: "20px",
                borderRadius: "8px",
                textAlign: "center",
                marginBottom: "24px",
                border: "1px solid #b3d9ff",
              }}
            >
              <p style={{ marginBottom: "12px", fontSize: "16px", fontWeight: "600", color: "#0070f3" }}>
                Want to create your own political greeting cards?
              </p>
              <p style={{ marginBottom: "16px", fontSize: "14px", color: "#666" }}>
                Join thousands of users creating personalized political cards with NoTrumpNWay
              </p>
              <a
                href="https://notrumpnway.com/create-card"
                style={{
                  display: "inline-block",
                  backgroundColor: "#0070f3",
                  color: "white",
                  padding: "12px 24px",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontWeight: "600",
                  fontSize: "14px",
                }}
              >
                Create Your Card Now
              </a>
            </div>

            {/* Footer */}
            <div
              style={{
                marginTop: "32px",
                borderTop: "1px solid #e5e7eb",
                paddingTop: "16px",
                fontSize: "12px",
                color: "#666",
              }}
            >
              <p>
                This email was sent from cards@notrumpnway.com on behalf of {effectiveSenderName} (
                {effectiveSenderEmail})
                <br />
                Card ID: {cardId} | Sent: {sentAt}
                <br />
                Recipient: {effectiveRecipientName} ({effectiveRecipientEmail})
                <br />
                Card Type: {effectiveCardType.charAt(0).toUpperCase() + effectiveCardType.slice(1)}
              </p>

              <div style={{ marginTop: "16px", textAlign: "center" }}>
                <p style={{ margin: "0" }}>NoTrumpNWay - Where Politics Meets Creativity</p>
                <a
                  href="https://notrumpnway.com"
                  style={{ color: "#0070f3", textDecoration: "none", fontWeight: "bold" }}
                >
                  https://notrumpnway.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mt-4">
          <h3 className="text-amber-800 font-medium mb-2">Email Preview Information</h3>
          <div className="space-y-2">
            <p className="text-amber-700 text-sm">
              <strong>Message Content:</strong> "{effectiveMessage}"
            </p>
            <p className="text-amber-700 text-sm">
              <strong>Template:</strong> {effectiveTemplateName} | <strong>Card Type:</strong> {effectiveCardType}
            </p>
            <p className="text-amber-700 text-sm">
              <strong>Data Sources:</strong>
              {cardData?.message ? " ✅ Card Message" : " ❌ No Card Message"}
              {emailData?.cardData?.message ? " ✅ Email Card Data" : " ❌ No Email Card Data"}
              {data.message ? " ✅ Direct Message" : " ❌ No Direct Message"}
            </p>
            <p className="text-amber-700 text-sm">
              This preview shows exactly how the email will appear when sent, with the message positioned beneath
              "Greetings from NoTrumpNWay".
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
