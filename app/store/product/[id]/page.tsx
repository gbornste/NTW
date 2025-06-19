"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { ResponsiveProductImage } from "@/components/responsive-product-image"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"
import {
  ShoppingCart,
  ArrowLeft,
  Loader2,
  Heart,
  Share2,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Plus,
  Minus,
  Info,
  RefreshCw,
  Package,
  Zap,
  Gift,
  MessageSquare,
  Palette,
  Ruler,
  Clock,
  ShoppingBag,
  CheckCircle,
  XCircle,
  Maximize2,
  ThumbsUp,
  Users,
  TrendingUp,
  Award,
  Verified,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"

// Helper function to safely extract display value from any type
const getDisplayValue = (value: any): string => {
  if (value === null || value === undefined) return ""

  // If it's already a string, return it
  if (typeof value === "string") {
    // Check if it's a stringified object
    if (value === "[object Object]" || value.startsWith("{") || value.startsWith("[")) {
      try {
        const parsed = JSON.parse(value)
        return getDisplayValue(parsed)
      } catch {
        return "Option"
      }
    }
    return value.trim()
  }

  // If it's a number, convert to string
  if (typeof value === "number") {
    return String(value)
  }

  // If it's an object, try to extract meaningful value
  if (typeof value === "object" && value !== null) {
    // Try common property names
    if (value.name) return String(value.name)
    if (value.title) return String(value.title)
    if (value.label) return String(value.label)
    if (value.value) return String(value.value)
    if (value.text) return String(value.text)

    // If it's an array, join string elements
    if (Array.isArray(value)) {
      const stringElements = value
        .filter((item) => typeof item === "string" || typeof item === "number")
        .map((item) => String(item))
        .filter(Boolean)

      if (stringElements.length > 0) {
        return stringElements.join(", ")
      }
    }

    // Last resort: try to find any string property
    const stringProps = Object.values(value).filter((v) => typeof v === "string" && v.length > 0)

    if (stringProps.length > 0) {
      return String(stringProps[0])
    }
  }

  // Fallback
  return String(value) === "[object Object]" ? "Option" : String(value)
}

interface ProductImage {
  src: string
  is_default: boolean
  alt?: string
  position?: string
  width?: number
  height?: number
}

interface ProductVariant {
  id: string
  title: string
  price: number
  is_enabled: boolean
  options: Record<string, string>
  stock_quantity?: number
}

interface ProductOption {
  name: string
  type: string
  values: string[]
}

interface Product {
  id: string
  title: string
  description: string
  images: ProductImage[]
  variants: ProductVariant[]
  options: ProductOption[]
  tags: string[]
  created_at?: string
  updated_at?: string
  isRealData?: boolean
  isMockData?: boolean
  dataSource?: string
  error?: string
  rating?: number
  reviewCount?: number
  bestseller?: boolean
}

export default function ProductDetailsPage() {
  const params = useParams()
  const router = useRouter()

  // Product State
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  // Selection State
  const [selectedVariant, setSelectedVariant] = useState<string>("")
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)

  // UI State
  const [addingToCart, setAddingToCart] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Customization State
  const [customization, setCustomization] = useState({
    giftWrap: false,
    giftMessage: "",
    specialInstructions: "",
    rushDelivery: false,
    expressShipping: false,
  })

  const { addItem, state: cartState } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
    if (params.id) {
      fetchProduct(String(params.id))
    }
  }, [params.id])

  const fetchProduct = async (id: string, isRetry = false) => {
    try {
      setLoading(true)
      setError(null)

      console.log(`🔍 Fetching product with ID: ${id} (retry: ${isRetry})`)

      const response = await fetch(`/api/printify/product/${id}`, {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch product`)
      }

      const data = await response.json()
      console.log("✅ Product data received:", data)

      // Use the data as-is from the API
      const processedProduct: Product = {
        ...data,
        id: String(data.id || id),
        title: String(data.title || "Unknown Product"),
        description: String(data.description || "No description available"),
        images:
          Array.isArray(data.images) && data.images.length > 0
            ? data.images
            : [
                {
                  src: "/placeholder.svg?height=600&width=600&text=Product+Image",
                  is_default: true,
                  alt: "Product Image",
                  position: "front",
                  width: 600,
                  height: 600,
                },
              ],
        variants:
          Array.isArray(data.variants) && data.variants.length > 0
            ? data.variants
            : [
                {
                  id: "default-variant",
                  title: "Default",
                  price: 19.99,
                  is_enabled: true,
                  options: { Size: "Medium", Color: "Black" },
                  stock_quantity: 50,
                },
              ],
        options:
          Array.isArray(data.options) && data.options.length > 0
            ? data.options
            : [
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
              ],
        tags: Array.isArray(data.tags) ? data.tags : [],
      }

      setProduct(processedProduct)

      // Set default variant and options
      if (processedProduct.variants.length > 0) {
        const enabledVariants = processedProduct.variants.filter((v) => v.is_enabled)
        const defaultVariant = enabledVariants[0] || processedProduct.variants[0]
        setSelectedVariant(String(defaultVariant.id))

        // Set initial options based on the default variant
        const initialOptions: Record<string, string> = {}
        processedProduct.options.forEach((option) => {
          const variantValue = defaultVariant.options[option.name]
          const cleanVariantValue = getDisplayValue(variantValue)

          // Find matching option value
          const matchingValue = option.values.find((optVal) => {
            const cleanOptVal = getDisplayValue(optVal)
            return cleanOptVal === cleanVariantValue
          })

          if (matchingValue) {
            initialOptions[option.name] = getDisplayValue(matchingValue)
          } else if (option.values.length > 0) {
            initialOptions[option.name] = getDisplayValue(option.values[0])
          }
        })

        setSelectedOptions(initialOptions)
        console.log("🎯 Default variant and options set:", {
          variant: defaultVariant.title,
          options: initialOptions,
        })
      }

      // Set default image
      if (processedProduct.images.length > 0) {
        const defaultImage = processedProduct.images.find((img) => img.is_default) || processedProduct.images[0]
        const defaultIndex = processedProduct.images.indexOf(defaultImage)
        setSelectedImageIndex(defaultIndex >= 0 ? defaultIndex : 0)
      }

      // Load favorites from localStorage
      if (mounted) {
        const favorites = JSON.parse(localStorage.getItem("product-favorites") || "[]")
        setIsFavorite(favorites.includes(processedProduct.id))
      }

      setRetryCount(0)
    } catch (err) {
      console.error("❌ Error fetching product:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to load product"
      setError(errorMessage)

      if (!isRetry && retryCount < 2) {
        setRetryCount((prev) => prev + 1)
        setTimeout(() => fetchProduct(id, true), 2000)
        return
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    // Check if product exists
    if (!product) {
      toast({
        title: "Product Error",
        description: "Product information is not available",
        variant: "destructive",
      })
      return
    }

    // Auto-select first available variant if none selected
    let variantToUse = selectedVariantData
    if (!variantToUse && product.variants.length > 0) {
      const enabledVariants = product.variants.filter((v) => v.is_enabled)
      variantToUse = enabledVariants[0] || product.variants[0]
      setSelectedVariant(String(variantToUse.id))
    }

    if (!variantToUse) {
      toast({
        title: "Product Unavailable",
        description: "This product is currently unavailable",
        variant: "destructive",
      })
      return
    }

    // Check if variant is enabled/in stock
    if (!variantToUse.is_enabled) {
      toast({
        title: "Out of Stock",
        description: "This product variant is currently out of stock",
        variant: "destructive",
      })
      return
    }

    // Check stock quantity if available
    if (variantToUse.stock_quantity !== undefined && variantToUse.stock_quantity < quantity) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${variantToUse.stock_quantity} items available. Please reduce quantity.`,
        variant: "destructive",
      })
      return
    }

    try {
      setAddingToCart(true)

      // Ensure price is in dollars (API might return cents)
      const price = variantToUse.price > 100 ? variantToUse.price / 100 : variantToUse.price

      // Clean up the options for the cart item
      const cleanOptions: Record<string, string> = {}
      Object.entries(variantToUse.options).forEach(([key, value]) => {
        cleanOptions[key] = getDisplayValue(value)
      })

      // Calculate total with add-ons
      const baseTotal = price * quantity
      let additionalCosts = 0
      if (customization.giftWrap) additionalCosts += 2.99
      if (customization.rushDelivery) additionalCosts += 9.99
      if (customization.expressShipping) additionalCosts += 15.99

      const cartItem = {
        id: `${product.id}-${variantToUse.id}-${Date.now()}`,
        productId: String(product.id),
        variantId: String(variantToUse.id),
        name: String(product.title),
        price: Number(price),
        quantity: Number(quantity),
        image: String(
          product.images[selectedImageIndex]?.src || product.images[0]?.src || "/placeholder.svg?height=300&width=300",
        ),
        variant: String(variantToUse.title),
        variantTitle: String(variantToUse.title),
        options: cleanOptions,
        customization,
      }

      console.log("🛒 Adding item to cart:", cartItem)
      addItem(cartItem)

      toast({
        title: "Added to cart!",
        description: `${quantity} × ${product.title} added for ${formatPrice(baseTotal + additionalCosts)}`,
        action: (
          <Button variant="outline" size="sm" onClick={() => router.push("/store/cart")}>
            View Cart
          </Button>
        ),
      })

      // Reset quantity after successful add
      setQuantity(1)
    } catch (err) {
      console.error("❌ Error adding to cart:", err)
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      setAddingToCart(false)
    }
  }

  const handleBuyNow = async () => {
    // Use the same validation logic as Add to Cart
    await handleAddToCart()

    // Only redirect if there was no error (check if we're still on the page)
    if (!error && selectedVariantData?.is_enabled) {
      router.push("/store/cart")
    }
  }

  const handleOptionChange = (optionName: string, value: string) => {
    const cleanValue = getDisplayValue(value)
    console.log(`🔄 Option change: ${optionName} = ${value} -> ${cleanValue}`)

    const newOptions = { ...selectedOptions, [optionName]: cleanValue }
    setSelectedOptions(newOptions)

    console.log(`🔄 New selected options:`, newOptions)

    // Find matching variant with improved matching logic
    const matchingVariant = product?.variants.find((variant) => {
      return Object.entries(newOptions).every(([key, val]) => {
        const variantValue = getDisplayValue(variant.options[key])
        const isMatch = variantValue === val
        console.log(`    Checking ${key}: "${val}" === "${variantValue}" = ${isMatch}`)
        return isMatch
      })
    })

    if (matchingVariant) {
      setSelectedVariant(String(matchingVariant.id))
      console.log("🎯 Variant changed to:", {
        id: matchingVariant.id,
        title: matchingVariant.title,
        options: matchingVariant.options,
        price: matchingVariant.price,
        enabled: matchingVariant.is_enabled,
      })
    } else {
      // If no exact match, find the first available variant
      const availableVariants = product?.variants.filter((v) => v.is_enabled) || []
      if (availableVariants.length > 0) {
        const fallbackVariant = availableVariants[0]
        setSelectedVariant(String(fallbackVariant.id))
        console.log("🔄 Using fallback variant:", fallbackVariant.title)
      }
    }
  }

  const handleQuantityChange = (newQuantity: number) => {
    const maxQuantity = selectedVariantData?.stock_quantity || 10
    const clampedQuantity = Math.max(1, Math.min(maxQuantity, newQuantity))
    setQuantity(clampedQuantity)

    // Show warning if user tried to exceed stock
    if (newQuantity > maxQuantity && selectedVariantData?.stock_quantity) {
      toast({
        title: "Stock Limit",
        description: `Only ${maxQuantity} items available for this variant`,
        variant: "destructive",
      })
    }
  }

  const formatPrice = (price: number) => {
    const priceInDollars = price > 100 ? price / 100 : price
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(priceInDollars)
  }

  const calculateTotalPrice = () => {
    const selectedVariantData = product?.variants.find((v) => v.id === selectedVariant)
    if (!selectedVariantData) {
      // Use first available variant if none selected
      const enabledVariants = product?.variants.filter((v) => v.is_enabled) || []
      const defaultVariant = enabledVariants[0] || product?.variants[0]
      if (!defaultVariant) return 0

      const basePrice = defaultVariant.price > 100 ? defaultVariant.price / 100 : defaultVariant.price
      let total = basePrice * quantity

      if (customization.giftWrap) total += 2.99
      if (customization.rushDelivery) total += 9.99
      if (customization.expressShipping) total += 15.99

      return total
    }

    const basePrice = selectedVariantData.price > 100 ? selectedVariantData.price / 100 : selectedVariantData.price
    let total = basePrice * quantity

    if (customization.giftWrap) total += 2.99
    if (customization.rushDelivery) total += 9.99
    if (customization.expressShipping) total += 15.99

    return total
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product?.title || "Product",
          text: product?.description || "Check out this product",
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Link copied!",
          description: "Product link copied to clipboard",
        })
      }
    } catch (err) {
      console.log("Share cancelled or failed")
    }
  }

  const toggleFavorite = () => {
    if (!product || !mounted) return

    const favorites = JSON.parse(localStorage.getItem("product-favorites") || "[]")
    let newFavorites

    if (isFavorite) {
      newFavorites = favorites.filter((id: string) => id !== product.id)
    } else {
      newFavorites = [...favorites, product.id]
    }

    localStorage.setItem("product-favorites", JSON.stringify(newFavorites))
    setIsFavorite(!isFavorite)

    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite ? "Product removed from your favorites" : "Product added to your favorites",
    })
  }

  // Show loading state while product is loading
  if (!mounted || loading) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Loading Product</h2>
              <p className="text-muted-foreground">
                {retryCount > 0 ? `Retrying... (${retryCount}/2)` : "Fetching product details..."}
              </p>
              <Progress value={33 + retryCount * 33} className="w-64 mx-auto" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container py-10">
        <Button variant="outline" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Store
        </Button>
        <div className="max-w-md mx-auto text-center">
          <Card>
            <CardContent className="pt-6">
              <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Product Not Found</h3>
              <p className="text-muted-foreground mb-6">{error || "The product you're looking for doesn't exist."}</p>
              <div className="space-y-3">
                <Button onClick={() => fetchProduct(String(params.id))} className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button variant="outline" onClick={() => router.push("/store")} className="w-full">
                  Browse All Products
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const selectedVariantData = product.variants.find((v) => v.id === selectedVariant)
  const isInCart = cartState.items.some((item) => item.productId === product.id)
  const totalPrice = calculateTotalPrice()

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Data Source & Status Indicators */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/store" className="hover:text-foreground transition-colors">
            Store
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate max-w-[200px]">{String(product.title)}</span>
        </nav>

        <div className="flex items-center gap-2 flex-wrap">
          {product.bestseller && (
            <Badge variant="default" className="bg-orange-500 text-xs sm:text-sm">
              <Award className="h-3 w-3 mr-1" />
              Bestseller
            </Badge>
          )}
          {product.isRealData ? (
            <Badge variant="default" className="bg-green-500 text-xs sm:text-sm">
              <Verified className="h-3 w-3 mr-1" />
              Live Data
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-xs sm:text-sm">
              <Info className="h-3 w-3 mr-1" />
              Demo Data
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-12">
        {/* Enhanced Product Images Section */}
        <div className="space-y-4">
          {/* Main Product Image */}
          <div className="relative w-full aspect-square max-w-lg mx-auto lg:max-w-none overflow-hidden rounded-xl border bg-muted/50 group">
            <ResponsiveProductImage
              src={product.images[selectedImageIndex]?.src || "/placeholder.svg?height=600&width=600"}
              alt={product.images[selectedImageIndex]?.alt || String(product.title)}
              fill={true}
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 500px"
              className="transition-transform hover:scale-105"
              priority
            />

            {/* Image Overlay Controls */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity space-y-2">
              <Button variant="secondary" size="icon" onClick={() => setShowImageModal(true)}>
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button variant="secondary" size="icon" onClick={toggleFavorite}>
                <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
              <Button variant="secondary" size="icon" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Stock Status Overlay */}
            {selectedVariantData && !selectedVariantData.is_enabled && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="destructive" className="text-lg px-4 py-2">
                  <XCircle className="h-5 w-5 mr-2" />
                  Out of Stock
                </Badge>
              </div>
            )}

            {/* Bestseller Badge */}
            {product.bestseller && (
              <div className="absolute top-4 left-4">
                <Badge variant="default" className="bg-orange-500">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Bestseller
                </Badge>
              </div>
            )}
          </div>

          {/* Image Thumbnails */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 gap-2 sm:gap-3 max-w-lg mx-auto lg:max-w-none">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                    selectedImageIndex === index
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-muted hover:border-muted-foreground"
                  }`}
                >
                  <ResponsiveProductImage
                    src={String(image.src)}
                    alt={String(image.alt || `${product.title} view ${index + 1}`)}
                    fill={true}
                    sizes="(max-width: 640px) 20vw, (max-width: 1024px) 15vw, 100px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Trust Signals */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm max-w-lg mx-auto lg:max-w-none">
            <div className="flex items-center gap-2 p-2 sm:p-3 bg-green-50 border border-green-200 rounded-lg">
              <Truck className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
              <span className="text-green-800 truncate">Free Shipping</span>
            </div>
            <div className="flex items-center gap-2 p-2 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0" />
              <span className="text-blue-800 truncate">Secure Payment</span>
            </div>
            <div className="flex items-center gap-2 p-2 sm:p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 flex-shrink-0" />
              <span className="text-purple-800 truncate">30-Day Returns</span>
            </div>
            <div className="flex items-center gap-2 p-2 sm:p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <Package className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600 flex-shrink-0" />
              <span className="text-orange-800 truncate">Order Tracking</span>
            </div>
          </div>
        </div>

        {/* Enhanced Product Details Section */}
        <div className="space-y-6">
          {/* Product Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold leading-tight text-foreground">
                  {String(product.title)}
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(product.rating || 4.8) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">
                      ({product.rating || 4.8}) • {product.reviewCount || 127} reviews
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>234 sold this week</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Pricing with Dynamic Updates */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-3">
                <div className="text-2xl sm:text-3xl font-bold text-primary">
                  {selectedVariantData
                    ? formatPrice(selectedVariantData.price)
                    : product?.variants[0]
                      ? formatPrice(product.variants[0].price)
                      : "Loading..."}
                </div>
                {quantity > 1 && (selectedVariantData || product?.variants[0]) && (
                  <div className="text-lg text-muted-foreground">
                    × {quantity} ={" "}
                    <span className="font-semibold text-foreground">
                      {formatPrice((selectedVariantData?.price || product?.variants[0]?.price || 0) * quantity)}
                    </span>
                  </div>
                )}
              </div>

              {/* Show add-on costs breakdown */}
              {(customization.giftWrap || customization.rushDelivery || customization.expressShipping) && (
                <div className="text-lg font-semibold text-green-600">
                  Total with add-ons: <span className="font-bold">{formatPrice(totalPrice)}</span>
                  <span className="text-sm text-muted-foreground ml-2">(includes selected options)</span>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Product Options */}
          <div className="space-y-4">
            {product.options.map((option, index) => (
              <div key={index} className="space-y-3">
                <Label className="text-base font-semibold flex items-center gap-2">
                  {option.name === "Size" && <Ruler className="h-4 w-4" />}
                  {option.name === "Color" && <Palette className="h-4 w-4" />}
                  {String(option.name)}
                  <span className="text-sm font-normal text-muted-foreground">({option.values.length} options)</span>
                </Label>

                {option.type === "color" ? (
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((value, valueIndex) => {
                      const displayValue = getDisplayValue(value)
                      const colorValue = displayValue.toLowerCase()

                      return (
                        <button
                          key={valueIndex}
                          onClick={() => handleOptionChange(option.name, displayValue)}
                          className={`w-10 h-10 rounded-full border-2 transition-all ${
                            selectedOptions[option.name] === displayValue
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-muted hover:border-muted-foreground"
                          }`}
                          style={{ backgroundColor: colorValue }}
                          title={displayValue}
                        />
                      )
                    })}
                  </div>
                ) : (
                  <Select
                    value={selectedOptions[option.name] || ""}
                    onValueChange={(value) => handleOptionChange(option.name, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={`Select ${String(option.name).toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {option.values.map((value, valueIndex) => {
                        const displayValue = getDisplayValue(value)
                        const cleanKey = `${option.name}-${valueIndex}-${displayValue}`

                        console.log(`Rendering option: ${JSON.stringify(value)} -> "${displayValue}"`)

                        return (
                          <SelectItem key={cleanKey} value={displayValue}>
                            {displayValue}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}
          </div>

          {/* Enhanced Quantity Selector with Price Display */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Quantity</Label>
              <div className="text-right">
                <div className="text-lg font-bold text-primary">
                  {formatPrice((selectedVariantData?.price || product?.variants[0]?.price || 0) * quantity)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatPrice(selectedVariantData?.price || product?.variants[0]?.price || 0)} each
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="h-10 w-10"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1)}
                  className="w-16 text-center border-0 focus-visible:ring-0"
                  min="1"
                  max={selectedVariantData?.stock_quantity || 10}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= (selectedVariantData?.stock_quantity || 10)}
                  className="h-10 w-10"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 text-sm text-muted-foreground">
                {selectedVariantData?.stock_quantity && (
                  <div className="space-y-1">
                    {selectedVariantData.stock_quantity > 10 ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-3 w-3" />
                        <span>In Stock ({selectedVariantData.stock_quantity} available)</span>
                      </div>
                    ) : selectedVariantData.stock_quantity > 5 ? (
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Clock className="h-3 w-3" />
                        <span>Limited Stock ({selectedVariantData.stock_quantity} left)</span>
                      </div>
                    ) : selectedVariantData.stock_quantity > 0 ? (
                      <div className="flex items-center gap-1 text-orange-600">
                        <AlertTriangle className="h-3 w-3" />
                        <span>Low Stock ({selectedVariantData.stock_quantity} left)</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-red-600">
                        <XCircle className="h-3 w-3" />
                        <span>Out of Stock</span>
                      </div>
                    )}
                    <div className="text-xs">Max quantity: {Math.min(10, selectedVariantData.stock_quantity)}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Price Breakdown */}
            {(customization.giftWrap || customization.rushDelivery || customization.expressShipping) && (
              <div className="p-3 bg-muted/50 rounded-lg space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>
                    Subtotal ({quantity} × {formatPrice(selectedVariantData?.price || product?.variants[0]?.price || 0)}
                    ):
                  </span>
                  <span className="font-medium">
                    {formatPrice((selectedVariantData?.price || product?.variants[0]?.price || 0) * quantity)}
                  </span>
                </div>
                {customization.giftWrap && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Gift wrapping:</span>
                    <span>+$2.99</span>
                  </div>
                )}
                {customization.rushDelivery && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Rush delivery (2-3 days):</span>
                    <span>+$9.99</span>
                  </div>
                )}
                {customization.expressShipping && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Express shipping (1-2 days):</span>
                    <span>+$15.99</span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold text-primary">
                  <span>Total:</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Customization Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Customization & Add-ons
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="giftWrap"
                    checked={customization.giftWrap}
                    onCheckedChange={(checked) =>
                      setCustomization((prev) => ({ ...prev, giftWrap: checked as boolean }))
                    }
                  />
                  <Label htmlFor="giftWrap" className="flex items-center gap-2">
                    <Gift className="h-4 w-4" />
                    Gift wrapping (+$2.99)
                  </Label>
                </div>

                {customization.giftWrap && (
                  <Textarea
                    placeholder="Enter gift message (optional)..."
                    value={customization.giftMessage}
                    onChange={(e) => setCustomization((prev) => ({ ...prev, giftMessage: e.target.value }))}
                    className="resize-none"
                    rows={3}
                  />
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rushDelivery"
                    checked={customization.rushDelivery}
                    onCheckedChange={(checked) =>
                      setCustomization((prev) => ({ ...prev, rushDelivery: checked as boolean }))
                    }
                  />
                  <Label htmlFor="rushDelivery" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Rush delivery 2-3 days (+$9.99)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="expressShipping"
                    checked={customization.expressShipping}
                    onCheckedChange={(checked) =>
                      setCustomization((prev) => ({ ...prev, expressShipping: checked as boolean }))
                    }
                  />
                  <Label htmlFor="expressShipping" className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Express shipping 1-2 days (+$15.99)
                  </Label>
                </div>

                <Textarea
                  placeholder="Special instructions (optional)"
                  value={customization.specialInstructions}
                  onChange={(e) => setCustomization((prev) => ({ ...prev, specialInstructions: e.target.value }))}
                  className="resize-none"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Action Buttons */}
          <div className="space-y-4">
            {/* Main Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={addingToCart || (selectedVariantData && !selectedVariantData.is_enabled)}
                size="lg"
                variant="outline"
                className="h-14 text-base font-semibold border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              >
                {addingToCart ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Adding to Cart...
                  </>
                ) : selectedVariantData && !selectedVariantData.is_enabled ? (
                  <>
                    <XCircle className="h-5 w-5 mr-2" />
                    Currently Unavailable
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart • {formatPrice(totalPrice)}
                  </>
                )}
              </Button>

              <Button
                onClick={handleBuyNow}
                disabled={addingToCart || (selectedVariantData && !selectedVariantData.is_enabled)}
                size="lg"
                className="h-14 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {addingToCart ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : selectedVariantData && !selectedVariantData.is_enabled ? (
                  <>
                    <XCircle className="h-5 w-5 mr-2" />
                    Currently Unavailable
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5 mr-2" />
                    Buy Now • {formatPrice(totalPrice)}
                  </>
                )}
              </Button>
            </div>

            {/* Secondary Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" size="lg" className="h-12" asChild>
                <Link href="/store/cart">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  View Cart ({cartState.itemCount})
                </Link>
              </Button>

              <Button variant="outline" size="lg" className="h-12" onClick={toggleFavorite}>
                <Heart className={`h-4 w-4 mr-2 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowImageModal(true)}>
                <Maximize2 className="h-4 w-4 mr-1" />
                View Images
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/store">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Store
                </Link>
              </Button>
            </div>
          </div>

          {/* Enhanced Product Information Tabs */}
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="space-y-4">
              <div className="text-muted-foreground">
                <p className={showFullDescription ? "" : "line-clamp-4"}>{String(product.description)}</p>
                {product.description && product.description.length > 200 && (
                  <Button
                    variant="link"
                    className="p-0 h-auto text-primary"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                  >
                    {showFullDescription ? "Show less" : "Read more"}
                  </Button>
                )}
              </div>

              {product.tags.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold">Categories & Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.tags
                      .filter((tag) => tag && tag !== "MOCK-DATA")
                      .map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {String(tag)}
                        </Badge>
                      ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="details" className="space-y-6">
              {/* Product Overview */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Product Overview
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-muted-foreground">Product ID:</span>
                      <div className="font-mono text-xs bg-muted px-2 py-1 rounded mt-1">{String(product.id)}</div>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Category:</span>
                      <div className="mt-1">
                        {product.tags.includes("Political") ? "Political Merchandise" : "General Merchandise"}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Available Variants:</span>
                      <div className="mt-1">{product.variants.length} options</div>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Total Stock:</span>
                      <div className="mt-1">
                        {product.variants.reduce((total, variant) => total + (variant.stock_quantity || 0), 0)} items
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-muted-foreground">Price Range:</span>
                      <div className="mt-1">
                        {formatPrice(Math.min(...product.variants.map((v) => v.price)))} -{" "}
                        {formatPrice(Math.max(...product.variants.map((v) => v.price)))}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Created:</span>
                      <div className="mt-1">
                        {product.created_at ? new Date(product.created_at).toLocaleDateString() : "Recently"}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Last Updated:</span>
                      <div className="mt-1">
                        {product.updated_at ? new Date(product.updated_at).toLocaleDateString() : "Recently"}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Data Source:</span>
                      <div className="mt-1">
                        <Badge variant={product.isRealData ? "default" : "secondary"} className="text-xs">
                          {product.isRealData ? "Live Printify Data" : "Demo Data"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Selected Variant Details */}
              {selectedVariantData && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Selected Variant Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-muted-foreground">Variant Name:</span>
                        <div className="mt-1 font-medium">{String(selectedVariantData.title)}</div>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Unit Price:</span>
                        <div className="mt-1 text-lg font-bold text-primary">
                          {formatPrice(selectedVariantData.price)}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Availability Status:</span>
                        <div className="mt-1">
                          <Badge
                            variant={selectedVariantData.is_enabled ? "default" : "destructive"}
                            className="text-xs"
                          >
                            {selectedVariantData.is_enabled ? "✓ Available" : "✗ Out of Stock"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-muted-foreground">Stock Quantity:</span>
                        <div className="mt-1">
                          {selectedVariantData.stock_quantity ? (
                            <span
                              className={`font-medium ${
                                selectedVariantData.stock_quantity > 10
                                  ? "text-green-600"
                                  : selectedVariantData.stock_quantity > 5
                                    ? "text-yellow-600"
                                    : selectedVariantData.stock_quantity > 0
                                      ? "text-orange-600"
                                      : "text-red-600"
                              }`}
                            >
                              {selectedVariantData.stock_quantity} units available
                            </span>
                          ) : (
                            <span className="text-muted-foreground">Stock info unavailable</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Variant ID:</span>
                        <div className="font-mono text-xs bg-muted px-2 py-1 rounded mt-1">
                          {String(selectedVariantData.id)}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Selected Quantity:</span>
                        <div className="mt-1 font-medium">
                          {quantity} {quantity === 1 ? "item" : "items"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <Separator />

              {/* Product Specifications */}
              {selectedVariantData && Object.entries(selectedVariantData.options).length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold flex items-center gap-2">
                    <Ruler className="h-5 w-5" />
                    Product Specifications
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(selectedVariantData.options).map(([key, value], index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <span className="font-medium capitalize flex items-center gap-2">
                          {key === "Size" && <Ruler className="h-4 w-4" />}
                          {key === "Color" && <Palette className="h-4 w-4" />}
                          {key === "Material" && <Package className="h-4 w-4" />}
                          {String(key)}:
                        </span>
                        <span className="text-muted-foreground font-medium">{getDisplayValue(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* All Available Variants */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  All Available Variants ({product.variants.length})
                </h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {product.variants.map((variant, index) => (
                    <div
                      key={variant.id}
                      className={`p-3 border rounded-lg transition-all cursor-pointer ${
                        selectedVariant === variant.id
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-muted-foreground"
                      }`}
                      onClick={() => setSelectedVariant(String(variant.id))}
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="font-medium">{String(variant.title)}</div>
                          <div className="text-sm text-muted-foreground">
                            {Object.entries(variant.options).map(([key, value]) => (
                              <span key={key} className="mr-2">
                                {String(key)}: {getDisplayValue(value)}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="font-bold text-primary">{formatPrice(variant.price)}</div>
                          <Badge variant={variant.is_enabled ? "default" : "secondary"} className="text-xs">
                            {variant.is_enabled ? "Available" : "Out of Stock"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Product Tags & Categories */}
              {product.tags.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">Categories & Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.tags
                      .filter((tag) => tag && tag !== "MOCK-DATA")
                      .map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-sm px-3 py-1">
                          {String(tag)}
                        </Badge>
                      ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="shipping" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-start gap-3 text-sm p-4 bg-green-50 border border-green-200 rounded-lg">
                  <Truck className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-green-800">Free Standard Shipping</div>
                    <div className="text-green-700">On orders over $50 • 5-7 business days</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-blue-800">Express Shipping</div>
                    <div className="text-blue-700">$9.99 • 2-3 business days</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <Zap className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-purple-800">Overnight Shipping</div>
                    <div className="text-purple-700">$15.99 • 1-2 business days</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <Package className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-orange-800">Order Tracking</div>
                    <div className="text-orange-700">Real-time tracking updates via email and SMS</div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <div>
                    <span className="text-lg font-semibold">{product.rating || 4.8} out of 5</span>
                    <div className="text-sm text-muted-foreground">({product.reviewCount || 127} reviews)</div>
                  </div>
                  <div className="ml-auto">
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Write Review
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      name: "Sarah M.",
                      rating: 5,
                      comment:
                        "Excellent quality and fast shipping! The design is exactly as shown and the material feels premium.",
                      date: "2 days ago",
                      verified: true,
                    },
                    {
                      name: "Mike R.",
                      rating: 4,
                      comment: "Good product, exactly as described. Would definitely recommend to others.",
                      date: "1 week ago",
                      verified: true,
                    },
                    {
                      name: "Jennifer L.",
                      rating: 5,
                      comment: "Perfect for making a statement. Excellent material quality and the colors are vibrant.",
                      date: "2 weeks ago",
                      verified: false,
                    },
                  ].map((review, index) => (
                    <div key={index} className="border-b pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{review.name}</span>
                        {review.verified && (
                          <Badge variant="outline" className="text-xs">
                            <Verified className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        <div className="flex items-center">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <Button variant="ghost" size="sm">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Helpful (12)
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Image Modal */}
      <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Product Images</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative w-full aspect-square max-h-[60vh] overflow-hidden rounded-lg">
              <ResponsiveProductImage
                src={product.images[selectedImageIndex]?.src || "/placeholder.svg?height=800&width=800"}
                alt={product.images[selectedImageIndex]?.alt || String(product.title)}
                fill={true}
                sizes="(max-width: 768px) 90vw, 800px"
                className="object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-24 overflow-y-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square overflow-hidden rounded border-2 ${
                      selectedImageIndex === index ? "border-primary" : "border-muted"
                    }`}
                  >
                    <ResponsiveProductImage
                      src={String(image.src)}
                      alt={String(image.alt || `View ${index + 1}`)}
                      fill={true}
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
