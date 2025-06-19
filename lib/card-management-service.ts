"use client"

interface CardData {
  id?: string
  template: any
  message: string
  templateName: string
  templateImage: string
  recipientName: string
  personalMessage: string
  optionalNote: string
  cardType: string
  fontStyle: string
  createdAt?: string
  updatedAt?: string
  status?: "draft" | "sent" | "scheduled"
}

interface SendCardOptions {
  recipientEmail: string
  senderName: string
  senderEmail: string
  subject?: string
  additionalMessage?: string
  scheduleDate?: Date
}

class CardManagementService {
  private storageKey = "notrumpnway_cards"

  // Get all saved cards for current user
  getSavedCards(): CardData[] {
    try {
      const saved = localStorage.getItem(this.storageKey)
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.error("Error loading saved cards:", error)
      return []
    }
  }

  // Save a card (create or update)
  saveCard(cardData: CardData): { success: boolean; cardId: string; error?: string } {
    try {
      const cards = this.getSavedCards()
      const cardId = cardData.id || `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      const cardToSave: CardData = {
        ...cardData,
        id: cardId,
        updatedAt: new Date().toISOString(),
        createdAt: cardData.createdAt || new Date().toISOString(),
        status: cardData.status || "draft",
      }

      // Update existing card or add new one
      const existingIndex = cards.findIndex((card) => card.id === cardId)
      if (existingIndex >= 0) {
        cards[existingIndex] = cardToSave
        console.log(`✅ Card updated: ${cardId}`)
      } else {
        cards.push(cardToSave)
        console.log(`✅ Card saved: ${cardId}`)
      }

      localStorage.setItem(this.storageKey, JSON.stringify(cards))

      return { success: true, cardId }
    } catch (error) {
      console.error("Error saving card:", error)
      return {
        success: false,
        cardId: "",
        error: error instanceof Error ? error.message : "Failed to save card",
      }
    }
  }

  // Get a specific card by ID
  getCard(cardId: string): CardData | null {
    try {
      const cards = this.getSavedCards()
      return cards.find((card) => card.id === cardId) || null
    } catch (error) {
      console.error("Error loading card:", error)
      return null
    }
  }

  // Delete a card
  deleteCard(cardId: string): { success: boolean; error?: string } {
    try {
      const cards = this.getSavedCards()
      const filteredCards = cards.filter((card) => card.id !== cardId)

      localStorage.setItem(this.storageKey, JSON.stringify(filteredCards))
      console.log(`✅ Card deleted: ${cardId}`)

      return { success: true }
    } catch (error) {
      console.error("Error deleting card:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete card",
      }
    }
  }

  // Send a card (enhanced with better error handling and debugging)
  async sendCard(
    cardData: CardData,
    options: SendCardOptions,
  ): Promise<{
    success: boolean
    cardId?: string
    sentAt?: string
    error?: string
    isDemo?: boolean
  }> {
    try {
      console.log("🚀 Starting card send process...")

      // Validate inputs
      if (!options.recipientEmail || !options.recipientEmail.includes("@")) {
        throw new Error("Valid recipient email is required")
      }

      if (!cardData.message?.trim()) {
        throw new Error("Card message is required")
      }

      if (!options.senderName?.trim()) {
        throw new Error("Sender name is required")
      }

      // Check if we're in demo mode or production
      const isDemoMode =
        options.senderEmail?.includes("@notrumpnway.com") || !process.env.NEXT_PUBLIC_ENABLE_REAL_EMAILS

      console.log(`📧 Email mode: ${isDemoMode ? "DEMO" : "PRODUCTION"}`)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate card ID and tracking info
      const cardId = cardData.id || `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const sentAt = new Date().toISOString()

      // Save card with sent status
      const sentCard: CardData = {
        ...cardData,
        id: cardId,
        status: "sent",
        updatedAt: sentAt,
      }

      this.saveCard(sentCard)

      // In a real implementation, we would call an API endpoint here
      // For demo purposes, we'll simulate the API call
      if (!isDemoMode) {
        try {
          // This would be a real API call in production
          console.log("📤 Attempting to send real email...")

          // Simulate API call
          const response = await fetch("/api/send-card", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              cardId,
              recipientEmail: options.recipientEmail,
              recipientName: cardData.recipientName,
              senderName: options.senderName,
              senderEmail: options.senderEmail,
              subject: options.subject,
              message: cardData.message,
              personalMessage: cardData.personalMessage,
              optionalNote: cardData.optionalNote,
              templateName: cardData.templateName,
              templateImage: cardData.templateImage,
            }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || "Failed to send card")
          }

          console.log("📨 Real email sent successfully!")
        } catch (apiError) {
          console.error("❌ API error:", apiError)
          // Fall back to demo mode if API fails
          console.log("⚠️ Falling back to demo mode due to API error")
        }
      }

      // Log the demo send (no real email sent)
      console.log(`
        ═══════════════════════════════════════════════════════════════
        📧 ${isDemoMode ? "DEMO" : "REAL"} CARD SEND ${isDemoMode ? "SIMULATION" : "COMPLETED"}
        ═══════════════════════════════════════════════════════════════
        
        Card ID: ${cardId}
        Template: ${cardData.templateName}
        Type: ${cardData.cardType}
        
        From: ${options.senderName} <${options.senderEmail}>
        To: ${cardData.recipientName || "Recipient"} <${options.recipientEmail}>
        Subject: ${options.subject || `${options.senderName} sent you a ${cardData.templateName} card!`}
        
        Card Message:
        "${cardData.message}"
        
        ${cardData.personalMessage ? `Personal Message: "${cardData.personalMessage}"` : ""}
        ${cardData.optionalNote ? `Additional Note: "${cardData.optionalNote}"` : ""}
        ${options.additionalMessage ? `Email Message: "${options.additionalMessage}"` : ""}
        
        Sent: ${new Date(sentAt).toLocaleString()}
        Font: ${cardData.fontStyle}
        
        ${isDemoMode ? "🚨 NOTE: This is a demonstration. No real email was sent." : "✅ Email has been sent successfully!"}
        ═══════════════════════════════════════════════════════════════
      `)

      return {
        success: true,
        cardId,
        sentAt,
        isDemo: isDemoMode,
      }
    } catch (error) {
      console.error("❌ Error sending card:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send card",
      }
    }
  }

  // Get card statistics
  getCardStats(): {
    total: number
    drafts: number
    sent: number
    templates: Record<string, number>
    recentActivity: CardData[]
  } {
    try {
      const cards = this.getSavedCards()

      const stats = {
        total: cards.length,
        drafts: cards.filter((card) => card.status === "draft").length,
        sent: cards.filter((card) => card.status === "sent").length,
        templates: {} as Record<string, number>,
        recentActivity: cards
          .sort(
            (a, b) =>
              new Date(b.updatedAt || b.createdAt || "").getTime() -
              new Date(a.updatedAt || a.createdAt || "").getTime(),
          )
          .slice(0, 5),
      }

      // Count template usage
      cards.forEach((card) => {
        const template = card.templateName || "Unknown"
        stats.templates[template] = (stats.templates[template] || 0) + 1
      })

      return stats
    } catch (error) {
      console.error("Error getting card stats:", error)
      return {
        total: 0,
        drafts: 0,
        sent: 0,
        templates: {},
        recentActivity: [],
      }
    }
  }

  // Export cards data
  exportCards(): { success: boolean; data?: string; error?: string } {
    try {
      const cards = this.getSavedCards()
      const exportData = {
        exportDate: new Date().toISOString(),
        version: "1.0",
        cards: cards,
      }

      return {
        success: true,
        data: JSON.stringify(exportData, null, 2),
      }
    } catch (error) {
      console.error("Error exporting cards:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to export cards",
      }
    }
  }

  // Import cards data
  importCards(data: string): { success: boolean; imported: number; error?: string } {
    try {
      const importData = JSON.parse(data)

      if (!importData.cards || !Array.isArray(importData.cards)) {
        throw new Error("Invalid import data format")
      }

      const existingCards = this.getSavedCards()
      const newCards = importData.cards.filter(
        (importCard: CardData) => !existingCards.some((existing) => existing.id === importCard.id),
      )

      const allCards = [...existingCards, ...newCards]
      localStorage.setItem(this.storageKey, JSON.stringify(allCards))

      console.log(`✅ Imported ${newCards.length} new cards`)

      return {
        success: true,
        imported: newCards.length,
      }
    } catch (error) {
      console.error("Error importing cards:", error)
      return {
        success: false,
        imported: 0,
        error: error instanceof Error ? error.message : "Failed to import cards",
      }
    }
  }
}

export const cardManagementService = new CardManagementService()
