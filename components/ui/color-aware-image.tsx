'use client'

import React from 'react'
import Image from 'next/image'
import { useColorImage } from '@/hooks/use-color-image'

interface ColorAwareImageProps {
  productId: string
  color?: string
  fallbackImage: string
  alt: string
  className?: string
  width?: number
  height?: number
  fill?: boolean
}

/**
 * Component that displays the correct color-specific image for a product
 */
export function ColorAwareImage({ 
  productId, 
  color, 
  fallbackImage, 
  alt, 
  className = '',
  width,
  height,
  fill = false
}: ColorAwareImageProps) {
  const { colorImage, isLoading, error } = useColorImage({ 
    productId, 
    color, 
    fallbackImage 
  })

  // Show loading state
  if (isLoading) {
    return (
      <div className={`bg-gray-200 animate-pulse flex items-center justify-center ${className}`}>
        <div className="text-gray-400 text-xs">Loading...</div>
      </div>
    )
  }

  // Show error state with fallback
  if (error && !colorImage) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <div className="text-gray-400 text-xs">No image</div>
      </div>
    )
  }

  // Render the image
  const imageProps = {
    src: colorImage || fallbackImage,
    alt,
    className: `object-cover ${className}`,
    ...(fill ? { fill: true } : { width: width || 100, height: height || 100 })
  }

  return <Image {...imageProps} />
}
