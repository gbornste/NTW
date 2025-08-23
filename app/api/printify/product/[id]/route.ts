import { type NextRequest, NextResponse } from "next/server"
import { printifyService } from "@/lib/printify-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    console.log(`🔍 Fetching product with ID: ${id}`)

    // Fetch product from Printify service
    const product = await printifyService.getProduct(id)

    if (!product) {
      console.log(`❌ Product not found: ${id}`)
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Minimal processing - just ensure data types are correct
    const processedProduct = {
      id: String(product.id),
      title: String(product.title || "Unknown Product"),
      description: String(product.description || ""),
      images: Array.isArray(product.images) ? product.images : [],
      variants: Array.isArray(product.variants) ? product.variants : [],
      options: Array.isArray(product.options) ? product.options : [],
      tags: Array.isArray(product.tags) ? product.tags : [],
      created_at: product.created_at,
      updated_at: product.updated_at,
      isRealData: !product.id?.toString().includes("mock") && !product.id?.toString().includes("shop-"),
      isMockData: product.id?.toString().includes("mock") || product.id?.toString().includes("shop-"),
      dataSource: product.id?.toString().includes("mock") ? "mock" : "printify-api",
      rating: 4.8,
      reviewCount: 127,
      bestseller: Math.random() > 0.7,
    }

    console.log(`✅ Product processed:`, {
      id: processedProduct.id,
      title: processedProduct.title,
      variantsCount: processedProduct.variants.length,
      optionsCount: processedProduct.options.length,
      dataSource: processedProduct.dataSource,
    })

    return NextResponse.json(processedProduct)
  } catch (error) {
    console.error("❌ Error fetching product:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch product",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
