const PRINTIFY_API_URL = "https://api.printify.com/v1"

export interface PrintifyProduct {
  id: string
  title: string
  description: string
  images: PrintifyImage[]
  variants: PrintifyVariant[]
  options: PrintifyOption[]
  tags: string[]
  created_at: string
  updated_at: string
}

export interface PrintifyImage {
  src: string
  is_default: boolean
  variant_ids: number[]
  position: string
  width?: number
  height?: number
  alt?: string
}

export interface PrintifyVariant {
  id: string
  title: string
  price: number
  is_enabled: boolean
  options: Record<string, string>
  stock_quantity?: number
}

export interface PrintifyOption {
  name: string
  type: string
  values: string[]
}

export interface PrintifyResponse {
  data: PrintifyProduct[]
  current_page: number
  last_page: number
  total: number
  shopTitle?: string
  isMockData?: boolean
  previewMode?: boolean
  shopId?: string | number
  salesChannel?: string
}

export interface PrintifyShopInfo {
  id: number
  title: string
  sales_channel: string
  status?: string
  products_count?: number
}

// Enhanced cleaning function that properly handles objects and arrays
function cleanOptionValue(value: any): string {
  if (value === null || value === undefined) return ""

  // If it's already a clean string, return it
  if (typeof value === "string" && !value.includes("{") && !value.includes("[")) {
    return value.trim()
  }

  // Handle objects by extracting meaningful properties
  if (typeof value === "object" && value !== null) {
    // Try common property names that might contain the display value
    if (value.name && typeof value.name === "string") return String(value.name).trim()
    if (value.title && typeof value.title === "string") return String(value.title).trim()
    if (value.label && typeof value.label === "string") return String(value.label).trim()
    if (value.value && typeof value.value === "string") return String(value.value).trim()
    if (value.text && typeof value.text === "string") return String(value.text).trim()

    // If it's an array, try to join meaningful elements
    if (Array.isArray(value)) {
      const stringElements = value
        .filter((item) => typeof item === "string" || typeof item === "number")
        .map((item) => String(item).trim())
        .filter(Boolean)

      if (stringElements.length > 0) {
        return stringElements.join(", ")
      }
    }

    // Last resort: try to extract any string values from the object
    const stringValues = Object.values(value)
      .filter((v) => typeof v === "string" && v.trim().length > 0)
      .map((v) => String(v).trim())

    if (stringValues.length > 0) {
      return stringValues[0]
    }
  }

  // Convert to string and clean up
  let cleanValue = String(value)

  // Remove object notation patterns
  cleanValue = cleanValue
    // Remove JSON-like patterns
    .replace(/^\{.*\}$/, "")
    .replace(/^\[.*\]$/, "")
    // Remove specific problematic patterns
    .replace(/\bid:\s*\d+/gi, "")
    .replace(/\{[^}]*\}/g, "")
    .replace(/\[[^\]]*\]/g, "")
    // Clean up quotes and separators
    .replace(/[{}[\]"'`]/g, "")
    .replace(/[,;:|]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  // If we end up with an empty string or just whitespace, return a fallback
  if (!cleanValue || cleanValue === "[object Object]") {
    return "Option"
  }

  return cleanValue
}

// Enhanced image processing utilities
export function getOptimizedImageUrl(imageUrl: string, width?: number, height?: number): string {
  if (!imageUrl) return "/placeholder.svg?height=300&width=300"

  // If it's already a placeholder, return as is
  if (imageUrl.includes("placeholder.svg")) return imageUrl

  // For Printify images, we can add size parameters
  if (imageUrl.includes("printify")) {
    const url = new URL(imageUrl)
    if (width) url.searchParams.set("width", width.toString())
    if (height) url.searchParams.set("height", height.toString())
    return url.toString()
  }

  return imageUrl
}

export function getImageAltText(product: PrintifyProduct, image?: PrintifyProduct["images"][0]): string {
  if (image?.alt) return image.alt
  return `${product.title} - Political merchandise`
}

export function getDefaultImage(product: PrintifyProduct): PrintifyProduct["images"][0] | null {
  if (!product.images || product.images.length === 0) return null

  // Find default image
  const defaultImage = product.images.find((img) => img.is_default)
  if (defaultImage) return defaultImage

  // Find front position image
  const frontImage = product.images.find((img) => img.position === "front")
  if (frontImage) return frontImage

  // Return first image
  return product.images[0]
}

export function getImagesByPosition(product: PrintifyProduct): Record<string, PrintifyProduct["images"][0]> {
  const imagesByPosition: Record<string, PrintifyProduct["images"][0]> = {}

  if (product.images) {
    product.images.forEach((image) => {
      imagesByPosition[image.position] = image
    })
  }

  return imagesByPosition
}

// Shop configuration based on ID - Updated to use 22732326 as primary
export function getShopConfig(shopId: string | number): { title: string; salesChannel: string } {
  const id = String(shopId)

  // Define known shop configurations with 22732326 as primary
  const shopConfigs: Record<string, { title: string; salesChannel: string }> = {
    "22732326": { title: "NoTrumpNWay Store", salesChannel: "custom_integration" },
    "22108081": { title: "NoTrumpNWay", salesChannel: "storefront" },
  }

  // Return the configuration for the specified shop ID, or default to 22732326
  return shopConfigs[id] || { title: "NoTrumpNWay Store", salesChannel: "custom_integration" }
}

export class PrintifyService {
  private apiKey: string
  private opensslSecret?: string
  private shopId: string | number

  constructor(apiKey?: string, opensslSecret?: string, shopId?: string | number) {
    // Updated to match your working environment variable names
    this.apiKey = apiKey || process.env.PRINTIFY_API_KEY || process.env.PRINTIFY_API_TOKEN || ""
    this.opensslSecret = opensslSecret || process.env.OPENSSL_SECRET || process.env.PRINTIFY_WEBHOOK_SECRET
    this.shopId = shopId || process.env.PRINTIFY_SHOP_ID || "22732326"
  }

  // Get headers for API requests
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": "NoTrumpNWay-Store/1.0",
    }

    // Add OpenSSL secret header if available
    if (this.opensslSecret) {
      headers["X-Printify-Secret"] = this.opensslSecret
    }

    return headers
  }

  // Get shop information
  async getShopInfo(): Promise<PrintifyShopInfo | null> {
    try {
      if (!this.apiKey || !this.shopId) {
        console.log("Using mock shop info - API credentials not available")
        return this.getMockShopInfo()
      }

      const response = await fetch(`${PRINTIFY_API_URL}/shops/${this.shopId}.json`, {
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return {
        id: data.id,
        title: data.title,
        sales_channel: data.sales_channel,
        status: data.status,
        products_count: data.products_count,
      }
    } catch (error) {
      console.error("Error fetching Printify shop info:", error)
      return this.getMockShopInfo()
    }
  }

  // Get all shops
  async getAllShops(): Promise<PrintifyShopInfo[]> {
    try {
      if (!this.apiKey) {
        console.log("Using mock shops - API credentials not available")
        return [this.getMockShopInfo()]
      }

      const response = await fetch(`${PRINTIFY_API_URL}/shops.json`, {
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.map((shop: any) => ({
        id: shop.id,
        title: shop.title,
        sales_channel: shop.sales_channel,
        status: shop.status,
        products_count: shop.products_count,
      }))
    } catch (error) {
      console.error("Error fetching Printify shops:", error)
      return [this.getMockShopInfo()]
    }
  }

  async getProducts(): Promise<PrintifyResponse> {
    try {
      if (!this.apiKey || !this.shopId) {
        console.log("Using enhanced mock data for shop 22732326 - API credentials not available")
        return this.getEnhancedMockProducts()
      }

      // Use the exact same URL format as your working code
      const response = await fetch(`${PRINTIFY_API_URL}/shops/${this.shopId}/products.json`, {
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const shopConfig = getShopConfig(this.shopId)

      return {
        ...this.transformResponse(data),
        shopId: this.shopId,
        shopTitle: shopConfig.title,
        salesChannel: shopConfig.salesChannel,
      }
    } catch (error) {
      console.error("Error fetching Printify products:", error)
      return this.getEnhancedMockProducts()
    }
  }

  async getProduct(id: string): Promise<PrintifyProduct | null> {
    try {
      if (!this.apiKey || !this.shopId) {
        return this.getMockProduct(id)
      }

      const response = await fetch(`${PRINTIFY_API_URL}/shops/${this.shopId}/products/${id}.json`, {
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return this.transformProduct(data)
    } catch (error) {
      console.error("Error fetching Printify product:", error)
      return this.getMockProduct(id)
    }
  }

  private transformResponse(data: any): PrintifyResponse {
    return {
      data: data.data?.map((product: any) => this.transformProduct(product)) || [],
      current_page: data.current_page || 1,
      last_page: data.last_page || 1,
      total: data.total || 0,
      shopTitle: "NoTrumpNWay Store",
    }
  }

  private transformProduct(product: any): PrintifyProduct {
    return {
      id: product.id,
      title: product.title,
      description: this.cleanHtmlFromDescription(product.description || ""),
      images: this.transformImages(product.images || []),
      variants: this.transformVariants(product.variants || []),
      options: this.transformOptions(product.options || []),
      tags: product.tags || [],
      created_at: product.created_at,
      updated_at: product.updated_at,
    }
  }

  private cleanHtmlFromDescription(description: string): string {
    if (!description) return ""

    return (
      description
        // Remove HTML tags
        .replace(/<[^>]*>/g, "")
        // Replace HTML entities
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        // Replace multiple spaces with single space
        .replace(/\s+/g, " ")
        // Trim whitespace
        .trim()
    )
  }

  private transformImages(images: any[]): PrintifyImage[] {
    return images.map((image, index) => ({
      src: this.optimizeImageUrl(image.src),
      is_default: image.is_default || index === 0,
      variant_ids: image.variant_ids || [],
      position: image.position || (index === 0 ? "front" : `view-${index + 1}`),
      width: image.width || 600,
      height: image.height || 600,
      alt: image.alt || `Product image ${index + 1}`,
    }))
  }

  private transformVariants(variants: any[]): PrintifyVariant[] {
    return variants.map((variant) => {
      // Process variant options with minimal cleaning
      const cleanOptions: Record<string, string> = {}
      if (variant.options && typeof variant.options === "object") {
        Object.entries(variant.options).forEach(([key, value]) => {
          cleanOptions[String(key)] = cleanOptionValue(value)
        })
      }

      return {
        id: variant.id,
        title: variant.title,
        price: variant.price / 100, // Convert cents to dollars
        is_enabled: variant.is_enabled !== false, // Default to true
        options: cleanOptions,
        stock_quantity: variant.stock_quantity || 50,
      }
    })
  }

  private transformOptions(options: any[]): PrintifyOption[] {
    const transformedOptions = options.map((option) => {
      // Extract and clean option values
      const cleanValues = Array.isArray(option.values)
        ? option.values
            .map((value: any) => {
              const cleaned = cleanOptionValue(value)
              console.log(`Option value transformation: ${JSON.stringify(value)} -> "${cleaned}"`)
              return cleaned
            })
            .filter(Boolean)
            .filter((value) => value !== "Option") // Remove generic fallbacks
        : []

      return {
        name: String(option.name || "Option"),
        type: String(option.type || "select"),
        values: cleanValues.length > 0 ? cleanValues : ["Standard"], // Provide fallback
      }
    })

    // If no options exist, create default options
    if (transformedOptions.length === 0 || transformedOptions.every((opt) => opt.values.length === 0)) {
      return [
        {
          name: "Size",
          type: "size",
          values: ["Small", "Medium", "Large", "XL"],
        },
        {
          name: "Color",
          type: "color",
          values: ["Black", "White", "Navy", "Red"],
        },
      ]
    }

    return transformedOptions
  }

  private optimizeImageUrl(url: string): string {
    if (!url) return "/placeholder.svg?height=600&width=600"

    // Add image optimization parameters if it's a Printify URL
    if (url.includes("printify")) {
      const separator = url.includes("?") ? "&" : "?"
      return `${url}${separator}w=600&h=600&fit=crop&auto=format`
    }

    return url
  }

  private getMockShopInfo(): PrintifyShopInfo {
    const shopConfig = getShopConfig(this.shopId)
    return {
      id: Number(this.shopId),
      title: shopConfig.title,
      sales_channel: shopConfig.salesChannel,
      status: "active",
      products_count: 8,
    }
  }

  private getEnhancedMockProducts(): PrintifyResponse {
    const shopConfig = getShopConfig(this.shopId)

    const mockProducts: PrintifyProduct[] = [
      {
        id: "shop-22732326-product-1",
        title: "Anti-Trump Climate Action T-Shirt",
        description:
          "Stand up for climate action and against Trump's environmental policies with this premium cotton t-shirt. Made from 100% organic cotton, this comfortable and durable shirt features a bold design that makes a statement about protecting our planet. Perfect for rallies, protests, or everyday wear to show your commitment to environmental justice.",
        images: [
          {
            src: "/political-t-shirt.png",
            is_default: true,
            variant_ids: [],
            position: "front",
            width: 600,
            height: 600,
            alt: "Anti-Trump Climate Action T-Shirt",
          },
        ],
        variants: [
          {
            id: "variant-1-small-black",
            title: "Small - Black",
            price: 24.99,
            is_enabled: true,
            options: { Size: "Small", Color: "Black" },
            stock_quantity: 25,
          },
          {
            id: "variant-1-medium-black",
            title: "Medium - Black",
            price: 24.99,
            is_enabled: true,
            options: { Size: "Medium", Color: "Black" },
            stock_quantity: 30,
          },
          {
            id: "variant-1-large-black",
            title: "Large - Black",
            price: 24.99,
            is_enabled: true,
            options: { Size: "Large", Color: "Black" },
            stock_quantity: 20,
          },
          {
            id: "variant-1-xl-black",
            title: "XL - Black",
            price: 26.99,
            is_enabled: true,
            options: { Size: "XL", Color: "Black" },
            stock_quantity: 15,
          },
          {
            id: "variant-1-small-white",
            title: "Small - White",
            price: 24.99,
            is_enabled: true,
            options: { Size: "Small", Color: "White" },
            stock_quantity: 20,
          },
          {
            id: "variant-1-medium-white",
            title: "Medium - White",
            price: 24.99,
            is_enabled: true,
            options: { Size: "Medium", Color: "White" },
            stock_quantity: 25,
          },
          {
            id: "variant-1-large-white",
            title: "Large - White",
            price: 24.99,
            is_enabled: true,
            options: { Size: "Large", Color: "White" },
            stock_quantity: 18,
          },
          {
            id: "variant-1-xl-white",
            title: "XL - White",
            price: 26.99,
            is_enabled: true,
            options: { Size: "XL", Color: "White" },
            stock_quantity: 12,
          },
        ],
        options: [
          {
            name: "Size",
            type: "size",
            values: ["Small", "Medium", "Large", "XL"],
          },
          {
            name: "Color",
            type: "color",
            values: ["Black", "White"],
          },
        ],
        tags: ["Apparel", "Political", "Anti-Trump", "Climate", "T-Shirt"],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "shop-22732326-product-2",
        title: "Science Over Politics Coffee Mug",
        description:
          "Start your morning with a statement supporting science and evidence-based policy making. This high-quality ceramic mug features a durable design that won't fade after multiple washes. Perfect for coffee, tea, or any hot beverage while you contemplate the importance of scientific literacy in modern politics.",
        images: [
          {
            src: "/political-mug.png",
            is_default: true,
            variant_ids: [],
            position: "front",
            width: 600,
            height: 600,
            alt: "Science Over Politics Coffee Mug",
          },
        ],
        variants: [
          {
            id: "variant-2-11oz",
            title: "11oz Ceramic Mug",
            price: 16.99,
            is_enabled: true,
            options: { Size: "11oz" },
            stock_quantity: 40,
          },
          {
            id: "variant-2-15oz",
            title: "15oz Ceramic Mug",
            price: 18.99,
            is_enabled: true,
            options: { Size: "15oz" },
            stock_quantity: 35,
          },
        ],
        options: [
          {
            name: "Size",
            type: "size",
            values: ["11oz", "15oz"],
          },
        ],
        tags: ["Drinkware", "Political", "Science", "Mug"],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "shop-22732326-product-3",
        title: "Democracy Defender Hat",
        description:
          "Show your support for democratic values with this comfortable adjustable baseball cap. Made from high-quality cotton twill with an adjustable strap, this hat is perfect for outdoor events, rallies, or everyday wear. The embroidered design is built to last and won't fade or peel over time.",
        images: [
          {
            src: "/blue-hat-anti-trump.png",
            is_default: true,
            variant_ids: [],
            position: "front",
            width: 600,
            height: 600,
            alt: "Democracy Defender Hat",
          },
        ],
        variants: [
          {
            id: "variant-3-onesize-blue",
            title: "One Size - Blue",
            price: 22.99,
            is_enabled: true,
            options: { Size: "One Size", Color: "Blue" },
            stock_quantity: 50,
          },
          {
            id: "variant-3-onesize-red",
            title: "One Size - Red",
            price: 22.99,
            is_enabled: true,
            options: { Size: "One Size", Color: "Red" },
            stock_quantity: 30,
          },
          {
            id: "variant-3-onesize-black",
            title: "One Size - Black",
            price: 22.99,
            is_enabled: true,
            options: { Size: "One Size", Color: "Black" },
            stock_quantity: 45,
          },
        ],
        options: [
          {
            name: "Size",
            type: "size",
            values: ["One Size"],
          },
          {
            name: "Color",
            type: "color",
            values: ["Blue", "Red", "Black"],
          },
        ],
        tags: ["Accessories", "Political", "Democracy", "Hat"],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "shop-22732326-product-4",
        title: "Climate Change is Real Bumper Sticker",
        description:
          "Spread awareness about climate change with this durable, weather-resistant bumper sticker. Made from high-quality vinyl that can withstand harsh weather conditions, UV rays, and car washes. Easy to apply and remove without leaving residue. Perfect for cars, laptops, water bottles, or any smooth surface.",
        images: [
          {
            src: "/climate-change-bumper-sticker.png",
            is_default: true,
            variant_ids: [],
            position: "front",
            width: 600,
            height: 400,
            alt: "Climate Change is Real Bumper Sticker",
          },
        ],
        variants: [
          {
            id: "variant-4-standard",
            title: 'Standard Size (3" x 11.5")',
            price: 8.99,
            is_enabled: true,
            options: { Size: "Standard" },
            stock_quantity: 100,
          },
        ],
        options: [
          {
            name: "Size",
            type: "size",
            values: ["Standard"],
          },
        ],
        tags: ["Accessories", "Environment", "Political", "Sticker"],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "shop-22732326-product-5",
        title: "Vote Blue Political Backpack",
        description:
          "Carry your essentials while showing your political stance with this durable backpack. Features multiple compartments, padded laptop sleeve, and comfortable adjustable straps. Made from water-resistant material to protect your belongings. Perfect for school, work, travel, or political events.",
        images: [
          {
            src: "/anti-trump-backpack.png",
            is_default: true,
            variant_ids: [],
            position: "front",
            width: 600,
            height: 600,
            alt: "Vote Blue Political Backpack",
          },
        ],
        variants: [
          {
            id: "variant-5-standard",
            title: "Standard Size",
            price: 45.99,
            is_enabled: true,
            options: { Size: "Standard" },
            stock_quantity: 25,
          },
        ],
        options: [
          {
            name: "Size",
            type: "size",
            values: ["Standard"],
          },
        ],
        tags: ["Accessories", "Political", "Bags", "Backpack"],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "shop-22732326-product-6",
        title: "Progressive Politics Jersey",
        description:
          "Sport your progressive values with this comfortable athletic jersey. Made from moisture-wicking fabric that keeps you cool and dry during activities. Features a modern fit and durable construction that maintains its shape after multiple washes. Perfect for sports, workouts, or casual wear.",
        images: [
          {
            src: "/anti-trump-jersey.png",
            is_default: true,
            variant_ids: [],
            position: "front",
            width: 600,
            height: 600,
            alt: "Progressive Politics Jersey",
          },
        ],
        variants: [
          {
            id: "variant-6-small",
            title: "Small",
            price: 32.99,
            is_enabled: true,
            options: { Size: "Small" },
            stock_quantity: 20,
          },
          {
            id: "variant-6-medium",
            title: "Medium",
            price: 32.99,
            is_enabled: true,
            options: { Size: "Medium" },
            stock_quantity: 25,
          },
          {
            id: "variant-6-large",
            title: "Large",
            price: 32.99,
            is_enabled: true,
            options: { Size: "Large" },
            stock_quantity: 22,
          },
          {
            id: "variant-6-xl",
            title: "XL",
            price: 34.99,
            is_enabled: true,
            options: { Size: "XL" },
            stock_quantity: 18,
          },
        ],
        options: [
          {
            name: "Size",
            type: "size",
            values: ["Small", "Medium", "Large", "XL"],
          },
        ],
        tags: ["Apparel", "Political", "Sports", "Jersey"],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "shop-22732326-product-7",
        title: "Anti-Trump Statement Mug",
        description:
          "Make your morning coffee a political statement with this bold ceramic mug. Features a striking design that won't fade or chip with regular use. Dishwasher and microwave safe for convenience. Perfect for home, office, or as a gift for like-minded friends and family.",
        images: [
          {
            src: "/anti-trump-mug.png",
            is_default: true,
            variant_ids: [],
            position: "front",
            width: 600,
            height: 600,
            alt: "Anti-Trump Statement Mug",
          },
        ],
        variants: [
          {
            id: "variant-7-11oz",
            title: "11oz Ceramic",
            price: 15.99,
            is_enabled: true,
            options: { Size: "11oz" },
            stock_quantity: 35,
          },
          {
            id: "variant-7-15oz",
            title: "15oz Ceramic",
            price: 17.99,
            is_enabled: true,
            options: { Size: "15oz" },
            stock_quantity: 30,
          },
        ],
        options: [
          {
            name: "Size",
            type: "size",
            values: ["11oz", "15oz"],
          },
        ],
        tags: ["Drinkware", "Political", "Anti-Trump", "Mug"],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "shop-22732326-product-8",
        title: "Political Activism Mousepad",
        description:
          "Keep your political message visible while you work with this high-quality mousepad. Features a smooth surface for precise mouse tracking and a non-slip rubber base that stays in place. Durable design that resists wear and fading. Perfect for home office, work, or as a conversation starter.",
        images: [
          {
            src: "/anti-trump-mousepad.png",
            is_default: true,
            variant_ids: [],
            position: "front",
            width: 600,
            height: 400,
            alt: "Political Activism Mousepad",
          },
        ],
        variants: [
          {
            id: "variant-8-standard",
            title: "Standard Size",
            price: 12.99,
            is_enabled: true,
            options: { Size: "Standard" },
            stock_quantity: 60,
          },
        ],
        options: [
          {
            name: "Size",
            type: "size",
            values: ["Standard"],
          },
        ],
        tags: ["Accessories", "Political", "Office", "Mousepad"],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]

    return {
      data: mockProducts,
      current_page: 1,
      last_page: 1,
      total: mockProducts.length,
      shopTitle: shopConfig.title,
      isMockData: true,
      previewMode: true,
      shopId: this.shopId,
      salesChannel: shopConfig.salesChannel,
    }
  }

  private getMockProduct(id: string): PrintifyProduct | null {
    const mockProducts = this.getEnhancedMockProducts()
    return mockProducts.data.find((product) => product.id === id) || null
  }
}

// Function to fetch all products from Printify
export async function fetchPrintifyProducts(): Promise<{
  products: PrintifyProduct[]
  isMockData: boolean
  shopTitle?: string
  shopId?: string | number
  salesChannel?: string
  previewMode?: boolean
}> {
  try {
    const response = await fetch("/api/printify/products", {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = errorData.error || `HTTP error! status: ${response.status}`
      throw new Error(errorMessage)
    }

    const data = await response.json()
    const isMockData = !!data.isMockData
    const previewMode = !!data.previewMode

    if (!data || !data.data || !Array.isArray(data.data)) {
      console.error("Invalid response structure:", data)
      throw new Error("Invalid response structure from Printify API")
    }

    return {
      products: data.data,
      isMockData,
      shopTitle: data.shopTitle,
      shopId: data.shopId,
      salesChannel: data.salesChannel,
      previewMode,
    }
  } catch (error) {
    console.error("Error fetching Printify products:", error)
    throw error
  }
}

// Function to fetch a single product from Printify
export async function fetchPrintifyProduct(id: string): Promise<PrintifyProduct> {
  try {
    const response = await fetch(`/api/printify/product/${id}`)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = errorData.error || `HTTP error! status: ${response.status}`
      throw new Error(errorMessage)
    }

    const product = await response.json()
    return product
  } catch (error) {
    console.error(`Error fetching Printify product ${id}:`, error)
    throw error
  }
}

// Function to create an order in Printify
export async function createPrintifyOrder(orderData: any): Promise<any> {
  try {
    const response = await fetch("/api/printify/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = errorData.error || `HTTP error! status: ${response.status}`
      throw new Error(errorMessage)
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating Printify order:", error)
    throw error
  }
}

// Function to fetch orders from Printify
export async function fetchPrintifyOrders(): Promise<any> {
  try {
    const response = await fetch("/api/printify/orders")

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = errorData.error || `HTTP error! status: ${response.status}`
      throw new Error(errorMessage)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching Printify orders:", error)
    throw error
  }
}

// Create a singleton instance with environment variables - Updated to use correct env vars
export const printifyService = new PrintifyService(
  process.env.PRINTIFY_API_KEY || process.env.PRINTIFY_API_TOKEN,
  process.env.OPENSSL_SECRET || process.env.PRINTIFY_WEBHOOK_SECRET,
  process.env.PRINTIFY_SHOP_ID || "22732326",
)
