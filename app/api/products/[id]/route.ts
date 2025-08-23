import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Fetch from Printify API
    const response = await fetch(`https://api.printify.com/v1/shops/${process.env.PRINTIFY_SHOP_ID}/products/${id}.json`, {
      headers: {
        'Authorization': `Bearer ${process.env.PRINTIFY_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Ensure fresh data
    });

    if (!response.ok) {
      console.error(`Printify API error: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: `Product not found: ${response.status}` },
        { status: response.status }
      );
    }

    const printifyProduct = await response.json();
    
    // Transform Printify product to match your component's expected structure
    const transformedProduct = {
      id: printifyProduct.id,
      title: printifyProduct.title,
      description: printifyProduct.description || '',
      images: printifyProduct.images?.map((img: any) => ({
        src: img.src,
        alt: img.alt || printifyProduct.title,
        position: img.position
      })) || [],
      options: printifyProduct.options?.map((opt: any) => ({
        name: opt.name,
        values: opt.values?.map((val: any) => val.title || val.name || val) || []
      })) || [],
      variants: printifyProduct.variants?.map((variant: any) => ({
        id: variant.id,
        price: variant.price, // Printify price is already in cents
        options: variant.options?.map((opt: any) => ({
          name: Object.keys(opt)[0], // Option name is the key
          value: opt[Object.keys(opt)[0]] // Option value
        })) || [],
        imageIndex: variant.image_index || 0
      })) || [],
      // Include original Printify data for debugging
      _printifyData: printifyProduct
    };

    console.log('Transformed product:', {
      id: transformedProduct.id,
      title: transformedProduct.title,
      imageCount: transformedProduct.images.length,
      optionCount: transformedProduct.options.length,
      variantCount: transformedProduct.variants.length
    });

    return NextResponse.json(transformedProduct);
  } catch (error) {
    console.error('Error fetching product from Printify:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product from Printify' },
      { status: 500 }
    );
  }
}