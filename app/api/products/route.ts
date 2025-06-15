import { NextResponse } from 'next/server';
import { 
  Product, 
  mockProducts, 
  filterProducts, 
  sortProducts, 
  searchProducts,
  ProductFilter,
  ProductSort 
} from '../../models/product';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse filter parameters
    const filter: ProductFilter = {
      categoryId: searchParams.get('categoryId') || undefined,
      brand: searchParams.get('brand') || undefined,
      minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
      inStock: searchParams.get('inStock') ? searchParams.get('inStock') === 'true' : undefined,
      search: searchParams.get('search') || undefined
    };

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

    // Apply filters
    let filteredProducts = filterProducts(filter);

    // Apply sorting
    filteredProducts = sortProducts(filteredProducts, sort);

    // Calculate total count before pagination
    const totalCount = filteredProducts.length;

    // Apply pagination
    const paginatedProducts = filteredProducts.slice(offset, offset + limit);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPrevPage
      },
      filters: filter,
      sort
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
