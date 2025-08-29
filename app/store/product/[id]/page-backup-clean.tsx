'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Heart, Share2, Plus, Minus } from 'lucide-react';
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

const getColorHex = (colorName: string): string => {
  const colorMap: { [key: string]: string } = {
    'White': '#ffffff',
    'Black': '#000000',
    'Navy': '#1e3a8a',
    'Royal Blue': '#2563eb',
    'Red': '#dc2626',
    'Forest Green': '#166534',
    'Gray': '#6b7280',
    'Dark Gray': '#374151',
    'Light Gray': '#d1d5db'
  };
  
  return colorMap[colorName] || '#808080';
};

const getProductColors = (product: Product): Array<{name: string, hex: string}> => {
  const colorOption = product.options.find(opt => opt.name.toLowerCase() === 'color');
  if (!colorOption) return [];
  
  return colorOption.values.map(value => ({
    name: value.title,
    hex: getColorHex(value.title)
  }));
};

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
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/printify/product/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
          
          const colors = getProductColors(data);
          const sizes = getProductSizes(data);
          
          if (colors.length > 0) {
            setSelectedColor(colors[0].name);
          }
          if (sizes.length > 0) {
            setSelectedSize(sizes[0]);
          }
          
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

  const getCurrentVariant = (): ProductVariant | null => {
    if (!product || !selectedColor || !selectedSize) return null;
    
    return product.variants.find(variant => 
      variant.options.color === selectedColor && 
      variant.options.size === selectedSize &&
      variant.is_enabled
    ) || null;
  };

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
      price: variant.price / 100,
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

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => {
      window.location.href = '/checkout';
    }, 800);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-gray-200 aspect-square rounded-lg"></div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-12">
        
        <div className="space-y-6">
          <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
            <img
              src={selectedImage}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary">Premium Quality</Badge>
              <Badge variant="outline">Fast Shipping</Badge>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.title}</h1>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl">
            <span className="text-4xl font-bold text-gray-900">${currentPrice}</span>
          </div>

          {colors.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Color: <span className="text-blue-600">{selectedColor}</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-12 h-12 rounded-full border-3 ${
                      selectedColor === color.name ? 'border-blue-500' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}

          {sizes.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Size</h3>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a size" />
                </SelectTrigger>
                <SelectContent>
                  {sizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Quantity</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4">
              <Button 
                onClick={handleBuyNow}
                className="flex-1"
                disabled={!selectedColor || !selectedSize}
              >
                Buy Now - ${currentPrice}
              </Button>
              
              <Button
                onClick={handleAddToCart}
                variant="outline"
                className="flex-1"
                disabled={!selectedColor || !selectedSize}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </div>
            
            <Button variant="outline" className="w-full">
              <Heart className="w-4 h-4 mr-2" />
              Add to Wishlist
            </Button>
            
            <Button variant="outline" className="w-full">
              <Share2 className="w-4 h-4 mr-2" />
              Share Product
            </Button>
          </div>

          <div className="border rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-4">Description</h3>
            <p className="text-gray-600">
              {product.description || 'Premium quality product'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
