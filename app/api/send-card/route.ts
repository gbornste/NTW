

import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import mysql from "mysql2/promise"

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

    // Send actual email if not in demo mode
    let emailResult = null;
    if (!data.isDemo) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT),
          secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        // Use cardImageUrl from frontend if provided, else fallback to public/images mapping
        let cardImageUrl = data.cardImageUrl || null;
        if (!cardImageUrl) {
          switch ((data.cardType || '').toLowerCase()) {
            case 'birthday':
              cardImageUrl = 'https://notrumpnway.com/images/trump-underwear.png';
              break;
            case 'fathersday':
            case 'fathers_day':
              cardImageUrl = 'https://notrumpnway.com/images/trump-fathers-day.jpg';
              break;
            case 'graduation':
              cardImageUrl = 'https://notrumpnway.com/images/trump-graduation.jpg';
              break;
            case 'holiday':
              cardImageUrl = 'https://notrumpnway.com/images/political-holiday-card.png';
              break;
            case 'congratulations':
              cardImageUrl = 'https://notrumpnway.com/images/Donald-Trump-Recount%20(1).jpg';
              break;
            case 'thankyou':
            case 'thank_you':
            case 'thank you':
              cardImageUrl = 'https://notrumpnway.com/images/trump-qatar-plane.png';
              break;
            case '4thofjuly':
            case '4th_of_july':
            case '4th of july':
            case 'independence':
              cardImageUrl = 'https://notrumpnway.com/images/Trump%204th%20of%20July%20(1).png';
              break;
            default:
              cardImageUrl = 'https://notrumpnway.com/images/cards/default.jpg';
          }
        }

        const mailOptions = {
          from: process.env.FROM_EMAIL || data.senderEmail,
          to: data.recipientEmail,
          subject: data.emailSubject || `You've received a card from ${data.senderName}`,
          html: `
            <h2>${data.templateName || "Greeting Card"}</h2>
            ${cardImageUrl ? `<img src="${cardImageUrl}" alt="Card Image" style="max-width:100%;margin-bottom:16px;" />` : ''}
            <p><strong>From:</strong> ${data.senderName} (${data.senderEmail})</p>
            <p><strong>To:</strong> ${data.recipientName || "Recipient"} (${data.recipientEmail})</p>
            <p><strong>Message:</strong></p>
            <p>${data.message}</p>
            ${data.personalMessage ? `<p><strong>Personal Message:</strong><br>${data.personalMessage}</p>` : ""}
            ${data.additionalMessage ? `<p><strong>Additional Message:</strong><br>${data.additionalMessage}</p>` : ""}
            <p><em>Sent via NoTrumpNWay.com</em></p>
          `,
        };

        emailResult = await transporter.sendMail(mailOptions);
        console.log("📧 Email sent:", emailResult.messageId);
      } catch (emailErr) {
        console.error("❌ Error sending email:", emailErr);
        return NextResponse.json({ success: false, message: "Failed to send email.", error: emailErr instanceof Error ? emailErr.message : emailErr }, { status: 500 });
      }
    }

    // Insert card send record into MySQL
    try {
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });
      await connection.execute(
        `INSERT INTO cardsends
          (cardid, templatename, cardtype, fontstyle, sendername, senderemail, recipientname, recipientemail, emailsubject, message, personalmessage, additionalmessage, isdemo, sentat, emailmessageid)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          cardId,
          data.templateName,
          data.cardType || null,
          data.fontStyle || null,
          data.senderName,
          data.senderEmail,
          data.recipientName || null,
          data.recipientEmail,
          data.emailSubject || null,
          data.message,
          data.personalMessage || null,
          data.additionalMessage || null,
          !!data.isDemo,
          sentAt,
          emailResult ? emailResult.messageId : null,
        ]
      );
      await connection.end();
    } catch (dbErr) {
      console.error("❌ Error inserting card send record:", dbErr);
      // Don't fail the request if DB insert fails, but log it
    }

    const response = {
      success: true,
      message: data.isDemo ? "Card sent successfully (Demo Mode - No actual email sent)" : "Card sent successfully",
      cardId,
      sentAt,
      recipientEmail: data.recipientEmail,
      senderName: data.senderName,
      isDemo: data.isDemo || false,
      emailResult: emailResult ? { messageId: emailResult.messageId } : undefined,
    };

    console.log("✅ Card sending completed:", response);

    return NextResponse.json(response);
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
