import { NextResponse } from 'next/server';
import { getItemsByProduct, getItemPriceRange } from '../../../../models/item';
import { getProductById } from '../../../../models/product';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const { searchParams } = new URL(request.url);
    const includePriceRange = searchParams.get('includePriceRange') === 'true';

    // Verify product exists
    const product = getProductById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Get all variants/items for this product
    const items = getItemsByProduct(productId);

    if (items.length === 0) {
      return NextResponse.json({
        product,
        items: [],
        priceRange: null
      });
    }

    const response: {
      product: typeof product;
      items: typeof items;
      priceRange?: { min: number; max: number } | null;
    } = {
      product,
      items
    };

    // Include price range if requested
    if (includePriceRange) {
      response.priceRange = getItemPriceRange(productId);
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching items for product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    );
  }
}
