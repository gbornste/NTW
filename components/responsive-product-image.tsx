"use client"

import { useState } from "react"
import Image from "next/image"

interface ResponsiveProductImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
  width?: number
  height?: number
  fill?: boolean
  sizes?: string
}

export function ResponsiveProductImage({
  src,
  alt,
  className = "",
  priority = false,
  width,
  height,
  fill = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
}: ResponsiveProductImageProps) {
  const [error, setError] = useState(false)
  const [loaded, setLoaded] = useState(false)

  // Use a placeholder if the image fails to load
  let imageSrc = error ? "/placeholder.svg?height=400&width=400" : src
  // Remove or replace '&fit=crop' in the image URL to prevent cropping
  if (typeof imageSrc === 'string') {
    imageSrc = imageSrc.replace(/([&?])fit=crop(&|$)/, (match, p1, p2) => (p2 === '&' ? p1 : ''));
    // Optionally, you could use fit=contain instead:
    // imageSrc = imageSrc.replace('fit=crop', 'fit=contain');
  }

  if (fill) {
    return (
      <div className="relative w-full h-full">
        {!loaded && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={alt}
          fill
          sizes={sizes}
          className={`object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
          onError={() => {
            console.log(`Image error: ${src}`)
            setError(true)
            setLoaded(true)
          }}
          onLoad={() => {
            setLoaded(true)
          }}
          priority={priority}
        />

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted bg-opacity-50 text-muted-foreground text-xs text-center p-4">
            <span>Image unavailable</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse rounded">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <Image
        src={imageSrc || "/placeholder.svg"}
        alt={alt}
        width={width || 400}
        height={height || 400}
        sizes={sizes}
        className={`transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
        onError={() => {
          console.log(`Image error: ${src}`)
          setError(true)
          setLoaded(true)
        }}
        onLoad={() => {
          setLoaded(true)
        }}
        priority={priority}
      />

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted bg-opacity-50 text-muted-foreground text-xs text-center p-4 rounded">
          <span>Image unavailable</span>
        </div>
      )}
    </div>
  )
}
