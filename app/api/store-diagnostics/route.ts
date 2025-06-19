import { NextResponse } from "next/server"

const PRINTIFY_API_BASE = "https://api.printify.com/v1"

export async function GET() {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: process.env.NODE_ENV,
      hasApiKey: !!process.env.PRINTIFY_API_KEY,
      hasApiToken: !!process.env.PRINTIFY_API_TOKEN,
      hasOpenSslSecret: !!process.env.OPENSSL_SECRET,
      hasWebhookSecret: !!process.env.PRINTIFY_WEBHOOK_SECRET,
      shopId: process.env.PRINTIFY_SHOP_ID,
    },
    apiTest: null as any,
    storePageTest: null as any,
    errors: [] as string[],
  }

  try {
    // Test environment variables
    const apiKey = process.env.PRINTIFY_API_KEY || process.env.PRINTIFY_API_TOKEN
    const shopId = process.env.PRINTIFY_SHOP_ID || "22732326"

    console.log("=== Store Diagnostics Started ===")
    console.log("API Key present:", !!apiKey)
    console.log("Shop ID:", shopId)

    if (!apiKey) {
      diagnostics.errors.push("Missing PRINTIFY_API_KEY or PRINTIFY_API_TOKEN")
      return NextResponse.json(diagnostics)
    }

    // Test direct API call
    console.log("Testing direct Printify API call...")
    const headers = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": "NoTrumpNWay-Store/1.0",
    }

    // Test shop access
    const shopResponse = await fetch(`${PRINTIFY_API_BASE}/shops/${shopId}.json`, { headers })
    console.log("Shop API response status:", shopResponse.status)

    if (!shopResponse.ok) {
      const shopError = await shopResponse.text()
      diagnostics.errors.push(`Shop API failed: ${shopResponse.status} - ${shopError}`)
      diagnostics.apiTest = {
        shopAccess: false,
        shopError: shopError,
        status: shopResponse.status,
      }
    } else {
      const shopData = await shopResponse.json()
      console.log("Shop data retrieved:", shopData.title)

      // Test products API
      const productsResponse = await fetch(`${PRINTIFY_API_BASE}/shops/${shopId}/products.json`, { headers })
      console.log("Products API response status:", productsResponse.status)

      if (!productsResponse.ok) {
        const productsError = await productsResponse.text()
        diagnostics.errors.push(`Products API failed: ${productsResponse.status} - ${productsError}`)
        diagnostics.apiTest = {
          shopAccess: true,
          shopData: shopData,
          productsAccess: false,
          productsError: productsError,
          status: productsResponse.status,
        }
      } else {
        const productsData = await productsResponse.json()
        console.log("Products retrieved:", productsData.data?.length || 0)

        diagnostics.apiTest = {
          shopAccess: true,
          shopData: shopData,
          productsAccess: true,
          productsCount: productsData.data?.length || 0,
          totalProducts: productsData.total || 0,
          firstProduct: productsData.data?.[0]
            ? {
                id: productsData.data[0].id,
                title: productsData.data[0].title,
                hasImages: !!productsData.data[0].images?.length,
                imageCount: productsData.data[0].images?.length || 0,
              }
            : null,
        }
      }
    }

    // Test internal API route
    console.log("Testing internal /api/printify/products route...")
    try {
      const internalResponse = await fetch(
        `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/printify/products`,
        {
          cache: "no-store",
        },
      )

      if (!internalResponse.ok) {
        const internalError = await internalResponse.text()
        diagnostics.errors.push(`Internal API failed: ${internalResponse.status} - ${internalError}`)
        diagnostics.storePageTest = {
          internalApiAccess: false,
          error: internalError,
          status: internalResponse.status,
        }
      } else {
        const internalData = await internalResponse.json()
        diagnostics.storePageTest = {
          internalApiAccess: true,
          isMockData: !!internalData.isMockData,
          productsCount: internalData.data?.length || 0,
          shopId: internalData.shopId,
          shopTitle: internalData.shopTitle,
        }
      }
    } catch (internalError) {
      diagnostics.errors.push(`Internal API error: ${internalError}`)
      diagnostics.storePageTest = {
        internalApiAccess: false,
        error: String(internalError),
      }
    }
  } catch (error) {
    console.error("Diagnostics error:", error)
    diagnostics.errors.push(`Diagnostics error: ${error}`)
  }

  console.log("=== Store Diagnostics Complete ===")
  return NextResponse.json(diagnostics)
}
