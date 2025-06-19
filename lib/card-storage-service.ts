export interface CardData {
  templateName: string
  templateImage: string
  message: string
  recipientName: string
  personalMessage: string
  optionalNote: string
  cardType: string
  fontStyle: string
  createdAt: string
}

// Service to handle card storage during authentication flow
export class CardStorageService {
  private readonly STORAGE_KEY = "pending_card_data"

  // Save card data to localStorage
  saveCard(cardData: CardData): void {
    try {
      const dataToStore = {
        ...cardData,
        createdAt: new Date().toISOString(),
      }
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToStore))
      console.log("✅ Card saved to storage:", cardData.templateName)
    } catch (error) {
      console.error("Error saving card:", error)
    }
  }

  // Get card data from localStorage
  getCard(): CardData | null {
    try {
      const cardData = localStorage.getItem(this.STORAGE_KEY)
      if (cardData) {
        return JSON.parse(cardData)
      }
      return null
    } catch (error) {
      console.error("Error retrieving card:", error)
      return null
    }
  }

  // Clear card data from localStorage
  clearCard(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY)
      console.log("✅ Pending card cleared from storage")
    } catch (error) {
      console.error("Error clearing card:", error)
    }
  }

  // Check if there's a pending card - FIXED METHOD NAME
  hasPendingCard(): boolean {
    try {
      const cardData = localStorage.getItem(this.STORAGE_KEY)
      return !!cardData
    } catch (error) {
      console.error("Error checking for pending card:", error)
      return false
    }
  }

  // Alternative method name for compatibility
  hasCard(): boolean {
    return this.hasPendingCard()
  }
}

// Export singleton instance
export const cardStorageService = new CardStorageService()
