import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { items } = await request.json()
    
    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid items data' }, { status: 400 })
    }

    // For now, we'll simulate the Printify order creation
    // In a real implementation, you would:
    // 1. Fetch actual product data from Printify API
    // 2. Create line items with correct variant IDs
    // 3. Submit order to Printify
    // 4. Handle webhook responses

    const printifyOrderData = {
      line_items: items.map((item: any) => ({
        product_id: item.productId,
        variant_id: parseInt(item.variantId),
        quantity: item.quantity,
        // Printify uses variant_id to determine color/size automatically
        // The variant_id already encodes the color and size information
      })),
      shipping_method: 1, // Standard shipping
      is_printify_express: false,
      send_shipping_notification: true,
      address_to: {
        // This would be filled with actual shipping address from the form
        first_name: "Customer",
        last_name: "Name",
        email: "customer@example.com",
        phone: "1234567890",
        country: "US",
        region: "",
        address1: "123 Main St",
        address2: "",
        city: "Anytown",
        zip: "12345"
      }
    }

    console.log('🛒 Printify Order Data Prepared:', {
      itemCount: items.length,
      lineItems: printifyOrderData.line_items,
      totalVariants: printifyOrderData.line_items.length
    })

    // Log color information for verification
    items.forEach((item: any, index: number) => {
      console.log(`📦 Item ${index + 1}:`, {
        productId: item.productId,
        variantId: item.variantId,
        color: item.options?.color,
        size: item.options?.size,
        quantity: item.quantity,
        title: item.title
      })
    })

    // For demo purposes, return success
    // In production, you would actually call the Printify API here
    return NextResponse.json({
      success: true,
      message: 'Order prepared for Printify submission',
      printifyData: printifyOrderData,
      orderInfo: {
        itemCount: items.length,
        totalQuantity: items.reduce((sum: number, item: any) => sum + item.quantity, 0),
        colorInfo: items.map((item: any) => ({
          productId: item.productId,
          color: item.options?.color,
          size: item.options?.size
        }))
      }
    })

  } catch (error) {
    console.error('❌ Error preparing Printify order:', error)
    return NextResponse.json(
      { error: 'Failed to prepare order for Printify' }, 
      { status: 500 }
    )
  }
}
