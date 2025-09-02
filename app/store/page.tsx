"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ResponsiveProductImage } from "@/components/responsive-product-image"
import {
  AlertCircle,
  ShoppingCart,
  Filter,
  Search,
  Tag,
  RefreshCw,
  Bug,
  CheckCircle,
  XCircle,
  Database,
  Heart,
} from "lucide-react"
import Link from "next/link"
import { useFavorites } from "@/contexts/favorites-context"

interface Product {
  id: string
  title: string
  description: string
  images: {
    src: string
    is_default: boolean
    alt?: string
  }[]
  variants: {
    id: string | number
    title: string
    price: number
    is_enabled: boolean
  }[]
  tags: string[]
}

interface StoreData {
  data: Product[]
  isMockData: boolean
  realDataSource: boolean
  shopTitle: string
  shopId: string
  error?: string
  message?: string
  fallbackReason?: string
  apiCallDuration?: number
  timestamp: string
}

export default function StorePage() {
  const [storeData, setStoreData] = useState<StoreData | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [categories, setCategories] = useState<string[]>([])
  const [retryCount, setRetryCount] = useState(0)

  const { itemCount: favoritesCount, toggleFavorite, isFavorite } = useFavorites()

  const fetchProducts = async (showLoading = true) => {
    if (showLoading) setLoading(true)
    setError(null)

    try {
      console.log("🛍️ Fetching products for store page...")
      const response = await fetch("/api/printify/products", {
        cache: "no-store",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })

      console.log("Store page API response status:", response.status)
      console.log("Store page API response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Store page received data:", {
        productsCount: data.data?.length || 0,
        isMockData: data.isMockData,
        realDataSource: data.realDataSource,
        shopId: data.shopId,
        shopTitle: data.shopTitle,
        hasError: !!data.error,
        hasFallbackReason: !!data.fallbackReason,
      })

      // Store complete response data
      setStoreData({
        data: data.data || [],
        isMockData: !!data.isMockData,
        realDataSource: !!data.realDataSource,
        shopTitle: data.shopTitle || "NoTrumpNWay Store",
        shopId: data.shopId || "Unknown",
        error: data.error,
        message: data.message,
        fallbackReason: data.fallbackReason,
        apiCallDuration: data.apiCallDuration,
        timestamp: data.timestamp || new Date().toISOString(),
      })

      if (!data.data || !Array.isArray(data.data)) {
        throw new Error("Invalid API response format: missing data array")
      }

      // Transform and validate products
      const transformedProducts: Product[] = data.data
        .map((product: any, index: number): Product | null => {
          try {
            // Validate required fields
            if (!product.id || !product.title) {
              console.warn(`Product ${index} missing required fields:`, product)
              return null
            }

            // Transform price from cents to dollars if needed
            const transformedVariants = (product.variants || []).map((variant: any) => ({
              ...variant,
              id: String(variant.id),
              price: typeof variant.price === "number" && variant.price > 100 ? variant.price / 100 : variant.price,
            }))

            // Ensure images array exists and has valid sources
            const transformedImages = (product.images || []).map((image: any) => ({
              ...image,
              src: image.src || "/placeholder.svg?height=400&width=400",
              alt: image.alt || product.title,
            }))

            // If no images, add a placeholder
            if (!transformedImages.length) {
              transformedImages.push({
                src: "/placeholder.svg?height=400&width=400",
                is_default: true,
                alt: product.title,
              })
            }

            return {
              ...product,
              variants: transformedVariants,
              images: transformedImages,
              tags: Array.isArray(product.tags) ? product.tags : [],
              description: product.description || "No description available",
            }
          } catch (err) {
            console.error(`Error transforming product ${index}:`, err)
            return null
          }
        })
        .filter((product: Product | null): product is Product => product !== null)

      console.log(`✅ Transformed ${transformedProducts.length} valid products`)
      setProducts(transformedProducts)

      // Extract unique categories from product tags, excluding MOCK-DATA tag
      const allTags = transformedProducts.flatMap((product: Product) => 
        product.tags.filter((tag: string) => tag !== "MOCK-DATA")
      )
      const uniqueCategories: string[] = Array.from(new Set(allTags)).sort()
      setCategories(uniqueCategories)
    } catch (err) {
      console.error("❌ Error fetching products:", err)
      setError(err instanceof Error ? err.message : "Failed to load products")
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Auto-refresh every 30 seconds if using mock data
  useEffect(() => {
    if (storeData?.isMockData && !loading) {
      const interval = setInterval(() => {
        console.log("🔄 Auto-refreshing to check for real data...")
        fetchProducts(false)
      }, 30000)
      return () => clearInterval(interval)
    }
  }, [storeData?.isMockData, loading])

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
    fetchProducts()
  }

  // Filter products based on search term and category
  const filteredProducts = products.filter((product) => {
    try {
      const matchesSearch =
        !searchTerm ||
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory =
        selectedCategory === "all" || product.tags.some((tag) => tag.toLowerCase() === selectedCategory.toLowerCase())

      return matchesSearch && matchesCategory
    } catch (err) {
      console.error("Error filtering product:", product.id, err)
      return false
    }
  })

  // Get price range for a product
  const getPriceRange = (variants: Product["variants"]) => {
    try {
      const enabledVariants = variants.filter((v) => v.is_enabled)
      if (enabledVariants.length === 0) return "Out of stock"

      const prices = enabledVariants.map((v) => v.price)
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)

      const formatPrice = (price: number) => `$${price.toFixed(2)}`

      if (minPrice === maxPrice) {
        return formatPrice(minPrice)
      } else {
        return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
      }
    } catch (err) {
      console.error("Error getting price range:", err)
      return "Price unavailable"
    }
  }

  return (
    <div className="container py-8">
      {/* Header with data source indicator and favorites */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">NoTrumpNWay Store</h1>
          <p className="text-muted-foreground">
            Browse our collection of anti-Trump merchandise and political products
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Favorites button */}
          <Link href="/store/favorites">
            <Button variant="outline" className="flex items-center gap-2">
              <Heart className={`h-4 w-4 ${favoritesCount > 0 ? "text-red-500 fill-current" : ""}`} />
              Favorites
              {favoritesCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {favoritesCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* Data source indicator */}
          {storeData && (
            <div className="flex items-center gap-2">
              {storeData.isMockData ? (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <XCircle className="h-3 w-3" />
                  Mock Data
                </Badge>
              ) : (
                <Badge variant="default" className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Real Data
                </Badge>
              )}

              <Badge variant="outline" className="flex items-center gap-1">
                <Database className="h-3 w-3" />
                {storeData.shopId}
              </Badge>
            </div>
          )}

          {/* Debug link */}
          <Link
            href="/debug/printify-diagnostics"
            className="text-xs text-muted-foreground hover:underline flex items-center"
          >
            <Bug className="h-3 w-3 mr-1" />
            Diagnostics
          </Link>
        </div>
      </div>

      {/* Data source alert */}
      {storeData?.isMockData && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>⚠️ Using Mock Data</AlertTitle>
          <AlertDescription>
            <div className="space-y-2">
              <p>Real Printify product data could not be loaded. Showing sample products instead.</p>
              {storeData.fallbackReason && (
                <p className="text-sm">
                  <strong>Reason:</strong> {storeData.fallbackReason}
                </p>
              )}
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" onClick={handleRetry}>
                  <RefreshCw className="h-3 w-3 mr-2" />
                  Retry ({retryCount})
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/debug/store-diagnostics">
                    <Bug className="h-3 w-3 mr-2" />
                    Diagnose Issue
                  </Link>
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Success indicator for real data */}
      {storeData && !storeData.isMockData && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">✅ Real Data Active</AlertTitle>
          <AlertDescription className="text-green-700">
            <div className="flex items-center justify-between">
              <span>Successfully loaded {products.length} products from your Printify shop</span>
              <Badge variant="outline" className="bg-white">
                {storeData.shopTitle}
              </Badge>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Search and filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            className="border rounded p-2 bg-background"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category.toLowerCase()}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Status information */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products
          </span>

          {selectedCategory !== "all" && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {selectedCategory}
            </Badge>
          )}

          {searchTerm && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Search className="h-3 w-3" />
              {searchTerm}
            </Badge>
          )}
        </div>

        {storeData?.apiCallDuration && (
          <Badge variant="outline" className="text-xs">
            {storeData.apiCallDuration}ms
          </Badge>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center gap-2">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            <p>Loading products...</p>
            <p className="text-sm text-muted-foreground">Connecting to Printify API...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800">Error loading products</h3>
              <p className="text-red-700 mt-1">{error}</p>
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm" onClick={handleRetry}>
                  <RefreshCw className="h-3 w-3 mr-2" />
                  Retry
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/debug/store-diagnostics">
                    <Bug className="h-3 w-3 mr-2" />
                    Diagnose
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No products state */}
      {!loading && !error && filteredProducts.length === 0 && (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">
            {products.length > 0
              ? "Try adjusting your search or filter criteria"
              : "There are no products available at this time"}
          </p>
          {products.length > 0 && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("all")
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      )}

      {/* Products grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden flex flex-col h-full">
            <div className="aspect-square relative bg-muted overflow-hidden">
              <ResponsiveProductImage
                src={product.images[0]?.src || "/placeholder.svg?height=400&width=400&query=product"}
                alt={product.images[0]?.alt || product.title}
                className="object-cover w-full h-full"
              />
            </div>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">{product.title}</CardTitle>
              <div className="flex flex-wrap gap-1 mt-2">
                {product.tags
                  .filter((tag) => tag !== "MOCK-DATA")
                  .slice(0, 3)
                  .map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                {product.tags.filter((tag) => tag !== "MOCK-DATA").length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{product.tags.filter((tag) => tag !== "MOCK-DATA").length - 3}
                  </Badge>
                )}
                {/* Show mock data indicator */}
                {product.tags.includes("MOCK-DATA") && (
                  <Badge variant="destructive" className="text-xs">
                    MOCK
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex-grow">
              <p className="text-muted-foreground text-sm line-clamp-3">{product.description}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between items-center">
              <div className="font-medium">{getPriceRange(product.variants)}</div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    toggleFavorite({
                      id: product.id,
                      title: product.title,
                      description: product.description,
                      image: product.images[0]?.src || "/placeholder.svg?height=400&width=400",
                      price: getPriceRange(product.variants),
                      tags: product.tags,
                      dateAdded: new Date().toISOString(),
                    })
                  }
                  className={`p-2 ${isFavorite(product.id) ? "text-red-500" : "text-muted-foreground hover:text-red-500"}`}
                >
                  <Heart className={`h-4 w-4 ${isFavorite(product.id) ? "fill-current" : ""}`} />
                  <span className="sr-only">
                    {isFavorite(product.id) ? "Remove from favorites" : "Add to favorites"}
                  </span>
                </Button>
                <Button size="sm" asChild>
                  <Link href={`/store/product/${product.id}`}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    View
                  </Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Debug information */}
      {storeData && (
        <Tabs defaultValue="summary" className="mt-12 border-t pt-6">
          <TabsList>
            <TabsTrigger value="summary">Data Summary</TabsTrigger>
            <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
          </TabsList>
          <TabsContent value="summary" className="mt-2">
            <div className="bg-muted p-4 rounded text-xs font-mono space-y-1">
              <div>Data Source: {storeData.isMockData ? "Mock/Fallback" : "Real Printify API"}</div>
              <div>Shop ID: {storeData.shopId}</div>
              <div>Shop Title: {storeData.shopTitle}</div>
              <div>Products Count: {products.length}</div>
              <div>Filtered Products: {filteredProducts.length}</div>
              <div>Categories: {categories.join(", ")}</div>
              <div>API Call Duration: {storeData.apiCallDuration}ms</div>
              <div>Last Updated: {new Date(storeData.timestamp).toLocaleString()}</div>
              {storeData.error && <div className="text-red-600">Error: {storeData.error}</div>}
            </div>
          </TabsContent>
          <TabsContent value="diagnostics" className="mt-2">
            <div className="space-y-4">
              <Button asChild>
                <Link href="/debug/store-diagnostics">
                  <Bug className="h-4 w-4 mr-2" />
                  Run Full Store Diagnostics
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/debug/printify-diagnostics">
                  <Database className="h-4 w-4 mr-2" />
                  Printify API Diagnostics
                </Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
