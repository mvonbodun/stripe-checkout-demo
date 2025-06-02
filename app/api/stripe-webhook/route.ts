import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    console.error('Missing stripe-signature header');
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    console.error('Webhook secret being used:', webhookSecret.substring(0, 10) + '...');
    console.error('Signature received:', signature);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  console.log('Received webhook event:', event.type, 'ID:', event.id);

  try {
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handlePaymentIntentSucceeded(event: Stripe.Event) {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  
  console.log('Payment Intent succeeded:', paymentIntent.id);
  console.log('Payment Intent metadata:', paymentIntent.metadata);

  // Extract tax_calculation_id from metadata
  const taxCalculationId = paymentIntent.metadata?.tax_calculation_id;

  if (!taxCalculationId) {
    console.log('No tax_calculation_id found in payment intent metadata');
    return;
  }

  try {
    // Record the tax transaction using the calculation
    const taxTransaction = await stripe.tax.transactions.createFromCalculation({
      calculation: taxCalculationId,
      reference: `payment_intent_${paymentIntent.id}`, // Unique reference for this transaction
      expand: ['line_items'], // Expand to get line item details
    });

    console.log('Tax transaction recorded successfully:', {
      transactionId: taxTransaction.id,
      calculationId: taxCalculationId,
      paymentIntentId: paymentIntent.id,
    });

    // Log line item tax details
    if (taxTransaction.line_items?.data) {
      console.log('Line item tax details:');
      taxTransaction.line_items.data.forEach((lineItem, index: number) => {
        console.log(`Item ${index + 1}: ${lineItem.reference}`);
        console.log(`  Amount: $${(lineItem.amount / 100).toFixed(2)}`);
        console.log(`  Tax: $${(lineItem.amount_tax / 100).toFixed(2)}`);
      });
    }

    // Optionally, you could store this information in your database here
    // await storeOrderTaxInfo({
    //   paymentIntentId: paymentIntent.id,
    //   taxTransactionId: taxTransaction.id,
    //   taxCalculationId: taxCalculationId,
    //   lineItemTaxDetails: taxTransaction.line_items?.data,
    // });

  } catch (error) {
    console.error('Failed to record tax transaction:', error);
    // You might want to implement retry logic or alert mechanisms here
    throw error; // Re-throw to trigger webhook retry by Stripe
  }
}

async function handlePaymentIntentFailed(event: Stripe.Event) {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  
  console.log('Payment Intent failed:', paymentIntent.id);
  console.log('Failure reason:', paymentIntent.last_payment_error?.message);
  
  // You can implement cleanup logic here if needed
  // For example, releasing inventory, sending failure notifications, etc.
}
