import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-04-30.basil',
});

export async function POST(req: Request) {
  try {
    const { shipping_address, cart, shipping_cost = 0 } = await req.json();
    if (!shipping_address || !cart) {
      return NextResponse.json({ error: 'Missing shipping address or cart' }, { status: 400 });
    }

    // Validate required address fields
    const { city, country, line1, line2, postal_code, state } = shipping_address;
    
    if (!country) {
      return NextResponse.json({ error: 'Country is required' }, { status: 400 });
    }
    
    if (!line1) {
      return NextResponse.json({ error: 'Address line 1 is required' }, { status: 400 });
    }
    
    // For US addresses, postal code is required by Stripe Tax API
    if (country === 'US' && !postal_code) {
      return NextResponse.json({ 
        error: 'For US addresses, postal code is required for tax calculation' 
      }, { status: 400 });
    }

    // Prepare line items for Stripe Tax API
    const line_items = cart.map((item: {
      id: string;
      name: string;
      price: number;
      quantity: number;
      taxcode?: string;
    }) => ({
      amount: Math.round(item.price * item.quantity * 100),
      reference: item.id, // Using unique cart item ID as reference
      quantity: item.quantity,
      tax_code: item.taxcode,
      tax_behavior: 'exclusive',
    }));

    // Prepare shipping address for Stripe Tax API
    const shipping_address_obj = {
      city,
      country,
      line1,
      line2,
      postal_code,
      state,
    };
    console.log("✅ Validated shipping address:", JSON.stringify(shipping_address_obj));

    const taxRequest = {
      currency: 'usd',
      line_items,
      shipping_cost: {
        amount: Math.round(shipping_cost * 100), // Convert to cents and use passed shipping cost
      },
      customer_details: {
        address: shipping_address_obj,
        address_source: 'shipping' as 'shipping' | 'billing',
      },
    };
    console.log("tax request: " + JSON.stringify(taxRequest));
    
    // Call Stripe Tax Calculations API with expanded line items to get detailed tax breakdown
    const calculation = await stripe.tax.calculations.create({
      ...taxRequest,
      expand: ['line_items.data.tax_breakdown'],
    });
    console.log("tax response: " + JSON.stringify(calculation));

    return NextResponse.json({
      calculation,
      tax_amount: calculation.tax_amount_exclusive,
      calculation_id: calculation.id,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    console.log("error in /api/calculate-tax: " + errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
