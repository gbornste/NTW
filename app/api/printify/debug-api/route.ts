import { type NextRequest, NextResponse } from "next/server"

// Printify API configuration
const PRINTIFY_API_BASE = "https://api.printify.com/v1"
const API_TIMEOUT = 15000 // 15 seconds

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  const searchParams = request.nextUrl.searchParams
  const shopId = searchParams.get("shopId") || process.env.PRINTIFY_SHOP_ID || "22732326"
  const raw = searchParams.get("raw") === "true"

  console.log(`🔍 DEBUG API: Fetching products for shop ${shopId}`)

  try {
    // Get API credentials - Updated to match your working code
    const apiKey = process.env.PRINTIFY_API_KEY || process.env.PRINTIFY_API_TOKEN
    const opensslSecret = process.env.OPENSSL_SECRET || process.env.PRINTIFY_WEBHOOK_SECRET

    console.log("Environment variables check:")
    console.log("- PRINTIFY_API_KEY:", !!process.env.PRINTIFY_API_KEY)
    console.log("- PRINTIFY_API_TOKEN:", !!process.env.PRINTIFY_API_TOKEN)
    console.log("- OPENSSL_SECRET:", !!process.env.OPENSSL_SECRET)
    console.log("- PRINTIFY_WEBHOOK_SECRET:", !!process.env.PRINTIFY_WEBHOOK_SECRET)
    console.log("- Using API Key:", apiKey ? `${apiKey.substring(0, 10)}...` : "None")
    console.log("- Using OpenSSL Secret:", !!opensslSecret)

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "Missing API key",
          env: {
            hasPrintifyApiKey: !!process.env.PRINTIFY_API_KEY,
            hasPrintifyApiToken: !!process.env.PRINTIFY_API_TOKEN,
            hasOpensslSecret: !!process.env.OPENSSL_SECRET,
            hasPrintifyWebhookSecret: !!process.env.PRINTIFY_WEBHOOK_SECRET,
            shopId: process.env.PRINTIFY_SHOP_ID,
          },
        },
        { status: 500 },
      )
    }

    // Prepare headers exactly like your working code
    const headers: Record<string, string> = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": "NoTrumpNWay-Store/1.0",
    }

    // Add OpenSSL secret header if available (matching your working code)
    if (opensslSecret) {
      headers["X-Printify-Secret"] = opensslSecret
      console.log("✅ Added X-Printify-Secret header")
    }

    // Make direct request to Printify API using exact same URL format as your working code
    const productsUrl = `${PRINTIFY_API_BASE}/shops/${shopId}/products.json`
    console.log(`📡 Making direct request to: ${productsUrl}`)
    console.log("Headers:", Object.keys(headers))

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

    try {
      const response = await fetch(productsUrl, {
        headers,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      console.log(`Response status: ${response.status} ${response.statusText}`)
      console.log("Response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.log("Error response:", errorText)

        return NextResponse.json(
          {
            success: false,
            error: `HTTP ${response.status}: ${response.statusText}`,
            errorDetails: errorText,
            apiCallDuration: Date.now() - startTime,
            timestamp: new Date().toISOString(),
            requestUrl: productsUrl,
            requestHeaders: headers,
          },
          { status: response.status },
        )
      }

      const responseData = await response.json()
      const duration = Date.now() - startTime

      console.log(`✅ Direct API call completed in ${duration}ms`)
      console.log(`📊 Products count: ${responseData.data?.length || 0}`)
      console.log("Response structure:", {
        hasData: !!responseData.data,
        isDataArray: Array.isArray(responseData.data),
        dataLength: responseData.data?.length || 0,
        currentPage: responseData.current_page,
        lastPage: responseData.last_page,
        total: responseData.total,
      })

      // Log first product details if available
      if (responseData.data && responseData.data.length > 0) {
        const firstProduct = responseData.data[0]
        console.log("First product details:", {
          id: firstProduct.id,
          title: firstProduct.title,
          description: firstProduct.description?.substring(0, 100) + "...",
          imageCount: firstProduct.images?.length || 0,
          variantCount: firstProduct.variants?.length || 0,
          tagCount: firstProduct.tags?.length || 0,
        })
      }

      // Return raw response or enhanced debug info
      if (raw) {
        return NextResponse.json(responseData)
      }

      return NextResponse.json({
        success: true,
        apiCallDuration: duration,
        timestamp: new Date().toISOString(),
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        responseSize: JSON.stringify(responseData).length,
        productsCount: responseData.data?.length || 0,
        requestUrl: productsUrl,
        requestHeaders: Object.keys(headers),
        hasOpensslSecret: !!opensslSecret,
        firstProduct: responseData.data?.[0]
          ? {
              id: responseData.data[0].id,
              title: responseData.data[0].title,
              hasImages: responseData.data[0].images?.length > 0,
              hasVariants: responseData.data[0].variants?.length > 0,
              hasTags: responseData.data[0].tags?.length > 0,
              imageCount: responseData.data[0].images?.length || 0,
              variantCount: responseData.data[0].variants?.length || 0,
              tagCount: responseData.data[0].tags?.length || 0,
            }
          : null,
        pagination: {
          current_page: responseData.current_page,
          last_page: responseData.last_page,
          total: responseData.total,
        },
        rawResponse: raw ? responseData : undefined,
      })
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  } catch (error) {
    const duration = Date.now() - startTime
    console.error("❌ Error in debug API:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        apiCallDuration: duration,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
