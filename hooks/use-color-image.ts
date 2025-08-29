'use client'

import { useState, useEffect } from 'react'
import { getCachedProduct, getColorSpecificImage } from '@/lib/color-image-utils'

interface UseColorImageProps {
  productId: string
  color?: string
  fallbackImage?: string
}

interface UseColorImageReturn {
  colorImage: string
  isLoading: boolean
  error: string | null
}

/**
 * Hook to get color-specific image for a product
 * @param productId - The product ID
 * @param color - The selected color
 * @param fallbackImage - Fallback image if color-specific image not found
 * @returns Object with colorImage, isLoading, and error
 */
export function useColorImage({ 
  productId, 
  color, 
  fallbackImage = '' 
}: UseColorImageProps): UseColorImageReturn {
  const [colorImage, setColorImage] = useState<string>(fallbackImage)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!productId || !color) {
      setColorImage(fallbackImage)
      return
    }

    setIsLoading(true)
    setError(null)

    const fetchColorImage = async () => {
      try {
        const product = await getCachedProduct(productId)
        if (product) {
          const image = getColorSpecificImage(product, color, fallbackImage)
          setColorImage(image)
        } else {
          setColorImage(fallbackImage)
          setError('Product not found')
        }
      } catch (err) {
        console.error('Error fetching color image:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        setColorImage(fallbackImage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchColorImage()
  }, [productId, color, fallbackImage])

  return { colorImage, isLoading, error }
}
