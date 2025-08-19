import { NextResponse } from 'next/server';
import { productService } from '../../../../lib/product-service';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const includeVariants = searchParams.get('includeVariants') === 'true';
    const includeInventory = searchParams.get('includeInventory') === 'true';
    const includePricing = searchParams.get('includePricing') === 'true';
    const bustCache = searchParams.has('_cache_bust');

    console.log(`API: Fetching product by slug: ${slug}, includeVariants: ${includeVariants}, includeInventory: ${includeInventory}, includePricing: ${includePricing}, bustCache: ${bustCache}`);

    const product = await productService.getProductBySlug(slug, includeVariants, includeInventory, includePricing, bustCache);
    
    if (!product) {
      console.log(`API: Product not found for slug: ${slug}`);
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    console.log(`API: Successfully fetched product: ${product.name}`);
    return NextResponse.json(product);

  } catch (error) {
    console.error('API: Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
