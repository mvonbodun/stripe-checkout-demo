import { NextResponse } from 'next/server';
import { getProductsByCategory, sortProducts, ProductSort } from '../../../../models/product';
import { findCategoryById } from '../../../../models/category';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;
    const { searchParams } = new URL(request.url);

    // Verify category exists
    const category = findCategoryById(categoryId);
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Parse sort parameters
    const sortField = searchParams.get('sortBy') as 'name' | 'price' | 'createdAt' | 'updatedAt' || 'name';
    const sortDirection = searchParams.get('sortDirection') as 'asc' | 'desc' || 'asc';
    const sort: ProductSort = {
      field: sortField,
      direction: sortDirection
    };

    // Parse pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // Get products by category
    let products = getProductsByCategory(categoryId);

    // Apply sorting
    products = sortProducts(products, sort);

    // Calculate total count before pagination
    const totalCount = products.length;

    // Apply pagination
    const paginatedProducts = products.slice(offset, offset + limit);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      products: paginatedProducts,
      category,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPrevPage
      },
      sort
    });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
