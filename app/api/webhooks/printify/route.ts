import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("x-printify-signature")
    const webhookSecret = process.env.PRINTIFY_WEBHOOK_SECRET

    // Verify webhook signature if secret is configured
    if (webhookSecret && signature) {
      const expectedSignature = crypto.createHmac("sha256", webhookSecret).update(body).digest("hex")

      if (signature !== expectedSignature) {
        console.error("Invalid webhook signature")
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
      }
    }

    const event = JSON.parse(body)
    console.log("Received Printify webhook:", {
      type: event.type,
      id: event.id,
      timestamp: new Date().toISOString(),
    })

    // Handle different event types
    switch (event.type) {
      case "order:created":
        await handleOrderCreated(event.data)
        break
      case "order:updated":
        await handleOrderUpdated(event.data)
        break
      case "order:shipped":
        await handleOrderShipped(event.data)
        break
      case "order:canceled":
        await handleOrderCanceled(event.data)
        break
      case "product:created":
        await handleProductCreated(event.data)
        break
      case "product:updated":
        await handleProductUpdated(event.data)
        break
      case "product:deleted":
        await handleProductDeleted(event.data)
        break
      default:
        console.log("Unhandled webhook event type:", event.type)
    }

    return NextResponse.json({ success: true, processed: true })
  } catch (error) {
    console.error("Error processing Printify webhook:", error)
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 })
  }
}

async function handleOrderCreated(orderData: any) {
  console.log("Order created:", {
    id: orderData.id,
    external_id: orderData.external_id,
    status: orderData.status,
    total: orderData.total_price,
  })

  // Add your order processing logic here
  // For example: send confirmation email, update inventory, etc.
}

async function handleOrderUpdated(orderData: any) {
  console.log("Order updated:", {
    id: orderData.id,
    status: orderData.status,
    tracking_number: orderData.tracking_number,
  })

  // Add your order update logic here
}

async function handleOrderShipped(orderData: any) {
  console.log("Order shipped:", {
    id: orderData.id,
    tracking_number: orderData.tracking_number,
    tracking_url: orderData.tracking_url,
  })

  // Add your shipping notification logic here
  // For example: send tracking email to customer
}

async function handleOrderCanceled(orderData: any) {
  console.log("Order canceled:", {
    id: orderData.id,
    reason: orderData.cancel_reason,
  })

  // Add your cancellation logic here
}

async function handleProductCreated(productData: any) {
  console.log("Product created:", {
    id: productData.id,
    title: productData.title,
    status: productData.status,
  })

  // Add your product creation logic here
}

async function handleProductUpdated(productData: any) {
  console.log("Product updated:", {
    id: productData.id,
    title: productData.title,
    status: productData.status,
  })

  // Add your product update logic here
}

async function handleProductDeleted(productData: any) {
  console.log("Product deleted:", {
    id: productData.id,
  })

  // Add your product deletion logic here
}
