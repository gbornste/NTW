import { type NextRequest, NextResponse } from "next/server"

// Printify API configuration - using exact pattern from your working code
const PRINTIFY_API_BASE = "https://api.printify.com/v1"
const SHOP_ID = "22732326" // Your shop ID
const API_TIMEOUT = 30000 // 30 seconds

export async function GET(request: NextRequest) {
  const startTime = Date.now()

  try {
    console.log("=== Printify Products API Request Started ===")
    console.log("Timestamp:", new Date().toISOString())

    // Get environment variables - using exact names from your working code
    const PRINTIFY_API_KEY = process.env.PRINTIFY_API_KEY
    const OPENSSL_SECRET = process.env.OPENSSL_SECRET

    console.log("Environment check:")
    console.log("- PRINTIFY_API_KEY present:", !!PRINTIFY_API_KEY)
    console.log("- OPENSSL_SECRET present:", !!OPENSSL_SECRET)
    console.log("- Shop ID:", SHOP_ID)

    // Check for required credentials
    if (!PRINTIFY_API_KEY) {
      console.log("❌ Missing PRINTIFY_API_KEY")
      return createMockResponse("Missing PRINTIFY_API_KEY environment variable", SHOP_ID)
    }

    if (!OPENSSL_SECRET) {
      console.log("❌ Missing OPENSSL_SECRET")
      return createMockResponse("Missing OPENSSL_SECRET environment variable", SHOP_ID)
    }

    console.log("✅ Credentials validated, attempting API call...")

    // Use exact URL pattern from your working code
    const PRINTIFY_API_URL = `${PRINTIFY_API_BASE}/shops/${SHOP_ID}/products.json`
    console.log("🛍️ Fetching products from:", PRINTIFY_API_URL)

    // Use exact headers pattern from your working code
    const headers = {
      Authorization: `Bearer ${PRINTIFY_API_KEY}`,
      "X-Printify-Secret": OPENSSL_SECRET,
      "Content-Type": "application/json",
      Accept: "application/json",
    }

    console.log("Headers configured (API key truncated):", {
      Authorization: `Bearer ${PRINTIFY_API_KEY.substring(0, 20)}...`,
      "X-Printify-Secret": OPENSSL_SECRET ? "***" : "missing",
      "Content-Type": "application/json",
      Accept: "application/json",
    })

    try {
      // Make the API call using fetch with timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

      const response = await fetch(PRINTIFY_API_URL, {
        method: "GET",
        headers,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      console.log("API Response status:", response.status)
      console.log("API Response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error")
        console.log("❌ API request failed:", errorText)

        // Parse error response if possible
        let errorMessage = errorText
        try {
          const errorData = JSON.parse(errorText)
          if (errorData.message) {
            errorMessage = errorData.message
          }
        } catch {
          // Not JSON, use as is
        }

        if (response.status === 401) {
          console.log("❌ AUTHENTICATION FAILED")
          return createMockResponse("Authentication failed - Invalid API credentials", SHOP_ID, 401)
        } else if (response.status === 404) {
          console.log("❌ SHOP NOT FOUND")
          return createMockResponse(`Shop ID ${SHOP_ID} not found`, SHOP_ID, 404)
        } else {
          console.log(`❌ API ERROR - ${response.status}`)
          return createMockResponse(`API error: ${errorMessage}`, SHOP_ID, response.status)
        }
      }

      const data = await response.json()
      console.log("✅ API request successful!")
      console.log("Response data structure:", {
        hasData: !!data.data,
        isDataArray: Array.isArray(data.data),
        productsCount: data.data?.length || 0,
        currentPage: data.current_page,
        lastPage: data.last_page,
        total: data.total,
      })

      // Log first product for debugging
      if (data.data && data.data.length > 0) {
        const firstProduct = data.data[0]
        console.log("First product sample:", {
          id: firstProduct.id,
          title: firstProduct.title,
          hasImages: !!firstProduct.images?.length,
          hasVariants: !!firstProduct.variants?.length,
          imageCount: firstProduct.images?.length || 0,
          variantCount: firstProduct.variants?.length || 0,
          tags: firstProduct.tags || [],
        })
      }

      // Create enhanced response with real data
      const enhancedResponse = {
        ...data,
        shopId: SHOP_ID,
        shopTitle: "NoTrumpNWay Store",
        salesChannel: "custom_integration",
        apiCallDuration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        isMockData: false,
        previewMode: false,
        realDataSource: true,
        apiVersion: "v1",
      }

      console.log(`✅ SUCCESS: Returning ${data.data?.length || 0} REAL products`)
      console.log("=== Printify Products API Request Complete ===")

      return NextResponse.json(enhancedResponse, {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          "X-Data-Source": "real-printify-api",
          "X-Shop-ID": SHOP_ID,
          "X-Products-Count": String(data.data?.length || 0),
        },
      })
    } catch (fetchError) {
      console.log("❌ Fetch error:", fetchError)
      const errorMessage = fetchError instanceof Error ? fetchError.message : "Unknown fetch error"

      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        return createMockResponse(`Request timeout after ${API_TIMEOUT}ms`, SHOP_ID, 408)
      }

      return createMockResponse(`Network error: ${errorMessage}`, SHOP_ID, 500)
    }
  } catch (error) {
    const duration = Date.now() - startTime
    console.log("❌ Unexpected error in products API:", error)
    return createMockResponse(
      `Unexpected error: ${error instanceof Error ? error.message : "Unknown error"}`,
      SHOP_ID,
      500,
      duration,
    )
  }
}

function createMockResponse(errorMessage: string, shopId: string, status = 500, duration?: number): Response {
  console.log("🚨 CREATING MOCK RESPONSE due to error:", errorMessage)
  console.log("🚨 THIS MEANS REAL DATA IS NOT BEING USED!")

  // Create a mock response with clear indication it's fallback data
  const mockResponse = {
    data: getMockProducts(),
    current_page: 1,
    last_page: 1,
    total: getMockProducts().length,
    shopId,
    shopTitle: "NoTrumpNWay Store (MOCK DATA - API FAILED)",
    salesChannel: "custom_integration",
    isMockData: true,
    previewMode: true,
    realDataSource: false,
    error: errorMessage,
    message: "⚠️ USING MOCK DATA - Real API failed",
    timestamp: new Date().toISOString(),
    apiCallDuration: duration,
    fallbackReason: errorMessage,
  }

  return NextResponse.json(mockResponse, {
    status: 200, // Always return 200 for mock data to prevent app crashes
    headers: {
      "X-Data-Source": "mock-fallback",
      "X-Error-Reason": errorMessage,
      "X-Shop-ID": shopId,
    },
  })
}

function getMockProducts() {
  return [
    {
      id: "mock-product-1",
      title: "⚠️ MOCK: Anti-Trump Climate Action T-Shirt",
      description:
        "⚠️ THIS IS MOCK DATA - Real API connection failed. Make a statement with this premium quality t-shirt featuring anti-Trump climate action messaging.",
      images: [
        {
          src: "/political-t-shirt.png",
          is_default: true,
          variant_ids: [1, 2, 3],
          position: "front",
          width: 600,
          height: 600,
          alt: "Mock Anti-Trump Climate Action T-Shirt",
        },
      ],
      variants: [
        {
          id: "1",
          title: "Small / Black",
          price: 2499, // Price in cents
          is_enabled: true,
          options: { size: "S", color: "Black" },
        },
        {
          id: "2",
          title: "Medium / Black",
          price: 2499,
          is_enabled: true,
          options: { size: "M", color: "Black" },
        },
        {
          id: "3",
          title: "Large / Black",
          price: 2499,
          is_enabled: true,
          options: { size: "L", color: "Black" },
        },
      ],
      options: [
        {
          name: "Size",
          type: "size",
          values: ["S", "M", "L", "XL"],
        },
        {
          name: "Color",
          type: "color",
          values: ["Black", "White", "Blue"],
        },
      ],
      tags: ["MOCK-DATA", "Apparel", "T-Shirt", "Anti-Trump", "Climate Change"],
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z",
    },
    {
      id: "mock-product-2",
      title: "⚠️ MOCK: Science Over Politics Coffee Mug",
      description:
        "⚠️ THIS IS MOCK DATA - Real API connection failed. Start your day with a reminder that science matters more than politics.",
      images: [
        {
          src: "/political-mug.png",
          is_default: true,
          variant_ids: [4, 5],
          position: "front",
          width: 600,
          height: 600,
          alt: "Mock Science Over Politics Coffee Mug",
        },
      ],
      variants: [
        {
          id: "4",
          title: "11oz",
          price: 1699,
          is_enabled: true,
          options: { size: "11oz" },
        },
      ],
      options: [
        {
          name: "Size",
          type: "size",
          values: ["11oz", "15oz"],
        },
      ],
      tags: ["MOCK-DATA", "Drinkware", "Mug", "Science", "Politics"],
      created_at: "2023-01-02T00:00:00Z",
      updated_at: "2023-01-02T00:00:00Z",
    },
  ]
}
