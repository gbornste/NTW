import { type NextRequest, NextResponse } from "next/server"

const PRINTIFY_API_BASE = "https://api.printify.com/v1"
const API_TIMEOUT = 15000

interface LiveDataTestResult {
  shopId: string
  timestamp: string
  forceRefresh: boolean
  tests: {
    environmentCheck: {
      hasApiKey: boolean
      hasShopId: boolean
      apiKeyLength: number
      apiKeyPrefix: string
      testShopId: string
      environmentVariables: Record<string, string>
    }
    directApiCall: {
      success: boolean
      status: number
      statusText: string
      responseTime: number
      responseSize: number
      error?: string
      headers: Record<string, string>
    }
    shopDataRetrieval: {
      success: boolean
      shopId: string
      shopTitle?: string
      salesChannel?: string
      status?: string
      error?: string
      httpStatus?: number
    }
    productsDataRetrieval: {
      success: boolean
      productsCount: number
      totalProducts: number
      currentPage: number
      lastPage: number
      error?: string
      httpStatus?: number
    }
    mockDataFallback: {
      mockProductsCount: number
      fallbackReason?: string
    }
  }
  analysis: {
    isUsingMockData: boolean
    reasonForMockData: string | null
    liveDataAvailable: boolean
    apiResponseTime: number
  }
  rawResponses: {
    shopResponse?: {
      status: number
      headers: Record<string, string>
      data: any
      rawText: string
    }
    productsResponse?: {
      status: number
      headers: Record<string, string>
      data: any
      rawText: string
    }
  }
  recommendations: string[]
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const shopId = searchParams.get("shopId") || "22732326"
  const forceRefresh = searchParams.get("forceRefresh") === "true"

  console.log(`🔍 Starting live data test for shop ID: ${shopId}`)
  console.log(`🔄 Force refresh: ${forceRefresh}`)

  const startTime = Date.now()
  const result: LiveDataTestResult = {
    shopId,
    timestamp: new Date().toISOString(),
    forceRefresh,
    tests: {} as any,
    analysis: {
      isUsingMockData: true,
      reasonForMockData: null,
      liveDataAvailable: false,
      apiResponseTime: 0,
    },
    rawResponses: {},
    recommendations: [],
  }

  try {
    // Test 1: Environment Check
    console.log("🔐 Testing environment variables...")
    result.tests.environmentCheck = await testEnvironmentVariables(shopId)

    // Test 2: Direct API Call
    console.log("🌐 Testing direct API connectivity...")
    result.tests.directApiCall = await testDirectApiCall()

    // Test 3: Shop Data Retrieval
    console.log("🏪 Testing shop data retrieval...")
    result.tests.shopDataRetrieval = await testShopDataRetrieval(shopId, forceRefresh)

    // Test 4: Products Data Retrieval
    console.log("📦 Testing products data retrieval...")
    result.tests.productsDataRetrieval = await testProductsDataRetrieval(shopId, forceRefresh)

    // Test 5: Mock Data Fallback Analysis
    console.log("🎭 Analyzing mock data fallback...")
    result.tests.mockDataFallback = await testMockDataFallback()

    // Analyze results
    result.analysis = analyzeTestResults(result.tests)
    result.analysis.apiResponseTime = Date.now() - startTime

    // Generate recommendations
    result.recommendations = generateRecommendations(result)

    console.log(`✅ Live data test completed in ${result.analysis.apiResponseTime}ms`)
    console.log(`📊 Using mock data: ${result.analysis.isUsingMockData}`)
    console.log(`🎯 Live data available: ${result.analysis.liveDataAvailable}`)

    return NextResponse.json(result)
  } catch (error) {
    console.error("❌ Live data test failed:", error)

    result.analysis.reasonForMockData = `Test failed: ${error instanceof Error ? error.message : "Unknown error"}`
    result.recommendations.push("Fix test execution errors before proceeding")

    return NextResponse.json(result, { status: 500 })
  }
}

async function testEnvironmentVariables(shopId: string) {
  const apiKey = process.env.PRINTIFY_API_TOKEN
  const envShopId = process.env.PRINTIFY_SHOP_ID

  return {
    hasApiKey: !!apiKey,
    hasShopId: !!envShopId,
    apiKeyLength: apiKey?.length || 0,
    apiKeyPrefix: apiKey ? `${apiKey.substring(0, 8)}...` : "N/A",
    testShopId: shopId,
    environmentVariables: {
      PRINTIFY_API_TOKEN: apiKey ? "SET" : "MISSING",
      PRINTIFY_SHOP_ID: envShopId || "NOT_SET",
      NODE_ENV: process.env.NODE_ENV || "unknown",
      VERCEL: process.env.VERCEL || "false",
    },
  }
}

async function testDirectApiCall() {
  const startTime = Date.now()

  try {
    const apiKey = process.env.PRINTIFY_API_TOKEN

    if (!apiKey) {
      return {
        success: false,
        status: 0,
        statusText: "No API Key",
        responseTime: Date.now() - startTime,
        responseSize: 0,
        error: "PRINTIFY_API_TOKEN environment variable is missing",
        headers: {},
      }
    }

    const response = await fetchWithTimeout(
      `${PRINTIFY_API_BASE}/shops.json`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "User-Agent": "NoTrumpNWay-LiveTest/1.0",
          "Cache-Control": "no-cache",
        },
      },
      10000,
    )

    const responseText = await response.text()
    const headers = Object.fromEntries(response.headers.entries())

    return {
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      responseTime: Date.now() - startTime,
      responseSize: responseText.length,
      error: response.ok ? undefined : `HTTP ${response.status}: ${response.statusText}`,
      headers,
    }
  } catch (error) {
    return {
      success: false,
      status: 0,
      statusText: "Network Error",
      responseTime: Date.now() - startTime,
      responseSize: 0,
      error: error instanceof Error ? error.message : "Unknown network error",
      headers: {},
    }
  }
}

async function testShopDataRetrieval(shopId: string, forceRefresh: boolean) {
  try {
    const apiKey = process.env.PRINTIFY_API_TOKEN

    if (!apiKey) {
      return {
        success: false,
        shopId,
        error: "API key missing",
      }
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": "NoTrumpNWay-LiveTest/1.0",
    }

    if (forceRefresh) {
      headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
      headers["Pragma"] = "no-cache"
      headers["Expires"] = "0"
    }

    const response = await fetchWithTimeout(`${PRINTIFY_API_BASE}/shops/${shopId}.json`, { headers }, 15000)

    const responseText = await response.text()
    let shopData = null

    try {
      shopData = JSON.parse(responseText)
    } catch {
      // Response is not JSON
    }

    // Store raw response for analysis
    const rawResponse = {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      data: shopData,
      rawText: responseText.substring(0, 1000), // First 1000 chars
    }

    // Add to global result for access in other functions
    ;(global as any).shopResponse = rawResponse

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`

      if (response.status === 404) {
        errorMessage = `Shop ID ${shopId} not found - shop may not exist or be accessible`
      } else if (response.status === 401) {
        errorMessage = "Authentication failed - invalid API token"
      } else if (response.status === 403) {
        errorMessage = `Access denied to shop ${shopId} - insufficient permissions`
      }

      return {
        success: false,
        shopId,
        error: errorMessage,
        httpStatus: response.status,
      }
    }

    return {
      success: true,
      shopId: shopData?.id?.toString() || shopId,
      shopTitle: shopData?.title || "Unknown",
      salesChannel: shopData?.sales_channel || "Unknown",
      status: shopData?.status || "Unknown",
    }
  } catch (error) {
    return {
      success: false,
      shopId,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

async function testProductsDataRetrieval(shopId: string, forceRefresh: boolean) {
  try {
    const apiKey = process.env.PRINTIFY_API_TOKEN

    if (!apiKey) {
      return {
        success: false,
        productsCount: 0,
        totalProducts: 0,
        currentPage: 0,
        lastPage: 0,
        error: "API key missing",
      }
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": "NoTrumpNWay-LiveTest/1.0",
    }

    if (forceRefresh) {
      headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
      headers["Pragma"] = "no-cache"
      headers["Expires"] = "0"
    }

    const response = await fetchWithTimeout(`${PRINTIFY_API_BASE}/shops/${shopId}/products.json`, { headers }, 15000)

    const responseText = await response.text()
    let productsData = null

    try {
      productsData = JSON.parse(responseText)
    } catch {
      // Response is not JSON
    }

    // Store raw response for analysis
    const rawResponse = {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      data: productsData,
      rawText: responseText.substring(0, 1000), // First 1000 chars
    }

    // Add to global result for access in other functions
    ;(global as any).productsResponse = rawResponse

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`

      if (response.status === 404) {
        errorMessage = `No products found in shop ${shopId} or shop doesn't exist`
      } else if (response.status === 401) {
        errorMessage = "Authentication failed when accessing products"
      } else if (response.status === 403) {
        errorMessage = `Access denied to products in shop ${shopId}`
      }

      return {
        success: false,
        productsCount: 0,
        totalProducts: 0,
        currentPage: 0,
        lastPage: 0,
        error: errorMessage,
        httpStatus: response.status,
      }
    }

    const products = productsData?.data || []

    return {
      success: true,
      productsCount: products.length,
      totalProducts: productsData?.total || products.length,
      currentPage: productsData?.current_page || 1,
      lastPage: productsData?.last_page || 1,
    }
  } catch (error) {
    return {
      success: false,
      productsCount: 0,
      totalProducts: 0,
      currentPage: 0,
      lastPage: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

async function testMockDataFallback() {
  // Simulate the mock data that would be returned
  const mockProducts = [
    { id: "mock-1", title: "Climate Change Sticker" },
    { id: "mock-2", title: "Anti-Trump T-Shirt" },
    { id: "mock-3", title: "Political Mug" },
    { id: "mock-4", title: "Blue Anti-Trump Hat" },
    { id: "mock-5", title: "Science Sticker" },
  ]

  return {
    mockProductsCount: mockProducts.length,
    fallbackReason: "Mock data is used when live API calls fail or return errors",
  }
}

function analyzeTestResults(tests: LiveDataTestResult["tests"]) {
  let isUsingMockData = true
  let reasonForMockData: string | null = null
  let liveDataAvailable = false

  // Check if live data is actually available
  if (tests.environmentCheck.hasApiKey && tests.directApiCall.success) {
    if (tests.shopDataRetrieval.success && tests.productsDataRetrieval.success) {
      isUsingMockData = false
      liveDataAvailable = true
      reasonForMockData = null
    } else {
      // Determine specific reason for mock data usage
      if (!tests.shopDataRetrieval.success) {
        reasonForMockData = `Shop access failed: ${tests.shopDataRetrieval.error}`
      } else if (!tests.productsDataRetrieval.success) {
        reasonForMockData = `Products access failed: ${tests.productsDataRetrieval.error}`
      }
    }
  } else {
    // API connectivity issues
    if (!tests.environmentCheck.hasApiKey) {
      reasonForMockData = "PRINTIFY_API_TOKEN environment variable is missing"
    } else if (!tests.directApiCall.success) {
      reasonForMockData = `API connectivity failed: ${tests.directApiCall.error}`
    }
  }

  return {
    isUsingMockData,
    reasonForMockData,
    liveDataAvailable,
    apiResponseTime: 0, // Will be set by caller
  }
}

function generateRecommendations(result: LiveDataTestResult): string[] {
  const recommendations: string[] = []
  const tests = result.tests

  // Environment issues
  if (!tests.environmentCheck.hasApiKey) {
    recommendations.push("Set PRINTIFY_API_TOKEN environment variable with a valid API token")
    recommendations.push("Generate a new API token in your Printify dashboard if needed")
  }

  // API connectivity issues
  if (!tests.directApiCall.success) {
    if (tests.directApiCall.status === 401) {
      recommendations.push("Regenerate your Printify API token - current token is invalid")
      recommendations.push("Verify the API token is correctly set in environment variables")
    } else if (tests.directApiCall.status === 0) {
      recommendations.push("Check network connectivity to Printify API")
      recommendations.push("Verify firewall settings allow outbound HTTPS connections")
    } else {
      recommendations.push(`Investigate HTTP ${tests.directApiCall.status} error from Printify API`)
    }
  }

  // Shop access issues
  if (!tests.shopDataRetrieval.success) {
    if (tests.shopDataRetrieval.httpStatus === 404) {
      recommendations.push(`Verify shop ID ${result.shopId} exists in your Printify account`)
      recommendations.push("Check if the shop is active and not suspended")
      recommendations.push("Try testing with a different shop ID (e.g., 22108081)")
    } else if (tests.shopDataRetrieval.httpStatus === 403) {
      recommendations.push("Ensure your API token has access to this specific shop")
      recommendations.push("Check shop permissions in your Printify dashboard")
    }
  }

  // Products access issues
  if (!tests.productsDataRetrieval.success && tests.shopDataRetrieval.success) {
    recommendations.push("Check if the shop has published products")
    recommendations.push("Verify product visibility settings in Printify dashboard")
    recommendations.push("Ensure API token has products:read permission")
  }

  // Application-level recommendations
  if (result.analysis.liveDataAvailable && result.analysis.isUsingMockData) {
    recommendations.push("Review application logic - live data is available but mock data is being used")
    recommendations.push("Check for hardcoded mock data conditions in the codebase")
    recommendations.push("Clear application cache and restart the development server")
  }

  // General recommendations
  recommendations.push("Use force refresh option to bypass any caching issues")
  recommendations.push("Monitor API response times and implement retry logic for failed requests")

  // Add raw response data to global for access in the page
  ;(global as any).rawResponses = {
    shopResponse: (global as any).shopResponse,
    productsResponse: (global as any).productsResponse,
  }

  result.rawResponses = (global as any).rawResponses || {}

  return recommendations
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
