import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("📬 Card sending API called")

    // Parse the request body
    const data = await request.json()
    console.log("📝 Received card data:", {
      cardId: data.cardId,
      template: data.templateName,
      recipient: data.recipientEmail,
      sender: data.senderEmail,
      isDemo: data.isDemo,
    })

    // Validate required fields
    const requiredFields = ["recipientEmail", "senderName", "senderEmail", "message", "templateName"]

    for (const field of requiredFields) {
      if (!data[field]) {
        console.error(`❌ Missing required field: ${field}`)
        return NextResponse.json({ success: false, message: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.recipientEmail)) {
      console.error("❌ Invalid recipient email format")
      return NextResponse.json({ success: false, message: "Invalid recipient email format" }, { status: 400 })
    }

    if (!emailRegex.test(data.senderEmail)) {
      console.error("❌ Invalid sender email format")
      return NextResponse.json({ success: false, message: "Invalid sender email format" }, { status: 400 })
    }

    // Generate card ID if not provided
    const cardId = data.cardId || `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const sentAt = new Date().toISOString()

    // Log the card sending details (in production, this would send actual email)
    console.log(`
      ═══════════════════════════════════════════════════════════════
      📧 CARD SENDING DETAILS
      ═══════════════════════════════════════════════════════════════
      Card ID: ${cardId}
      Template: ${data.templateName}
      Card Type: ${data.cardType || "greeting"}
      Font Style: ${data.fontStyle || "classic"}
      
      FROM: ${data.senderName} <${data.senderEmail}>
      TO: ${data.recipientName || "Recipient"} <${data.recipientEmail}>
      SUBJECT: ${data.emailSubject}
      
      CARD MESSAGE:
      ${data.message}
      
      ${data.personalMessage ? `PERSONAL MESSAGE:\n${data.personalMessage}\n` : ""}
      ${data.additionalMessage ? `ADDITIONAL MESSAGE:\n${data.additionalMessage}\n` : ""}
      
      DEMO MODE: ${data.isDemo ? "YES" : "NO"}
      SENT AT: ${sentAt}
      ═══════════════════════════════════════════════════════════════
    `)

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real implementation, you would:
    // 1. Send actual email using a service like SendGrid, Mailgun, etc.
    // 2. Store the card sending record in a database
    // 3. Handle delivery tracking and notifications

    const response = {
      success: true,
      message: data.isDemo ? "Card sent successfully (Demo Mode - No actual email sent)" : "Card sent successfully",
      cardId,
      sentAt,
      recipientEmail: data.recipientEmail,
      senderName: data.senderName,
      isDemo: data.isDemo || false,
    }

    console.log("✅ Card sending completed:", response)

    return NextResponse.json(response)
  } catch (error) {
    console.error("❌ Error in card sending API:", error)

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "An error occurred while sending the card",
      },
      { status: 500 },
    )
  }
}
