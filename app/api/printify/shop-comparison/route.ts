import { type NextRequest, NextResponse } from "next/server"

const PRINTIFY_API_BASE = "https://api.printify.com/v1"

interface ShopComparisonResult {
  timestamp: string
  workingShop: {
    id: string
    accessible: boolean
    data?: any
    error?: string
  }
  targetShop: {
    id: string
    accessible: boolean
    data?: any
    error?: string
  }
  comparison: {
    bothAccessible: boolean
    differences: string[]
    similarities: string[]
    recommendations: string[]
  }
  analysis: {
    rootCause: string
    confidence: "high" | "medium" | "low"
    nextSteps: string[]
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const targetShopId = searchParams.get("targetShop") || "22732326"
  const workingShopId = searchParams.get("workingShop") || "22108081"

  console.log(`🔍 Comparing shops: ${workingShopId} (working) vs ${targetShopId} (target)`)

  const result: ShopComparisonResult = {
    timestamp: new Date().toISOString(),
    workingShop: { id: workingShopId, accessible: false },
    targetShop: { id: targetShopId, accessible: false },
    comparison: {
      bothAccessible: false,
      differences: [],
      similarities: [],
      recommendations: [],
    },
    analysis: {
      rootCause: "Unknown",
      confidence: "low",
      nextSteps: [],
    },
  }

  try {
    const apiKey = process.env.PRINTIFY_API_TOKEN

    if (!apiKey) {
      result.analysis.rootCause = "Missing API token"
      result.analysis.confidence = "high"
      result.analysis.nextSteps = ["Set PRINTIFY_API_TOKEN environment variable"]
      return NextResponse.json(result)
    }

    // Test working shop
    console.log(`🏪 Testing working shop: ${workingShopId}`)
    result.workingShop = await testShopAccess(workingShopId, apiKey)

    // Test target shop
    console.log(`🎯 Testing target shop: ${targetShopId}`)
    result.targetShop = await testShopAccess(targetShopId, apiKey)

    // Perform comparison
    result.comparison = compareShops(result.workingShop, result.targetShop)

    // Analyze results
    result.analysis = analyzeComparison(result)

    console.log(`✅ Shop comparison completed`)
    console.log(`📊 Working shop accessible: ${result.workingShop.accessible}`)
    console.log(`📊 Target shop accessible: ${result.targetShop.accessible}`)
    console.log(`🎯 Root cause: ${result.analysis.rootCause}`)

    return NextResponse.json(result)
  } catch (error) {
    console.error("❌ Shop comparison failed:", error)
    result.analysis.rootCause = `Comparison failed: ${error instanceof Error ? error.message : "Unknown error"}`
    return NextResponse.json(result, { status: 500 })
  }
}

async function testShopAccess(shopId: string, apiKey: string) {
  try {
    // Test shop details
    const shopResponse = await fetch(`${PRINTIFY_API_BASE}/shops/${shopId}.json`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "User-Agent": "NoTrumpNWay-Comparison/1.0",
      },
    })

    if (!shopResponse.ok) {
      return {
        id: shopId,
        accessible: false,
        error: `HTTP ${shopResponse.status}: ${shopResponse.statusText}`,
      }
    }

    const shopData = await shopResponse.json()

    // Test products access
    const productsResponse = await fetch(`${PRINTIFY_API_BASE}/shops/${shopId}/products.json?limit=5`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "User-Agent": "NoTrumpNWay-Comparison/1.0",
      },
    })

    let productsData = null
    if (productsResponse.ok) {
      productsData = await productsResponse.json()
    }

    return {
      id: shopId,
      accessible: true,
      data: {
        shop: shopData,
        products: productsData,
        shopStatus: shopData.status,
        shopTitle: shopData.title,
        salesChannel: shopData.sales_channel,
        productsCount: productsData?.data?.length || 0,
        totalProducts: productsData?.total || 0,
      },
    }
  } catch (error) {
    return {
      id: shopId,
      accessible: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

function compareShops(workingShop: any, targetShop: any) {
  const differences: string[] = []
  const similarities: string[] = []
  const recommendations: string[] = []

  const bothAccessible = workingShop.accessible && targetShop.accessible

  if (!workingShop.accessible && !targetShop.accessible) {
    differences.push("Both shops are inaccessible - API token issue likely")
    recommendations.push("Check API token validity and permissions")
  } else if (workingShop.accessible && !targetShop.accessible) {
    differences.push(`Working shop ${workingShop.id} is accessible, target shop ${targetShop.id} is not`)
    differences.push(`Target shop error: ${targetShop.error}`)
    recommendations.push(`Verify shop ID ${targetShop.id} exists in your Printify account`)
    recommendations.push("Check if target shop is active and not suspended")
  } else if (!workingShop.accessible && targetShop.accessible) {
    differences.push(`Target shop ${targetShop.id} is accessible, working shop ${workingShop.id} is not`)
    recommendations.push("Unexpected result - investigate working shop configuration")
  } else {
    // Both accessible - compare details
    similarities.push("Both shops are accessible with current API token")

    const workingData = workingShop.data
    const targetData = targetShop.data

    // Compare shop properties
    if (workingData.shopStatus !== targetData.shopStatus) {
      differences.push(`Shop status differs: ${workingData.shopStatus} vs ${targetData.shopStatus}`)
    } else {
      similarities.push(`Both shops have status: ${workingData.shopStatus}`)
    }

    if (workingData.salesChannel !== targetData.salesChannel) {
      differences.push(`Sales channel differs: ${workingData.salesChannel} vs ${targetData.salesChannel}`)
    } else {
      similarities.push(`Both shops use sales channel: ${workingData.salesChannel}`)
    }

    if (workingData.productsCount !== targetData.productsCount) {
      differences.push(`Product count differs: ${workingData.productsCount} vs ${targetData.productsCount}`)
      if (targetData.productsCount === 0) {
        recommendations.push("Target shop has no products - this may cause mock data fallback")
      }
    } else {
      similarities.push(`Both shops have ${workingData.productsCount} products`)
    }

    // Shop titles
    if (workingData.shopTitle !== targetData.shopTitle) {
      differences.push(`Shop titles differ: "${workingData.shopTitle}" vs "${targetData.shopTitle}"`)
    } else {
      similarities.push(`Both shops have title: "${workingData.shopTitle}"`)
    }
  }

  return {
    bothAccessible,
    differences,
    similarities,
    recommendations,
  }
}

function analyzeComparison(result: ShopComparisonResult) {
  let rootCause = "Unknown"
  let confidence: "high" | "medium" | "low" = "low"
  const nextSteps: string[] = []

  if (!result.workingShop.accessible && !result.targetShop.accessible) {
    rootCause = "API token is invalid or lacks permissions for both shops"
    confidence = "high"
    nextSteps.push("Regenerate API token in Printify dashboard")
    nextSteps.push("Verify token permissions include shop and product access")
  } else if (result.workingShop.accessible && !result.targetShop.accessible) {
    if (result.targetShop.error?.includes("404")) {
      rootCause = `Shop ID ${result.targetShop.id} does not exist or is not accessible`
      confidence = "high"
      nextSteps.push(`Verify shop ID ${result.targetShop.id} exists in your Printify account`)
      nextSteps.push("Check if the shop is active and published")
      nextSteps.push("Ensure the shop is not suspended or deleted")
    } else if (result.targetShop.error?.includes("403")) {
      rootCause = `API token lacks permissions for shop ${result.targetShop.id}`
      confidence = "high"
      nextSteps.push("Check shop-specific permissions in Printify dashboard")
      nextSteps.push("Ensure API token has access to this specific shop")
    } else {
      rootCause = `Target shop ${result.targetShop.id} has access issues: ${result.targetShop.error}`
      confidence = "medium"
      nextSteps.push("Investigate specific error returned by target shop")
    }
  } else if (result.comparison.bothAccessible) {
    // Both accessible but application still shows mock data
    const targetData = result.targetShop.data
    if (targetData.productsCount === 0) {
      rootCause = "Target shop exists but has no products, causing mock data fallback"
      confidence = "high"
      nextSteps.push("Add products to the target shop in Printify dashboard")
      nextSteps.push("Verify product visibility and publication status")
    } else {
      rootCause = "Both shops accessible - issue may be in application logic or caching"
      confidence = "medium"
      nextSteps.push("Review application code for mock data override conditions")
      nextSteps.push("Clear application cache and restart development server")
      nextSteps.push("Check for hardcoded shop ID references in the code")
    }
  }

  return {
    rootCause,
    confidence,
    nextSteps,
  }
}
