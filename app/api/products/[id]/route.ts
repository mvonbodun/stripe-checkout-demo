import { NextResponse } from 'next/server';
import { getProductById } from '../../../models/product';
import { getItemsByProduct } from '../../../models/item';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const includeVariants = searchParams.get('includeVariants') === 'true';

    const product = getProductById(id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // If variants are requested, include them
    if (includeVariants) {
      const variants = getItemsByProduct(id);
      return NextResponse.json({
        ...product,
        variants
      });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
