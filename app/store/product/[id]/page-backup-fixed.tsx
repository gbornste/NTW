'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, CreditCard, Heart, Share2, ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';

interface ProductImage {
  src: string;
  alt?: string;
  is_default?: boolean;
}

interface ProductVariant {
  id: number;
  title: string;
  options: {
    color?: string;
    size?: string;
  };
  price: number;
  is_enabled: boolean;
}

interface Product {
  id: string;
  title: string;
  description: string;
  tags: string[];
  options: Array<{
    name: string;
    type: string;
    values: Array<{
      id: number;
      title: string;
      colors?: string[];
    }>;
  }>;
  variants: ProductVariant[];
  images: ProductImage[];
  created_at: string;
  updated_at: string;
  visible: boolean;
  is_locked: boolean;
  blueprint_id: number;
  user_id: number;
  shop_id: number;
  print_provider_id: number;
  print_areas: any[];
  print_details: any[];
  sales_channel_properties: any[];
  is_printify_express_eligible: boolean;
  is_printify_express_enabled: boolean;
  is_economy_shipping_eligible: boolean;
  is_economy_shipping_enabled: boolean;
}

// COMPLETE color mapping with real API color names to hex values
const getColorHex = (colorName: string): string => {
  const colorMap: { [key: string]: string } = {
    'White': '#ffffff',
    'Black': '#000000',
    'Navy': '#1e3a8a',
    'Royal Blue': '#2563eb',
    'Red': '#dc2626',
    'Forest Green': '#166534',
    'Terracotta': '#DB8C76',
    'Butter': '#F5E1A4',
    'Pepper': '#5F605B',
    'Sage': '#B5B5A3',
    'Dusty blue': '#7BA4B0',
    'Mauve': '#BA9BB4',
    'Heather Prism Lilac': '#C8A2C8',
    'Heather Prism Mint': '#9BC2A8',
    'Heather Prism Natural': '#E8E2D5',
    'Heather Prism Sunset': '#FFB347',
    'Heather Prism Peach': '#FFCAB0',
    'Heather Prism Ice Blue': '#B8E0D2',
    'Heather Prism Dusty Blue': '#A4C2CE',
    'Gray': '#6b7280',
    'Dark Gray': '#374151',
    'Light Gray': '#d1d5db'
  };
  
  return colorMap[colorName] || '#808080';
};

// Extract available colors from product options
const getProductColors = (product: Product): Array<{name: string, hex: string}> => {
  const colorOption = product.options.find(opt => opt.name.toLowerCase() === 'color');
  if (!colorOption) return [];
  
  return colorOption.values.map(value => ({
    name: value.title,
    hex: getColorHex(value.title)
  }));
};

// Get available sizes from product options
const getProductSizes = (product: Product): string[] => {
  const sizeOption = product.options.find(opt => opt.name.toLowerCase() === 'size');
  if (!sizeOption) return [];
  
  return sizeOption.values.map(value => value.title);
};

export default function ProductPage() {
  const params = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [imageIndex, setImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/printify/product/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
          
          // Set default selections
          const colors = getProductColors(data);
          const sizes = getProductSizes(data);
          
          if (colors.length > 0) {
            setSelectedColor(colors[0].name);
          }
          if (sizes.length > 0) {
            setSelectedSize(sizes[0]);
          }
          
          // Set default image
          const defaultImage = data.images.find((img: ProductImage) => img.is_default) || data.images[0];
          if (defaultImage) {
            setSelectedImage(defaultImage.src);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  // Handle color change and sync thumbnail
  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    
    // Find image that matches the selected color and update main image
    if (product) {
      const colorIndex = getProductColors(product).findIndex(c => c.name === color);
      const newImageIndex = colorIndex % product.images.length;
      setImageIndex(newImageIndex);
      setSelectedImage(product.images[newImageIndex].src);
    }
  };

  // Navigate through product images
  const navigateImage = (direction: 'prev' | 'next') => {
    if (!product || product.images.length === 0) return;
    
    let newIndex;
    if (direction === 'prev') {
      newIndex = imageIndex > 0 ? imageIndex - 1 : product.images.length - 1;
    } else {
      newIndex = imageIndex < product.images.length - 1 ? imageIndex + 1 : 0;
    }
    
    setImageIndex(newIndex);
    setSelectedImage(product.images[newIndex].src);
  };

  // Get current variant based on selections
  const getCurrentVariant = (): ProductVariant | null => {
    if (!product || !selectedColor || !selectedSize) return null;
    
    return product.variants.find(variant => 
      variant.options.color === selectedColor && 
      variant.options.size === selectedSize &&
      variant.is_enabled
    ) || null;
  };

  // Add to cart functionality with quantity
  const handleAddToCart = () => {
    if (!product || !selectedColor || !selectedSize) {
      toast.error('Please select color and size');
      return;
    }

    const variant = getCurrentVariant();
    if (!variant) {
      toast.error('Selected variant is not available');
      return;
    }

    const cartItem = {
      id: `${product.id}-${selectedColor}-${selectedSize}`,
      name: product.title,
      price: variant.price / 100, // Convert cents to dollars
      image: selectedImage,
      quantity: quantity,
      variant: {
        color: selectedColor,
        size: selectedSize
      }
    };

    addItem(cartItem);
    toast.success(`Added ${quantity} item(s) to cart!`);
  };

  // Buy now functionality - immediate checkout
  const handleBuyNow = () => {
    if (!product || !selectedColor || !selectedSize) {
      toast.error('Please select color and size');
      return;
    }

    const variant = getCurrentVariant();
    if (!variant) {
      toast.error('Selected variant is not available');
      return;
    }

    // Add to cart first
    handleAddToCart();
    
    // Redirect to checkout after short delay
    setTimeout(() => {
      window.location.href = '/checkout';
    }, 800);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="bg-gray-200 aspect-square rounded-lg"></div>
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-200 aspect-square rounded-lg"></div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Product not found</h1>
          <p className="text-gray-600 text-lg">The product you're looking for doesn't exist or has been removed.</p>
          <Button className="mt-6" onClick={() => window.location.href = '/store'}>
            Return to Store
          </Button>
        </div>
      </div>
    );
  }

  const colors = getProductColors(product);
  const sizes = getProductSizes(product);
  const currentVariant = getCurrentVariant();
  const currentPrice = currentVariant ? (currentVariant.price / 100).toFixed(2) : '0.00';
  const originalPrice = currentVariant ? ((currentVariant.price / 100) * 1.3).toFixed(2) : '0.00';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-12">
        
        {/* PRODUCT IMAGES SECTION */}
        <div className="space-y-6">
          {/* Main Product Image */}
          <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden group">
            <img
              src={selectedImage}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            
            {/* Navigation Arrows */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => navigateImage('prev')}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-800" />
                </button>
                <button
                  onClick={() => navigateImage('next')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="w-6 h-6 text-gray-800" />
                </button>
              </>
            )}
            
            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              {imageIndex + 1} / {product.images.length}
            </div>
          </div>
          
          {/* Thumbnail Grid */}
          <div className="grid grid-cols-4 gap-3">
            {product.images.slice(0, 8).map((image, index) => (
              <button
                key={index}
                onClick={() => {
                  setImageIndex(index);
                  setSelectedImage(image.src);
                }}
                className={`aspect-square bg-gray-100 rounded-xl overflow-hidden border-3 transition-all duration-200 ${
                  imageIndex === index ? 'border-blue-500 shadow-lg' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <img
                  src={image.src}
                  alt={`${product.title} view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* PRODUCT INFO SECTION */}
        <div className="space-y-8">
          
          {/* Header & Title */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">Premium Quality</Badge>
              <Badge variant="outline" className="border-blue-200 text-blue-700">Fast Shipping</Badge>
              <Badge variant="destructive">25% OFF</Badge>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.title}</h1>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-lg text-gray-600">(2,847 reviews)</span>
              <span className="text-green-600 font-semibold">Best Seller</span>
            </div>
          </div>

          {/* PRICING */}
          <div className="bg-gray-50 p-6 rounded-2xl">
            <div className="flex items-center gap-4 mb-2">
              <span className="text-4xl font-bold text-gray-900">${currentPrice}</span>
              <span className="text-2xl text-gray-500 line-through">${originalPrice}</span>
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">SAVE 25%</span>
            </div>
            <p className="text-gray-600">Free shipping on orders over $50 • 30-day returns</p>
          </div>

          {/* COLOR SELECTION */}
          {colors.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Color: <span className="text-blue-600">{selectedColor}</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => handleColorChange(color.name)}
                    className={`relative w-12 h-12 rounded-full border-3 transition-all duration-200 ${
                      selectedColor === color.name ? 'border-blue-500 shadow-lg' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {selectedColor === color.name && (
                      <div className="absolute inset-0 rounded-full border-2 border-white"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SIZE SELECTION */}
          {sizes.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Size: <span className="text-blue-600">{selectedSize}</span>
              </h3>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger className="w-full h-14 text-lg border-2 border-gray-300 rounded-xl">
                  <SelectValue placeholder="Select a size" />
                </SelectTrigger>
                <SelectContent>
                  {sizes.map((size) => (
                    <SelectItem key={size} value={size} className="text-lg py-3">
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* QUANTITY SELECTOR */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Quantity</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center border-2 border-gray-300 rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-100 transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="px-6 py-3 text-xl font-semibold min-w-[4rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <span className="text-gray-600">
                Total: <span className="font-semibold text-2xl">${(parseFloat(currentPrice) * quantity).toFixed(2)}</span>
              </span>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <Button 
                onClick={handleBuyNow}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white h-14 text-lg font-semibold rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
                size="lg"
                disabled={!selectedColor || !selectedSize || !currentVariant}
              >
                Buy Now - ${currentPrice}
              </Button>
              
              <Button
                onClick={handleAddToCart}
                variant="outline"
                className="flex-1 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white h-14 text-lg font-semibold rounded-xl transition-all duration-200"
                size="lg"
                disabled={!selectedColor || !selectedSize || !currentVariant}
              >
                <ShoppingCart className="w-6 h-6 mr-3" />
                Add to Cart
              </Button>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="flex-1 h-12 rounded-xl"
              >
                <Heart className={`w-5 h-5 mr-2 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                {isWishlisted ? 'Added to Wishlist' : 'Add to Wishlist'}
              </Button>
              <Button variant="outline" className="flex-1 h-12 rounded-xl">
                <Share2 className="w-5 h-5 mr-2" />
                Share Product
              </Button>
            </div>
          </div>

          {/* PRODUCT DESCRIPTION */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Product Description</h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              {product.description || 'Premium quality product crafted with the finest materials. Perfect for everyday wear with superior comfort and durability. Machine washable and designed to maintain its shape and color wash after wash.'}
            </p>
          </div>

          {/* SHIPPING & RETURN INFO */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Shipping & Returns</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-green-600">Orders over $50</span>
                <span className="font-semibold text-green-600">FREE SHIPPING</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Express Delivery</span>
                <span className="font-semibold">1-2 business days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Return Policy</span>
                <span className="font-semibold">30-day free returns</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Warranty</span>
                <span className="font-semibold">1-year guarantee</span>
              </div>
            </div>
          </div>

          {/* TRUST BADGES */}
          <div className="flex justify-center gap-6 py-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-green-600 text-2xl">🔒</span>
              </div>
              <span className="text-sm font-medium text-gray-700">Secure Payment</span>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 text-2xl">🚚</span>
              </div>
              <span className="text-sm font-medium text-gray-700">Fast Delivery</span>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-purple-600 text-2xl">⭐</span>
              </div>
              <span className="text-sm font-medium text-gray-700">Top Quality</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
