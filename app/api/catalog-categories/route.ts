import { NextResponse } from 'next/server';

export interface CatalogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  active: boolean;
  order: number;
}

// Mock catalog categories data
const mockCategories: CatalogCategory[] = [
  {
    id: '1',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Latest gadgets and electronics',
    active: true,
    order: 1,
  },
  {
    id: '2',
    name: 'Clothing',
    slug: 'clothing',
    description: 'Fashion and apparel',
    active: true,
    order: 2,
  },
  {
    id: '3',
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'Home improvement and garden supplies',
    active: true,
    order: 3,
  },
  {
    id: '4',
    name: 'Sports & Outdoors',
    slug: 'sports-outdoors',
    description: 'Sports equipment and outdoor gear',
    active: true,
    order: 4,
  },
  {
    id: '5',
    name: 'Books',
    slug: 'books',
    description: 'Books and literature',
    active: true,
    order: 5,
  },
  {
    id: '6',
    name: 'Beauty',
    slug: 'beauty',
    description: 'Beauty and personal care',
    active: true,
    order: 6,
  },
];

export async function GET() {
  try {
    // Filter only active categories and sort by order
    const activeCategories = mockCategories
      .filter(category => category.active)
      .sort((a, b) => a.order - b.order);

    return NextResponse.json(activeCategories);
  } catch (error) {
    console.error('Error fetching catalog categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch catalog categories' },
      { status: 500 }
    );
  }
}
