import { type NextRequest, NextResponse } from "next/server"

// Force use of shop ID 22108081
const SHOP_ID = "22108081"
const PRINTIFY_API_BASE = "https://api.printify.com/v1"
const API_TIMEOUT = 15000 // 15 seconds for thorough data retrieval

interface ShopDataResponse {
  shop: any
  products: any[]
  shopId: string
  timestamp: string
  dataSource: "live" | "mock"
  error?: string
  message?: string
}

export async function GET(request: NextRequest) {
  const startTime = Date.now()

  try {
    console.log(`🏪 Fetching updated data for shop ID: ${SHOP_ID}`)
    console.log("Timestamp:", new Date().toISOString())

    // Get environment variables
    const apiKey = process.env.PRINTIFY_API_TOKEN

    if (!apiKey) {
      console.log("❌ Missing PRINTIFY_API_TOKEN")
      return NextResponse.json(
        {
          shop: null,
          products: [],
          shopId: SHOP_ID,
          timestamp: new Date().toISOString(),
          dataSource: "mock" as const,
          error: "Missing PRINTIFY_API_TOKEN environment variable",
          message: "API token required for live data retrieval",
        },
        { status: 200 },
      )
    }

    // Validate API key format
    if (apiKey.length < 10) {
      console.log("❌ Invalid API key format")
      return NextResponse.json(
        {
          shop: null,
          products: [],
          shopId: SHOP_ID,
          timestamp: new Date().toISOString(),
          dataSource: "mock" as const,
          error: "Invalid PRINTIFY_API_TOKEN format",
          message: "API token appears to be invalid",
        },
        { status: 200 },
      )
    }

    console.log("✅ API credentials validated, fetching shop data...")

    // Create headers for API requests
    const headers = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": "NoTrumpNWay-Store/1.0",
      "X-Shop-ID": SHOP_ID,
    }

    // First, get shop information
    console.log(`📋 Fetching shop information for shop ${SHOP_ID}...`)
    const shopUrl = `${PRINTIFY_API_BASE}/shops/${SHOP_ID}.json`

    const shopResponse = await fetchWithTimeout(shopUrl, { headers }, API_TIMEOUT)

    if (!shopResponse.ok) {
      const shopError = await shopResponse.text().catch(() => "Unknown error")
      console.log(`❌ Shop fetch failed: ${shopResponse.status} - ${shopError}`)

      return NextResponse.json(
        {
          shop: null,
          products: [],
          shopId: SHOP_ID,
          timestamp: new Date().toISOString(),
          dataSource: "mock" as const,
          error: `Shop fetch failed: ${shopResponse.status}`,
          message: shopError,
        },
        { status: 200 },
      )
    }

    const shopData = await shopResponse.json()
    console.log(`✅ Shop data retrieved: ${shopData.title}`)

    // Now fetch products for this shop
    console.log(`📦 Fetching products for shop ${SHOP_ID}...`)
    const productsUrl = `${PRINTIFY_API_BASE}/shops/${SHOP_ID}/products.json`

    const productsResponse = await fetchWithTimeout(productsUrl, { headers }, API_TIMEOUT)

    if (!productsResponse.ok) {
      const productsError = await productsResponse.text().catch(() => "Unknown error")
      console.log(`❌ Products fetch failed: ${productsResponse.status} - ${productsError}`)

      return NextResponse.json(
        {
          shop: shopData,
          products: [],
          shopId: SHOP_ID,
          timestamp: new Date().toISOString(),
          dataSource: "live" as const,
          error: `Products fetch failed: ${productsResponse.status}`,
          message: `Shop exists but products could not be retrieved: ${productsError}`,
        },
        { status: 200 },
      )
    }

    const productsData = await productsResponse.json()
    console.log(`✅ Products retrieved: ${productsData.data?.length || 0} products`)

    const duration = Date.now() - startTime
    console.log(`⏱️ Total API call duration: ${duration}ms`)

    return NextResponse.json({
      shop: shopData,
      products: productsData.data || [],
      shopId: SHOP_ID,
      timestamp: new Date().toISOString(),
      dataSource: "live" as const,
      message: `Successfully retrieved updated data for shop ${SHOP_ID}`,
      apiCallDuration: duration,
      totalProducts: productsData.total || 0,
      currentPage: productsData.current_page || 1,
      lastPage: productsData.last_page || 1,
    })
  } catch (error) {
    const duration = Date.now() - startTime
    console.error("❌ Unexpected error fetching shop data:", error)

    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"

    return NextResponse.json(
      {
        shop: null,
        products: [],
        shopId: SHOP_ID,
        timestamp: new Date().toISOString(),
        dataSource: "mock" as const,
        error: `Unexpected error: ${errorMessage}`,
        message: "Failed to retrieve updated shop data",
        apiCallDuration: duration,
      },
      { status: 200 },
    )
  }
}

async function fetchWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Request timeout after ${timeout}ms`)
    }
    throw error
  }
}
