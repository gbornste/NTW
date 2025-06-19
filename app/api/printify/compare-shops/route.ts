import { type NextRequest, NextResponse } from "next/server"
import { PrintifyShopComparator } from "@/lib/printify-shop-comparator"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const shop1 = searchParams.get("shop1") || "22732326"
  const shop2 = searchParams.get("shop2") || "22108081"

  try {
    console.log(`🔍 Comparing shops: ${shop1} vs ${shop2}`)

    const comparator = new PrintifyShopComparator()
    const result = await comparator.compareShops(shop1, shop2)

    console.log(`✅ Comparison completed:`, {
      shop1Accessible: result.shop1.accessible,
      shop2Accessible: result.shop2.accessible,
      bothAccessible: result.comparison.bothAccessible,
      differencesFound: result.comparison.differences.length,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("❌ Shop comparison failed:", error)

    return NextResponse.json(
      {
        error: "Shop comparison failed",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
