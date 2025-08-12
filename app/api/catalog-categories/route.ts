import { NextResponse } from 'next/server';
import { 
  mockCategories, 
  getCategoriesByLevel, 
  getCategoryTree,
  findCategoryById,
  findCategoryBySlug 
} from '../../models/category';
import { categoryService } from '../../lib/category-service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level');
    const parentId = searchParams.get('parentId');
    const slug = searchParams.get('slug');
    const tree = searchParams.get('tree');
    const id = searchParams.get('id');
    const health = searchParams.get('health');

    // Health check for backend service
    if (health === 'true') {
      try {
        const healthStatus = await categoryService.healthCheck();
        return NextResponse.json(healthStatus);
      } catch (error) {
        return NextResponse.json(
          { 
            healthy: false, 
            message: 'Health check failed',
            error: error instanceof Error ? error.message : 'Unknown error'
          },
          { status: 503 }
        );
      }
    }

    // Get single category by ID
    if (id) {
      const category = findCategoryById(id);
      if (!category) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
      }
      return NextResponse.json(category);
    }

    // Get single category by slug
    if (slug) {
      const category = findCategoryBySlug(slug);
      if (!category) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
      }
      return NextResponse.json(category);
    }

    // Get category tree
    if (tree === 'true') {
      try {
        // Extract query parameters for backend service
        const maxDepth = searchParams.get('maxDepth');
        const includeInactive = searchParams.get('includeInactive');
        const rebuildCache = searchParams.get('rebuildCache');

        const options = {
          ...(maxDepth && { maxDepth: parseInt(maxDepth) }),
          ...(includeInactive && { includeInactive: includeInactive === 'true' }),
          ...(rebuildCache && { rebuildCache: rebuildCache === 'true' })
        };

        console.log('Fetching category tree from backend service with options:', options);
        
        const categoryTree = await categoryService.getCategoryTree(options);
        
        console.log(`Successfully retrieved ${categoryTree.length} top-level categories from backend`);
        
        return NextResponse.json(categoryTree);
      } catch (error) {
        console.error('Backend service failed, falling back to mock data:', error);
        
        // Fallback to mock data
        const categoryTree = getCategoryTree();
        
        // Add a header to indicate fallback mode
        const response = NextResponse.json(categoryTree);
        response.headers.set('X-Data-Source', 'fallback-mock');
        response.headers.set('X-Backend-Error', error instanceof Error ? error.message : 'Unknown error');
        
        return response;
      }
    }

    // Get categories by level
    if (level) {
      const levelNum = parseInt(level) as 1 | 2 | 3;
      if (levelNum >= 1 && levelNum <= 3) {
        const categories = getCategoriesByLevel(levelNum);
        return NextResponse.json(categories);
      }
    }

    // Get categories by parent ID
    if (parentId) {
      const childCategories = mockCategories.filter(cat => cat.parentId === parentId);
      return NextResponse.json(childCategories);
    }

    // Return all categories by default
    return NextResponse.json(mockCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
