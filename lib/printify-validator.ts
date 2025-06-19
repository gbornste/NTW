export interface PrintifyImage {
  src: string
  is_default: boolean
  variant_ids: number[] | string[]
  position: string
  width?: number
  height?: number
  alt?: string
}

export interface PrintifyVariant {
  id: string | number
  title: string
  price: number
  is_enabled: boolean
  options: Record<string, string | number>
}

export interface PrintifyOption {
  name: string
  type: string
  values: string[]
}

export interface PrintifyProduct {
  id: string
  title: string
  description: string
  images: PrintifyImage[]
  variants: PrintifyVariant[]
  options?: PrintifyOption[]
  tags: string[]
  created_at: string
  updated_at: string
}

export interface PrintifyApiResponse {
  data: PrintifyProduct[]
  current_page: number
  last_page: number
  total: number
  shopTitle?: string
  shopId?: string | number
  salesChannel?: string
  isMockData?: boolean
  previewMode?: boolean
  error?: string
  message?: string
  apiCallDuration?: number
  timestamp?: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
  product?: PrintifyProduct
}

export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface ValidationWarning {
  field: string
  message: string
  code: string
}

/**
 * Validates a Printify product object
 */
export function validatePrintifyProduct(product: any): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []

  // Check required fields
  if (!product) {
    errors.push({
      field: "product",
      message: "Product is null or undefined",
      code: "MISSING_PRODUCT",
    })
    return { isValid: false, errors, warnings }
  }

  // Check ID
  if (!product.id) {
    errors.push({
      field: "id",
      message: "Product ID is missing",
      code: "MISSING_ID",
    })
  }

  // Check title
  if (!product.title) {
    errors.push({
      field: "title",
      message: "Product title is missing",
      code: "MISSING_TITLE",
    })
  } else if (typeof product.title !== "string") {
    errors.push({
      field: "title",
      message: "Product title must be a string",
      code: "INVALID_TITLE_TYPE",
    })
  }

  // Check description
  if (!product.description) {
    warnings.push({
      field: "description",
      message: "Product description is missing",
      code: "MISSING_DESCRIPTION",
    })
  } else if (typeof product.description !== "string") {
    errors.push({
      field: "description",
      message: "Product description must be a string",
      code: "INVALID_DESCRIPTION_TYPE",
    })
  }

  // Check images
  if (!product.images || !Array.isArray(product.images)) {
    errors.push({
      field: "images",
      message: "Product images must be an array",
      code: "INVALID_IMAGES",
    })
  } else if (product.images.length === 0) {
    warnings.push({
      field: "images",
      message: "Product has no images",
      code: "NO_IMAGES",
    })
  } else {
    // Check if there's a default image
    const hasDefaultImage = product.images.some((img: any) => img.is_default)
    if (!hasDefaultImage) {
      warnings.push({
        field: "images",
        message: "No default image specified",
        code: "NO_DEFAULT_IMAGE",
      })
    }

    // Check image sources
    product.images.forEach((img: any, index: number) => {
      if (!img.src) {
        errors.push({
          field: `images[${index}].src`,
          message: `Image at index ${index} has no source URL`,
          code: "MISSING_IMAGE_SRC",
        })
      }
    })
  }

  // Check variants
  if (!product.variants || !Array.isArray(product.variants)) {
    errors.push({
      field: "variants",
      message: "Product variants must be an array",
      code: "INVALID_VARIANTS",
    })
  } else if (product.variants.length === 0) {
    warnings.push({
      field: "variants",
      message: "Product has no variants",
      code: "NO_VARIANTS",
    })
  } else {
    // Check if there's at least one enabled variant
    const hasEnabledVariant = product.variants.some((v: any) => v.is_enabled)
    if (!hasEnabledVariant) {
      warnings.push({
        field: "variants",
        message: "No enabled variants",
        code: "NO_ENABLED_VARIANTS",
      })
    }

    // Check variant prices
    product.variants.forEach((variant: any, index: number) => {
      if (variant.price === undefined || variant.price === null) {
        errors.push({
          field: `variants[${index}].price`,
          message: `Variant at index ${index} has no price`,
          code: "MISSING_VARIANT_PRICE",
        })
      } else if (typeof variant.price !== "number") {
        errors.push({
          field: `variants[${index}].price`,
          message: `Variant price must be a number`,
          code: "INVALID_VARIANT_PRICE_TYPE",
        })
      }
    })
  }

  // Check tags
  if (!product.tags) {
    warnings.push({
      field: "tags",
      message: "Product tags are missing",
      code: "MISSING_TAGS",
    })
  } else if (!Array.isArray(product.tags)) {
    errors.push({
      field: "tags",
      message: "Product tags must be an array",
      code: "INVALID_TAGS_TYPE",
    })
  }

  // Transform the product to ensure it has the correct structure
  const transformedProduct: PrintifyProduct = {
    id: product.id || "",
    title: product.title || "",
    description: product.description || "",
    images: Array.isArray(product.images)
      ? product.images.map((img: any) => ({
          src: img.src || "",
          is_default: !!img.is_default,
          variant_ids: Array.isArray(img.variant_ids) ? img.variant_ids : [],
          position: img.position || "front",
          width: img.width || undefined,
          height: img.height || undefined,
          alt: img.alt || product.title || "",
        }))
      : [],
    variants: Array.isArray(product.variants)
      ? product.variants.map((v: any) => ({
          id: v.id || "",
          title: v.title || "",
          price: typeof v.price === "number" ? v.price : 0,
          is_enabled: !!v.is_enabled,
          options: v.options || {},
        }))
      : [],
    options: Array.isArray(product.options) ? product.options : [],
    tags: Array.isArray(product.tags) ? product.tags : [],
    created_at: product.created_at || new Date().toISOString(),
    updated_at: product.updated_at || new Date().toISOString(),
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    product: transformedProduct,
  }
}

/**
 * Validates a Printify API response
 */
export function validatePrintifyApiResponse(response: any): {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
  transformedResponse: PrintifyApiResponse
} {
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []

  // Check if response exists
  if (!response) {
    errors.push({
      field: "response",
      message: "API response is null or undefined",
      code: "MISSING_RESPONSE",
    })
    return {
      isValid: false,
      errors,
      warnings,
      transformedResponse: {
        data: [],
        current_page: 1,
        last_page: 1,
        total: 0,
      },
    }
  }

  // Check data array
  if (!response.data) {
    errors.push({
      field: "data",
      message: "API response data is missing",
      code: "MISSING_DATA",
    })
  } else if (!Array.isArray(response.data)) {
    errors.push({
      field: "data",
      message: "API response data must be an array",
      code: "INVALID_DATA_TYPE",
    })
  } else if (response.data.length === 0) {
    warnings.push({
      field: "data",
      message: "API response contains no products",
      code: "EMPTY_DATA",
    })
  }

  // Check pagination
  if (response.current_page === undefined) {
    warnings.push({
      field: "current_page",
      message: "Current page information is missing",
      code: "MISSING_CURRENT_PAGE",
    })
  }

  if (response.last_page === undefined) {
    warnings.push({
      field: "last_page",
      message: "Last page information is missing",
      code: "MISSING_LAST_PAGE",
    })
  }

  if (response.total === undefined) {
    warnings.push({
      field: "total",
      message: "Total count information is missing",
      code: "MISSING_TOTAL",
    })
  }

  // Transform and validate products
  const transformedProducts: PrintifyProduct[] = []
  const productErrors: Record<string, ValidationError[]> = {}
  const productWarnings: Record<string, ValidationWarning[]> = {}

  if (Array.isArray(response.data)) {
    response.data.forEach((product: any, index: number) => {
      const validationResult = validatePrintifyProduct(product)

      if (validationResult.errors.length > 0) {
        productErrors[`product_${index}`] = validationResult.errors
      }

      if (validationResult.warnings.length > 0) {
        productWarnings[`product_${index}`] = validationResult.warnings
      }

      if (validationResult.product) {
        transformedProducts.push(validationResult.product)
      }
    })
  }

  // Add summary warnings for product issues
  if (Object.keys(productErrors).length > 0) {
    warnings.push({
      field: "products",
      message: `${Object.keys(productErrors).length} products have validation errors`,
      code: "PRODUCT_VALIDATION_ERRORS",
    })
  }

  // Create transformed response
  const transformedResponse: PrintifyApiResponse = {
    data: transformedProducts,
    current_page: response.current_page || 1,
    last_page: response.last_page || 1,
    total: response.total || transformedProducts.length,
    shopTitle: response.shopTitle,
    shopId: response.shopId,
    salesChannel: response.salesChannel,
    isMockData: response.isMockData,
    previewMode: response.previewMode,
    error: response.error,
    message: response.message,
    apiCallDuration: response.apiCallDuration,
    timestamp: response.timestamp || new Date().toISOString(),
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    transformedResponse,
  }
}
