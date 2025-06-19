import { NextResponse } from "next/server"

const PRINTIFY_API_URL = "https://api.printify.com/v1"
const API_TOKEN =
  process.env.PRINTIFY_API_TOKEN ||
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzN2Q0YmQzMDM1ZmUxMWU5YTgwM2FiN2VlYjNjY2M5NyIsImp0aSI6IjU0ODg1ZjkzMWNiN2RkZjdlYjI1ODlhYjYwNGRlNGE0MzA3ZjE1OTExNDBiNmJhYTM4NDAxNTBmNTI2MDg1Y2ZhOGE2ZDhlZTZlNTk1ZTI2IiwiaWF0IjoxNzQ3ODM3MTgyLjE2NTk0NiwibmJmIjoxNzQ3ODM3MTgyLjE2NTk0OSwiZXhwIjoxNzc5MzczMTgyLjE1OTYyNCwic3ViIjoiMjI5OTk5NzciLCJzY29wZXMiOlsic2hvcHMubWFuYWdlIiwic2hvcHMucmVhZCIsImNhdGFsb2cucmVhZCIsIm9yZGVycy5yZWFkIiwib3JkZXJzLndyaXRlIiwicHJvZHVjdHMucmVhZCIsInByb2R1Y3RzLndyaXRlIiwid2ViaG9va3MucmVhZCIsIndlYmhvb2tzLndyaXRlIiwidXBsb2Fkcy5yZWFkIiwidXBsb2Fkcy53cml0ZSIsInByaW50X3Byb3ZpZGVycy5yZWFkIiwidXNlci5pbmZvIl19.e3lkshF0c22sZSh03AScGxOkoTMi0hHFCRHRvxzZjEFQZXEJqnAEqHtyrS_-vu1a17kcH4zJNZYm9d1Tk1zVPoRLRCO947ajfOd1YkeidAtUuMemm9HLPo6Ha6naon6y9ZC4LNiw2DxfE6gtC4v-RC-SD6jpGo5yAL184SlN3at4GaLceBXn6GLB2tRH6b1FX_h1RzQYViytiL2GSaT3i6c5cnudF5vDGOoKlfJ7k7MvVn6WBFQMbrS-5j7jrk04-RshpOqhKlC3QAYwardddAga1PKrNuJwUSXJXtHXjrNkicTndBok2x0TkqIABfdRNorFPt2feN-iIRh4zaqqNsYjZswvF2brkdBVrOSGq2mTqLHKcTeW6Gtv55FG9N6jz9RCBgZcm1WfVRhNfG-6qTDEq7Q8jGrK2Pd-Wof7JPpYl1f6YErdydG-xdAI-lxnjus0p6ZpLfi7fXjuY39Cd5cgLffwUB_27-XvXWSM3vC5JPZLs_4lyfUlYI27IT76TwXCOwR7Zq_q25-nPj99ePShTrle3PAcKFAFU4U6MVNpKW8u63wW3ObvK2vtd2HsQzfvhKy_EYGxCo1Vo1tdxptDTtcc-YCwuQUYnia5uTYchFSH_-G5sJfj79EKpPrn1wzE_7TzSCCXW-LNSeZg2_6l2jh1KTe0T5ewfmwKSA"

// Store name for identification
const STORE_NAME = "NoTrumpNWay"

export async function POST(request: Request) {
  try {
    // Parse the order data from the request
    const orderData = await request.json()

    // Step 1: Get shops to find the NoTrumpNWay shop
    console.log("Fetching shops from Printify API...")
    const shopsResponse = await fetch(`${PRINTIFY_API_URL}/shops.json`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
    })

    if (!shopsResponse.ok) {
      throw new Error(`Failed to fetch shops: ${shopsResponse.status}`)
    }

    const shopsData = await shopsResponse.json()

    if (!shopsData.data || shopsData.data.length === 0) {
      throw new Error("No shops found in your Printify account")
    }

    // Find the NoTrumpNWay shop specifically
    const noTrumpNWayShop = shopsData.data.find(
      (shop: any) =>
        shop.title.toLowerCase().includes("notrumpnway") || shop.title.toLowerCase().includes("no trump n way"),
    )

    // If we can't find the specific shop, use the first one
    const shopToUse = noTrumpNWayShop || shopsData.data[0]
    const shopId = shopToUse.id

    console.log(`Using shop ID: ${shopId} to create order`)

    // Step 2: Create the order in the specific shop
    const orderResponse = await fetch(`${PRINTIFY_API_URL}/shops/${shopId}/orders.json`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })

    if (!orderResponse.ok) {
      const errorText = await orderResponse.text()
      console.error(`Failed to create order: ${orderResponse.status}`, errorText)
      throw new Error(`Failed to create order: ${orderResponse.status}`)
    }

    const order = await orderResponse.json()
    return NextResponse.json(order)
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create order",
        success: false,
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    // Step 1: Get shops to find the NoTrumpNWay shop
    console.log("Fetching shops from Printify API...")
    const shopsResponse = await fetch(`${PRINTIFY_API_URL}/shops.json`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
    })

    if (!shopsResponse.ok) {
      throw new Error(`Failed to fetch shops: ${shopsResponse.status}`)
    }

    const shopsData = await shopsResponse.json()

    if (!shopsData.data || shopsData.data.length === 0) {
      throw new Error("No shops found in your Printify account")
    }

    // Find the NoTrumpNWay shop specifically
    const noTrumpNWayShop = shopsData.data.find(
      (shop: any) =>
        shop.title.toLowerCase().includes("notrumpnway") || shop.title.toLowerCase().includes("no trump n way"),
    )

    // If we can't find the specific shop, use the first one
    const shopToUse = noTrumpNWayShop || shopsData.data[0]
    const shopId = shopToUse.id

    console.log(`Using shop ID: ${shopId} to fetch orders`)

    // Step 2: Fetch orders for this shop
    const ordersResponse = await fetch(`${PRINTIFY_API_URL}/shops/${shopId}/orders.json`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
    })

    if (!ordersResponse.ok) {
      throw new Error(`Failed to fetch orders: ${ordersResponse.status}`)
    }

    const orders = await ordersResponse.json()
    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch orders",
        data: [],
      },
      { status: 500 },
    )
  }
}
