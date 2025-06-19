export interface CardSendingData {
  // Card content
  templateName: string
  templateImage: string
  message: string
  cardType: string
  fontStyle: string

  // Recipient information
  recipientEmail: string
  recipientName?: string

  // Sender information
  senderName: string
  senderEmail: string

  // Email details
  emailSubject: string
  personalMessage?: string
  additionalMessage?: string

  // Metadata
  createdAt: string
  cardId?: string
}

export interface CardSendingResult {
  success: boolean
  cardId?: string
  sentAt?: string
  error?: string
  isDemo?: boolean
}

class CardSendingService {
  async sendCard(data: CardSendingData, isDemo = false): Promise<CardSendingResult> {
    try {
      console.log("🚀 Initiating card sending process...")
      console.log("Card data:", {
        template: data.templateName,
        recipient: data.recipientEmail,
        sender: data.senderEmail,
        isDemo,
      })

      // Validate required fields
      const validation = this.validateCardData(data)
      if (!validation.isValid) {
        throw new Error(validation.error)
      }

      // Generate unique card ID
      const cardId = `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Prepare sending payload
      const sendingPayload = {
        ...data,
        cardId,
        isDemo,
        timestamp: new Date().toISOString(),
      }

      // Call the API endpoint
      const response = await fetch("/api/send-card", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(sendingPayload),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to send card")
      }

      console.log("✅ Card sent successfully:", result)

      return {
        success: true,
        cardId: result.cardId || cardId,
        sentAt: result.sentAt || new Date().toISOString(),
        isDemo,
      }
    } catch (error) {
      console.error("❌ Card sending failed:", error)

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }

  private validateCardData(data: CardSendingData): { isValid: boolean; error?: string } {
    if (!data.recipientEmail) {
      return { isValid: false, error: "Recipient email is required" }
    }

    if (!data.recipientEmail.includes("@")) {
      return { isValid: false, error: "Invalid recipient email format" }
    }

    if (!data.senderName) {
      return { isValid: false, error: "Sender name is required" }
    }

    if (!data.senderEmail) {
      return { isValid: false, error: "Sender email is required" }
    }

    if (!data.message) {
      return { isValid: false, error: "Card message is required" }
    }

    if (!data.templateName) {
      return { isValid: false, error: "Card template is required" }
    }

    return { isValid: true }
  }

  // Method to prepare card data for sending
  prepareCardForSending(
    cardData: any,
    recipientInfo: { email: string; name?: string },
    senderInfo: { name: string; email: string },
    emailDetails: { subject: string; personalMessage?: string; additionalMessage?: string },
  ): CardSendingData {
    return {
      // Card content
      templateName: cardData.templateName || "Political Greeting Card",
      templateImage: cardData.templateImage || "/placeholder.svg",
      message: cardData.message || "",
      cardType: cardData.cardType || "greeting",
      fontStyle: cardData.fontStyle || "classic",

      // Recipient information
      recipientEmail: recipientInfo.email,
      recipientName: recipientInfo.name,

      // Sender information
      senderName: senderInfo.name,
      senderEmail: senderInfo.email,

      // Email details
      emailSubject: emailDetails.subject,
      personalMessage: emailDetails.personalMessage,
      additionalMessage: emailDetails.additionalMessage,

      // Metadata
      createdAt: cardData.createdAt || new Date().toISOString(),
    }
  }
}

export const cardSendingService = new CardSendingService()
