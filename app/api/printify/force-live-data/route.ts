import { type NextRequest, NextResponse } from "next/server"

const PRINTIFY_API_BASE = "https://api.printify.com/v1"

interface ForceLiveDataResult {
  success: boolean
  shopId: string
  timestamp: string
  method: string
  data?: any
  error?: string
  httpStatus?: number
  responseTime: number
  headers: Record<string, string>
  rawResponse: string
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const shopId = searchParams.get("shopId") || "22732326"
  const endpoint = searchParams.get("endpoint") || "products"

  console.log(`🚀 Force live data test for shop ${shopId}, endpoint: ${endpoint}`)

  const startTime = Date.now()
  const result: ForceLiveDataResult = {
    success: false,
    shopId,
    timestamp: new Date().toISOString(),
    method: "GET",
    responseTime: 0,
    headers: {},
    rawResponse: "",
  }

  try {
    const apiKey = process.env.PRINTIFY_API_TOKEN

    if (!apiKey) {
      result.error = "PRINTIFY_API_TOKEN environment variable is missing"
      result.responseTime = Date.now() - startTime
      return NextResponse.json(result, { status: 400 })
    }

    // Determine the API endpoint
    let apiUrl: string
    switch (endpoint) {
      case "shop":
        apiUrl = `${PRINTIFY_API_BASE}/shops/${shopId}.json`
        break
      case "products":
        apiUrl = `${PRINTIFY_API_BASE}/shops/${shopId}/products.json`
        break
      case "orders":
        apiUrl = `${PRINTIFY_API_BASE}/shops/${shopId}/orders.json`
        break
      default:
        apiUrl = `${PRINTIFY_API_BASE}/shops/${shopId}/products.json`
    }

    console.log(`📡 Making direct API call to: ${apiUrl}`)

    // Force fresh data with aggressive cache-busting headers
    const headers = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": "NoTrumpNWay-ForceLive/1.0",
      "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
      Pragma: "no-cache",
      Expires: "0",
      "If-None-Match": "*",
      "X-Requested-With": "XMLHttpRequest",
      "X-Force-Fresh": "true",
    }

    const response = await fetch(apiUrl, {
      method: "GET",
      headers,
      cache: "no-store",
    })

    const responseText = await response.text()
    const responseHeaders = Object.fromEntries(response.headers.entries())

    result.responseTime = Date.now() - startTime
    result.httpStatus = response.status
    result.headers = responseHeaders
    result.rawResponse = responseText

    console.log(`📊 Response status: ${response.status}`)
    console.log(`⏱️ Response time: ${result.responseTime}ms`)
    console.log(`📏 Response size: ${responseText.length} bytes`)

    if (!response.ok) {
      result.success = false
      result.error = `HTTP ${response.status}: ${response.statusText}`

      // Provide specific error messages
      if (response.status === 404) {
        result.error = `Shop ID ${shopId} not found. This shop may not exist or be accessible with your API token.`
      } else if (response.status === 401) {
        result.error = "Authentication failed. Your API token is invalid or expired."
      } else if (response.status === 403) {
        result.error = `Access denied to shop ${shopId}. Your API token may lack permissions for this shop.`
      } else if (response.status === 429) {
        result.error = "Rate limit exceeded. Please wait before making more requests."
      }

      console.log(`❌ API call failed: ${result.error}`)
      return NextResponse.json(result)
    }

    // Try to parse JSON response
    try {
      const data = JSON.parse(responseText)
      result.success = true
      result.data = data

      // Log success details
      if (endpoint === "products" && data.data) {
        console.log(`✅ Successfully retrieved ${data.data.length} products`)
        console.log(`📦 Total products: ${data.total || data.data.length}`)
      } else if (endpoint === "shop") {
        console.log(`✅ Successfully retrieved shop: ${data.title || "Unknown"}`)
        console.log(`🏪 Shop status: ${data.status || "Unknown"}`)
      }

      return NextResponse.json(result)
    } catch (parseError) {
      result.success = false
      result.error = `Invalid JSON response: ${parseError instanceof Error ? parseError.message : "Parse error"}`
      console.log(`❌ JSON parse failed: ${result.error}`)
      return NextResponse.json(result)
    }
  } catch (error) {
    result.responseTime = Date.now() - startTime
    result.success = false
    result.error = error instanceof Error ? error.message : "Unknown error"

    console.log(`❌ Force live data test failed: ${result.error}`)
    return NextResponse.json(result, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  // Handle POST requests for testing different HTTP methods
  const body = await request.json()
  const { shopId = "22732326", endpoint = "products", payload } = body

  console.log(`🚀 Force live data POST test for shop ${shopId}, endpoint: ${endpoint}`)

  const startTime = Date.now()
  const result: ForceLiveDataResult = {
    success: false,
    shopId,
    timestamp: new Date().toISOString(),
    method: "POST",
    responseTime: 0,
    headers: {},
    rawResponse: "",
  }

  try {
    const apiKey = process.env.PRINTIFY_API_TOKEN

    if (!apiKey) {
      result.error = "PRINTIFY_API_TOKEN environment variable is missing"
      result.responseTime = Date.now() - startTime
      return NextResponse.json(result, { status: 400 })
    }

    // This is primarily for testing - most Printify endpoints are GET
    const apiUrl = `${PRINTIFY_API_BASE}/shops/${shopId}/products.json`

    const headers = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": "NoTrumpNWay-ForceLive/1.0",
    }

    const response = await fetch(apiUrl, {
      method: "GET", // Force GET even for POST test
      headers,
    })

    const responseText = await response.text()
    const responseHeaders = Object.fromEntries(response.headers.entries())

    result.responseTime = Date.now() - startTime
    result.httpStatus = response.status
    result.headers = responseHeaders
    result.rawResponse = responseText

    if (response.ok) {
      const data = JSON.parse(responseText)
      result.success = true
      result.data = data
    } else {
      result.success = false
      result.error = `HTTP ${response.status}: ${response.statusText}`
    }

    return NextResponse.json(result)
  } catch (error) {
    result.responseTime = Date.now() - startTime
    result.success = false
    result.error = error instanceof Error ? error.message : "Unknown error"

    console.log(`❌ Force live data POST test failed: ${result.error}`)
    return NextResponse.json(result, { status: 500 })
  }
}
