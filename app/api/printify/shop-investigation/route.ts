import { type NextRequest, NextResponse } from "next/server"

const PRINTIFY_API_BASE = "https://api.printify.com/v1"
const API_TIMEOUT = 15000

interface TestResult {
  status: "pass" | "fail" | "warning" | "pending"
  message: string
  details?: any
  duration?: number
  httpStatus?: number
  errorCode?: string
  rawResponse?: any
}

interface InvestigationResult {
  shopId: string
  timestamp: string
  tests: {
    apiCredentials: TestResult
    shopAccess: TestResult
    shopDetails: TestResult
    productsAccess: TestResult
    imagesAccess: TestResult
    permissionsCheck: TestResult
    rateLimitCheck: TestResult
    dataConsistency: TestResult
    endpointValidation: TestResult
    authenticationFlow: TestResult
    cacheAnalysis: TestResult
    networkConnectivity: TestResult
  }
  shopData?: any
  productsData?: any
  errors: string[]
  recommendations: string[]
  summary: {
    overallStatus: "success" | "partial" | "failure"
    criticalIssues: number
    warningIssues: number
    dataRetrievalScore: number
  }
  diagnostics: {
    apiEndpoint: string
    requestHeaders: Record<string, string>
    environmentVariables: Record<string, boolean>
    networkLatency: number
    cacheStatus: string
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const shopId = searchParams.get("shopId") || "22732326"

  console.log(`🔍 Starting comprehensive investigation for shop ID: ${shopId}`)

  const startTime = Date.now()
  const result: InvestigationResult = {
    shopId,
    timestamp: new Date().toISOString(),
    tests: {} as any,
    errors: [],
    recommendations: [],
    summary: {
      overallStatus: "failure",
      criticalIssues: 0,
      warningIssues: 0,
      dataRetrievalScore: 0,
    },
    diagnostics: {
      apiEndpoint: PRINTIFY_API_BASE,
      requestHeaders: {},
      environmentVariables: {},
      networkLatency: 0,
      cacheStatus: "unknown",
    },
  }

  try {
    // Test 1: API Credentials Validation
    console.log("🔐 Testing API credentials...")
    result.tests.apiCredentials = await testApiCredentials()

    // Test 2: Network Connectivity
    console.log("🌐 Testing network connectivity...")
    result.tests.networkConnectivity = await testNetworkConnectivity()

    // Test 3: Endpoint Validation
    console.log("🔗 Validating API endpoints...")
    result.tests.endpointValidation = await testEndpointValidation()

    // Test 4: Authentication Flow
    console.log("🔑 Testing authentication flow...")
    result.tests.authenticationFlow = await testAuthenticationFlow()

    // Test 5: Shop Access
    console.log("🏪 Testing shop access...")
    result.tests.shopAccess = await testShopAccess(shopId)

    // Test 6: Shop Details
    console.log("📋 Fetching shop details...")
    result.tests.shopDetails = await testShopDetails(shopId)

    // Test 7: Products Access
    console.log("📦 Testing products access...")
    result.tests.productsAccess = await testProductsAccess(shopId)

    // Test 8: Images Access
    console.log("🖼️ Testing images access...")
    result.tests.imagesAccess = await testImagesAccess(shopId)

    // Test 9: Permissions Check
    console.log("🛡️ Checking permissions...")
    result.tests.permissionsCheck = await testPermissions(shopId)

    // Test 10: Rate Limit Check
    console.log("⚡ Checking rate limits...")
    result.tests.rateLimitCheck = await testRateLimits()

    // Test 11: Cache Analysis
    console.log("💾 Analyzing cache behavior...")
    result.tests.cacheAnalysis = await testCacheAnalysis()

    // Test 12: Data Consistency
    console.log("🔄 Testing data consistency...")
    result.tests.dataConsistency = await testDataConsistency(shopId)

    // Collect shop data if available
    if (result.tests.shopDetails.status === "pass") {
      result.shopData = result.tests.shopDetails.details
    }

    if (result.tests.productsAccess.status === "pass") {
      result.productsData = result.tests.productsAccess.details
    }

    // Calculate summary
    const testResults = Object.values(result.tests)
    const passedTests = testResults.filter((t) => t.status === "pass").length
    const failedTests = testResults.filter((t) => t.status === "fail").length
    const warningTests = testResults.filter((t) => t.status === "warning").length

    result.summary.criticalIssues = failedTests
    result.summary.warningIssues = warningTests
    result.summary.dataRetrievalScore = Math.round((passedTests / testResults.length) * 100)

    if (result.summary.dataRetrievalScore >= 80) {
      result.summary.overallStatus = "success"
    } else if (result.summary.dataRetrievalScore >= 50) {
      result.summary.overallStatus = "partial"
    } else {
      result.summary.overallStatus = "failure"
    }

    // Generate errors and recommendations
    generateErrorsAndRecommendations(result)

    // Set diagnostics
    result.diagnostics.networkLatency = Date.now() - startTime
    result.diagnostics.requestHeaders = getRequestHeaders()
    result.diagnostics.environmentVariables = getEnvironmentStatus()
    result.diagnostics.cacheStatus = result.tests.cacheAnalysis.details?.status || "unknown"

    console.log(`✅ Investigation completed in ${result.diagnostics.networkLatency}ms`)
    console.log(`📊 Overall status: ${result.summary.overallStatus}`)
    console.log(`🎯 Data retrieval score: ${result.summary.dataRetrievalScore}%`)

    return NextResponse.json(result)
  } catch (error) {
    console.error("❌ Investigation failed:", error)

    result.errors.push(`Investigation failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    result.summary.overallStatus = "failure"
    result.diagnostics.networkLatency = Date.now() - startTime

    return NextResponse.json(result, { status: 500 })
  }
}

async function testApiCredentials(): Promise<TestResult> {
  const startTime = Date.now()

  try {
    const apiKey = process.env.PRINTIFY_API_TOKEN
    const shopId = process.env.PRINTIFY_SHOP_ID

    if (!apiKey) {
      return {
        status: "fail",
        message: "PRINTIFY_API_TOKEN environment variable is missing",
        duration: Date.now() - startTime,
        details: {
          hasApiKey: false,
          hasShopId: !!shopId,
          apiKeyLength: 0,
          shopIdValue: shopId || "undefined",
        },
      }
    }

    if (apiKey.length < 10) {
      return {
        status: "fail",
        message: "PRINTIFY_API_TOKEN appears to be invalid (too short)",
        duration: Date.now() - startTime,
        details: {
          hasApiKey: true,
          hasShopId: !!shopId,
          apiKeyLength: apiKey.length,
          shopIdValue: shopId || "undefined",
        },
      }
    }

    return {
      status: "pass",
      message: "API credentials are present and appear valid",
      duration: Date.now() - startTime,
      details: {
        hasApiKey: true,
        hasShopId: !!shopId,
        apiKeyLength: apiKey.length,
        apiKeyPrefix: apiKey.substring(0, 8) + "...",
        shopIdValue: shopId || "undefined",
      },
    }
  } catch (error) {
    return {
      status: "fail",
      message: `Credentials test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      duration: Date.now() - startTime,
    }
  }
}

async function testNetworkConnectivity(): Promise<TestResult> {
  const startTime = Date.now()

  try {
    // Test basic connectivity to Printify API
    const response = await fetchWithTimeout(
      `${PRINTIFY_API_BASE}/shops.json`,
      {
        method: "HEAD",
        headers: {
          "User-Agent": "NoTrumpNWay-Diagnostic/1.0",
        },
      },
      5000,
    )

    return {
      status: response.ok ? "pass" : "warning",
      message: response.ok
        ? "Network connectivity to Printify API is working"
        : `Network connectivity issue: HTTP ${response.status}`,
      duration: Date.now() - startTime,
      httpStatus: response.status,
      details: {
        endpoint: `${PRINTIFY_API_BASE}/shops.json`,
        method: "HEAD",
        responseHeaders: Object.fromEntries(response.headers.entries()),
      },
    }
  } catch (error) {
    return {
      status: "fail",
      message: `Network connectivity failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      duration: Date.now() - startTime,
      details: {
        endpoint: `${PRINTIFY_API_BASE}/shops.json`,
        error: error instanceof Error ? error.message : "Unknown error",
      },
    }
  }
}

async function testEndpointValidation(): Promise<TestResult> {
  const startTime = Date.now()

  try {
    const endpoints = ["/shops.json", "/catalog/blueprints.json", "/catalog/print_providers.json"]

    const results = []

    for (const endpoint of endpoints) {
      try {
        const response = await fetchWithTimeout(
          `${PRINTIFY_API_BASE}${endpoint}`,
          {
            method: "HEAD",
            headers: {
              "User-Agent": "NoTrumpNWay-Diagnostic/1.0",
            },
          },
          3000,
        )

        results.push({
          endpoint,
          status: response.status,
          ok: response.ok,
        })
      } catch (error) {
        results.push({
          endpoint,
          status: 0,
          ok: false,
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    const workingEndpoints = results.filter((r) => r.ok).length
    const totalEndpoints = results.length

    return {
      status: workingEndpoints === totalEndpoints ? "pass" : workingEndpoints > 0 ? "warning" : "fail",
      message: `${workingEndpoints}/${totalEndpoints} API endpoints are accessible`,
      duration: Date.now() - startTime,
      details: {
        endpoints: results,
        workingCount: workingEndpoints,
        totalCount: totalEndpoints,
      },
    }
  } catch (error) {
    return {
      status: "fail",
      message: `Endpoint validation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      duration: Date.now() - startTime,
    }
  }
}

async function testAuthenticationFlow(): Promise<TestResult> {
  const startTime = Date.now()

  try {
    const apiKey = process.env.PRINTIFY_API_TOKEN

    if (!apiKey) {
      return {
        status: "fail",
        message: "Cannot test authentication - API key missing",
        duration: Date.now() - startTime,
      }
    }

    // Test authentication with a simple API call
    const response = await fetchWithTimeout(
      `${PRINTIFY_API_BASE}/shops.json`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "User-Agent": "NoTrumpNWay-Diagnostic/1.0",
        },
      },
      10000,
    )

    const responseText = await response.text()
    let responseData = null

    try {
      responseData = JSON.parse(responseText)
    } catch {
      // Response is not JSON
    }

    if (response.status === 401) {
      return {
        status: "fail",
        message: "Authentication failed - Invalid API token",
        duration: Date.now() - startTime,
        httpStatus: response.status,
        details: {
          responseText: responseText.substring(0, 500),
          responseHeaders: Object.fromEntries(response.headers.entries()),
        },
      }
    }

    if (response.status === 403) {
      return {
        status: "fail",
        message: "Authentication failed - Insufficient permissions",
        duration: Date.now() - startTime,
        httpStatus: response.status,
        details: {
          responseText: responseText.substring(0, 500),
          responseHeaders: Object.fromEntries(response.headers.entries()),
        },
      }
    }

    if (!response.ok) {
      return {
        status: "warning",
        message: `Authentication test returned HTTP ${response.status}`,
        duration: Date.now() - startTime,
        httpStatus: response.status,
        details: {
          responseText: responseText.substring(0, 500),
          responseHeaders: Object.fromEntries(response.headers.entries()),
        },
      }
    }

    return {
      status: "pass",
      message: "Authentication successful",
      duration: Date.now() - startTime,
      httpStatus: response.status,
      details: {
        shopsFound: Array.isArray(responseData) ? responseData.length : "unknown",
        responseHeaders: Object.fromEntries(response.headers.entries()),
        responseSize: responseText.length,
      },
    }
  } catch (error) {
    return {
      status: "fail",
      message: `Authentication test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      duration: Date.now() - startTime,
    }
  }
}

async function testShopAccess(shopId: string): Promise<TestResult> {
  const startTime = Date.now()

  try {
    const apiKey = process.env.PRINTIFY_API_TOKEN

    if (!apiKey) {
      return {
        status: "fail",
        message: "Cannot test shop access - API key missing",
        duration: Date.now() - startTime,
      }
    }

    const response = await fetchWithTimeout(
      `${PRINTIFY_API_BASE}/shops/${shopId}.json`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "User-Agent": "NoTrumpNWay-Diagnostic/1.0",
        },
      },
      10000,
    )

    const responseText = await response.text()
    let responseData = null

    try {
      responseData = JSON.parse(responseText)
    } catch {
      // Response is not JSON
    }

    if (response.status === 404) {
      return {
        status: "fail",
        message: `Shop ID ${shopId} not found`,
        duration: Date.now() - startTime,
        httpStatus: response.status,
        details: {
          shopId,
          responseText: responseText.substring(0, 500),
          responseHeaders: Object.fromEntries(response.headers.entries()),
        },
      }
    }

    if (response.status === 403) {
      return {
        status: "fail",
        message: `Access denied to shop ID ${shopId}`,
        duration: Date.now() - startTime,
        httpStatus: response.status,
        details: {
          shopId,
          responseText: responseText.substring(0, 500),
          responseHeaders: Object.fromEntries(response.headers.entries()),
        },
      }
    }

    if (!response.ok) {
      return {
        status: "fail",
        message: `Shop access failed: HTTP ${response.status}`,
        duration: Date.now() - startTime,
        httpStatus: response.status,
        details: {
          shopId,
          responseText: responseText.substring(0, 500),
          responseHeaders: Object.fromEntries(response.headers.entries()),
        },
      }
    }

    return {
      status: "pass",
      message: `Shop ID ${shopId} is accessible`,
      duration: Date.now() - startTime,
      httpStatus: response.status,
      details: {
        shopId,
        shopData: responseData,
        responseHeaders: Object.fromEntries(response.headers.entries()),
      },
    }
  } catch (error) {
    return {
      status: "fail",
      message: `Shop access test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      duration: Date.now() - startTime,
      details: {
        shopId,
        error: error instanceof Error ? error.message : "Unknown error",
      },
    }
  }
}

async function testShopDetails(shopId: string): Promise<TestResult> {
  const startTime = Date.now()

  try {
    const apiKey = process.env.PRINTIFY_API_TOKEN

    if (!apiKey) {
      return {
        status: "fail",
        message: "Cannot fetch shop details - API key missing",
        duration: Date.now() - startTime,
      }
    }

    const response = await fetchWithTimeout(
      `${PRINTIFY_API_BASE}/shops/${shopId}.json`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "User-Agent": "NoTrumpNWay-Diagnostic/1.0",
        },
      },
      10000,
    )

    if (!response.ok) {
      return {
        status: "fail",
        message: `Failed to fetch shop details: HTTP ${response.status}`,
        duration: Date.now() - startTime,
        httpStatus: response.status,
      }
    }

    const shopData = await response.json()

    return {
      status: "pass",
      message: `Shop details retrieved successfully`,
      duration: Date.now() - startTime,
      httpStatus: response.status,
      details: shopData,
    }
  } catch (error) {
    return {
      status: "fail",
      message: `Shop details test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      duration: Date.now() - startTime,
    }
  }
}

async function testProductsAccess(shopId: string): Promise<TestResult> {
  const startTime = Date.now()

  try {
    const apiKey = process.env.PRINTIFY_API_TOKEN

    if (!apiKey) {
      return {
        status: "fail",
        message: "Cannot test products access - API key missing",
        duration: Date.now() - startTime,
      }
    }

    const response = await fetchWithTimeout(
      `${PRINTIFY_API_BASE}/shops/${shopId}/products.json`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "User-Agent": "NoTrumpNWay-Diagnostic/1.0",
        },
      },
      15000,
    )

    const responseText = await response.text()
    let responseData = null

    try {
      responseData = JSON.parse(responseText)
    } catch {
      // Response is not JSON
    }

    if (!response.ok) {
      return {
        status: "fail",
        message: `Products access failed: HTTP ${response.status}`,
        duration: Date.now() - startTime,
        httpStatus: response.status,
        details: {
          responseText: responseText.substring(0, 1000),
          responseHeaders: Object.fromEntries(response.headers.entries()),
        },
      }
    }

    const productsCount = responseData?.data?.length || 0

    return {
      status: productsCount > 0 ? "pass" : "warning",
      message: `Products access successful - ${productsCount} products found`,
      duration: Date.now() - startTime,
      httpStatus: response.status,
      details: {
        productsCount,
        productsData: responseData,
        responseHeaders: Object.fromEntries(response.headers.entries()),
      },
    }
  } catch (error) {
    return {
      status: "fail",
      message: `Products access test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      duration: Date.now() - startTime,
    }
  }
}

async function testImagesAccess(shopId: string): Promise<TestResult> {
  const startTime = Date.now()

  try {
    const apiKey = process.env.PRINTIFY_API_TOKEN

    if (!apiKey) {
      return {
        status: "fail",
        message: "Cannot test images access - API key missing",
        duration: Date.now() - startTime,
      }
    }

    // First get products to find images
    const productsResponse = await fetchWithTimeout(
      `${PRINTIFY_API_BASE}/shops/${shopId}/products.json?limit=5`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "User-Agent": "NoTrumpNWay-Diagnostic/1.0",
        },
      },
      10000,
    )

    if (!productsResponse.ok) {
      return {
        status: "warning",
        message: "Cannot test images - products not accessible",
        duration: Date.now() - startTime,
      }
    }

    const productsData = await productsResponse.json()
    const products = productsData.data || []

    if (products.length === 0) {
      return {
        status: "warning",
        message: "No products found to test image access",
        duration: Date.now() - startTime,
      }
    }

    // Test image accessibility
    const imageTests = []
    for (const product of products.slice(0, 3)) {
      if (product.images && product.images.length > 0) {
        const image = product.images[0]
        try {
          const imageResponse = await fetchWithTimeout(image.src, { method: "HEAD" }, 5000)
          imageTests.push({
            productId: product.id,
            imageUrl: image.src,
            accessible: imageResponse.ok,
            status: imageResponse.status,
          })
        } catch (error) {
          imageTests.push({
            productId: product.id,
            imageUrl: image.src,
            accessible: false,
            error: error instanceof Error ? error.message : "Unknown error",
          })
        }
      }
    }

    const accessibleImages = imageTests.filter((t) => t.accessible).length
    const totalImages = imageTests.length

    return {
      status: accessibleImages === totalImages ? "pass" : accessibleImages > 0 ? "warning" : "fail",
      message: `${accessibleImages}/${totalImages} product images are accessible`,
      duration: Date.now() - startTime,
      details: {
        imageTests,
        accessibleCount: accessibleImages,
        totalCount: totalImages,
      },
    }
  } catch (error) {
    return {
      status: "fail",
      message: `Images access test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      duration: Date.now() - startTime,
    }
  }
}

async function testPermissions(shopId: string): Promise<TestResult> {
  const startTime = Date.now()

  try {
    const apiKey = process.env.PRINTIFY_API_TOKEN

    if (!apiKey) {
      return {
        status: "fail",
        message: "Cannot test permissions - API key missing",
        duration: Date.now() - startTime,
      }
    }

    const permissionTests = []

    // Test various endpoints to check permissions
    const endpoints = [
      { path: `/shops/${shopId}.json`, name: "Shop Details" },
      { path: `/shops/${shopId}/products.json`, name: "Products" },
      { path: `/shops.json`, name: "Shops List" },
      { path: `/catalog/blueprints.json`, name: "Catalog" },
    ]

    for (const endpoint of endpoints) {
      try {
        const response = await fetchWithTimeout(
          `${PRINTIFY_API_BASE}${endpoint.path}`,
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
              "User-Agent": "NoTrumpNWay-Diagnostic/1.0",
            },
          },
          5000,
        )

        permissionTests.push({
          endpoint: endpoint.name,
          path: endpoint.path,
          status: response.status,
          accessible: response.ok,
          forbidden: response.status === 403,
          unauthorized: response.status === 401,
        })
      } catch (error) {
        permissionTests.push({
          endpoint: endpoint.name,
          path: endpoint.path,
          status: 0,
          accessible: false,
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    const accessibleEndpoints = permissionTests.filter((t) => t.accessible).length
    const forbiddenEndpoints = permissionTests.filter((t) => t.forbidden).length
    const unauthorizedEndpoints = permissionTests.filter((t) => t.unauthorized).length

    let status: "pass" | "fail" | "warning" = "pass"
    let message = `${accessibleEndpoints}/${permissionTests.length} endpoints accessible`

    if (unauthorizedEndpoints > 0) {
      status = "fail"
      message = `Authentication failed on ${unauthorizedEndpoints} endpoints`
    } else if (forbiddenEndpoints > 0) {
      status = "fail"
      message = `Access forbidden on ${forbiddenEndpoints} endpoints`
    } else if (accessibleEndpoints < permissionTests.length) {
      status = "warning"
      message = `${permissionTests.length - accessibleEndpoints} endpoints not accessible`
    }

    return {
      status,
      message,
      duration: Date.now() - startTime,
      details: {
        permissionTests,
        accessibleCount: accessibleEndpoints,
        forbiddenCount: forbiddenEndpoints,
        unauthorizedCount: unauthorizedEndpoints,
        totalCount: permissionTests.length,
      },
    }
  } catch (error) {
    return {
      status: "fail",
      message: `Permissions test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      duration: Date.now() - startTime,
    }
  }
}

async function testRateLimits(): Promise<TestResult> {
  const startTime = Date.now()

  try {
    const apiKey = process.env.PRINTIFY_API_TOKEN

    if (!apiKey) {
      return {
        status: "fail",
        message: "Cannot test rate limits - API key missing",
        duration: Date.now() - startTime,
      }
    }

    // Make a few rapid requests to test rate limiting
    const requests = []
    for (let i = 0; i < 3; i++) {
      requests.push(
        fetchWithTimeout(
          `${PRINTIFY_API_BASE}/shops.json`,
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
              "User-Agent": "NoTrumpNWay-Diagnostic/1.0",
            },
          },
          5000,
        ),
      )
    }

    const responses = await Promise.allSettled(requests)
    const rateLimitHeaders = []
    let rateLimited = false

    for (const response of responses) {
      if (response.status === "fulfilled") {
        const headers = Object.fromEntries(response.value.headers.entries())
        rateLimitHeaders.push({
          status: response.value.status,
          rateLimitRemaining: headers["x-ratelimit-remaining"],
          rateLimitLimit: headers["x-ratelimit-limit"],
          rateLimitReset: headers["x-ratelimit-reset"],
        })

        if (response.value.status === 429) {
          rateLimited = true
        }
      }
    }

    return {
      status: rateLimited ? "warning" : "pass",
      message: rateLimited ? "Rate limiting detected" : "No rate limiting issues detected",
      duration: Date.now() - startTime,
      details: {
        requestCount: requests.length,
        responses: rateLimitHeaders,
        rateLimited,
      },
    }
  } catch (error) {
    return {
      status: "fail",
      message: `Rate limit test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      duration: Date.now() - startTime,
    }
  }
}

async function testCacheAnalysis(): Promise<TestResult> {
  const startTime = Date.now()

  try {
    // Analyze cache headers and behavior
    const apiKey = process.env.PRINTIFY_API_TOKEN

    if (!apiKey) {
      return {
        status: "warning",
        message: "Cannot analyze cache - API key missing",
        duration: Date.now() - startTime,
      }
    }

    const response = await fetchWithTimeout(
      `${PRINTIFY_API_BASE}/shops.json`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "User-Agent": "NoTrumpNWay-Diagnostic/1.0",
          "Cache-Control": "no-cache",
        },
      },
      5000,
    )

    const headers = Object.fromEntries(response.headers.entries())

    const cacheAnalysis = {
      cacheControl: headers["cache-control"],
      etag: headers["etag"],
      lastModified: headers["last-modified"],
      expires: headers["expires"],
      age: headers["age"],
      vary: headers["vary"],
      hasCacheHeaders: !!(headers["cache-control"] || headers["etag"] || headers["last-modified"]),
    }

    return {
      status: "pass",
      message: "Cache analysis completed",
      duration: Date.now() - startTime,
      details: {
        status: cacheAnalysis.hasCacheHeaders ? "cache-enabled" : "no-cache",
        headers: cacheAnalysis,
        responseHeaders: headers,
      },
    }
  } catch (error) {
    return {
      status: "warning",
      message: `Cache analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      duration: Date.now() - startTime,
    }
  }
}

async function testDataConsistency(shopId: string): Promise<TestResult> {
  const startTime = Date.now()

  try {
    const apiKey = process.env.PRINTIFY_API_TOKEN

    if (!apiKey) {
      return {
        status: "fail",
        message: "Cannot test data consistency - API key missing",
        duration: Date.now() - startTime,
      }
    }

    // Make multiple requests to check for consistency
    const requests = []
    for (let i = 0; i < 2; i++) {
      requests.push(
        fetchWithTimeout(
          `${PRINTIFY_API_BASE}/shops/${shopId}/products.json`,
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
              "User-Agent": "NoTrumpNWay-Diagnostic/1.0",
              "Cache-Control": "no-cache",
            },
          },
          10000,
        ),
      )
    }

    const responses = await Promise.allSettled(requests)
    const successfulResponses = responses.filter((r) => r.status === "fulfilled" && r.value.ok)

    if (successfulResponses.length < 2) {
      return {
        status: "warning",
        message: "Insufficient responses for consistency check",
        duration: Date.now() - startTime,
        details: {
          successfulRequests: successfulResponses.length,
          totalRequests: requests.length,
        },
      }
    }

    // Compare response data
    const data1 = await (successfulResponses[0] as any).value.json()
    const data2 = await (successfulResponses[1] as any).value.json()

    const consistent = JSON.stringify(data1) === JSON.stringify(data2)

    return {
      status: consistent ? "pass" : "warning",
      message: consistent ? "Data is consistent across requests" : "Data inconsistency detected",
      duration: Date.now() - startTime,
      details: {
        consistent,
        request1ProductCount: data1.data?.length || 0,
        request2ProductCount: data2.data?.length || 0,
        request1Total: data1.total || 0,
        request2Total: data2.total || 0,
      },
    }
  } catch (error) {
    return {
      status: "fail",
      message: `Data consistency test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      duration: Date.now() - startTime,
    }
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

function getRequestHeaders(): Record<string, string> {
  const apiKey = process.env.PRINTIFY_API_TOKEN

  return {
    Authorization: apiKey ? `Bearer ${apiKey.substring(0, 8)}...` : "Missing",
    "Content-Type": "application/json",
    "User-Agent": "NoTrumpNWay-Diagnostic/1.0",
  }
}

function getEnvironmentStatus(): Record<string, boolean> {
  return {
    PRINTIFY_API_TOKEN: !!process.env.PRINTIFY_API_TOKEN,
    PRINTIFY_SHOP_ID: !!process.env.PRINTIFY_SHOP_ID,
    NODE_ENV: !!process.env.NODE_ENV,
    VERCEL: !!process.env.VERCEL,
  }
}

function generateErrorsAndRecommendations(result: InvestigationResult) {
  const tests = result.tests

  // Generate errors
  if (tests.apiCredentials.status === "fail") {
    result.errors.push("API credentials are missing or invalid")
  }

  if (tests.authenticationFlow.status === "fail") {
    result.errors.push("Authentication with Printify API failed")
  }

  if (tests.shopAccess.status === "fail") {
    result.errors.push(`Shop ID ${result.shopId} is not accessible`)
  }

  if (tests.productsAccess.status === "fail") {
    result.errors.push("Unable to retrieve products from the shop")
  }

  if (tests.networkConnectivity.status === "fail") {
    result.errors.push("Network connectivity to Printify API is failing")
  }

  // Generate recommendations
  if (tests.apiCredentials.status === "fail") {
    result.recommendations.push("Verify PRINTIFY_API_TOKEN environment variable is set correctly")
    result.recommendations.push("Regenerate API token in Printify dashboard if necessary")
  }

  if (tests.shopAccess.status === "fail") {
    result.recommendations.push(`Verify shop ID ${result.shopId} exists in your Printify account`)
    result.recommendations.push("Check if the API token has access to this specific shop")
    result.recommendations.push("Ensure the shop is active and not suspended")
  }

  if (tests.productsAccess.status === "fail") {
    result.recommendations.push("Check if the shop has published products")
    result.recommendations.push("Verify product visibility settings in Printify dashboard")
  }

  if (tests.permissionsCheck.status === "fail") {
    result.recommendations.push("Review API token permissions in Printify dashboard")
    result.recommendations.push("Ensure token has read access to shops and products")
  }

  if (tests.rateLimitCheck.status === "warning") {
    result.recommendations.push("Implement rate limiting in your application")
    result.recommendations.push("Add retry logic with exponential backoff")
  }

  if (tests.dataConsistency.status === "warning") {
    result.recommendations.push("Implement caching to reduce API calls")
    result.recommendations.push("Add data validation and error handling")
  }
}
