import { type NextRequest, NextResponse } from "next/server"
import {
  generateShopPayload,
  getShopConfiguration,
  isValidShopId,
  getCurrentShopId,
  validatePayload,
  formatPayloadAsJson,
  createApiRequest,
} from "@/lib/printify-shop-selector"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const shopId = searchParams.get("shopId") || getCurrentShopId()

    console.log(`🔍 Generating payload for shop ID: ${shopId}`)

    // Generate the payload
    const payload = generateShopPayload(shopId)
    const shopConfig = getShopConfiguration(shopId)
    const isValid = validatePayload(payload)
    const isSupported = isValidShopId(shopId)

    // Create complete API request configuration
    const apiRequest = createApiRequest(shopId)

    const response = {
      success: true,
      shopId: shopId,
      payload: payload,
      payloadJson: formatPayloadAsJson(shopId),
      validation: {
        isValid: isValid,
        isSupported: isSupported,
      },
      shopConfiguration: shopConfig,
      apiRequest: {
        payload: apiRequest.payload,
        headers: apiRequest.headers,
        shopConfig: apiRequest.shopConfig,
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        currentShopId: getCurrentShopId(),
      },
    }

    console.log(`✅ Payload generated successfully for shop ${shopId}`)

    return NextResponse.json(response)
  } catch (error) {
    console.error("❌ Error generating payload:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        shopId: null,
        payload: null,
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { shopId } = body

    if (!shopId) {
      return NextResponse.json(
        {
          success: false,
          error: "Shop ID is required",
        },
        { status: 400 },
      )
    }

    console.log(`🔍 Generating payload for provided shop ID: ${shopId}`)

    // Generate the payload
    const payload = generateShopPayload(shopId)
    const shopConfig = getShopConfiguration(shopId)
    const isValid = validatePayload(payload)
    const isSupported = isValidShopId(shopId)

    const response = {
      success: true,
      shopId: String(shopId),
      payload: payload,
      payloadJson: formatPayloadAsJson(shopId),
      validation: {
        isValid: isValid,
        isSupported: isSupported,
        message: isSupported
          ? "Shop ID is supported and configured"
          : "Shop ID not found in predefined configurations, using default",
      },
      shopConfiguration: shopConfig,
      metadata: {
        generatedAt: new Date().toISOString(),
        requestMethod: "POST",
      },
    }

    console.log(`✅ Payload generated successfully for shop ${shopId}`)

    return NextResponse.json(response)
  } catch (error) {
    console.error("❌ Error generating payload:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
