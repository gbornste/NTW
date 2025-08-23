"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/cart-context"
import { useFavorites } from "@/contexts/favorites-context"
import { ArrowLeft, Heart, ShoppingCart, Star, Plus, Minus, Check, ChevronLeft, ChevronRight } from "lucide-react"

interface Product {
  id: string
  title: string
  description: string
  images: { src: string }[]
  variants: {
    id: number
    price: number
    title: string
    is_available: boolean
  }[]
  tags: string[]
}

export default function ProductPage() {
  const params = useParams()
  const id = params.id as string
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<number>(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0)
  const [addedToCart, setAddedToCart] = useState(false)
  
  const { addToCart } = useCart()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  
  const thumbnailsPerView = 6

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/printify/product/${id}`)
        if (!response.ok) {
          throw new Error("Product not found")
        }
        const productData = await response.json()
        setProduct(productData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  useEffect(() => {
    if (addedToCart) {
      const timer = setTimeout(() => setAddedToCart(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [addedToCart])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Loading Product...</h2>
            <p className="text-gray-600">Please wait while we fetch product details.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold mb-2 text-red-600">Product Not Found</h2>
            <p className="text-gray-600 mb-4">{error || "The product you are looking for does not exist."}</p>
            <Link href="/store">
              <Button>Back to Store</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const selectedVariantData = product.variants[selectedVariant] || product.variants[0]
  const currentPrice = selectedVariantData?.price / 100 || 0 // Convert cents to dollars
  const isProductFavorite = isFavorite(product.id)

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      variantId: selectedVariantData.id.toString(),
      quantity,
      price: currentPrice,
      title: product.title,
      image: product.images[selectedImageIndex]?.src || "/placeholder.jpg",
      description: product.description || "",
      options: {
        variant: selectedVariantData.title
      }
    })
    
    setAddedToCart(true)
  }

  const handleFavoriteToggle = () => {
    if (isProductFavorite) {
      removeFromFavorites(product.id)
    } else {
      addToFavorites({
        id: product.id,
        title: product.title,
        price: currentPrice,
        image: product.images[0]?.src || "/placeholder.jpg",
        rating: 4.5 // Default rating
      })
    }
  }

  const nextThumbnailSet = () => {
    const maxStart = Math.max(0, product.images.length - thumbnailsPerView)
    setThumbnailStartIndex(Math.min(thumbnailStartIndex + thumbnailsPerView, maxStart))
  }

  const prevThumbnailSet = () => {
    setThumbnailStartIndex(Math.max(0, thumbnailStartIndex - thumbnailsPerView))
  }

  const canGoNext = thumbnailStartIndex + thumbnailsPerView < product.images.length
  const canGoPrev = thumbnailStartIndex > 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link href="/store" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Store
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images with Comprehensive Thumbnail Navigation */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-lg">
              <Image
                src={product.images[selectedImageIndex]?.src || "/placeholder.jpg"}
                alt={`${product.title} - Image ${selectedImageIndex + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <Badge className="absolute top-4 left-4 bg-blue-600 text-white">
                {product.tags[0] || "Featured"}
              </Badge>
            </div>

            {/* Enhanced Thumbnail Grid with Navigation for ALL Images */}
            {product.images.length > 1 && (
              <div className="space-y-2">
                {/* Navigation Controls */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevThumbnailSet}
                    disabled={!canGoPrev}
                    className="h-8"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-500">
                    {thumbnailStartIndex + 1}-{Math.min(thumbnailStartIndex + thumbnailsPerView, product.images.length)} of {product.images.length}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextThumbnailSet}
                    disabled={!canGoNext}
                    className="h-8"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Thumbnail Grid */}
                <div className="grid grid-cols-6 gap-2">
                  {product.images
                    .slice(thumbnailStartIndex, thumbnailStartIndex + thumbnailsPerView)
                    .map((image, index) => {
                      const actualIndex = thumbnailStartIndex + index
                      return (
                        <button
                          key={actualIndex}
                          onClick={() => setSelectedImageIndex(actualIndex)}
                          className={`relative aspect-square bg-white rounded-md overflow-hidden border-2 transition-all hover:opacity-80 ${
                            selectedImageIndex === actualIndex
                              ? "border-blue-500 ring-2 ring-blue-200"
                              : "border-gray-200"
                          }`}
                        >
                          <Image
                            src={image.src}
                            alt={`${product.title} thumbnail ${actualIndex + 1}`}
                            fill
                            className="object-cover"
                            sizes="100px"
                          />
                        </button>
                      )
                    })}
                </div>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <Badge variant="outline" className="mb-2">{product.tags[0] || "Product"}</Badge>
                  <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
                  <p className="text-lg text-gray-600 mt-2">NoTrumpNWay</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleFavoriteToggle}
                  className={`${isProductFavorite ? "text-red-500" : "text-gray-400"}`}
                >
                  <Heart className={`h-6 w-6 ${isProductFavorite ? "fill-current" : ""}`} />
                </Button>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">4.5 (Reviews coming soon)</span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  ${currentPrice.toFixed(2)}
                </span>
                <Badge variant="secondary" className="text-sm">
                  {selectedVariantData.is_available ? "In Stock" : "Out of Stock"}
                </Badge>
              </div>
            </div>

            {/* Variant Selection */}
            {product.variants.length > 1 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Variants</h3>
                <div className="space-y-2">
                  {product.variants.map((variant, index) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(index)}
                      disabled={!variant.is_available}
                      className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                        selectedVariant === index
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      } ${!variant.is_available ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{variant.title}</span>
                        <span className="font-bold">${(variant.price / 100).toFixed(2)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Quantity</h3>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={!selectedVariantData.is_available}
                className="w-full h-12 text-lg font-semibold"
                size="lg"
              >
                {addedToCart ? (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart - ${(currentPrice * quantity).toFixed(2)}
                  </>
                )}
              </Button>
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              <Separator />
              
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description || "High-quality product from NoTrumpNWay. Perfect for your collection."}
                </p>
              </div>

              {/* Tags */}
              {product.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
