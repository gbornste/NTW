import shopConfig from "../config/printify-shop-config.json"
import apiPayloads from "../config/printify-api-payloads.json"

export interface PrintifyShopConfig {
  id: number
  title: string
  sales_channel: string
  description: string
  currency: string
  country: string
  language: string
  timezone: string
  settings: {
    auto_fulfill: boolean
    auto_approve: boolean
    send_shipping_notification: boolean
    send_order_confirmation: boolean
    inventory_tracking: boolean
    tax_calculation: string
    shipping_calculation: string
  }
  branding: {
    logo_url: string
    primary_color: string
    secondary_color: string
    accent_color: string
  }
  contact: {
    email: string
    phone: string
    address: {
      line1: string
      line2: string
      city: string
      state: string
      zip: string
      country: string
    }
  }
}

export interface PrintifyApiConfig {
  base_url: string
  shop_id: number
  authentication: {
    type: string
    token_env_var: string
  }
  rate_limits: {
    requests_per_minute: number
    burst_limit: number
  }
  retry_policy: {
    max_retries: number
    backoff_strategy: string
    initial_delay_ms: number
  }
}

// Update the getShopId function to use shop ID 22732326
export const getShopId = (): string => {
  return process.env.PRINTIFY_SHOP_ID || "22732326"
}

// Add a function to force use of shop ID 22732326
export const getPrimaryShopId = (): string => {
  return "22732326"
}

// Shop configuration constants
export const PRINTIFY_SHOP_CONFIG: PrintifyShopConfig = {
  ...shopConfig.shop,
  id: Number.parseInt(getShopId()),
}

export const PRINTIFY_API_CONFIG: PrintifyApiConfig = {
  ...shopConfig.api_configuration,
  shop_id: Number.parseInt(getShopId()),
}

// API endpoint URLs
export const PRINTIFY_ENDPOINTS = {
  shops: "/shops.json",
  shop: (shopId: string | number) => `/shops/${shopId}.json`,
  products: (shopId: string | number) => `/shops/${shopId}/products.json`,
  product: (shopId: string | number, productId: string) => `/shops/${shopId}/products/${productId}.json`,
  orders: (shopId: string | number) => `/shops/${shopId}/orders.json`,
  order: (shopId: string | number, orderId: string) => `/shops/${shopId}/orders/${orderId}.json`,
  webhooks: (shopId: string | number) => `/shops/${shopId}/webhooks.json`,
  uploads: "/uploads/images.json",
  catalog: "/catalog/blueprints.json",
  printProviders: "/catalog/print_providers.json",
} as const

// API payload templates
export const API_PAYLOADS = apiPayloads

// Helper function to create shop configuration payload
export function createShopPayload(): typeof apiPayloads.create_shop_payload {
  return {
    title: PRINTIFY_SHOP_CONFIG.title,
    sales_channel: PRINTIFY_SHOP_CONFIG.sales_channel,
    description: PRINTIFY_SHOP_CONFIG.description,
    currency: PRINTIFY_SHOP_CONFIG.currency,
    country: PRINTIFY_SHOP_CONFIG.country,
    language: PRINTIFY_SHOP_CONFIG.language,
    timezone: PRINTIFY_SHOP_CONFIG.timezone,
  }
}

// Helper function to create shop update payload
export function createShopUpdatePayload(): typeof apiPayloads.update_shop_payload {
  return {
    id: PRINTIFY_SHOP_CONFIG.id,
    title: PRINTIFY_SHOP_CONFIG.title,
    sales_channel: PRINTIFY_SHOP_CONFIG.sales_channel,
    description: PRINTIFY_SHOP_CONFIG.description,
    currency: PRINTIFY_SHOP_CONFIG.currency,
    country: PRINTIFY_SHOP_CONFIG.country,
    language: PRINTIFY_SHOP_CONFIG.language,
    timezone: PRINTIFY_SHOP_CONFIG.timezone,
    settings: PRINTIFY_SHOP_CONFIG.settings,
  }
}

// Helper function to create webhook configuration payload
export function createWebhookPayload(webhookUrl: string): typeof apiPayloads.webhook_configuration {
  return {
    url: webhookUrl,
    events: apiPayloads.webhook_configuration.events,
    secret: process.env.PRINTIFY_WEBHOOK_SECRET || "default_webhook_secret",
  }
}

// Validation function for shop configuration
export function validateShopConfig(config: Partial<PrintifyShopConfig>): boolean {
  const required = ["id", "title", "sales_channel", "currency", "country"]
  return required.every((field) => field in config && config[field as keyof PrintifyShopConfig])
}

// Get shop configuration for API requests
export function getShopConfig() {
  return {
    shopId: getShopId(),
    title: PRINTIFY_SHOP_CONFIG.title,
    salesChannel: PRINTIFY_SHOP_CONFIG.sales_channel,
    apiConfig: PRINTIFY_API_CONFIG,
  }
}
