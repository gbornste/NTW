import { NextResponse } from "next/server"
import { createShopUpdatePayload, createWebhookPayload } from "@/lib/printify-config"

const PRINTIFY_API_BASE = "https://api.printify.com/v1"

export async function POST(request: Request) {
  try {
    const apiKey = process.env.PRINTIFY_API_TOKEN
    const shopId = process.env.PRINTIFY_SHOP_ID || "22732326"

    if (!apiKey) {
      return NextResponse.json({ error: "PRINTIFY_API_TOKEN environment variable is required" }, { status: 400 })
    }

    console.log("Configuring Printify shop with ID:", shopId)

    // Update shop configuration
    const shopUpdatePayload = createShopUpdatePayload()
    console.log("Shop update payload:", JSON.stringify(shopUpdatePayload, null, 2))

    const shopResponse = await fetch(`${PRINTIFY_API_BASE}/shops/${shopId}.json`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "User-Agent": "NoTrumpNWay-Store/1.0",
      },
      body: JSON.stringify(shopUpdatePayload),
    })

    if (!shopResponse.ok) {
      const errorText = await shopResponse.text()
      console.error("Shop update failed:", errorText)
      return NextResponse.json(
        {
          error: `Failed to update shop: ${shopResponse.status} ${shopResponse.statusText}`,
          details: errorText,
        },
        { status: shopResponse.status },
      )
    }

    const updatedShop = await shopResponse.json()
    console.log("Shop updated successfully:", updatedShop)

    // Configure webhooks
    const webhookUrl = `${process.env.NEXTAUTH_URL || "https://notrumpnway.vercel.app"}/api/webhooks/printify`
    const webhookPayload = createWebhookPayload(webhookUrl)
    console.log("Webhook payload:", JSON.stringify(webhookPayload, null, 2))

    const webhookResponse = await fetch(`${PRINTIFY_API_BASE}/shops/${shopId}/webhooks.json`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "User-Agent": "NoTrumpNWay-Store/1.0",
      },
      body: JSON.stringify(webhookPayload),
    })

    let webhookResult = null
    if (webhookResponse.ok) {
      webhookResult = await webhookResponse.json()
      console.log("Webhook configured successfully:", webhookResult)
    } else {
      const webhookError = await webhookResponse.text()
      console.warn("Webhook configuration failed (non-critical):", webhookError)
    }

    return NextResponse.json({
      success: true,
      message: "Shop configured successfully",
      shop: updatedShop,
      webhook: webhookResult,
      configuration: {
        shopId: Number.parseInt(shopId),
        title: "NoTrumpNWay",
        salesChannel: "custom_integration",
        webhookUrl: webhookUrl,
      },
    })
  } catch (error) {
    console.error("Error configuring Printify shop:", error)
    return NextResponse.json(
      {
        error: "Failed to configure shop",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const apiKey = process.env.PRINTIFY_API_TOKEN
    const shopId = process.env.PRINTIFY_SHOP_ID || "22732326"

    if (!apiKey) {
      return NextResponse.json({ error: "PRINTIFY_API_TOKEN environment variable is required" }, { status: 400 })
    }

    // Get current shop configuration
    const shopResponse = await fetch(`${PRINTIFY_API_BASE}/shops/${shopId}.json`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "User-Agent": "NoTrumpNWay-Store/1.0",
      },
    })

    if (!shopResponse.ok) {
      const errorText = await shopResponse.text()
      return NextResponse.json(
        {
          error: `Failed to get shop: ${shopResponse.status} ${shopResponse.statusText}`,
          details: errorText,
        },
        { status: shopResponse.status },
      )
    }

    const shop = await shopResponse.json()

    // Get webhooks
    const webhooksResponse = await fetch(`${PRINTIFY_API_BASE}/shops/${shopId}/webhooks.json`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "User-Agent": "NoTrumpNWay-Store/1.0",
      },
    })

    let webhooks = []
    if (webhooksResponse.ok) {
      const webhooksData = await webhooksResponse.json()
      webhooks = webhooksData.data || []
    }

    return NextResponse.json({
      shop,
      webhooks,
      configuration: {
        shopId: Number.parseInt(shopId),
        title: shop.title,
        salesChannel: shop.sales_channel,
        isConfigured: shop.title === "NoTrumpNWay" && shop.sales_channel === "custom_integration",
      },
    })
  } catch (error) {
    console.error("Error getting shop configuration:", error)
    return NextResponse.json(
      {
        error: "Failed to get shop configuration",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
