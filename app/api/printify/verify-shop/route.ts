import { NextResponse } from "next/server"
import { createVerificationService } from "@/lib/printify-verification-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const shopId = searchParams.get("shopId") || process.env.PRINTIFY_SHOP_ID || "22108081"
    const apiKey = process.env.PRINTIFY_API_TOKEN

    console.log("=== Printify Shop Verification ===")
    console.log("Shop ID:", shopId)
    console.log("API Key present:", !!apiKey)

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "PRINTIFY_API_TOKEN environment variable is required",
          shopId,
          timestamp: new Date().toISOString(),
        },
        { status: 400 },
      )
    }

    const verificationService = createVerificationService(apiKey, shopId)
    if (!verificationService) {
      return NextResponse.json(
        {
          error: "Failed to create verification service",
          shopId,
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      )
    }

    const result = await verificationService.performFullVerification()

    // Add environment information
    const environmentInfo = {
      shopId,
      apiKeyPresent: !!apiKey,
      apiKeyLength: apiKey ? apiKey.length : 0,
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json({
      verification: result,
      environment: environmentInfo,
      summary: {
        isValid: result.isValid,
        status: result.status,
        shopTitle: result.shop?.title,
        salesChannel: result.shop?.sales_channel,
        issuesCount: result.issues?.length || 0,
        recommendationsCount: result.recommendations?.length || 0,
        responseTime: result.responseTime,
      },
    })
  } catch (error) {
    console.error("Shop verification error:", error)

    return NextResponse.json(
      {
        error: "Verification failed",
        details: error instanceof Error ? error.message : "Unknown error",
        shopId: process.env.PRINTIFY_SHOP_ID || "22108081",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { shopId, apiKey } = body

    if (!shopId) {
      return NextResponse.json(
        {
          error: "shopId is required in request body",
        },
        { status: 400 },
      )
    }

    const key = apiKey || process.env.PRINTIFY_API_TOKEN
    if (!key) {
      return NextResponse.json(
        {
          error: "API key is required (either in body or environment)",
        },
        { status: 400 },
      )
    }

    console.log("=== Custom Shop Verification ===")
    console.log("Shop ID:", shopId)
    console.log("Using custom API key:", !!apiKey)

    const verificationService = createVerificationService(key, shopId)
    if (!verificationService) {
      return NextResponse.json(
        {
          error: "Failed to create verification service",
        },
        { status: 500 },
      )
    }

    const result = await verificationService.performFullVerification()

    return NextResponse.json({
      verification: result,
      summary: {
        isValid: result.isValid,
        status: result.status,
        shopTitle: result.shop?.title,
        salesChannel: result.shop?.sales_channel,
        responseTime: result.responseTime,
      },
    })
  } catch (error) {
    console.error("Custom verification error:", error)

    return NextResponse.json(
      {
        error: "Custom verification failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
