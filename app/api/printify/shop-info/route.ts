import { type NextRequest, NextResponse } from "next/server"
import { getShopConfig } from "@/lib/printify-service"

// Printify API configuration
const PRINTIFY_API_BASE = "https://api.printify.com/v1"
const API_TIMEOUT = 15000 // 15 seconds

export async function GET(request: NextRequest) {
  const startTime = Date.now()

  try {
    console.log("=== Printify Shop Info API Request Started ===")
    console.log("Timestamp:", new Date().toISOString())

    // Get environment variables
    const apiKey = process.env.PRINTIFY_API_KEY || process.env.PRINTIFY_API_TOKEN
    const opensslSecret = process.env.OPENSSL_SECRET || process.env.PRINTIFY_WEBHOOK_SECRET
    const shopId = process.env.PRINTIFY_SHOP_ID || "22732326"

    console.log("Environment check:")
    console.log("- API Key present:", !!apiKey)
    console.log("- OpenSSL Secret present:", !!opensslSecret)
    console.log("- Shop ID:", shopId)

    // Check for required credentials
    if (!apiKey) {
      console.log("❌ Missing API key")
      return createMockResponse("Missing API key environment variable", shopId, startTime)
    }

    // Prepare headers
    const headers: Record<string, string> = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": "NoTrumpNWay-Store/1.0",
    }

    if (opensslSecret) {
      headers["X-Printify-Secret"] = opensslSecret
    }

    console.log("✅ Making API calls...")

    // Fetch shop info and products in parallel
    const [shopResponse, productsResponse] = await Promise.allSettled([
      fetchWithTimeout(`${PRINTIFY_API_BASE}/shops/${shopId}.json`, { headers }, API_TIMEOUT),
      fetchWithTimeout(`${PRINTIFY_API_BASE}/shops/${shopId}/products.json`, { headers }, API_TIMEOUT),
    ])

    let shopInfo = null
    let productsData = null

    // Process shop response
    if (shopResponse.status === "fulfilled" && shopResponse.value.ok) {
      try {
        shopInfo = await shopResponse.value.json()
        console.log("✅ Shop info retrieved successfully")
      } catch (error) {
        console.log("❌ Error parsing shop info:", error)
      }
    } else {
      console.log("❌ Shop info request failed:", shopResponse)
    }

    // Process products response
    if (productsResponse.status === "fulfilled" && productsResponse.value.ok) {
      try {
        productsData = await productsResponse.value.json()
        console.log("✅ Products retrieved successfully:", productsData.data?.length || 0, "products")
      } catch (error) {
        console.log("❌ Error parsing products:", error)
      }
    } else {
      console.log("❌ Products request failed:", productsResponse)
    }

    // If we have real data, use it; otherwise fall back to mock
    if (shopInfo && productsData) {
      const response = {
        shopInfo: {
          id: shopInfo.id,
          title: shopInfo.title,
          sales_channel: shopInfo.sales_channel,
          created_at: shopInfo.created_at,
          updated_at: shopInfo.updated_at,
        },
        products: transformProductsForStorefront(productsData.data || []),
        apiStats: {
          productsRetrieved: productsData.data?.length || 0,
          totalProducts: productsData.total || 0,
          apiCallDuration: Date.now() - startTime,
          timestamp: new Date().toISOString(),
          dataSource: "Printify API",
          pagination: {
            current_page: productsData.current_page,
            last_page: productsData.last_page,
          },
        },
      }

      console.log("✅ Returning real API data")
      return NextResponse.json(response)
    } else {
      console.log("⚠️ Falling back to mock data")
      return createMockResponse("API call failed, using mock data", shopId, startTime)
    }
  } catch (error) {
    console.log("❌ Unexpected error:", error)
    return createMockResponse(
      `Unexpected error: ${error instanceof Error ? error.message : "Unknown error"}`,
      "22732326",
      startTime,
    )
  }
}

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

function transformProductsForStorefront(products: any[]): any[] {
  return products.map((product) => ({
    id: product.id,
    title: product.title,
    description: product.description || "",
    tags: product.tags || [],
    options: product.options || [],
    variants: (product.variants || []).map((variant: any) => ({
      id: variant.id,
      price: variant.price, // Keep price in cents for storefront
      is_enabled: variant.is_enabled,
      is_default: variant.is_default || false,
      title: variant.title,
      options: variant.options || {},
    })),
    images: (product.images || []).map((image: any) => ({
      src: image.src || "/placeholder.svg?height=400&width=400",
      variant_ids: image.variant_ids || [],
      position: image.position || "front",
      is_default: image.is_default || false,
    })),
    created_at: product.created_at,
    updated_at: product.updated_at,
    visible: product.visible !== false, // Default to visible
    is_locked: product.is_locked || false,
    blueprint_id: product.blueprint_id,
    user_id: product.user_id,
    shop_id: product.shop_id,
  }))
}

function createMockResponse(errorMessage: string, shopId: string, startTime: number): Response {
  console.log("Creating mock response:", errorMessage)

  const mockProducts = [
    {
      id: "mock-product-1",
      title: "Anti-Trump Climate Action T-Shirt",
      description:
        "Make a statement with this premium quality t-shirt featuring anti-Trump climate action messaging. Perfect for rallies, protests, or everyday wear.",
      tags: ["Apparel", "T-Shirt", "Anti-Trump", "Climate Change"],
      options: [
        {
          name: "Size",
          type: "size",
          values: [
            { id: 1, title: "Small", colors: [] },
            { id: 2, title: "Medium", colors: [] },
            { id: 3, title: "Large", colors: [] },
            { id: 4, title: "XL", colors: [] },
          ],
        },
        {
          name: "Color",
          type: "color",
          values: [
            { id: 1, title: "Black", colors: ["#000000"] },
            { id: 2, title: "White", colors: ["#FFFFFF"] },
            { id: 3, title: "Navy", colors: ["#000080"] },
          ],
        },
      ],
      variants: [
        {
          id: 1,
          price: 2499, // Price in cents
          is_enabled: true,
          is_default: true,
          title: "Small / Black",
          options: { 1: 1, 2: 1 }, // Size: Small, Color: Black
        },
        {
          id: 2,
          price: 2499,
          is_enabled: true,
          is_default: false,
          title: "Medium / Black",
          options: { 1: 2, 2: 1 },
        },
        {
          id: 3,
          price: 2499,
          is_enabled: true,
          is_default: false,
          title: "Large / Black",
          options: { 1: 3, 2: 1 },
        },
      ],
      images: [
        {
          src: "/political-t-shirt.png",
          variant_ids: [1, 2, 3],
          position: "front",
          is_default: true,
        },
      ],
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z",
      visible: true,
      is_locked: false,
      blueprint_id: 5,
      user_id: 123456,
      shop_id: Number.parseInt(shopId),
    },
    {
      id: "mock-product-2",
      title: "Science Over Politics Coffee Mug",
      description:
        "Start your day with a reminder that science matters more than politics. This durable ceramic mug holds 11oz of your favorite beverage.",
      tags: ["Drinkware", "Mug", "Science", "Politics"],
      options: [
        {
          name: "Size",
          type: "size",
          values: [
            { id: 1, title: "11oz", colors: [] },
            { id: 2, title: "15oz", colors: [] },
          ],
        },
      ],
      variants: [
        {
          id: 4,
          price: 1699,
          is_enabled: true,
          is_default: true,
          title: "11oz",
          options: { 1: 1 },
        },
        {
          id: 5,
          price: 1899,
          is_enabled: true,
          is_default: false,
          title: "15oz",
          options: { 1: 2 },
        },
      ],
      images: [
        {
          src: "/political-mug.png",
          variant_ids: [4, 5],
          position: "front",
          is_default: true,
        },
      ],
      created_at: "2023-01-02T00:00:00Z",
      updated_at: "2023-01-02T00:00:00Z",
      visible: true,
      is_locked: false,
      blueprint_id: 11,
      user_id: 123456,
      shop_id: Number.parseInt(shopId),
    },
    {
      id: "mock-product-3",
      title: "Democracy Defender Hat",
      description:
        "Show your support for democracy with this comfortable and stylish hat. Features an embroidered design and adjustable strap.",
      tags: ["Accessories", "Hat", "Democracy", "Anti-Trump"],
      options: [
        {
          name: "Size",
          type: "size",
          values: [{ id: 1, title: "One Size", colors: [] }],
        },
        {
          name: "Color",
          type: "color",
          values: [
            { id: 1, title: "Blue", colors: ["#0000FF"] },
            { id: 2, title: "Red", colors: ["#FF0000"] },
            { id: 3, title: "Black", colors: ["#000000"] },
          ],
        },
      ],
      variants: [
        {
          id: 6,
          price: 2299,
          is_enabled: true,
          is_default: true,
          title: "One Size / Blue",
          options: { 1: 1, 2: 1 },
        },
      ],
      images: [
        {
          src: "/blue-hat-anti-trump.png",
          variant_ids: [6],
          position: "front",
          is_default: true,
        },
      ],
      created_at: "2023-01-03T00:00:00Z",
      updated_at: "2023-01-03T00:00:00Z",
      visible: true,
      is_locked: false,
      blueprint_id: 384,
      user_id: 123456,
      shop_id: Number.parseInt(shopId),
    },
    {
      id: "mock-product-4",
      title: "Climate Change is Real Bumper Sticker",
      description:
        "Spread awareness about climate change with this durable vinyl bumper sticker. Weather-resistant and long-lasting.",
      tags: ["Stickers", "Climate Change", "Activism"],
      options: [
        {
          name: "Size",
          type: "size",
          values: [{ id: 1, title: "Standard", colors: [] }],
        },
      ],
      variants: [
        {
          id: 7,
          price: 899,
          is_enabled: true,
          is_default: true,
          title: "Standard",
          options: { 1: 1 },
        },
      ],
      images: [
        {
          src: "/climate-change-bumper-sticker.png",
          variant_ids: [7],
          position: "front",
          is_default: true,
        },
      ],
      created_at: "2023-01-04T00:00:00Z",
      updated_at: "2023-01-04T00:00:00Z",
      visible: true,
      is_locked: false,
      blueprint_id: 17,
      user_id: 123456,
      shop_id: Number.parseInt(shopId),
    },
    {
      id: "mock-product-5",
      title: "Vote Blue Political Backpack",
      description:
        "Carry your essentials in style with this durable backpack featuring pro-democracy messaging. Multiple pockets and comfortable straps.",
      tags: ["Accessories", "Backpack", "Political", "Vote Blue"],
      options: [
        {
          name: "Size",
          type: "size",
          values: [{ id: 1, title: "Standard", colors: [] }],
        },
      ],
      variants: [
        {
          id: 8,
          price: 4599,
          is_enabled: true,
          is_default: true,
          title: "Standard",
          options: { 1: 1 },
        },
      ],
      images: [
        {
          src: "/anti-trump-backpack.png",
          variant_ids: [8],
          position: "front",
          is_default: true,
        },
      ],
      created_at: "2023-01-05T00:00:00Z",
      updated_at: "2023-01-05T00:00:00Z",
      visible: true,
      is_locked: false,
      blueprint_id: 71,
      user_id: 123456,
      shop_id: Number.parseInt(shopId),
    },
  ]

  const shopConfig = getShopConfig(shopId)

  const response = {
    shopInfo: {
      id: Number.parseInt(shopId),
      title: shopConfig.title + " (Mock)",
      sales_channel: shopConfig.salesChannel,
      created_at: "2023-01-01T00:00:00Z",
      updated_at: new Date().toISOString(),
    },
    products: mockProducts,
    apiStats: {
      productsRetrieved: mockProducts.length,
      totalProducts: mockProducts.length,
      apiCallDuration: Date.now() - startTime,
      timestamp: new Date().toISOString(),
      dataSource: "Mock Data",
      error: errorMessage,
    },
  }

  return NextResponse.json(response)
}
