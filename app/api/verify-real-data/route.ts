import { NextResponse } from "next/server"

export async function GET() {
  const startTime = Date.now()

  try {
    console.log("🔍 Verifying real data connection...")

    // Check environment variables
    const apiKey = process.env.PRINTIFY_API_KEY || process.env.PRINTIFY_API_TOKEN
    const opensslSecret = process.env.OPENSSL_SECRET || process.env.PRINTIFY_WEBHOOK_SECRET
    const shopId = process.env.PRINTIFY_SHOP_ID || "22732326"

    console.log("Environment check:")
    console.log("- API Key present:", !!apiKey)
    console.log("- API Key length:", apiKey?.length || 0)
    console.log("- OpenSSL Secret present:", !!opensslSecret)
    console.log("- Shop ID:", shopId)

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: "PRINTIFY_API_KEY not found in environment variables",
        usingMockData: true,
        timestamp: new Date().toISOString(),
      })
    }

    // Test API connection
    const headers: Record<string, string> = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": "NoTrumpNWay-Store/1.0",
    }

    if (opensslSecret) {
      headers["X-Printify-Secret"] = opensslSecret
    }

    // Test shop access
    console.log("🏪 Testing shop access...")
    const shopResponse = await fetch(`https://api.printify.com/v1/shops/${shopId}.json`, {
      headers,
      cache: "no-store",
    })

    if (!shopResponse.ok) {
      const errorText = await shopResponse.text().catch(() => "Unknown error")
      console.log("❌ Shop access failed:", shopResponse.status, errorText)

      return NextResponse.json({
        success: false,
        error: `Shop access failed: ${shopResponse.status} ${shopResponse.statusText}`,
        details: errorText,
        usingMockData: true,
        timestamp: new Date().toISOString(),
      })
    }

    const shopData = await shopResponse.json()
    console.log("✅ Shop access successful:", shopData.title)

    // Test products access
    console.log("📦 Testing products access...")
    const productsResponse = await fetch(`https://api.printify.com/v1/shops/${shopId}/products.json`, {
      headers,
      cache: "no-store",
    })

    if (!productsResponse.ok) {
      const errorText = await productsResponse.text().catch(() => "Unknown error")
      console.log("❌ Products access failed:", productsResponse.status, errorText)

      return NextResponse.json({
        success: false,
        error: `Products access failed: ${productsResponse.status} ${productsResponse.statusText}`,
        details: errorText,
        shopData,
        usingMockData: true,
        timestamp: new Date().toISOString(),
      })
    }

    const productsData = await productsResponse.json()
    console.log("✅ Products access successful:", productsData.data?.length || 0, "products found")

    const duration = Date.now() - startTime

    return NextResponse.json({
      success: true,
      message: "Successfully connected to real Printify data!",
      shopData: {
        id: shopData.id,
        title: shopData.title,
        sales_channel: shopData.sales_channel,
      },
      productsData: {
        count: productsData.data?.length || 0,
        total: productsData.total || 0,
        current_page: productsData.current_page || 1,
        last_page: productsData.last_page || 1,
      },
      firstProduct: productsData.data?.[0]
        ? {
            id: productsData.data[0].id,
            title: productsData.data[0].title,
            hasImages: !!productsData.data[0].images?.length,
            hasVariants: !!productsData.data[0].variants?.length,
          }
        : null,
      usingMockData: false,
      apiCallDuration: duration,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Verification error:", error)

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      usingMockData: true,
      timestamp: new Date().toISOString(),
    })
  }
}
