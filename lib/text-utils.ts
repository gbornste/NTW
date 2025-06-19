export function cleanHtmlFromText(text: string): string {
  if (!text || typeof text !== "string") return ""

  return (
    text
      // Remove HTML tags
      .replace(/<[^>]*>/g, "")
      // Replace common HTML entities
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&cent;/g, "¢")
      .replace(/&pound;/g, "£")
      .replace(/&yen;/g, "¥")
      .replace(/&euro;/g, "€")
      .replace(/&copy;/g, "©")
      .replace(/&reg;/g, "®")
      // Replace multiple whitespace with single space
      .replace(/\s+/g, " ")
      // Remove leading/trailing whitespace
      .trim()
  )
}

/**
 * Format product description for display
 */
export function formatProductDescription(description: string): string {
  const cleaned = cleanHtmlFromText(description)

  if (!cleaned) return "No description available"

  // Ensure proper sentence structure
  return cleaned
    .replace(/([.!?])\s*([a-z])/g, "$1 $2") // Ensure space after punctuation
    .replace(/([a-z])([A-Z])/g, "$1. $2") // Add period between sentences if missing
}

/**
 * Truncate text to specified length with ellipsis
 */
export function truncateText(text: string, maxLength = 200): string {
  const cleaned = cleanHtmlFromText(text)

  if (cleaned.length <= maxLength) return cleaned

  // Find the last space before the max length to avoid cutting words
  const truncated = cleaned.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(" ")

  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + "..."
  }

  return truncated + "..."
}

/**
 * Validate and clean product option values
 */
export function cleanOptionValue(value: any): string {
  if (value === null || value === undefined) return ""

  return cleanHtmlFromText(String(value))
}

/**
 * Format price for display
 */
export function formatPrice(price: number): string {
  // Handle price conversion (cents to dollars if needed)
  const priceInDollars = price > 100 ? price / 100 : price

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(priceInDollars)
}

/**
 * Validate product data structure
 */
export function validateProductData(product: any): boolean {
  if (!product || typeof product !== "object") return false

  // Check required fields
  const requiredFields = ["id", "title"]
  for (const field of requiredFields) {
    if (!product[field]) return false
  }

  // Validate arrays
  if (product.images && !Array.isArray(product.images)) return false
  if (product.variants && !Array.isArray(product.variants)) return false
  if (product.options && !Array.isArray(product.options)) return false
  if (product.tags && !Array.isArray(product.tags)) return false

  return true
}
