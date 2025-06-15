import { NextResponse } from 'next/server';
import { 
  Category, 
  CategoryTree, 
  mockCategories, 
  getCategoriesByLevel, 
  getCategoryTree,
  findCategoryById,
  findCategoryBySlug 
} from '../../models/category';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level');
    const parentId = searchParams.get('parentId');
    const slug = searchParams.get('slug');
    const tree = searchParams.get('tree');
    const id = searchParams.get('id');

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
      const categoryTree = getCategoryTree();
      return NextResponse.json(categoryTree);
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
