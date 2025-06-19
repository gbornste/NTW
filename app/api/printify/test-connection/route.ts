import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("=== Testing Printify Connection ===")

    const apiKey = process.env.PRINTIFY_API_TOKEN
    const shopId = process.env.PRINTIFY_SHOP_ID

    console.log("API Key present:", !!apiKey)
    console.log("Shop ID:", shopId)

    if (!apiKey || !shopId) {
      return NextResponse.json({
        success: false,
        error: "Missing credentials",
        details: {
          hasApiKey: !!apiKey,
          hasShopId: !!shopId,
        },
      })
    }

    // Test shop access first
    const shopUrl = `https://api.printify.com/v1/shops/${shopId}.json`
    console.log("Testing shop URL:", shopUrl)

    const shopResponse = await fetch(shopUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    })

    console.log("Shop response status:", shopResponse.status)

    if (!shopResponse.ok) {
      const errorText = await shopResponse.text()
      console.log("Shop error:", errorText)

      return NextResponse.json({
        success: false,
        error: `Shop access failed: ${shopResponse.status}`,
        details: {
          status: shopResponse.status,
          statusText: shopResponse.statusText,
          errorText,
          shopId,
        },
      })
    }

    const shopData = await shopResponse.json()
    console.log("Shop data:", shopData)

    // Now test products
    const productsUrl = `https://api.printify.com/v1/shops/${shopId}/products.json`
    console.log("Testing products URL:", productsUrl)

    const productsResponse = await fetch(productsUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    })

    console.log("Products response status:", productsResponse.status)

    if (!productsResponse.ok) {
      const errorText = await productsResponse.text()
      console.log("Products error:", errorText)

      return NextResponse.json({
        success: false,
        error: `Products fetch failed: ${productsResponse.status}`,
        shopData,
        details: {
          status: productsResponse.status,
          statusText: productsResponse.statusText,
          errorText,
        },
      })
    }

    const productsData = await productsResponse.json()
    console.log("Products data:", {
      total: productsData.data?.length,
      currentPage: productsData.current_page,
      lastPage: productsData.last_page,
    })

    return NextResponse.json({
      success: true,
      message: "Connection successful!",
      shopData,
      productsData: {
        total: productsData.data?.length || 0,
        currentPage: productsData.current_page,
        lastPage: productsData.last_page,
        sampleProducts: productsData.data?.slice(0, 3) || [],
      },
    })
  } catch (error) {
    console.error("Connection test error:", error)

    return NextResponse.json({
      success: false,
      error: "Connection test failed",
      details: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
