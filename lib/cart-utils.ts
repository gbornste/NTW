import type { CartItem } from "@/contexts/cart-context"

/**
 * Validate cart item data before adding to cart
 */
export function validateCartItem(item: any): boolean {
  if (!item || typeof item !== "object") return false

  const requiredFields = ["id", "productId", "variantId", "name", "price", "quantity"]

  for (const field of requiredFields) {
    if (item[field] === undefined || item[field] === null) {
      console.error(`Missing required cart item field: ${field}`)
      return false
    }
  }

  // Validate data types
  if (typeof item.price !== "number" || item.price < 0) {
    console.error("Invalid price:", item.price)
    return false
  }

  if (typeof item.quantity !== "number" || item.quantity < 1) {
    console.error("Invalid quantity:", item.quantity)
    return false
  }

  return true
}

/**
 * Sanitize cart item data
 */
export function sanitizeCartItem(item: any): CartItem {
  return {
    id: String(item.id || ""),
    productId: String(item.productId || ""),
    variantId: String(item.variantId || ""),
    name: String(item.name || "Unknown Product"),
    price: Number(item.price || 0),
    quantity: Math.max(1, Math.min(10, Number(item.quantity || 1))),
    image: String(item.image || "/placeholder.svg?height=300&width=300"),
    variant: String(item.variant || "Default"),
    variantTitle: String(item.variantTitle || item.variant || "Default"),
    options: item.options && typeof item.options === "object" ? item.options : {},
    customization: item.customization && typeof item.customization === "object" ? item.customization : {},
  }
}

/**
 * Calculate cart totals
 */
export function calculateCartTotals(items: CartItem[]) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  // Calculate additional costs
  let additionalCosts = 0
  items.forEach((item) => {
    if (item.customization?.giftWrap) additionalCosts += 2.99
    if (item.customization?.rushDelivery) additionalCosts += 9.99
    if (item.customization?.expressShipping) additionalCosts += 15.99
  })

  const tax = (subtotal + additionalCosts) * 0.08 // 8% tax
  const total = subtotal + additionalCosts + tax

  return {
    subtotal,
    additionalCosts,
    tax,
    total,
    itemCount,
  }
}

/**
 * Generate unique cart item ID
 */
export function generateCartItemId(productId: string, variantId: string, customization?: any): string {
  let id = `${productId}-${variantId}`

  if (customization) {
    const customizationKeys = Object.keys(customization)
      .filter((key) => customization[key])
      .sort()
      .join("-")

    if (customizationKeys) {
      id += `-${customizationKeys}`
    }
  }

  return id
}
