import { type NextRequest, NextResponse } from "next/server"

const PRINTIFY_API_BASE = "https://api.printify.com/v1"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const shopId = searchParams.get("shopId") || "22732326"

  console.log(`🔍 DIRECT API CONNECTIVITY TEST for Shop ID: ${shopId}`)
  console.log(`⏰ Test started at: ${new Date().toISOString()}`)

  const testResult = {
    shopId,
    timestamp: new Date().toISOString(),
    connectivity: {
      apiBaseReachable: false,
      authenticationValid: false,
      shopAccessible: false,
      productsAccessible: false,
    },
    apiResponses: {
      shopsListCall: null as any,
      specificShopCall: null as any,
      productsCall: null as any,
    },
    diagnostics: {
      apiKey: {
        present: false,
        length: 0,
        prefix: "",
        valid: false,
      },
      networkConnectivity: {
        reachable: false,
        responseTime: 0,
        error: null as string | null,
      },
      shopStatus: {
        exists: false,
        accessible: false,
        title: null as string | null,
        salesChannel: null as string | null,
        status: null as string | null,
        error: null as string | null,
      },
      productsStatus: {
        accessible: false,
        count: 0,
        total: 0,
        error: null as string | null,
      },
    },
    recommendations: [] as string[],
    rawData: {} as any,
  }

  try {
    // Step 1: Check API Key
    console.log("🔐 Step 1: Checking API credentials...")
    const apiKey = process.env.PRINTIFY_API_TOKEN

    testResult.diagnostics.apiKey = {
      present: !!apiKey,
      length: apiKey?.length || 0,
      prefix: apiKey ? `${apiKey.substring(0, 8)}...` : "N/A",
      valid: false, // Will be determined by API calls
    }

    if (!apiKey) {
      testResult.recommendations.push("❌ CRITICAL: PRINTIFY_API_TOKEN environment variable is missing")
      testResult.recommendations.push("🔧 ACTION: Set PRINTIFY_API_TOKEN in your environment variables")
      return NextResponse.json(testResult)
    }

    console.log(
      `✅ API key found: ${testResult.diagnostics.apiKey.prefix} (${testResult.diagnostics.apiKey.length} chars)`,
    )

    // Step 2: Test Basic API Connectivity
    console.log("🌐 Step 2: Testing basic API connectivity...")
    const connectivityStartTime = Date.now()

    try {
      const shopsResponse = await fetch(`${PRINTIFY_API_BASE}/shops.json`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "User-Agent": "NoTrumpNWay-DirectTest/1.0",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
        cache: "no-store",
      })

      const responseTime = Date.now() - connectivityStartTime
      const responseText = await shopsResponse.text()

      testResult.diagnostics.networkConnectivity = {
        reachable: shopsResponse.ok,
        responseTime,
        error: shopsResponse.ok ? null : `HTTP ${shopsResponse.status}: ${shopsResponse.statusText}`,
      }

      let shopsData = null
      try {
        shopsData = JSON.parse(responseText)
      } catch (parseError) {
        console.error("❌ Failed to parse shops response as JSON")
      }

      testResult.apiResponses.shopsListCall = {
        status: shopsResponse.status,
        statusText: shopsResponse.statusText,
        headers: Object.fromEntries(shopsResponse.headers.entries()),
        data: shopsData,
        rawText: responseText.substring(0, 500),
        responseTime,
      }

      if (shopsResponse.ok) {
        console.log(`✅ API connectivity successful (${responseTime}ms)`)
        testResult.connectivity.apiBaseReachable = true
        testResult.diagnostics.apiKey.valid = true

        if (Array.isArray(shopsData)) {
          console.log(`📊 Found ${shopsData.length} shops in account`)
          const targetShop = shopsData.find((shop) => shop.id.toString() === shopId)
          if (targetShop) {
            console.log(`🎯 Target shop ${shopId} found in shops list: "${targetShop.title}"`)
          } else {
            console.log(`⚠️ Target shop ${shopId} NOT found in shops list`)
            testResult.recommendations.push(`❌ Shop ID ${shopId} not found in your Printify account`)
            testResult.recommendations.push("🔧 ACTION: Verify the shop ID exists in your Printify dashboard")
          }
        }
      } else {
        console.log(`❌ API connectivity failed: HTTP ${shopsResponse.status}`)
        if (shopsResponse.status === 401) {
          testResult.recommendations.push("❌ CRITICAL: API token is invalid or expired")
          testResult.recommendations.push("🔧 ACTION: Generate a new API token in Printify dashboard")
        } else if (shopsResponse.status === 403) {
          testResult.recommendations.push("❌ CRITICAL: API token lacks required permissions")
          testResult.recommendations.push("🔧 ACTION: Ensure token has 'shops:read' permission")
        }
      }
    } catch (networkError) {
      console.error("❌ Network connectivity failed:", networkError)
      testResult.diagnostics.networkConnectivity = {
        reachable: false,
        responseTime: Date.now() - connectivityStartTime,
        error: networkError instanceof Error ? networkError.message : "Unknown network error",
      }
      testResult.recommendations.push("❌ CRITICAL: Cannot reach Printify API")
      testResult.recommendations.push("🔧 ACTION: Check internet connectivity and firewall settings")
    }

    // Step 3: Test Specific Shop Access
    if (testResult.connectivity.apiBaseReachable) {
      console.log(`🏪 Step 3: Testing access to specific shop ${shopId}...`)

      try {
        const shopResponse = await fetch(`${PRINTIFY_API_BASE}/shops/${shopId}.json`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "User-Agent": "NoTrumpNWay-DirectTest/1.0",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
          },
          cache: "no-store",
        })

        const shopResponseText = await shopResponse.text()
        let shopData = null

        try {
          shopData = JSON.parse(shopResponseText)
        } catch (parseError) {
          console.error("❌ Failed to parse shop response as JSON")
        }

        testResult.apiResponses.specificShopCall = {
          status: shopResponse.status,
          statusText: shopResponse.statusText,
          headers: Object.fromEntries(shopResponse.headers.entries()),
          data: shopData,
          rawText: shopResponseText.substring(0, 500),
        }

        if (shopResponse.ok && shopData) {
          console.log(`✅ Shop ${shopId} accessible: "${shopData.title}"`)
          testResult.connectivity.shopAccessible = true
          testResult.diagnostics.shopStatus = {
            exists: true,
            accessible: true,
            title: shopData.title,
            salesChannel: shopData.sales_channel,
            status: shopData.status,
            error: null,
          }
        } else {
          console.log(`❌ Shop ${shopId} not accessible: HTTP ${shopResponse.status}`)
          testResult.diagnostics.shopStatus = {
            exists: false,
            accessible: false,
            title: null,
            salesChannel: null,
            status: null,
            error: `HTTP ${shopResponse.status}: ${shopResponse.statusText}`,
          }

          if (shopResponse.status === 404) {
            testResult.recommendations.push(`❌ CRITICAL: Shop ID ${shopId} does not exist`)
            testResult.recommendations.push(
              "🔧 ACTION: Verify shop ID in Printify dashboard or use working shop 22108081",
            )
          } else if (shopResponse.status === 403) {
            testResult.recommendations.push(`❌ CRITICAL: Access denied to shop ${shopId}`)
            testResult.recommendations.push("🔧 ACTION: Check shop permissions for your API token")
          }
        }
      } catch (shopError) {
        console.error("❌ Shop access test failed:", shopError)
        testResult.diagnostics.shopStatus = {
          exists: false,
          accessible: false,
          title: null,
          salesChannel: null,
          status: null,
          error: shopError instanceof Error ? shopError.message : "Unknown error",
        }
      }
    }

    // Step 4: Test Products Access
    if (testResult.connectivity.shopAccessible) {
      console.log(`📦 Step 4: Testing products access for shop ${shopId}...`)

      try {
        const productsResponse = await fetch(`${PRINTIFY_API_BASE}/shops/${shopId}/products.json`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "User-Agent": "NoTrumpNWay-DirectTest/1.0",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
          },
          cache: "no-store",
        })

        const productsResponseText = await productsResponse.text()
        let productsData = null

        try {
          productsData = JSON.parse(productsResponseText)
        } catch (parseError) {
          console.error("❌ Failed to parse products response as JSON")
        }

        testResult.apiResponses.productsCall = {
          status: productsResponse.status,
          statusText: productsResponse.statusText,
          headers: Object.fromEntries(productsResponse.headers.entries()),
          data: productsData,
          rawText: productsResponseText.substring(0, 500),
        }

        if (productsResponse.ok && productsData) {
          const productsCount = productsData.data?.length || 0
          const totalProducts = productsData.total || 0

          console.log(`✅ Products accessible: ${productsCount} products found (${totalProducts} total)`)
          testResult.connectivity.productsAccessible = true
          testResult.diagnostics.productsStatus = {
            accessible: true,
            count: productsCount,
            total: totalProducts,
            error: null,
          }

          if (productsCount === 0) {
            testResult.recommendations.push(`⚠️ WARNING: Shop ${shopId} has no products`)
            testResult.recommendations.push("🔧 ACTION: Add products to the shop in Printify dashboard")
            testResult.recommendations.push("💡 INFO: Empty product catalog triggers mock data fallback")
          }
        } else {
          console.log(`❌ Products not accessible: HTTP ${productsResponse.status}`)
          testResult.diagnostics.productsStatus = {
            accessible: false,
            count: 0,
            total: 0,
            error: `HTTP ${productsResponse.status}: ${productsResponse.statusText}`,
          }

          if (productsResponse.status === 404) {
            testResult.recommendations.push(`❌ Products endpoint not found for shop ${shopId}`)
          } else if (productsResponse.status === 403) {
            testResult.recommendations.push(`❌ Access denied to products in shop ${shopId}`)
            testResult.recommendations.push("🔧 ACTION: Ensure API token has 'products:read' permission")
          }
        }
      } catch (productsError) {
        console.error("❌ Products access test failed:", productsError)
        testResult.diagnostics.productsStatus = {
          accessible: false,
          count: 0,
          total: 0,
          error: productsError instanceof Error ? productsError.message : "Unknown error",
        }
      }
    }

    // Final Analysis
    testResult.connectivity.authenticationValid = testResult.diagnostics.apiKey.valid

    // Store raw data for detailed analysis
    testResult.rawData = {
      environmentVariables: {
        PRINTIFY_API_TOKEN: apiKey ? "SET" : "MISSING",
        PRINTIFY_SHOP_ID: process.env.PRINTIFY_SHOP_ID || "NOT_SET",
        NODE_ENV: process.env.NODE_ENV || "unknown",
      },
      testConfiguration: {
        targetShopId: shopId,
        testTimestamp: testResult.timestamp,
        apiBaseUrl: PRINTIFY_API_BASE,
      },
    }

    // Generate final recommendations
    if (testResult.connectivity.productsAccessible && testResult.diagnostics.productsStatus.count > 0) {
      testResult.recommendations.unshift("✅ SUCCESS: Live data should be available for this shop")
      testResult.recommendations.push("🔧 ACTION: Check application logic for mock data override conditions")
      testResult.recommendations.push("🔧 ACTION: Clear application cache and restart development server")
    } else if (!testResult.connectivity.apiBaseReachable) {
      testResult.recommendations.unshift("❌ CRITICAL: Cannot connect to Printify API")
    } else if (!testResult.connectivity.shopAccessible) {
      testResult.recommendations.unshift(`❌ CRITICAL: Shop ${shopId} is not accessible`)
    } else if (!testResult.connectivity.productsAccessible) {
      testResult.recommendations.unshift(`❌ CRITICAL: Products in shop ${shopId} are not accessible`)
    }

    console.log(`🏁 Direct connectivity test completed`)
    console.log(
      `📊 Results: API=${testResult.connectivity.apiBaseReachable}, Shop=${testResult.connectivity.shopAccessible}, Products=${testResult.connectivity.productsAccessible}`,
    )

    return NextResponse.json(testResult)
  } catch (error) {
    console.error("❌ Direct connectivity test failed:", error)

    testResult.recommendations.push("❌ CRITICAL: Test execution failed")
    testResult.recommendations.push(`🔧 ERROR: ${error instanceof Error ? error.message : "Unknown error"}`)

    return NextResponse.json(testResult, { status: 500 })
  }
}
