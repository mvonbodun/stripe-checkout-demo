import { NextResponse } from 'next/server';

export interface PromotionalOffer {
  id: string;
  text: string;
  type: 'shipping' | 'discount' | 'sale' | 'announcement';
  active: boolean;
  priority: number;
}

// Mock promotional offers data
const mockOffers: PromotionalOffer[] = [
  {
    id: '1',
    text: 'Free Shipping on Orders Over $75',
    type: 'shipping',
    active: true,
    priority: 1,
  },
  {
    id: '2',
    text: '20% Off Sitewide - Use Code SAVE20',
    type: 'discount',
    active: true,
    priority: 2,
  },
  {
    id: '3',
    text: 'Flash Sale: 50% Off Select Items',
    type: 'sale',
    active: false,
    priority: 3,
  },
];

export async function GET() {
  try {
    // Filter only active offers and sort by priority
    const activeOffers = mockOffers
      .filter(offer => offer.active)
      .sort((a, b) => a.priority - b.priority);

    return NextResponse.json(activeOffers);
  } catch (error) {
    console.error('Error fetching promotional offers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch promotional offers' },
      { status: 500 }
    );
  }
}
