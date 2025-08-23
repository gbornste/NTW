'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Heart, ShoppingCart, ShoppingBag, Minus, Plus, Loader2, XCircle, AlertTriangle, ArrowLeft, RefreshCw, Check, Star, Shield, Truck, RotateCcw, Award } from 'lucide-react';
import { useFavorites } from '@/contexts/favorites-context';
import { useCart } from '@/contexts/cart-context';

interface CartItem {
  productId: string;
  variantId: string | number;
  quantity: number;
  options: { [key: string]: string };
  price: number;
}

const ResponsiveProductImage = ({ src, alt, fill, sizes, className, ...props }: any) => {
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      className={className}
      {...props}
    />
  );
};

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  // State management
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showImageModal, setShowImageModal] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [justAdded, setJustAdded] = useState(false);

  // Context hooks
  const { isFavorite, toggleFavorite: toggle } = useFavorites();
  const { addToCart } = useCart();

  const toggleFavorite = (id: string) => {
    if (!product) return;
    const favoriteItem = {
      id: product.id,
      title: product.title,
      price: selectedVariant?.price || 0,
      image: product.images?.[0]?.src || '',
      description: product.description || '',
      tags: product.tags || [],
      dateAdded: new Date().toISOString()
    };
    toggle(favoriteItem);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/products/${productId}`, {
          cache: 'no-store'
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.status}`);
        }
        
        const productData = await response.json();
        setProduct(productData);
        
        // Set default options
        if (productData.options) {
          const defaultOptions: { [key: string]: string } = {};
          productData.options.forEach((option: any) => {
            if (option.values && option.values.length > 0) {
              defaultOptions[option.name] = option.values[0];
            }
          });
          setSelectedOptions(defaultOptions);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, retryCount]);

  // Helper functions
  const findColorForImage = (image: any, availableColors: string[]) => {
    if (!image || !availableColors?.length) return null;
    const haystacks: string[] = [
      image.alt,
      image.title,
      image.src,
      JSON.stringify(image || {})
    ].filter(Boolean).map(s => String(s).toLowerCase());

    for (const color of availableColors) {
      const c = color.toLowerCase();
      if (haystacks.some(h => h.includes(c))) return color;
    }
    return null;
  };

  const buildColorThumbnailMapping = (product: any) => {
    const colorToThumbnail: { [color: string]: number } = {};
    const thumbnailToColor: { [idx: number]: string } = {};
    if (!product?.variants || !product?.images) return { colorToThumbnail, thumbnailToColor };

    product.variants.forEach((variant: any) => {
      let variantColor: string | null = null;
      if (Array.isArray(variant.options)) {
        variant.options.forEach((opt: any) => {
          if (opt?.name && opt.name.toLowerCase().includes('color')) {
            variantColor = opt.value;
          }
        });
      }
      const imageIndex = variant.imageIndex;
      if (
        variantColor &&
        imageIndex !== undefined &&
        imageIndex !== null &&
        imageIndex >= 0 &&
        imageIndex < product.images.length
      ) {
        if (
          colorToThumbnail[variantColor] === undefined ||
          imageIndex < colorToThumbnail[variantColor]
        ) {
          colorToThumbnail[variantColor] = imageIndex;
        }
        if (thumbnailToColor[imageIndex] === undefined) {
          thumbnailToColor[imageIndex] = variantColor;
        }
      }
    });

    return { colorToThumbnail, thumbnailToColor };
  };

  const getCorrectColorForThumbnail = (thumbnailIndex: number, colorOptions: string[]) => {
    if (!product?.images?.length) return null;
    const { thumbnailToColor } = buildColorThumbnailMapping(product);

    // 1. Variant mapping
    const variantColor = thumbnailToColor[thumbnailIndex];
    if (variantColor && colorOptions.includes(variantColor)) return variantColor;

    const images = product.images;
    const identical = images.length > 1 && images.every((img: any) => img.src === images[0].src);

    // 2. Identical-images sets-of-N
    if (identical) {
      const colorsCount = colorOptions.length;
      if (!colorsCount) return null;
      const thumbnailsPerColor = Math.max(1, Math.floor(images.length / colorsCount));
      let setIndex = Math.floor(thumbnailIndex / thumbnailsPerColor);
      if (setIndex >= colorsCount) setIndex = colorsCount - 1;
      return colorOptions[setIndex] || null;
    }

    // 3. Derive from image content
    const img = images[thumbnailIndex];
    if (img) {
      const inferred = findColorForImage(img, colorOptions);
      if (inferred) return inferred;
    }
    return null;
  };

  // Event handlers
  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
    const colorOpt = product?.options?.find((o: any) => {
      const n = (o.name || '').toLowerCase().trim();
      return n.includes('color') || n.includes('colour');
    });
    if (!colorOpt) return;
    const colorValues: string[] = colorOpt.values || [];
    const mapped = getCorrectColorForThumbnail(index, colorValues);
    if (mapped) {
      setSelectedOptions(prev => ({ ...prev, [colorOpt.name]: mapped }));
    }
  };

  const handleColorClick = (color: string) => {
    const colorOpt = product?.options?.find((o: any) => {
      const n = (o.name || '').toLowerCase().trim();
      return n.includes('color') || n.includes('colour');
    });
    if (!colorOpt) return;

    setSelectedOptions(prev => ({ ...prev, [colorOpt.name]: color }));

    // Try variant mapping first
    const { colorToThumbnail } = buildColorThumbnailMapping(product);
    let thumbIndex = colorToThumbnail[color];

    if (thumbIndex === undefined) {
      // Fallback: scan thumbnails for a match via mapping
      for (let i = 0; i < product.images.length; i++) {
        const c = getCorrectColorForThumbnail(i, colorOpt.values);
        if (c === color) {
          thumbIndex = i;
          break;
        }
      }
    }

    if (thumbIndex !== undefined) {
      setSelectedImageIndex(thumbIndex);
    }
  };

  const handleAddToCart = async () => {
    if (!product || !selectedVariant) return;
    
    setAddingToCart(true);
    try {
      // Normalize price from cents to dollars
      const priceInCents = selectedVariant.price || 0;
      const priceInDollars = priceInCents > 100 ? priceInCents / 100 : priceInCents;
      
      const cartItem = {
        productId: product.id,
        variantId: selectedVariant.id,
        quantity,
        options: selectedOptions,
        price: priceInDollars
      };
      
      addToCart(cartItem);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
      
      console.log('Added to cart:', cartItem);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product || !selectedVariant) return;
    
    setAddingToCart(true);
    try {
      // Normalize price from cents to dollars
      const priceInCents = selectedVariant.price || 0;
      const priceInDollars = priceInCents > 100 ? priceInCents / 100 : priceInCents;
      
      const cartItem = {
        productId: product.id,
        variantId: selectedVariant.id,
        quantity,
        options: selectedOptions,
        price: priceInDollars
      };
      
      addToCart(cartItem);
      
      // Navigate to checkout immediately
      router.push('/checkout');
    } catch (error) {
      console.error('Error during buy now:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  // Get selected variant
  const selectedVariant = product?.variants?.find((variant: any) => {
    return variant.options?.every((opt: any) => 
      selectedOptions[opt.name] === opt.value
    );
  });

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price > 100 ? price / 100 : price);
  };

  // Calculate total price based on quantity
  const calculateTotalPrice = (price: number, qty: number) => {
    const normalizedPrice = price > 100 ? price / 100 : price;
    return normalizedPrice * qty;
  };

  // Format description to handle HTML and line breaks
  const formatDescription = (description: string) => {
    if (!description) return '';
    
    // Remove HTML tags but preserve line breaks
    return description
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]*>/g, '')
      .trim();
  };

  // Get color value for styling
  const getColorValue = (colorName: string) => {
    const colorMap: { [key: string]: string } = {
      'black': '#000000',
      'white': '#ffffff',
      'red': '#dc2626',
      'crimson': '#dc143c',
      'blue': '#2563eb',
      'navy': '#1e3a8a',
      'royal blue': '#4169e1',
      'green': '#16a34a',
      'yellow': '#eab308',
      'gold': '#ffd700',
      'butter': '#ffdb58',
      'orange': '#ea580c',
      'terracotta': '#e2725b',
      'purple': '#9333ea',
      'pink': '#ec4899',
      'brown': '#92400e',
      'grey': '#6b7280',
      'gray': '#6b7280',
    };
    
    const normalizedColor = colorName.toLowerCase().trim();
    return colorMap[normalizedColor] || '#e5e7eb';
  };

  // Loading state
  if (loading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading product...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex items-center justify-center h-64 text-center">
          <div>
            <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => setRetryCount(prev => prev + 1)} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Product not found state
  if (!product) {
    return (
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p>Product not found</p>
            <Button onClick={() => router.back()} variant="outline" className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-6">
            <div className="relative group">
              <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-white shadow-2xl cursor-pointer transition-transform duration-300 group-hover:scale-[1.02]" onClick={() => setShowImageModal(true)}>
                {product?.images && product.images.length > 0 ? (
                  <ResponsiveProductImage
                    src={product.images[selectedImageIndex]?.src || "/placeholder.svg?height=800&width=800"}
                    alt={product.images[selectedImageIndex]?.alt || String(product.title)}
                    fill={true}
                    sizes="(max-width: 768px) 90vw, 50vw"
                    className="object-contain w-full h-full p-4"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-muted text-muted-foreground">
                    No images available
                  </div>
                )}
                <Button
                  size="icon"
                  variant={isFavorite(product?.id) ? "destructive" : "outline"}
                  className="absolute top-4 right-4 h-12 w-12 rounded-full shadow-lg backdrop-blur-sm bg-white/90 hover:bg-white transition-all duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product?.id);
                  }}
                  aria-label={isFavorite(product?.id) ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart className={`h-6 w-6 ${isFavorite(product?.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
                </Button>
                
                {/* Sale Badge */}
                {selectedVariant && (
                  <div className="absolute top-4 left-4">
                    <Badge variant="destructive" className="text-sm px-3 py-1 font-bold">
                      LIMITED TIME
                    </Badge>
                  </div>
                )}
              </div>
              
              {/* Thumbnail grid */}
              {product?.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 xl:grid-cols-6 gap-3 mt-6">
                  {product.images.slice(0, 12).map((image: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => handleThumbnailClick(index)}
                      className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                        selectedImageIndex === index ? "border-primary shadow-lg ring-2 ring-primary/20" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <ResponsiveProductImage
                        src={String(image?.src || '')}
                        alt={String(image?.alt || `View ${index + 1}`)}
                        fill={true}
                        sizes="80px"
                        className="object-contain p-1"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h1 className="text-4xl lg:text-5xl font-bold leading-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    {product?.title || 'Product'}
                  </h1>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-sm text-muted-foreground ml-2">(4.9)  2,847 reviews</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Price */}
            {selectedVariant && (
              <Card className="p-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                <div className="space-y-3">
                  <div className="flex items-baseline space-x-4">
                    <span className="text-4xl font-bold text-primary">
                      {formatPrice(calculateTotalPrice(selectedVariant.price * 100, quantity))}
                    </span>
                    {quantity > 1 && (
                      <span className="text-lg text-muted-foreground">
                        ({formatPrice(selectedVariant.price)} each)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant="secondary" className="px-3 py-1">
                      Free Shipping with orders over $50
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1">
                      30-Day Returns
                    </Badge>
                  </div>
                </div>
              </Card>
            )}

            {/* Product Description */}
            {product?.description && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Description</h3>
                <div className="prose prose-lg max-w-none">
                  {formatDescription(product.description).split('\n').map((line, index) => (
                    <p key={index} className="text-muted-foreground leading-relaxed">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Product Options */}
            <div className="space-y-6">
              {product?.options?.map((option: any) => {
                const isColor = option.name.toLowerCase().includes('color') || option.name.toLowerCase().includes('colour');
                const isSize = option.name.toLowerCase().includes('size');
                
                return (
                  <div key={option.name} className="space-y-3">
                    <Label className="text-lg font-semibold flex items-center space-x-2">
                      <span>{option.name}:</span>
                      {selectedOptions[option.name] && (
                        <Badge variant="outline" className="ml-2">
                          {selectedOptions[option.name]}
                        </Badge>
                      )}
                    </Label>
                    
                    {isColor ? (
                      <div className="grid grid-cols-6 sm:grid-cols-8 gap-3">
                        {option.values.map((value: string) => (
                          <button
                            key={value}
                            onClick={() => handleColorClick(value)}
                            className={`relative w-12 h-12 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                              selectedOptions[option.name] === value
                                ? "border-primary ring-2 ring-primary/30 shadow-lg"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                            style={{ backgroundColor: getColorValue(value) }}
                            title={value}
                          >
                            {selectedOptions[option.name] === value && (
                              <Check className="absolute inset-0 m-auto h-5 w-5 text-white drop-shadow-lg" />
                            )}
                          </button>
                        ))}
                      </div>
                    ) : isSize ? (
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {option.values.map((value: string) => (
                          <Button
                            key={value}
                            variant={selectedOptions[option.name] === value ? "default" : "outline"}
                            className="h-12 font-semibold transition-all duration-200 hover:scale-105"
                            onClick={() => setSelectedOptions(prev => ({ ...prev, [option.name]: value }))}
                          >
                            {value}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <Select
                        value={selectedOptions[option.name] || ''}
                        onValueChange={(value) => setSelectedOptions(prev => ({ ...prev, [option.name]: value }))}
                      >
                        <SelectTrigger className="h-12 text-lg">
                          <SelectValue placeholder={`Select ${option.name}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {option.values.map((value: string) => (
                            <SelectItem key={value} value={value} className="text-lg py-3">
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <Label className="text-lg font-semibold">Quantity:</Label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-l-lg"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const qty = parseInt(e.target.value, 10);
                      if (qty > 0) setQuantity(qty);
                    }}
                    className="w-20 h-12 text-center border-0 text-lg font-semibold"
                    min="1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-r-lg"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  In stock  Ships within 3-5 business days
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button 
                  onClick={handleAddToCart} 
                  disabled={addingToCart || !selectedVariant}
                  className="h-14 text-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
                  size="lg"
                >
                  {addingToCart ? (
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  ) : justAdded ? (
                    <Check className="h-5 w-5 mr-2" />
                  ) : (
                    <ShoppingCart className="h-5 w-5 mr-2" />
                  )}
                  {addingToCart ? 'Adding...' : justAdded ? 'Added!' : 'Add to Cart'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleBuyNow} 
                  disabled={!selectedVariant}
                  className="h-14 text-lg font-semibold transition-all duration-200 hover:scale-105 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  size="lg"
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Buy Now
                </Button>
              </div>
              
              {/* Trust Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Truck className="h-5 w-5 text-blue-600" />
                  <span>Fast Shipping</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <RotateCcw className="h-5 w-5 text-purple-600" />
                  <span>Easy Returns</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Award className="h-5 w-5 text-yellow-600" />
                  <span>Quality Guarantee</span>
                </div>
              </div>
            </div>

            {/* Return Policy Link */}
            <div className="pt-4 border-t">
              <a
                href="/return-policy"
                className="text-primary underline hover:text-primary/80 font-medium"
              >
                View our complete return policy 
              </a>
            </div>
          </div>
        </div>

        {/* Product Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 text-center">
            <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
            <p className="text-muted-foreground">Made with the finest materials and attention to detail</p>
          </Card>
          <Card className="p-6 text-center">
            <Truck className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Fast & Free Shipping with orders over $50</h3>
            <p className="text-muted-foreground">Free shipping on all orders. Delivered within 3-5 business days</p>
          </Card>
          <Card className="p-6 text-center">
            <RotateCcw className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">30-Day Returns</h3>
            <p className="text-muted-foreground">Not satisfied? Return it within 30 days for a full refund</p>
          </Card>
        </div>
      </div>

      {/* Image Modal */}
      <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{product?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="relative w-full aspect-square max-h-[60vh] overflow-hidden rounded-xl bg-white">
              {product?.images && product.images.length > 0 ? (
                <ResponsiveProductImage
                  src={product.images[selectedImageIndex]?.src || "/placeholder.svg?height=800&width=800"}
                  alt={product.images[selectedImageIndex]?.alt || String(product.title)}
                  fill={true}
                  sizes="(max-width: 768px) 90vw, 800px"
                  className="object-contain p-4"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-muted text-muted-foreground">
                  No images available
                </div>
              )}
            </div>
            {product?.images && product.images.length > 1 && (
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-3 max-h-32 overflow-y-auto">
                {product.images.map((image: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                      selectedImageIndex === index ? "border-primary shadow-lg" : "border-gray-200"
                    }`}
                  >
                    <ResponsiveProductImage
                      src={String(image?.src || '')}
                      alt={String(image?.alt || `View ${index + 1}`)}
                      fill={true}
                      sizes="80px"
                      className="object-contain p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}