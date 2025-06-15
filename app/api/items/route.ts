import { NextResponse } from 'next/server';
import { 
  mockItems, 
  getItemById, 
  getItemBySku, 
  getInStockItems, 
  getLowStockItems,
  getItemsByOption 
} from '../../models/item';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const sku = searchParams.get('sku');
    const inStockOnly = searchParams.get('inStockOnly') === 'true';
    const lowStockOnly = searchParams.get('lowStockOnly') === 'true';
    const optionName = searchParams.get('optionName');
    const optionValue = searchParams.get('optionValue');

    // Get single item by ID
    if (id) {
      const item = getItemById(id);
      if (!item) {
        return NextResponse.json({ error: 'Item not found' }, { status: 404 });
      }
      return NextResponse.json(item);
    }

    // Get single item by SKU
    if (sku) {
      const item = getItemBySku(sku);
      if (!item) {
        return NextResponse.json({ error: 'Item not found' }, { status: 404 });
      }
      return NextResponse.json(item);
    }

    // Get items by option
    if (optionName && optionValue) {
      const items = getItemsByOption(optionName, optionValue);
      return NextResponse.json(items);
    }

    // Get low stock items
    if (lowStockOnly) {
      const items = getLowStockItems();
      return NextResponse.json(items);
    }

    // Get in stock items only
    if (inStockOnly) {
      const items = getInStockItems();
      return NextResponse.json(items);
    }

    // Return all items by default
    return NextResponse.json(mockItems);
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    );
  }
}
