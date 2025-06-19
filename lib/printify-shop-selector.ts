export interface PrintifyShopPayload {
  id: number
  title: string
  sales_channel: string
}

export interface ShopConfiguration {
  id: number
  title: string
  sales_channel: string
  description: string
  currency: string
  country: string
  language: string
  timezone: string
  webhook_url?: string
  settings: {
    auto_fulfill: boolean
    auto_approve: boolean
    send_shipping_notification: boolean
    send_order_confirmation: boolean
    inventory_tracking: boolean
  }
}

// Predefined shop configurations
const SHOP_CONFIGURATIONS: Record<string, ShopConfiguration> = {
  "22108081": {
    id: 22108081,
    title: "NoTrumpNWay",
    sales_channel: "storefront",
    description: "NoTrumpNWay political greeting cards and merchandise - Storefront integration",
    currency: "USD",
    country: "US",
    language: "en",
    timezone: "America/New_York",
    webhook_url: "https://notrumpnway.vercel.app/api/webhooks/printify/storefront",
    settings: {
      auto_fulfill: true,
      auto_approve: true,
      send_shipping_notification: true,
      send_order_confirmation: true,
      inventory_tracking: true,
    },
  },
  "22732326": {
    id: 22732326,
    title: "NoTrumpNWay",
    sales_channel: "custom_integration",
    description: "NoTrumpNWay political greeting cards and merchandise - Custom integration",
    currency: "USD",
    country: "US",
    language: "en",
    timezone: "America/New_York",
    webhook_url: "https://notrumpnway.vercel.app/api/webhooks/printify/custom",
    settings: {
      auto_fulfill: false,
      auto_approve: false,
      send_shipping_notification: true,
      send_order_confirmation: true,
      inventory_tracking: true,
    },
  },
}

/**
 * Generates the appropriate JSON payload for Printify API data retrieval
 * based on the provided shop ID
 */
export function generateShopPayload(shopId: string | number): PrintifyShopPayload {
  const normalizedShopId = String(shopId)

  console.log(`🏪 Generating shop payload for shop ID: ${normalizedShopId}`)

  const config = SHOP_CONFIGURATIONS[normalizedShopId]

  if (!config) {
    console.warn(`⚠️ Unknown shop ID: ${normalizedShopId}. Using default configuration.`)
    // Default fallback configuration
    return {
      id: Number.parseInt(normalizedShopId),
      title: "NoTrumpNWay",
      sales_channel: "custom_integration",
    }
  }

  const payload: PrintifyShopPayload = {
    id: config.id,
    title: config.title,
    sales_channel: config.sales_channel,
  }

  console.log(`✅ Generated payload:`, JSON.stringify(payload, null, 2))

  return payload
}

/**
 * Gets the complete shop configuration for a given shop ID
 */
export function getShopConfiguration(shopId: string | number): ShopConfiguration | null {
  const normalizedShopId = String(shopId)
  return SHOP_CONFIGURATIONS[normalizedShopId] || null
}

/**
 * Gets all available shop configurations
 */
export function getAllShopConfigurations(): Record<string, ShopConfiguration> {
  return SHOP_CONFIGURATIONS
}

/**
 * Validates if a shop ID is supported
 */
export function isValidShopId(shopId: string | number): boolean {
  const normalizedShopId = String(shopId)
  return normalizedShopId in SHOP_CONFIGURATIONS
}

/**
 * Gets the current shop ID from environment variables
 */
export function getCurrentShopId(): string {
  return process.env.PRINTIFY_SHOP_ID || "22108081"
}

/**
 * Generates payload for the current environment shop ID
 */
export function generateCurrentShopPayload(): PrintifyShopPayload {
  const currentShopId = getCurrentShopId()
  return generateShopPayload(currentShopId)
}

/**
 * Creates API request headers with the shop payload
 */
export function createApiHeaders(shopId?: string | number): Record<string, string> {
  const apiToken = process.env.PRINTIFY_API_TOKEN

  if (!apiToken) {
    throw new Error("PRINTIFY_API_TOKEN environment variable is required")
  }

  return {
    Authorization: `Bearer ${apiToken}`,
    "Content-Type": "application/json",
    "User-Agent": "NoTrumpNWay-Store/1.0",
    "X-Shop-ID": String(shopId || getCurrentShopId()),
  }
}

/**
 * Creates a complete API request configuration
 */
export function createApiRequest(shopId?: string | number) {
  const payload = generateShopPayload(shopId || getCurrentShopId())
  const headers = createApiHeaders(shopId)

  return {
    payload,
    headers,
    shopConfig: getShopConfiguration(payload.id),
  }
}

/**
 * Formats the payload as a JSON string for API requests
 */
export function formatPayloadAsJson(shopId: string | number): string {
  const payload = generateShopPayload(shopId)
  return JSON.stringify(payload, null, 2)
}

/**
 * Validates the generated payload structure
 */
export function validatePayload(payload: PrintifyShopPayload): boolean {
  const requiredFields = ["id", "title", "sales_channel"]
  const hasAllFields = requiredFields.every((field) => field in payload && payload[field as keyof PrintifyShopPayload])

  const validSalesChannels = ["storefront", "custom_integration", "api", "manual"]
  const hasValidSalesChannel = validSalesChannels.includes(payload.sales_channel)

  const hasValidId = typeof payload.id === "number" && payload.id > 0
  const hasValidTitle = typeof payload.title === "string" && payload.title.length > 0

  return hasAllFields && hasValidSalesChannel && hasValidId && hasValidTitle
}

// Export specific shop payloads for direct use
export const SHOP_22108081_PAYLOAD: PrintifyShopPayload = {
  id: 22108081,
  title: "NoTrumpNWay",
  sales_channel: "storefront",
}

export const SHOP_22732326_PAYLOAD: PrintifyShopPayload = {
  id: 22732326,
  title: "NoTrumpNWay",
  sales_channel: "custom_integration",
}
