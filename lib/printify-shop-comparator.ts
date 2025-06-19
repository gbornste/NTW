export interface ShopComparisonResult {
  shop1: {
    id: string
    accessible: boolean
    data?: any
    products?: any[]
    errors: string[]
  }
  shop2: {
    id: string
    accessible: boolean
    data?: any
    products?: any[]
    errors: string[]
  }
  comparison: {
    bothAccessible: boolean
    dataStructureSimilar: boolean
    productCountComparison: string
    differences: string[]
    recommendations: string[]
  }
  timestamp: string
}

export class PrintifyShopComparator {
  private apiKey: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.PRINTIFY_API_TOKEN || ""
  }

  async compareShops(shopId1: string, shopId2: string): Promise<ShopComparisonResult> {
    console.log(`🔍 Comparing shops ${shopId1} vs ${shopId2}`)

    const result: ShopComparisonResult = {
      shop1: {
        id: shopId1,
        accessible: false,
        errors: [],
      },
      shop2: {
        id: shopId2,
        accessible: false,
        errors: [],
      },
      comparison: {
        bothAccessible: false,
        dataStructureSimilar: false,
        productCountComparison: "",
        differences: [],
        recommendations: [],
      },
      timestamp: new Date().toISOString(),
    }

    // Test both shops in parallel
    const [shop1Result, shop2Result] = await Promise.all([this.testShop(shopId1), this.testShop(shopId2)])

    result.shop1 = shop1Result
    result.shop2 = shop2Result

    // Perform comparison analysis
    this.analyzeComparison(result)

    return result
  }

  private async testShop(shopId: string): Promise<{
    id: string
    accessible: boolean
    data?: any
    products?: any[]
    errors: string[]
  }> {
    const shopResult = {
      id: shopId,
      accessible: false,
      errors: [] as string[],
    }

    try {
      // Test shop access
      const shopResponse = await this.makeRequest(`/shops/${shopId}.json`)

      if (!shopResponse.ok) {
        shopResult.errors.push(`Shop access failed: ${shopResponse.status} ${shopResponse.statusText}`)
        return shopResult
      }

      const shopData = await shopResponse.json()
      shopResult.data = shopData
      shopResult.accessible = true

      // Test products access
      try {
        const productsResponse = await this.makeRequest(`/shops/${shopId}/products.json?limit=10`)

        if (productsResponse.ok) {
          const productsData = await productsResponse.json()
          shopResult.products = productsData.data || []
        } else {
          shopResult.errors.push(`Products access failed: ${productsResponse.status}`)
        }
      } catch (error) {
        shopResult.errors.push(`Products fetch error: ${error instanceof Error ? error.message : "Unknown"}`)
      }
    } catch (error) {
      shopResult.errors.push(`Shop test failed: ${error instanceof Error ? error.message : "Unknown"}`)
    }

    return shopResult
  }

  private async makeRequest(endpoint: string): Promise<Response> {
    const url = `https://api.printify.com/v1${endpoint}`

    return fetch(url, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        "User-Agent": "NoTrumpNWay-Comparator/1.0",
      },
    })
  }

  private analyzeComparison(result: ShopComparisonResult) {
    const { shop1, shop2, comparison } = result

    // Check if both shops are accessible
    comparison.bothAccessible = shop1.accessible && shop2.accessible

    if (!comparison.bothAccessible) {
      if (!shop1.accessible && !shop2.accessible) {
        comparison.differences.push("Neither shop is accessible")
        comparison.recommendations.push("Check API credentials and shop IDs")
      } else if (!shop1.accessible) {
        comparison.differences.push(`Shop ${shop1.id} is not accessible while ${shop2.id} is`)
        comparison.recommendations.push(
          `Investigate shop ${shop1.id} specifically - it may not exist or have permission issues`,
        )
      } else {
        comparison.differences.push(`Shop ${shop2.id} is not accessible while ${shop1.id} is`)
        comparison.recommendations.push(
          `Investigate shop ${shop2.id} specifically - it may not exist or have permission issues`,
        )
      }
      return
    }

    // Compare shop data structures
    if (shop1.data && shop2.data) {
      const shop1Keys = Object.keys(shop1.data).sort()
      const shop2Keys = Object.keys(shop2.data).sort()

      comparison.dataStructureSimilar = JSON.stringify(shop1Keys) === JSON.stringify(shop2Keys)

      if (!comparison.dataStructureSimilar) {
        comparison.differences.push("Shop data structures differ")

        const missingInShop1 = shop2Keys.filter((key) => !shop1Keys.includes(key))
        const missingInShop2 = shop1Keys.filter((key) => !shop2Keys.includes(key))

        if (missingInShop1.length > 0) {
          comparison.differences.push(`Shop ${shop1.id} missing fields: ${missingInShop1.join(", ")}`)
        }
        if (missingInShop2.length > 0) {
          comparison.differences.push(`Shop ${shop2.id} missing fields: ${missingInShop2.join(", ")}`)
        }
      }

      // Compare specific shop properties
      const shop1Title = shop1.data.title || "Unknown"
      const shop2Title = shop2.data.title || "Unknown"
      const shop1Channel = shop1.data.sales_channel || "Unknown"
      const shop2Channel = shop2.data.sales_channel || "Unknown"

      if (shop1Title !== shop2Title) {
        comparison.differences.push(`Shop titles differ: "${shop1Title}" vs "${shop2Title}"`)
      }

      if (shop1Channel !== shop2Channel) {
        comparison.differences.push(`Sales channels differ: "${shop1Channel}" vs "${shop2Channel}"`)
        comparison.recommendations.push("Different sales channels may affect product visibility and API behavior")
      }
    }

    // Compare product counts
    const shop1ProductCount = shop1.products?.length || 0
    const shop2ProductCount = shop2.products?.length || 0

    if (shop1ProductCount === 0 && shop2ProductCount === 0) {
      comparison.productCountComparison = "Both shops have no products"
      comparison.recommendations.push("Both shops appear to be empty - check if products are published")
    } else if (shop1ProductCount === 0) {
      comparison.productCountComparison = `Shop ${shop1.id} has no products, ${shop2.id} has ${shop2ProductCount}`
      comparison.differences.push(
        `Shop ${shop1.id} has no products while ${shop2.id} has ${shop2ProductCount} products`,
      )
      comparison.recommendations.push(
        `Shop ${shop1.id} may not have published products or may have permission restrictions`,
      )
    } else if (shop2ProductCount === 0) {
      comparison.productCountComparison = `Shop ${shop2.id} has no products, ${shop1.id} has ${shop1ProductCount}`
      comparison.differences.push(
        `Shop ${shop2.id} has no products while ${shop1.id} has ${shop1ProductCount} products`,
      )
      comparison.recommendations.push(
        `Shop ${shop2.id} may not have published products or may have permission restrictions`,
      )
    } else {
      comparison.productCountComparison = `Shop ${shop1.id}: ${shop1ProductCount} products, Shop ${shop2.id}: ${shop2ProductCount} products`

      if (Math.abs(shop1ProductCount - shop2ProductCount) > 5) {
        comparison.differences.push(
          `Significant difference in product counts: ${shop1ProductCount} vs ${shop2ProductCount}`,
        )
      }
    }

    // Compare product structures if both have products
    if (shop1.products && shop1.products.length > 0 && shop2.products && shop2.products.length > 0) {
      const shop1ProductStructure = Object.keys(shop1.products[0]).sort()
      const shop2ProductStructure = Object.keys(shop2.products[0]).sort()

      if (JSON.stringify(shop1ProductStructure) !== JSON.stringify(shop2ProductStructure)) {
        comparison.differences.push("Product data structures differ between shops")
      }
    }

    // Generate final recommendations
    if (comparison.differences.length === 0) {
      comparison.recommendations.push("Both shops appear to be configured similarly and are accessible")
    } else {
      comparison.recommendations.push("Investigate the differences found to understand why one shop may not be working")

      if (!comparison.bothAccessible) {
        comparison.recommendations.push("Focus on the inaccessible shop - verify it exists and check API permissions")
      }
    }
  }
}

// Helper function to create and run comparison
export async function compareShops(shopId1: string, shopId2: string): Promise<ShopComparisonResult> {
  const comparator = new PrintifyShopComparator()
  return await comparator.compareShops(shopId1, shopId2)
}
