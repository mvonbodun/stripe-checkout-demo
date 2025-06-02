import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const action = url.searchParams.get('action');
  
  if (action === 'simulate-cart-add') {
    // This endpoint can be used to test the flow
    return NextResponse.json({
      message: 'Test endpoint working',
      timestamp: Date.now(),
      suggested_test_flow: [
        '1. Add items to cart on homepage',
        '2. Open mini-cart',
        '3. Wait for Express Checkout to load (payment intent created)',
        '4. Click "Proceed to Checkout"',
        '5. Verify checkout form loads instead of infinite spinner'
      ]
    });
  }
  
  return NextResponse.json({
    message: 'Test endpoint for debugging cart flow',
    available_actions: ['simulate-cart-add']
  });
}
