export const debugCardSending = {
  logSendAttempt: (cardData: any, user: any) => {
    console.log("🔍 Card Send Attempt:", {
      timestamp: new Date().toISOString(),
      cardType: cardData?.cardType || "unknown",
      templateName: cardData?.templateName || "unknown",
      recipientName: cardData?.recipientName || "none",
      messageLength: cardData?.message?.length || 0,
      userAuthenticated: !!user,
      userId: user?.id || "not-authenticated",
      userEmail: user?.email || "not-authenticated",
    })
  },

  logSendError: (error: any, context: string) => {
    console.error(`❌ Card Send Error (${context}):`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      context,
      timestamp: new Date().toISOString(),
    }
  },

  logSendSuccess: (result: any) => {
    console.log("✅ Card Send Success:", {
      timestamp: new Date().toISOString(),
      cardId: result.cardId,
      sentAt: result.sentAt,
      isDemo: result.isDemo,
    })
    return result
  },
}
