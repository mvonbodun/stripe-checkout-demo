import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

interface CartItem {
  name: string;
  price: number;
  quantity: number;
  taxcode?: string;
}

interface PaymentIntentRequestBody {
  amount: number;
  cart?: CartItem[];
  tax_calculation_id?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { amount, tax_calculation_id }: PaymentIntentRequestBody = await req.json();
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      description: 'Checkout with Stripe Tax',
      capture_method: 'manual', // Only authorize, don't capture automatically
      metadata: {
        ...(tax_calculation_id ? { tax_calculation_id } : {}),
      },
    });
    
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
