/**
 * Utility functions for handling color-specific product images
 */

interface ProductImage {
  src: string
  variant_ids: number[]
  position: string
}

interface ProductVariant {
  id: number
  title: string
  options: {
    color?: string
    size?: string
  }
  price: number
  is_enabled: boolean
}

interface Product {
  id: string
  title: string
  images: ProductImage[]
  variants: ProductVariant[]
}

/**
 * Get the appropriate image for a specific color from a product
 * @param product - The full product data
 * @param color - The selected color
 * @param fallbackImage - Fallback image if color-specific image not found
 * @returns The URL of the appropriate image
 */
export function getColorSpecificImage(
  product: Product | null, 
  color: string | undefined, 
  fallbackImage?: string
): string {
  if (!product?.images || !color) {
    return fallbackImage || product?.images?.[0]?.src || ''
  }

  // Build color to images mapping
  const colorMap = new Map<string, string[]>()
  
  product.variants.forEach(variant => {
    if (variant.is_enabled && variant.options.color) {
      const colorName = variant.options.color
      if (!colorMap.has(colorName)) {
        colorMap.set(colorName, [])
      }
    }
  })

  // Map images to colors based on variant_ids
  product.images.forEach(img => {
    img.variant_ids.forEach(variantId => {
      const variant = product.variants.find(v => v.id === variantId)
      if (variant?.options.color) {
        const colorImages = colorMap.get(variant.options.color)
        if (colorImages && !colorImages.includes(img.src)) {
          colorImages.push(img.src)
        }
      }
    })
  })

  // Get the first image for the specified color
  const colorImages = colorMap.get(color)
  if (colorImages && colorImages.length > 0) {
    return colorImages[0]
  }

  // Fallback to provided fallback or first product image
  return fallbackImage || product.images[0]?.src || ''
}

/**
 * Fetch product data and get color-specific image
 * @param productId - The product ID
 * @param color - The selected color
 * @param fallbackImage - Fallback image if color-specific image not found
 * @returns Promise resolving to the appropriate image URL
 */
export async function fetchColorSpecificImage(
  productId: string, 
  color: string | undefined, 
  fallbackImage?: string
): Promise<string> {
  if (!color) {
    return fallbackImage || ''
  }

  try {
    const response = await fetch(`/api/printify/product/${productId}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.status}`)
    }
    
    const product = await response.json()
    return getColorSpecificImage(product, color, fallbackImage)
  } catch (error) {
    console.error('Error fetching color-specific image:', error)
    return fallbackImage || ''
  }
}

/**
 * Cache for product data to avoid repeated API calls
 */
const productCache = new Map<string, Product>()

/**
 * Get cached product or fetch if not cached
 * @param productId - The product ID
 * @returns Promise resolving to product data
 */
export async function getCachedProduct(productId: string): Promise<Product | null> {
  if (productCache.has(productId)) {
    return productCache.get(productId) || null
  }

  try {
    const response = await fetch(`/api/printify/product/${productId}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.status}`)
    }
    
    const product = await response.json()
    productCache.set(productId, product)
    return product
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}
