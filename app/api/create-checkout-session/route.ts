import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

interface CheckoutItem {
  name: string;
  amount: number;
  quantity: number;
}

interface CheckoutRequestBody {
  items?: CheckoutItem[];
  customer_email?: string;
}

// POST /api/create-checkout-session
export async function POST(req: NextRequest) {
  try {
    const { items, customer_email }: CheckoutRequestBody = await req.json();

    // Map your items to Stripe line_items
    const line_items = (items || []).map((item: CheckoutItem) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: item.amount, // Amount in cents
      },
      quantity: item.quantity,
      tax_behavior: 'exclusive' as const, // To enable tax calculation
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      customer_email,
      automatic_tax: { enabled: true },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
