const PRINTIFY_API_BASE = "https://api.printify.com/v1"

export interface ShopVerificationResult {
  isValid: boolean
  shopId: string
  status: "valid" | "invalid" | "unauthorized" | "not_found" | "error"
  shop?: any
  products?: any[]
  webhooks?: any[]
  permissions?: string[]
  issues?: string[]
  recommendations?: string[]
  lastChecked: string
  responseTime: number
}

export interface VerificationCheck {
  name: string
  status: "pass" | "fail" | "warning" | "pending"
  message: string
  details?: any
  duration?: number
}

export class PrintifyVerificationService {
  private apiKey: string
  private shopId: string

  constructor(apiKey: string, shopId: string) {
    this.apiKey = apiKey
    this.shopId = shopId
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = `${PRINTIFY_API_BASE}${endpoint}`

    return fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        "User-Agent": "NoTrumpNWay-Verification/1.0",
        ...options.headers,
      },
    })
  }

  async verifyShopAccess(): Promise<VerificationCheck> {
    const startTime = Date.now()

    try {
      const response = await this.makeRequest(`/shops/${this.shopId}.json`)
      const duration = Date.now() - startTime

      if (response.status === 404) {
        return {
          name: "Shop Access",
          status: "fail",
          message: `Shop ID ${this.shopId} not found`,
          details: { status: 404, shopId: this.shopId },
          duration,
        }
      }

      if (response.status === 401 || response.status === 403) {
        return {
          name: "Shop Access",
          status: "fail",
          message: "Unauthorized access to shop",
          details: { status: response.status, shopId: this.shopId },
          duration,
        }
      }

      if (!response.ok) {
        const errorText = await response.text()
        return {
          name: "Shop Access",
          status: "fail",
          message: `API error: ${response.status}`,
          details: { status: response.status, error: errorText },
          duration,
        }
      }

      const shop = await response.json()
      return {
        name: "Shop Access",
        status: "pass",
        message: `Successfully accessed shop "${shop.title}"`,
        details: shop,
        duration,
      }
    } catch (error) {
      return {
        name: "Shop Access",
        status: "fail",
        message: "Network error accessing shop",
        details: error instanceof Error ? error.message : "Unknown error",
        duration: Date.now() - startTime,
      }
    }
  }

  async verifyShopConfiguration(): Promise<VerificationCheck> {
    const startTime = Date.now()

    try {
      const response = await this.makeRequest(`/shops/${this.shopId}.json`)
      const duration = Date.now() - startTime

      if (!response.ok) {
        return {
          name: "Shop Configuration",
          status: "fail",
          message: "Cannot verify configuration - shop access failed",
          duration,
        }
      }

      const shop = await response.json()
      const issues: string[] = []
      const recommendations: string[] = []

      // Check required fields
      if (!shop.title || shop.title.trim() === "") {
        issues.push("Shop title is missing or empty")
      }

      if (!shop.sales_channel) {
        issues.push("Sales channel is not configured")
      }

      if (!shop.currency) {
        issues.push("Currency is not set")
      }

      // Check for optimal configuration
      if (shop.title !== "NoTrumpNWay") {
        recommendations.push(`Consider updating shop title to "NoTrumpNWay" (current: "${shop.title}")`)
      }

      if (shop.sales_channel !== "custom_integration") {
        recommendations.push(
          `Consider setting sales channel to "custom_integration" (current: "${shop.sales_channel}")`,
        )
      }

      const status = issues.length > 0 ? "fail" : recommendations.length > 0 ? "warning" : "pass"
      const message =
        issues.length > 0
          ? `Configuration issues found: ${issues.length}`
          : recommendations.length > 0
            ? `Configuration recommendations: ${recommendations.length}`
            : "Shop configuration is optimal"

      return {
        name: "Shop Configuration",
        status,
        message,
        details: {
          shop,
          issues,
          recommendations,
        },
        duration,
      }
    } catch (error) {
      return {
        name: "Shop Configuration",
        status: "fail",
        message: "Error verifying configuration",
        details: error instanceof Error ? error.message : "Unknown error",
        duration: Date.now() - startTime,
      }
    }
  }

  async verifyProductAccess(): Promise<VerificationCheck> {
    const startTime = Date.now()

    try {
      const response = await this.makeRequest(`/shops/${this.shopId}/products.json?limit=5`)
      const duration = Date.now() - startTime

      if (!response.ok) {
        const errorText = await response.text()
        return {
          name: "Product Access",
          status: "fail",
          message: `Cannot access products: ${response.status}`,
          details: { status: response.status, error: errorText },
          duration,
        }
      }

      const data = await response.json()
      const products = data.data || []

      return {
        name: "Product Access",
        status: "pass",
        message: `Found ${products.length} products (showing first 5)`,
        details: {
          total: data.total || products.length,
          currentPage: data.current_page || 1,
          lastPage: data.last_page || 1,
          products: products.slice(0, 3), // Show first 3 for verification
        },
        duration,
      }
    } catch (error) {
      return {
        name: "Product Access",
        status: "fail",
        message: "Error accessing products",
        details: error instanceof Error ? error.message : "Unknown error",
        duration: Date.now() - startTime,
      }
    }
  }

  async verifyWebhookConfiguration(): Promise<VerificationCheck> {
    const startTime = Date.now()

    try {
      const response = await this.makeRequest(`/shops/${this.shopId}/webhooks.json`)
      const duration = Date.now() - startTime

      if (!response.ok) {
        return {
          name: "Webhook Configuration",
          status: "warning",
          message: "Cannot access webhooks (may not be critical)",
          details: { status: response.status },
          duration,
        }
      }

      const data = await response.json()
      const webhooks = data.data || []

      if (webhooks.length === 0) {
        return {
          name: "Webhook Configuration",
          status: "warning",
          message: "No webhooks configured",
          details: { webhooks: [] },
          duration,
        }
      }

      return {
        name: "Webhook Configuration",
        status: "pass",
        message: `${webhooks.length} webhook(s) configured`,
        details: { webhooks },
        duration,
      }
    } catch (error) {
      return {
        name: "Webhook Configuration",
        status: "warning",
        message: "Error checking webhooks (non-critical)",
        details: error instanceof Error ? error.message : "Unknown error",
        duration: Date.now() - startTime,
      }
    }
  }

  async verifyApiPermissions(): Promise<VerificationCheck> {
    const startTime = Date.now()
    const permissions: string[] = []
    const issues: string[] = []

    try {
      // Test shop read permission
      const shopResponse = await this.makeRequest(`/shops/${this.shopId}.json`)
      if (shopResponse.ok) {
        permissions.push("shop:read")
      } else {
        issues.push("shop:read - Cannot read shop details")
      }

      // Test products read permission
      const productsResponse = await this.makeRequest(`/shops/${this.shopId}/products.json?limit=1`)
      if (productsResponse.ok) {
        permissions.push("products:read")
      } else {
        issues.push("products:read - Cannot read products")
      }

      // Test webhooks read permission
      const webhooksResponse = await this.makeRequest(`/shops/${this.shopId}/webhooks.json`)
      if (webhooksResponse.ok) {
        permissions.push("webhooks:read")
      } else {
        issues.push("webhooks:read - Cannot read webhooks")
      }

      const duration = Date.now() - startTime
      const status = issues.length > 0 ? "warning" : "pass"
      const message = `${permissions.length} permissions verified, ${issues.length} issues`

      return {
        name: "API Permissions",
        status,
        message,
        details: { permissions, issues },
        duration,
      }
    } catch (error) {
      return {
        name: "API Permissions",
        status: "fail",
        message: "Error testing permissions",
        details: error instanceof Error ? error.message : "Unknown error",
        duration: Date.now() - startTime,
      }
    }
  }

  async performFullVerification(): Promise<ShopVerificationResult> {
    const startTime = Date.now()
    console.log(`Starting full verification for shop ID: ${this.shopId}`)

    const checks = await Promise.all([
      this.verifyShopAccess(),
      this.verifyShopConfiguration(),
      this.verifyProductAccess(),
      this.verifyWebhookConfiguration(),
      this.verifyApiPermissions(),
    ])

    const totalDuration = Date.now() - startTime
    const failedChecks = checks.filter((check) => check.status === "fail")
    const warningChecks = checks.filter((check) => check.status === "warning")

    // Determine overall status
    let status: ShopVerificationResult["status"]
    let isValid: boolean

    if (failedChecks.length > 0) {
      // If shop access failed, it's invalid
      const shopAccessFailed = checks[0].status === "fail"
      if (shopAccessFailed) {
        status =
          checks[0].details?.status === 404
            ? "not_found"
            : checks[0].details?.status === 401 || checks[0].details?.status === 403
              ? "unauthorized"
              : "error"
        isValid = false
      } else {
        status = "error"
        isValid = false
      }
    } else {
      status = "valid"
      isValid = true
    }

    // Collect issues and recommendations
    const issues: string[] = []
    const recommendations: string[] = []

    checks.forEach((check) => {
      if (check.status === "fail") {
        issues.push(`${check.name}: ${check.message}`)
      } else if (check.status === "warning") {
        recommendations.push(`${check.name}: ${check.message}`)
      }

      if (check.details?.issues) {
        issues.push(...check.details.issues)
      }
      if (check.details?.recommendations) {
        recommendations.push(...check.details.recommendations)
      }
    })

    const result: ShopVerificationResult = {
      isValid,
      shopId: this.shopId,
      status,
      shop: checks[0].details,
      products: checks[2].details?.products,
      webhooks: checks[3].details?.webhooks,
      permissions: checks[4].details?.permissions,
      issues: issues.length > 0 ? issues : undefined,
      recommendations: recommendations.length > 0 ? recommendations : undefined,
      lastChecked: new Date().toISOString(),
      responseTime: totalDuration,
    }

    console.log(`Verification completed in ${totalDuration}ms:`, {
      status: result.status,
      isValid: result.isValid,
      issuesCount: issues.length,
      recommendationsCount: recommendations.length,
    })

    return result
  }
}

// Helper function to create verification service
export function createVerificationService(apiKey?: string, shopId?: string): PrintifyVerificationService | null {
  const key = apiKey || process.env.PRINTIFY_API_TOKEN
  const id = shopId || process.env.PRINTIFY_SHOP_ID || "22108081"

  if (!key) {
    console.error("PRINTIFY_API_TOKEN is required for verification")
    return null
  }

  return new PrintifyVerificationService(key, id)
}
