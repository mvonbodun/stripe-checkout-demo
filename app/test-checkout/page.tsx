'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, AddressElement, LinkAuthenticationElement, PaymentElement } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function SimpleCheckoutTest() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [emailComplete, setEmailComplete] = useState(false);

  // Create a test payment intent
  useEffect(() => {
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 2999, // $29.99
        tax_calculation_id: null,
        cart: [{
          id: 'test-1',
          name: 'Test Product',
          quantity: 1,
          price: 29.99,
          taxcode: 'txcd_99999999',
          attributes: []
        }]
      }),
    })
      .then(res => res.json())
      .then(data => setClientSecret(data.clientSecret))
      .catch(err => console.error('Error creating payment intent:', err));
  }, []);

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Simple Checkout Test</h1>
      
      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Email</h3>
              <LinkAuthenticationElement
                onChange={event => {
                  console.log("📧 Email changed:", event.complete, event.value?.email);
                  setEmail(event.value?.email || '');
                  setEmailComplete(event.complete);
                }}
              />
              <div className="mt-2 text-sm">
                Email: {email} | Complete: {emailComplete ? 'Yes' : 'No'}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Address</h3>
              <AddressElement 
                options={{mode: 'shipping'}}
                onChange={event => {
                  console.log("🏠 Address changed:", event.complete, !!event.value);
                }}
              />
            </div>

            <div>
              <h3 className="font-semibold mb-2">Payment</h3>
              <PaymentElement 
                options={{ layout: 'tabs' }}
                onChange={event => {
                  console.log("💳 Payment changed:", event.complete);
                }}
              />
            </div>
          </div>
        </Elements>
      )}
    </div>
  );
}

export default SimpleCheckoutTest;
