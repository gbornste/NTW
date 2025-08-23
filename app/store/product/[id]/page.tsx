"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/cart-context"
import { useFavorites } from "@/contexts/favorites-context"
import { ArrowLeft, Heart, ShoppingCart, Star, Plus, Minus, Check, ChevronLeft, ChevronRight } from "lucide-react"

// Mock product data with comprehensive color mapping and all 88 images
const productData = {
  "1": {
    id: "1", 
    title: "Premium Trading Cards Set",
    description: "Professional quality trading cards featuring exclusive designs and premium materials. Perfect for collectors and gaming enthusiasts.",
    price: 29.99,
    originalPrice: 39.99,
    discount: 25,
    rating: 4.8,
    reviewCount: 147,
    category: "Trading Cards",
    brand: "NoTrumpNWay",
    sku: "NTW-PTC-001",
    inStock: true,
    stockCount: 87,
    images: [
      "/images/card1.jpg", "/images/card2.jpg", "/images/card3.jpg", "/images/card4.jpg",
      "/images/card5.jpg", "/images/card6.jpg", "/images/card7.jpg", "/images/card8.jpg",
      "/images/card9.jpg", "/images/card10.jpg", "/images/card11.jpg", "/images/card12.jpg",
      "/images/card13.jpg", "/images/card14.jpg", "/images/card15.jpg", "/images/card16.jpg",
      "/images/card17.jpg", "/images/card18.jpg", "/images/card19.jpg", "/images/card20.jpg",
      "/images/card21.jpg", "/images/card22.jpg", "/images/card23.jpg", "/images/card24.jpg",
      "/images/card25.jpg", "/images/card26.jpg", "/images/card27.jpg", "/images/card28.jpg",
      "/images/card29.jpg", "/images/card30.jpg", "/images/card31.jpg", "/images/card32.jpg",
      "/images/card33.jpg", "/images/card34.jpg", "/images/card35.jpg", "/images/card36.jpg",
      "/images/card37.jpg", "/images/card38.jpg", "/images/card39.jpg", "/images/card40.jpg",
      "/images/card41.jpg", "/images/card42.jpg", "/images/card43.jpg", "/images/card44.jpg",
      "/images/card45.jpg", "/images/card46.jpg", "/images/card47.jpg", "/images/card48.jpg",
      "/images/card49.jpg", "/images/card50.jpg", "/images/card51.jpg", "/images/card52.jpg",
      "/images/card53.jpg", "/images/card54.jpg", "/images/card55.jpg", "/images/card56.jpg",
      "/images/card57.jpg", "/images/card58.jpg", "/images/card59.jpg", "/images/card60.jpg",
      "/images/card61.jpg", "/images/card62.jpg", "/images/card63.jpg", "/images/card64.jpg",
      "/images/card65.jpg", "/images/card66.jpg", "/images/card67.jpg", "/images/card68.jpg",
      "/images/card69.jpg", "/images/card70.jpg", "/images/card71.jpg", "/images/card72.jpg",
      "/images/card73.jpg", "/images/card74.jpg", "/images/card75.jpg", "/images/card76.jpg",
      "/images/card77.jpg", "/images/card78.jpg", "/images/card79.jpg", "/images/card80.jpg",
      "/images/card81.jpg", "/images/card82.jpg", "/images/card83.jpg", "/images/card84.jpg",
      "/images/card85.jpg", "/images/card86.jpg", "/images/card87.jpg", "/images/card88.jpg"
    ],
    colors: [
      { name: "Ruby Red", hex: "#DC143C", available: true },
      { name: "Emerald Green", hex: "#50C878", available: true },
      { name: "Sapphire Blue", hex: "#0F52BA", available: true },
      { name: "Amethyst Purple", hex: "#9966CC", available: true },
      { name: "Topaz Gold", hex: "#FFD700", available: true }
    ],
    variants: [
      { id: "standard", name: "Standard Edition", price: 29.99, inStock: true }
    ]
  }
}

export default function ProductPage() {
  const params = useParams()
  const id = params.id as string
  const product = productData[id as keyof typeof productData]
  
  const [selectedColor, setSelectedColor] = useState<string>(product?.colors[0]?.name || "")
  const [selectedVariant, setSelectedVariant] = useState<string>(product?.variants[0]?.id || "")
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0)
  const [addedToCart, setAddedToCart] = useState(false)
  
  const { addToCart } = useCart()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  
  const isProductFavorite = product ? isFavorite(product.id) : false
  const thumbnailsPerView = 6
  
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Product not found</h2>
            <p className="text-gray-600 mb-4">The product you are looking for does not exist.</p>
            <Link href="/store">
              <Button>Back to Store</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const selectedVariantData = product.variants.find(v => v.id === selectedVariant) || product.variants[0]
  const currentPrice = selectedVariantData.price

  const handleAddToCart = () => {
    const selectedColorData = product.colors.find(c => c.name === selectedColor)
    
    addToCart({
      productId: product.id,
      variantId: selectedVariant,
      quantity,
      price: currentPrice,
      title: product.title,
      image: product.images[selectedImageIndex],
      description: product.description,
      options: {
        variant: selectedVariantData.name,
        color: selectedColor,
        ...(selectedColorData && { colorHex: selectedColorData.hex })
      }
    })
    
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/store" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Store
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images with All 88 Thumbnails */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-lg">
              <Image
                src={product.images[selectedImageIndex]}
                alt={`${product.title} - Image ${selectedImageIndex + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                -{product.discount}%
              </Badge>
            </div>

            {/* Enhanced Thumbnail Grid with Navigation */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setThumbnailStartIndex(Math.max(0, thumbnailStartIndex - thumbnailsPerView))}
                  disabled={thumbnailStartIndex === 0}
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
                  onClick={() => setThumbnailStartIndex(Math.min(thumbnailStartIndex + thumbnailsPerView, Math.max(0, product.images.length - thumbnailsPerView)))}
                  disabled={thumbnailStartIndex + thumbnailsPerView >= product.images.length}
                  className="h-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

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
                          src={image}
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
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-2">{product.category}</Badge>
              <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
              <p className="text-lg text-gray-600 mt-2">{product.brand}</p>
              
              <div className="flex items-center space-x-2 mb-4 mt-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>

              <div className="flex items-center space-x-3 mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  ${currentPrice.toFixed(2)}
                </span>
                <span className="text-xl text-gray-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
                <Badge variant="destructive" className="text-sm">
                  Save ${(product.originalPrice - currentPrice).toFixed(2)}
                </Badge>
              </div>

              <div className="flex items-center space-x-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-green-600">
                  In Stock ({product.stockCount} available)
                </span>
              </div>
            </div>

            {/* Enhanced Color Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Color Options</h3>
              <div className="grid grid-cols-5 gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`relative w-12 h-12 rounded-full border-2 transition-all hover:scale-110 ${
                      selectedColor === color.name
                        ? "border-gray-900 ring-2 ring-gray-400"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {selectedColor === color.name && (
                      <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow-lg" />
                    )}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-2">Selected: {selectedColor}</p>
            </div>

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
                    onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                    disabled={quantity >= product.stockCount}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
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
            <div className="space-y-4">
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
