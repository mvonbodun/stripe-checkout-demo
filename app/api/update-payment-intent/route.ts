import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

interface UpdatePaymentIntentRequestBody {
  payment_intent_id: string;
  amount: number;
  tax_calculation_id?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { payment_intent_id, amount, tax_calculation_id }: UpdatePaymentIntentRequestBody = await req.json();
    console.log("fn update-payment-intent: payment_intent_id: " + payment_intent_id);
    console.log("fn update-payment-intent: amount: " + amount);
    console.log("fn update-payment-intent: tax_calculation_id: " + tax_calculation_id);
    
    if (!payment_intent_id) {
      return NextResponse.json({ error: 'Missing payment_intent_id' }, { status: 400 });
    }
    
    // Update the existing PaymentIntent
    const paymentIntent = await stripe.paymentIntents.update(payment_intent_id, {
      amount,
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
