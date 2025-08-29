'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { useCart } from '@/contexts/cart-context'
import { useFavorites } from '@/contexts/favorites-context'
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  Plus, 
  Minus, 
  Shield, 
  Truck, 
  RotateCcw, 
  CreditCard,
  Palette,
  Ruler,
  Camera,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Info,
  Share2,
  Facebook,
  Twitter,
  MessageCircle,
  ChevronDown,
  Zap,
  Award,
  Users,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'

interface PrintifyProduct {
  id: string
  title: string
  description: string
  tags: string[]
  images: Array<{
    src: string
    variant_ids: number[]
    position: string
  }>
  variants: Array<{
    id: number
    title: string
    options: {
      color?: string
      size?: string
    }
    price: number
    is_enabled: boolean
  }>
  print_provider_id: number
  blueprint_id: number
  user_id: number
  shop_id: number
  created_at: string
  updated_at: string
  visible: boolean
  is_locked: boolean
  external?: {
    id: string
    handle: string
  }
  sales_channel_properties: Array<{
    sales_channel: string
    status: string
    price: number
  }>
}

interface SelectedVariant {
  id: number
  title: string
  options: {
    color?: string
    size?: string
  }
  price: number
}

interface ColorSwatch {
  name: string
  hex: string
  images: string[]
}

export default function ProductPage() {
  const params = useParams()
  const productId = params?.id as string
  const { addToCart } = useCart()
  const { addFavorite, removeFavorite, isFavorite } = useFavorites()
  
  const [product, setProduct] = useState<PrintifyProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<SelectedVariant | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [shareMenuOpen, setShareMenuOpen] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  const isFav = product ? isFavorite(product.id) : false

  useEffect(() => {
    if (!productId) return

    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/printify/product/${productId}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Product not found')
          }
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        
        if (!data) {
          throw new Error('No product data received')
        }

        setProduct(data)
        
        if (data.variants && data.variants.length > 0) {
          const firstEnabledVariant = data.variants.find((v: any) => v.is_enabled)
          if (firstEnabledVariant) {
            setSelectedVariant(firstEnabledVariant)
            setSelectedColor(firstEnabledVariant.options.color || '')
            setSelectedSize(firstEnabledVariant.options.size || '')
          }
        }

      } catch (err) {
        console.error('Error fetching product:', err)
        setError(err instanceof Error ? err.message : 'Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  const { uniqueColors, uniqueSizes, colorSwatches } = useMemo(() => {
    if (!product?.variants) return { uniqueColors: [], uniqueSizes: [], colorSwatches: [] }
    
    const colors = new Set<string>()
    const sizes = new Set<string>()
    const colorMap = new Map<string, { images: string[], variants: number[] }>()
    
    product.variants.forEach(variant => {
      if (variant.is_enabled) {
        if (variant.options.color) {
          colors.add(variant.options.color)
          const colorName = variant.options.color
          if (!colorMap.has(colorName)) {
            colorMap.set(colorName, { images: [], variants: [] })
          }
          colorMap.get(colorName)!.variants.push(variant.id)
        }
        if (variant.options.size) sizes.add(variant.options.size)
      }
    })

    // Map images to colors
    product.images?.forEach(img => {
      img.variant_ids.forEach(variantId => {
        const variant = product.variants.find(v => v.id === variantId)
        if (variant?.options.color) {
          const colorData = colorMap.get(variant.options.color)
          if (colorData && !colorData.images.includes(img.src)) {
            colorData.images.push(img.src)
          }
        }
      })
    })

    const swatches: ColorSwatch[] = Array.from(colorMap.entries()).map(([name, data]) => ({
      name,
      hex: getColorHex(name),
      images: data.images
    }))
    
    return {
      uniqueColors: Array.from(colors),
      uniqueSizes: Array.from(sizes).sort((a, b) => {
        const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL']
        return sizeOrder.indexOf(a) - sizeOrder.indexOf(b)
      }),
      colorSwatches: swatches
    }
  }, [product?.variants, product?.images])

  const availableImages = useMemo(() => {
    if (!product?.images) return []
    
    if (!selectedColor) return product.images
    
    const colorSwatch = colorSwatches.find(c => c.name === selectedColor)
    if (colorSwatch && colorSwatch.images.length > 0) {
      return product.images.filter(img => colorSwatch.images.includes(img.src))
    }
    
    return product.images
  }, [product?.images, selectedColor, colorSwatches])

  useEffect(() => {
    if (!product?.variants || !selectedColor || !selectedSize) return
    
    const matchingVariant = product.variants.find(variant => 
      variant.is_enabled &&
      variant.options.color === selectedColor &&
      variant.options.size === selectedSize
    )
    
    if (matchingVariant) {
      setSelectedVariant(matchingVariant)
    }
  }, [selectedColor, selectedSize, product?.variants])

  useEffect(() => {
    if (availableImages.length > 0 && currentImageIndex >= availableImages.length) {
      setCurrentImageIndex(0)
    }
  }, [availableImages, currentImageIndex])

  const descriptionSections = useMemo(() => {
    if (!product?.description) return { main: '', features: [], care: [], materials: [] }
    
    const text = product.description
    const sections = text.split(/(?=\b(?:Features?|Care|Material|Fabric|Shipping|Size|Dimension)s?:)/i)
    
    const main = sections[0]?.replace(/[\-\n]+/g, ' ').replace(/\s+/g, ' ').trim() || ''
    
    const features = sections
      .find(s => /^features?:/i.test(s.trim()))
      ?.replace(/^features?:\s*/i, '')
      .split(/[\-\n]/)
      .filter(f => f.trim().length > 2)
      .map(f => f.trim()) || []

    const care = sections
      .find(s => /^care/i.test(s.trim()))
      ?.replace(/^care[^:]*:\s*/i, '')
      .split(/[\-\n]/)
      .filter(c => c.trim().length > 2)
      .map(c => c.trim()) || []

    const materials = sections
      .find(s => /^(?:material|fabric)/i.test(s.trim()))
      ?.replace(/^(?:material|fabric)s?[^:]*:\s*/i, '')
      .split(/[\-\n]/)
      .filter(m => m.trim().length > 2)
      .map(m => m.trim()) || []
    
    return { main, features, care, materials }
  }, [product?.description])

  function getColorHex(colorName: string): string {
    const colorMap: { [key: string]: string } = {
      'black': '#000000',
      'white': '#FFFFFF',
      'red': '#EF4444',
      'blue': '#3B82F6',
      'green': '#10B981',
      'yellow': '#F59E0B',
      'purple': '#8B5CF6',
      'pink': '#EC4899',
      'gray': '#6B7280',
      'grey': '#6B7280',
      'navy': '#1E40AF',
      'brown': '#92400E',
      'orange': '#F97316',
      'teal': '#14B8A6',
      'lime': '#84CC16',
      'indigo': '#6366F1',
      'cyan': '#06B6D4'
    }
    
    const normalizedColor = colorName.toLowerCase().replace(/[^a-z]/g, '')
    return colorMap[normalizedColor] || '#9CA3AF'
  }

  const handleColorSelect = (colorName: string) => {
    setSelectedColor(colorName)
    const colorSwatch = colorSwatches.find(c => c.name === colorName)
    if (colorSwatch && colorSwatch.images.length > 0) {
      setCurrentImageIndex(0)
    }
  }

  const handleAddToCart = async () => {
    if (!product || !selectedVariant) return
    
    setIsAddingToCart(true)
    
    try {
      await addToCart({
        productId: product.id,
        variantId: selectedVariant.id.toString(),
        title: product.title,
        price: selectedVariant.price,
        image: availableImages[currentImageIndex]?.src || product.images?.[0]?.src || '',
        quantity,
        options: {
          color: selectedColor,
          size: selectedSize
        }
      })
      
      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 3000)
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleToggleFavorite = () => {
    if (!product) return
    
    if (isFav) {
      removeFavorite(product.id)
    } else {
      addFavorite({
        id: product.id,
        title: product.title,
        description: product.description || '',
        image: availableImages[currentImageIndex]?.src || product.images?.[0]?.src || '',
        price: selectedVariant?.price ? `$${(selectedVariant.price / 100).toFixed(2)}` : '$0.00',
        tags: product.tags || [],
        dateAdded: new Date().toISOString()
      })
    }
  }

  const handleShare = (platform: string) => {
    const url = window.location.href
    const text = `Check out this amazing ${product?.title}!`
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
        break
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`)
        break
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`)
        break
      default:
        navigator.clipboard.writeText(url)
    }
    setShareMenuOpen(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-indigo-200 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
          </div>
          <div className="space-y-2">
            <p className="text-xl font-semibold text-gray-900">Loading Premium Product</p>
            <p className="text-gray-600">Preparing your shopping experience...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
        <Card className="max-w-lg mx-4 border-red-200 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Info className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-8 py-3"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <Card className="max-w-lg mx-4 shadow-xl">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Product Not Found</h2>
            <p className="text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Enhanced Image Gallery */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-3xl shadow-2xl overflow-hidden group">
              {availableImages.length > 0 && (
                <>
                  <Image
                    src={availableImages[currentImageIndex]?.src || ''}
                    alt={product.title}
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-110"
                    priority
                  />
                  
                  {/* Navigation Arrows */}
                  {availableImages.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : availableImages.length - 1)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white text-gray-800 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 backdrop-blur-sm"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={() => setCurrentImageIndex(prev => (prev + 1) % availableImages.length)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white text-gray-800 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 backdrop-blur-sm"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                    </>
                  )}

                  {/* Action Buttons */}
                  <div className="absolute top-6 right-6 flex flex-col gap-3">
                    <button
                      onClick={handleToggleFavorite}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg backdrop-blur-sm ${
                        isFav ? 'bg-red-500 text-white' : 'bg-white/90 hover:bg-white text-gray-700'
                      }`}
                    >
                      <Heart className={`h-6 w-6 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                    
                    <div className="relative">
                      <button
                        onClick={() => setShareMenuOpen(!shareMenuOpen)}
                        className="w-12 h-12 bg-white/90 hover:bg-white text-gray-700 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm transition-all"
                      >
                        <Share2 className="h-6 w-6" />
                      </button>
                      
                      {shareMenuOpen && (
                        <div className="absolute top-14 right-0 bg-white rounded-xl shadow-xl border border-gray-100 p-3 z-20 min-w-48">
                          <div className="text-sm font-semibold text-gray-900 mb-3">Share this product</div>
                          <div className="space-y-1">
                            <button onClick={() => handleShare('facebook')} className="flex items-center gap-3 w-full p-2 hover:bg-gray-50 rounded-lg transition-colors">
                              <Facebook className="h-5 w-5 text-blue-600" />
                              <span className="text-gray-700">Facebook</span>
                            </button>
                            <button onClick={() => handleShare('twitter')} className="flex items-center gap-3 w-full p-2 hover:bg-gray-50 rounded-lg transition-colors">
                              <Twitter className="h-5 w-5 text-blue-400" />
                              <span className="text-gray-700">Twitter</span>
                            </button>
                            <button onClick={() => handleShare('whatsapp')} className="flex items-center gap-3 w-full p-2 hover:bg-gray-50 rounded-lg transition-colors">
                              <MessageCircle className="h-5 w-5 text-green-600" />
                              <span className="text-gray-700">WhatsApp</span>
                            </button>
                            <button onClick={() => handleShare('copy')} className="flex items-center gap-3 w-full p-2 hover:bg-gray-50 rounded-lg transition-colors">
                              <Camera className="h-5 w-5 text-gray-600" />
                              <span className="text-gray-700">Copy Link</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Image Counter */}
                  {availableImages.length > 1 && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                      {currentImageIndex + 1} / {availableImages.length}
                    </div>
                  )}
                </>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-6 gap-3">
              {availableImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-3 transition-all ${
                    index === currentImageIndex 
                      ? 'border-indigo-500 ring-4 ring-indigo-200 shadow-lg' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <Image
                    src={img.src}
                    alt={`${product.title} view ${index + 1}`}
                    fill
                    className="object-cover transition-transform hover:scale-110"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced Product Information */}
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  {product.title}
                </h1>
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 text-sm font-semibold">
                  Premium Quality
                </Badge>
              </div>
              
              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.tags.slice(0, 5).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-3 py-1 text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Rating & Reviews */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-gray-600 font-medium">4.8 (247 reviews)</span>
                <div className="flex items-center gap-1 text-green-600">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">1,342 customers love this</span>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-green-600">
                    ${selectedVariant?.price ? (selectedVariant.price).toFixed(2) : '0.00'}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    ${selectedVariant?.price ? ((selectedVariant.price * 1.3)).toFixed(2) : '0.00'}
                  </span>
                  <Badge className="bg-red-500 text-white">Save 23%</Badge>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Free shipping on all orders over $50</span>
                                    <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">30-day returns</span>
                </div>
              </div>
            </div>

            {/* Color Selection with Swatches */}
            {colorSwatches.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Palette className="h-6 w-6 text-gray-600" />
                  <span className="text-lg font-semibold text-gray-900">
                    Color: {selectedColor && <span className="text-indigo-600">{selectedColor}</span>}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {colorSwatches.map((colorSwatch) => (
                    <button
                      key={colorSwatch.name}
                      onClick={() => handleColorSelect(colorSwatch.name)}
                      className={`group flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
                        selectedColor === colorSwatch.name
                          ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                          : 'border-gray-300 hover:border-gray-400 hover:shadow-md bg-white'
                      }`}
                    >
                      <div 
                        className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                        style={{ backgroundColor: colorSwatch.hex }}
                      />
                      <span className={`font-medium ${selectedColor === colorSwatch.name ? 'text-indigo-700' : 'text-gray-700'}`}>
                        {colorSwatch.name}
                      </span>
                      {selectedColor === colorSwatch.name && (
                        <CheckCircle className="h-5 w-5 text-indigo-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection with Dropdown */}
            {true && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Ruler className="h-6 w-6 text-gray-600" />
                    <span className="text-lg font-semibold text-gray-900">Size</span>
                  </div>
                  <button
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1"
                  >
                    <Info className="h-4 w-4" />
                    Size Guide
                  </button>
                </div>
                
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="w-full h-12 text-lg border-2 border-gray-300 hover:border-gray-400 focus:border-indigo-500 rounded-xl">
                    <SelectValue placeholder="Select your size" />
                  </SelectTrigger>
                  <SelectContent>
                    {['S', 'M', 'L', 'XL', '2XL', '3XL'].map((size) => (
                      <SelectItem key={size} value={size} className="text-lg py-3">
                        <div className="flex items-center justify-between w-full">
                          <span>{size}</span>
                          <span className="text-sm text-gray-500 ml-4">In Stock</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {showSizeGuide && (
                  <Card className="border border-indigo-200 bg-indigo-50">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-3">Size Guide</h4>
                      <div className="grid grid-cols-4 gap-2 text-sm">
                        <div className="font-medium">Size</div>
                        <div className="font-medium">Chest</div>
                        <div className="font-medium">Length</div>
                        <div className="font-medium">Sleeve</div>
                        {['S', 'M', 'L', 'XL'].map(size => (
                          <React.Fragment key={size}>
                            <div>{size}</div>
                            <div>36-38"</div>
                            <div>28-30"</div>
                            <div>32-34"</div>
                          </React.Fragment>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Quantity Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-gray-900">Quantity</span>
                <div className="flex items-center gap-2 text-green-600">
                  <Zap className="h-4 w-4" />
                  <span className="text-sm font-medium">Limited time offer</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 border-2 border-gray-300 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-all hover:border-gray-400 disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-5 w-5" />
                </button>
                
                <div className="w-20 text-center">
                  <span className="text-2xl font-bold text-gray-900">{quantity}</span>
                  <div className="text-sm text-gray-500">items</div>
                </div>
                
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 border-2 border-gray-300 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-all hover:border-gray-400"
                >
                  <Plus className="h-5 w-5" />
                </button>

                <div className="text-sm text-gray-600 ml-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Only 12 left in stock</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Add to Cart Section */}
            <div className="space-y-4">
              <Button
                onClick={handleAddToCart}
                disabled={!selectedVariant || isAddingToCart}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none"
              >
                {isAddingToCart ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                    Adding to Cart...
                  </>
                ) : addedToCart ? (
                  <>
                    <CheckCircle className="h-6 w-6 mr-3" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-6 w-6 mr-3" />
                    Add to Cart  ${selectedVariant?.price ? ((selectedVariant.price * quantity)).toFixed(2) : '0.00'}
                  </>
                )}
              </Button>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="h-12 border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-semibold"
                >
                  Buy Now
                </Button>
                <Button 
                  variant="outline" 
                  className="h-12 border-2 border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold"
                >
                  Save for Later
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Truck className="h-7 w-7 text-indigo-600" />
                </div>
                <p className="text-sm font-semibold text-gray-900 mb-1">Fast & Free Shipping</p>
                <p className="text-xs text-gray-600">2-3 business days</p>
              </div>
              
              <div className="text-center">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <RotateCcw className="h-7 w-7 text-green-600" />
                </div>
                <p className="text-sm font-semibold text-gray-900 mb-1">Easy Returns</p>
                <p className="text-xs text-gray-600">30-day guarantee</p>
              </div>
              
              <div className="text-center">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-7 w-7 text-purple-600" />
                </div>
                <p className="text-sm font-semibold text-gray-900 mb-1">Secure Checkout</p>
                <p className="text-xs text-gray-600">SSL protected</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Product Details */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:w-2/3 mx-auto h-14 bg-gray-100 rounded-2xl">
              <TabsTrigger value="description" className="text-base font-semibold rounded-xl">Description</TabsTrigger>
              <TabsTrigger value="features" className="text-base font-semibold rounded-xl">Features</TabsTrigger>
              <TabsTrigger value="reviews" className="text-base font-semibold rounded-xl">Reviews</TabsTrigger>
              <TabsTrigger value="shipping" className="text-base font-semibold rounded-xl">Shipping</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-8">
              <Card className="border-0 shadow-xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6 text-gray-900">Product Description</h3>
                  
                  {descriptionSections.main && (
                    <div className="prose prose-lg max-w-none mb-8">
                      <p className="text-gray-700 leading-relaxed text-lg">{descriptionSections.main}</p>
                    </div>
                  )}

                  {descriptionSections.materials.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Award className="h-6 w-6 text-indigo-600" />
                        Materials & Quality
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {descriptionSections.materials.map((material, index) => (
                          <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{material}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {descriptionSections.care.length > 0 && (
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-4">Care Instructions</h4>
                      <div className="space-y-3">
                        {descriptionSections.care.map((instruction, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-indigo-600 text-sm font-bold">{index + 1}</span>
                            </div>
                            <span className="text-gray-700">{instruction}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="features" className="mt-8">
              <Card className="border-0 shadow-xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6 text-gray-900">Key Features</h3>
                  
                  {descriptionSections.features.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {descriptionSections.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-4 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="h-6 w-6 text-white" />
                          </div>
                          <span className="text-gray-800 font-medium leading-relaxed">{feature}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                        <CheckCircle className="h-6 w-6 text-indigo-600 mt-1" />
                        <span className="text-gray-800 font-medium">Premium quality materials for lasting durability</span>
                      </div>
                      <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                        <CheckCircle className="h-6 w-6 text-indigo-600 mt-1" />
                        <span className="text-gray-800 font-medium">Comfortable fit designed for all-day wear</span>
                      </div>
                      <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                        <CheckCircle className="h-6 w-6 text-indigo-600 mt-1" />
                        <span className="text-gray-800 font-medium">Available in multiple colors and sizes</span>
                      </div>
                      <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                        <CheckCircle className="h-6 w-6 text-indigo-600 mt-1" />
                        <span className="text-gray-800 font-medium">Easy care and maintenance instructions</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-8">
              <Card className="border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold text-gray-900">Customer Reviews</h3>
                    <Button className="bg-indigo-600 hover:bg-indigo-700">Write a Review</Button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-indigo-600 mb-2">4.8</div>
                      <div className="flex items-center justify-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <div className="text-gray-600">Based on 247 reviews</div>
                    </div>
                    
                    <div className="space-y-3">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center gap-3">
                          <span className="text-sm w-8">{stars}</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-yellow-400 h-2 rounded-full" 
                              style={{ width: `${stars === 5 ? 75 : stars === 4 ? 15 : stars === 3 ? 7 : stars === 2 ? 2 : 1}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-12">{stars === 5 ? '185' : stars === 4 ? '37' : stars === 3 ? '17' : stars === 2 ? '5' : '3'}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">96%</div>
                      <div className="text-gray-600">Would recommend</div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {[
                      { name: "Sarah M.", rating: 5, text: "Absolutely love this product! The quality is outstanding and it fits perfectly. Will definitely order again.", date: "2 days ago" },
                      { name: "Mike R.", rating: 5, text: "Fast shipping and exactly as described. The colors are vibrant and the material feels premium.", date: "1 week ago" },
                      { name: "Emma L.", rating: 4, text: "Great product overall. Only wish it came in more color options. But very satisfied with the purchase!", date: "2 weeks ago" }
                    ].map((review, index) => (
                      <div key={index} className="border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                              <span className="font-semibold text-indigo-600">{review.name[0]}</span>
                            </div>
                            <div>
                              <div className="font-semibold">{review.name}</div>
                              <div className="flex items-center gap-1">
                                {[...Array(review.rating)].map((_, i) => (
                                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{review.text}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="shipping" className="mt-8">
              <Card className="border-0 shadow-xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6 text-gray-900">Shipping & Returns</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Truck className="h-6 w-6 text-indigo-600" />
                        Shipping Options
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl">
                          <Truck className="h-6 w-6 text-green-600 mt-1" />
                          <div>
                            <div className="font-semibold text-gray-900">Free Standard Shipping</div>
                            <div className="text-gray-600">5-7 business days  Free on orders over $50</div>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl">
                          <Zap className="h-6 w-6 text-blue-600 mt-1" />
                          <div>
                            <div className="font-semibold text-gray-900">Express Shipping</div>
                            <div className="text-gray-600">2-3 business days  $9.99</div>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl">
                          <Award className="h-6 w-6 text-purple-600 mt-1" />
                          <div>
                            <div className="font-semibold text-gray-900">Next Day Delivery</div>
                            <div className="text-gray-600">1 business day  $19.99</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <RotateCcw className="h-6 w-6 text-green-600" />
                        Returns & Exchanges
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                          <div>
                            <div className="font-semibold text-gray-900">30-Day Return Policy</div>
                            <div className="text-gray-600">Return items within 30 days for a full refund</div>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                          <div>
                            <div className="font-semibold text-gray-900">Free Return Shipping</div>
                            <div className="text-gray-600">We provide prepaid return labels</div>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                          <div>
                            <div className="font-semibold text-gray-900">Easy Exchanges</div>
                            <div className="text-gray-600">Quick size or color exchanges available</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                    <div className="flex items-center gap-3 mb-3">
                      <Shield className="h-6 w-6 text-indigo-600" />
                      <h4 className="text-lg font-semibold text-gray-900">Quality Guarantee</h4>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      We stand behind the quality of our products. If you're not completely satisfied with your purchase, 
                      we'll work with you to make it right. Your satisfaction is our top priority.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
