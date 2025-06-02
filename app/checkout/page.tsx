'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import React from 'react';
import Image from 'next/image';
import { useCart } from '../cart-context';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, AddressElement, useStripe, useElements, LinkAuthenticationElement, PaymentElement, ExpressCheckoutElement } from '@stripe/react-stripe-js';
import type { PaymentRequest } from '@stripe/stripe-js';
import { useRouter } from 'next/navigation';
import ShippingMethods from '../components/ShippingMethods';
import { buildTaxCalculationPayload, calculateTax, updateCartTaxTotals, clearCartTaxTotals } from '../utils/taxCalculation';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

import type { Cart } from '../cart-context';

// Helper to generate payload for payment intent APIs
function getPaymentIntentPayload({
  cart,
  payment_intent_id,
  taxCalculationId,
  includeCart = false
}: {
  cart: Cart;
  payment_intent_id?: string | null;
  taxCalculationId?: string | null;
  includeCart?: boolean;
}) {
  const payload: {
    amount: number;
    tax_calculation_id: string | null;
    payment_intent_id?: string | null;
    cart?: {
      id: string;
      name: string;
      quantity: number;
      price: number;
      taxcode: string;
      attributes: string[];
    }[];
  } = {
    amount: Math.round(cart.order_grand_total * 100), // in cents
    tax_calculation_id: taxCalculationId ?? null,
  };
  if (payment_intent_id) payload.payment_intent_id = payment_intent_id;
  if (includeCart) {
    payload.cart = cart.line_items.map((item) => ({
      id: String(item.product_id),
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      taxcode: item.taxcode ?? '',
      attributes: item.attributes ?? []
    }));
  }
  return payload;
}

const CheckoutForm = React.memo(function CheckoutForm({ 
  cart, 
  onTaxCalculationIdChange,
  isUpdatingPaymentIntent = false,
  onProcessingStateChange,
  onTaxCalculationStarted,
  onTaxCalculationCompleted
}: { 
  cart: Cart;
  onTaxCalculationIdChange?: (id: string | null) => void;
  isUpdatingPaymentIntent?: boolean;
  onProcessingStateChange?: (isProcessing: boolean) => void;
  onTaxCalculationStarted?: () => void;
  onTaxCalculationCompleted?: () => void;
}) {
  const { dispatch } = useCart();
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [message, setMessage] = useState('');
  type StripeAddress = {
    city?: string;
    country?: string;
    line1?: string;
    line2?: string | null;
    postal_code?: string;
    state?: string;
  };
  const [address, setAddress] = useState<StripeAddress | null>(null);
  const [email, setEmail] = useState('');
  const [emailComplete, setEmailComplete] = useState(false);
  
  // Additional state for Pay button validation
  const [addressComplete, setAddressComplete] = useState(false);
  const [shippingMethodSelected, setShippingMethodSelected] = useState(!!cart.shipping_method_id);
  const [paymentElementReady, setPaymentElementReady] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);
  const [prbAvailable, setPrbAvailable] = useState(false);
  const [taxCalculationId, setTaxCalculationId] = useState<string | null>(null);

  // Track component mounting/unmounting
  useEffect(() => {
    console.log("🚀 CheckoutForm component mounted");
    return () => {
      console.log("💥 CheckoutForm component unmounting");
    };
  }, []);

  // Track email state changes that might cause re-rendering issues
  useEffect(() => {
    console.log("📧 Email state changed:", { email, emailComplete });
  }, [email, emailComplete]);

  // Debug: Log validation states when they change (throttled)
  useEffect(() => {
    const isPayButtonEnabled = emailComplete && addressComplete && shippingMethodSelected && paymentElementReady;
    // Only log when actually enabled to reduce console noise
    if (isPayButtonEnabled) {
      console.log("🔐 Pay button enabled - all validations passed");
    }
  }, [emailComplete, addressComplete, shippingMethodSelected, paymentElementReady]);

  useEffect(() => {
    if (stripe) {
      // Calculate amount from cart - use grand total including all taxes and shipping
      const amount = Math.round(cart.order_grand_total * 100);
      const pr = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: 'Total',
          amount,
        },
        requestPayerName: true,
        requestPayerEmail: true,
        requestShipping: false,
        // requestPayerPhone: true, // Optional
      });
      pr.canMakePayment().then((result) => {
        if (result) {
          setPaymentRequest(pr);
          setPrbAvailable(true);
        }
      });
    }
  }, [stripe, cart.order_grand_total, setPaymentRequest, setPrbAvailable]);

  // Load Link authentication testing utilities in development mode (temporarily disabled for debugging)
  /*
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const script = document.createElement('script');
      script.src = '/test-link-authentication.js';
      script.async = true;
      script.onload = () => {
        console.log('🧪 Link authentication testing utilities loaded');
      };
      document.head.appendChild(script);
      
      return () => {
        // Cleanup script on unmount
        const existingScript = document.querySelector('script[src="/test-link-authentication.js"]');
        if (existingScript) {
          document.head.removeChild(existingScript);
        }
      };
    }
  }, []);
  */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!stripe || !elements) {
      setMessage('Stripe has not loaded yet.');
      setLoading(false);
      return;
    }

    // By this point, the payment intent should already exist and be up-to-date thanks to useEffect in parent component
    if (!cart.payment_intent) {
      setMessage('Payment intent not ready. Please try again.');
      setLoading(false);
      return;
    }
    
    // Log the taxCalculationId for verification that we're using it
    console.log("Submitting payment with taxCalculationId:", taxCalculationId);

    console.log("Before confirmPayment call: cart.payment_intent: " + cart.payment_intent);
    
    // Show processing modal before confirming payment
    setProcessingPayment(true);
    onProcessingStateChange?.(true);
    
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        payment_method_data: {
          billing_details: {
            ...(address ? { address } : {}),
            ...(email ? { email } : {}),
          },
        },
      },
      redirect: 'if_required', // Prevent automatic redirect, handle manually
    });

    if (result.error) {
      setMessage(result.error.message || 'Payment failed');
      setProcessingPayment(false);
      onProcessingStateChange?.(false);
      setLoading(false);
    } else if (result.paymentIntent && (result.paymentIntent.status === 'succeeded' || result.paymentIntent.status === 'requires_capture')) {
      console.log("fn CheckoutForm: clearing cart and redirecting to order confirmation. Payment status:", result.paymentIntent.status);
      // Store completed order data before clearing cart
      const completedOrder = {
        id: result.paymentIntent.id,
        status: result.paymentIntent.status,
        amount: result.paymentIntent.amount,
        currency: result.paymentIntent.currency,
        items: cart.line_items,
        subtotal: cart.order_subtotal,
        tax: cart.order_tax_total,
        shipping: cart.order_shipping_total,
        shipping_tax: cart.order_shipping_tax_total,
        total: cart.order_grand_total,
        timestamp: new Date().toISOString(),
        email: email,
        address: address,
        shipping_method_id: cart.shipping_method_id,
        shipping_method_name: cart.shipping_method_name
      };
      
      try {
        localStorage.setItem('completed-order', JSON.stringify(completedOrder));
      } catch (error) {
        console.error('Error saving completed order:', error);
      }
      
      // Keep the modal open while clearing cart and redirecting
      dispatch({ type: 'CLEAR_CART' });
      router.push('/order-confirmation');
      // Don't hide the modal or reset processing state here - let the redirect handle it
    } else {
      setMessage('Payment processing or requires further action.');
      setProcessingPayment(false);
      onProcessingStateChange?.(false);
      setLoading(false);
    }
  };

  return (
    <>
      {/* Validation Status Indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm">
          <div className="font-semibold text-gray-700 mb-2">🔐 Pay Button Validation Status:</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className={`flex items-center ${emailComplete ? 'text-green-600' : 'text-gray-400'}`}>
              {emailComplete ? '✅' : '⏳'} Email: {emailComplete ? 'Valid' : 'Required'}
            </div>
            <div className={`flex items-center ${addressComplete ? 'text-green-600' : 'text-gray-400'}`}>
              {addressComplete ? '✅' : '⏳'} Address: {addressComplete ? 'Complete' : 'Required'}
            </div>
            <div className={`flex items-center ${shippingMethodSelected ? 'text-green-600' : 'text-gray-400'}`}>
              {shippingMethodSelected ? '✅' : '⏳'} Shipping: {shippingMethodSelected ? 'Selected' : 'Required'}
            </div>
            <div className={`flex items-center ${paymentElementReady ? 'text-green-600' : 'text-gray-400'}`}>
              {paymentElementReady ? '✅' : '⏳'} Payment: {paymentElementReady ? 'Ready' : 'Required'}
            </div>
          </div>
        </div>
      )}

      {/* Processing Payment Modal */}
      {processingPayment && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 text-center">
            <div className="mb-4">
              <svg className="animate-spin h-12 w-12 mx-auto text-blue-600" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Your Order</h3>
            <p className="text-gray-600">Please wait while we confirm your payment...</p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={{maxWidth: 600, margin: '0 auto'}}>
        {prbAvailable && paymentRequest && (
        <>
          <div className="text-sm mb-2 p-2 text-gray-400 text-center">Express Checkout</div>
          <ExpressCheckoutElement onConfirm={async (event) => {
            console.log('Express checkout confirmed:', event);
            setProcessingPayment(true);
            onProcessingStateChange?.(true);
            
            // Simulate the same flow as regular checkout
            try {
              // Store completed order data before clearing cart
              const completedOrder = {
                id: `express_${Date.now()}`, // Temporary ID for express checkout
                status: 'succeeded',
                amount: Math.round(cart.order_grand_total * 100),
                currency: 'usd',
                items: cart.line_items,
                subtotal: cart.order_subtotal,
                tax: cart.order_tax_total,
                shipping: cart.order_shipping_total,
                shipping_tax: cart.order_shipping_tax_total,
                total: cart.order_grand_total,
                timestamp: new Date().toISOString(),
                email: event.expressPaymentType === 'apple_pay' ? 'Apple Pay User' : 'Express Pay User',
                address: null,
                expressPaymentType: event.expressPaymentType,
                shipping_method_id: cart.shipping_method_id,
                shipping_method_name: cart.shipping_method_name
              };
              
              try {
                localStorage.setItem('completed-order', JSON.stringify(completedOrder));
              } catch (error) {
                console.error('Error saving completed order:', error);
              }
              
              // You would handle the express checkout confirmation here
              // For now, we'll redirect to order confirmation after a brief delay
              setTimeout(() => {
                dispatch({ type: 'CLEAR_CART' });
                router.push('/order-confirmation');
              }, 2000);
            } catch (error) {
              console.error('Express checkout error:', error);
              setProcessingPayment(false);
              onProcessingStateChange?.(false);
            }
          }} />
          <div className="flex items-center my-4">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="mx-4 text-sm text-gray-400">OR</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>
        </>
      )}
      <div className="py-4 mb-6">
        <div className="font-bold text-lg mb-2 text-gray-800">Contact</div>
        <LinkAuthenticationElement
          key="link-auth-element"
          onChange={event => {
            // Minimal logging to prevent re-render issues
            console.log("📧 LinkAuthentication changed - complete:", event.complete, "email:", event.value?.email);
            
            // Update state with batched updates to prevent multiple re-renders
            if (event.value?.email !== email || event.complete !== emailComplete) {
              setEmail(event.value?.email || '');
              setEmailComplete(event.complete);
            }
          }}
        />
        {email && (
          <div className="mt-2 text-sm">
            {emailComplete ? (
              <span className="text-green-600 flex items-center">
                ✓ Email is valid
              </span>
            ) : (
              <span className="text-amber-600 flex items-center">
                ⚠ Please enter a valid email address
              </span>
            )}
          </div>
        )}
      </div>
      <div className="py-4 mb-6">
        <div className="font-bold text-lg mb-2 text-gray-800">Shipping Address</div>
        <AddressElement 
          key="shipping-address-element"
          options={{mode: 'shipping'}} 
          onChange={async (event) => {
            console.log("🏠 AddressElement changed - complete:", event.complete, "hasValue:", !!event.value);
            console.log("🏠 Address data:", event.value?.address);
            
            // Update address completion state for Pay button validation
            setAddressComplete(event.complete && !!event.value);
            setAddress(event.value.address);
            
            // Only calculate tax if the address is complete and has required fields
            if (event.complete && event.value?.address) {
              const address = event.value.address;
              
              // Validate required fields for US addresses
              if (address.country === 'US' && !address.postal_code) {
                console.log("⚠️ US address missing postal code, skipping tax calculation");
                return;
              }
              
              // Validate that we have minimum required fields
              if (!address.country || !address.line1) {
                console.log("⚠️ Address missing required fields, skipping tax calculation");
                return;
              }
              
              console.log("📍 Complete shipping address entered, starting tax calculation...");
              
              // Set tax calculation flag to prevent payment intent updates during calculation
              if (onTaxCalculationStarted) {
                onTaxCalculationStarted();
              }
              
              // Call calculate-tax API using utility functions
              try {
                const payload = buildTaxCalculationPayload({
                  shippingAddress: address,
                  cart,
                  shippingCost: cart.order_shipping_total
                });
                
                console.log("📝 Tax calculation payload:", payload);
                const data = await calculateTax(payload);
                
                // Update cart tax totals
                updateCartTaxTotals(data, cart, dispatch, onTaxCalculationIdChange);
                setTaxCalculationId(data.calculation_id);
                
                console.log("✅ Address tax calculation completed");
                
              } catch (err) {
                console.log("fn CheckoutForm: error calculating tax, clearing line tax totals: " + err);
                // Clear tax totals for all line items
                clearCartTaxTotals(cart, dispatch, onTaxCalculationIdChange);
                setTaxCalculationId(null);
              } finally {
                // Clear tax calculation flag to allow payment intent updates
                if (onTaxCalculationCompleted) {
                  onTaxCalculationCompleted();
                }
              }
            } else {
              console.log("⏳ Address incomplete, waiting for user to finish entering address");
            }
          }}
        />
      </div>
      <div className="py-4 mb-6">
        <div className="font-bold text-lg mb-2 text-gray-800">Shipping Method</div>
        <ShippingMethods 
          shippingAddress={address} 
          onTaxCalculationIdChange={onTaxCalculationIdChange}
          onTaxCalculationStarted={onTaxCalculationStarted}
          onTaxCalculationCompleted={onTaxCalculationCompleted}
          onShippingMethodSelected={(selected) => setShippingMethodSelected(selected)}
        />
      </div>
      <div className="py-4 mb-2">
        <div className="font-bold text-lg mb-2 text-gray-800">Payment</div>
        <div className="text-sm py-2 text-gray-400">All transactions are secure and encrypted</div>
        <PaymentElement 
          options={{ layout: 'tabs' }} 
          onChange={(event) => {
            // Update payment element ready state for Pay button validation
            setPaymentElementReady(event.complete);
            console.log("💳 PaymentElement changed - complete:", event.complete);
          }}
        />
      </div>
      <button 
        className='btn btn-secondary' 
        type="submit" 
        disabled={
          !stripe || 
          loading || 
          isUpdatingPaymentIntent || 
          !emailComplete || 
          !addressComplete || 
          !shippingMethodSelected || 
          !paymentElementReady
        } 
        style={{marginTop: 16, width: '100%'}}
      >
        {loading ? 'Processing...' : 
         `Pay ${cart.order_grand_total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`}
      </button>
      {message && <div style={{marginTop: 16}}>{message}</div>}
      </form>
    </>
  );
});


export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [isUpdatingPaymentIntent, setIsUpdatingPaymentIntent] = useState(false);
  const [taxCalculationId, setTaxCalculationId] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isTaxCalculating, setIsTaxCalculating] = useState(false);

  // Use global cart context
  const { state: cart, dispatch, isLoaded } = useCart();

  const itemCount = cart.line_items.reduce((sum: number, item: typeof cart.line_items[number]) => sum + item.quantity, 0);

  // Use a ref to track the timeout for debouncing
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Track the relevant cart values for payment intent updates
  const cartItemsRef = useRef(cart.line_items);
  const orderGrandTotalRef = useRef(cart.order_grand_total);
  const paymentIntentRef = useRef(cart.payment_intent);
  const taxCalculationIdRef = useRef(taxCalculationId);
  const isFirstRenderRef = useRef(true);

  // Only trigger payment intent update when important values change
  useEffect(() => {
    // Skip payment intent updates during tax calculation to prevent race conditions
    if (isTaxCalculating) {
      console.log("🚫 Skipping payment intent update - tax calculation in progress");
      return;
    }
    
    // Only run if cart has items
    if (!cart.line_items || cart.line_items.length === 0) {
      setClientSecret(null);
      console.log("Checkout page: No items in cart, clearing client secret");
      return;
    }

    // Check if important values have changed
    const itemsChanged = JSON.stringify(cartItemsRef.current) !== JSON.stringify(cart.line_items);
    const totalChanged = orderGrandTotalRef.current !== cart.order_grand_total;
    const taxIdChanged = taxCalculationIdRef.current !== taxCalculationId;
    const isFirstRender = isFirstRenderRef.current;
    
    // Update references to current values
    cartItemsRef.current = cart.line_items;
    orderGrandTotalRef.current = cart.order_grand_total;
    paymentIntentRef.current = cart.payment_intent;
    taxCalculationIdRef.current = taxCalculationId;
    isFirstRenderRef.current = false;
    
    // If we have a payment intent from mini-cart but no client secret, get it
    if (cart.payment_intent && !clientSecret && !isUpdatingPaymentIntent) {
      setIsUpdatingPaymentIntent(true);
      
      fetch('/api/update-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(getPaymentIntentPayload({
          cart,
          payment_intent_id: cart.payment_intent,
          taxCalculationId,
        })),
      })
        .then(async (res) => {
          if (!res.ok) {
            const text = await res.text();
            console.error("Retrieve client secret HTTP error:", res.status, text);
            throw new Error(`HTTP ${res.status}: ${text}`);
          }
          return res.json();
        })
        .then((data) => {
          setClientSecret(data.clientSecret);
          setIsUpdatingPaymentIntent(false);
          console.log("Retrieved client secret for existing payment intent:", cart.payment_intent);
        })
        .catch(err => {
          console.error("Error retrieving payment intent:", err);
          setIsUpdatingPaymentIntent(false);
        });
      return;
    }
    
    // Always proceed on first render or if there's no payment intent
    // Otherwise, only proceed if amount/items changed or tax calculation ID changed
    // This prevents infinite loops when only payment_intent ID is updated
    if (!isFirstRender && cart.payment_intent && clientSecret && !itemsChanged && !totalChanged && !taxIdChanged) {
      console.log("Skipping payment intent update - no relevant changes");
      return;
    }
    
    console.log("Creating/updating payment intent - isFirstRender:", isFirstRender, "has PI:", !!cart.payment_intent);

    // Clear any existing timeout
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    // Set a timeout to debounce rapid changes
    updateTimeoutRef.current = setTimeout(() => {
      // Prevent multiple simultaneous updates
      if (isUpdatingPaymentIntent) return;

      setIsUpdatingPaymentIntent(true);
      
      // If payment_intent exists, update it
      if (cart.payment_intent) {
        fetch('/api/update-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(getPaymentIntentPayload({
            cart,
            payment_intent_id: cart.payment_intent,
            taxCalculationId, // Use the calculated tax ID if available
          })),
        })
          .then(async (res) => {
            if (!res.ok) {
              const text = await res.text();
              console.error("Update payment intent HTTP error:", res.status, text);
              throw new Error(`HTTP ${res.status}: ${text}`);
            }
            return res.json();
          })
          .then((data) => {
            setClientSecret(data.clientSecret);
            // Make sure payment intent ID is still stored in cart context
            if (data.paymentIntentId && data.paymentIntentId !== cart.payment_intent) {
              dispatch({ type: 'UPDATE_PAYMENT_INTENT', payment_intent: data.paymentIntentId });
            }
            setIsUpdatingPaymentIntent(false);
            // Log for debugging only when needed
            console.log("💳 Updated payment intent with new total:", cart.order_grand_total);
          })
          .catch(err => {
            console.error("Error updating payment intent:", err);
            setIsUpdatingPaymentIntent(false);
          });
      } else {
        // Only create if not already present
        fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(getPaymentIntentPayload({
            cart,
            includeCart: true,
          })),
        })
          .then(async (res) => {
            if (!res.ok) {
              const text = await res.text();
              console.error("Create payment intent HTTP error:", res.status, text);
              throw new Error(`HTTP ${res.status}: ${text}`);
            }
            return res.json();
          })
          .then((data) => {
            setClientSecret(data.clientSecret);
            dispatch({ type: 'UPDATE_PAYMENT_INTENT', payment_intent: data.paymentIntentId });
            setIsUpdatingPaymentIntent(false);
            console.log("Created new payment intent:", data.paymentIntentId);
          })
          .catch(err => {
            console.error("Error creating payment intent:", err);
            setIsUpdatingPaymentIntent(false);
          });
      }
    }, 300); // 300ms debounce

    // Cleanup function to clear timeout when component unmounts or deps change
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [cart, dispatch, isUpdatingPaymentIntent, taxCalculationId, clientSecret, isTaxCalculating]);

  console.log("fn CheckoutPage: cart:", { 
    has_items: cart.line_items.length > 0,
    payment_intent: cart.payment_intent,
    client_secret: clientSecret,
    total: cart.order_grand_total,
    isUpdatingPaymentIntent: isUpdatingPaymentIntent,
  });
  
  // Track clientSecret changes
  useEffect(() => {
    console.log("🔑 clientSecret changed:", clientSecret);
  }, [clientSecret]);
  
  const loader = 'auto';
  
  // Memoize Elements options to prevent unnecessary re-renders
  const elementsOptions = useMemo(() => {
    if (!clientSecret) return undefined;
    return {
      clientSecret,
      loader: loader as 'auto'
    };
  }, [clientSecret, loader]);

  // Tooltip component
  const Tooltip = ({ text, children }: { text: string; children: React.ReactNode }) => (
    <span className="relative group cursor-pointer">
      {children}
      <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 bg-gray-800 text-xs text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none z-10 transition-opacity duration-200">
        {text}
      </span>
    </span>
  );

  return (
    <div className="min-h-screen bg-white py-8 px-4 md:px-16 relative">
      {/* Loading Overlay */}
      {cart.line_items.length > 0 && !clientSecret && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 text-center">
            <div className="mb-4">
              <svg className="animate-spin h-12 w-12 mx-auto text-blue-600" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 718-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Checkout</h3>
            <p className="text-gray-600">Setting up your payment form...</p>
          </div>
        </div>
      )}

      {/* Updating Payment Intent Overlay */}
      {isUpdatingPaymentIntent && clientSecret && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 text-center">
            <div className="mb-4">
              <svg className="animate-spin h-12 w-12 mx-auto text-blue-600" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 718-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Updating Payment Details</h3>
            <p className="text-gray-600">Please wait while we update your payment information...</p>
          </div>
        </div>
      )}

      {!isLoaded ? (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 text-center">
            <div className="mb-4">
              <svg className="animate-spin h-12 w-12 mx-auto text-blue-600" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 718-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Cart</h3>
            <p className="text-gray-600">Please wait while we load your cart...</p>
          </div>
        </div>
      ) : cart.line_items.length === 0 && !isProcessingPayment ? (
        <div className="max-w-2xl mx-auto text-center py-16">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some items to your cart before proceeding to checkout.</p>
          <button
            onClick={() => window.history.back()}
            className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left: Checkout Form */}
        <div>
          {clientSecret && elementsOptions && (
            <Elements stripe={stripePromise} options={elementsOptions}>
              <CheckoutForm 
                cart={cart} 
                onTaxCalculationIdChange={(id) => setTaxCalculationId(id)}
                isUpdatingPaymentIntent={isUpdatingPaymentIntent}
                onProcessingStateChange={setIsProcessingPayment}
                onTaxCalculationStarted={() => setIsTaxCalculating(true)}
                onTaxCalculationCompleted={() => setIsTaxCalculating(false)}
              />
            </Elements>
          )}
        </div>
        {/* Right: Cart Summary */}
        <div className="bg-gray-50 rounded-xl p-6 shadow-md">
          <div className="text-lg font-bold mb-4">Order Summary</div>
          <div className="space-y-4 mb-6">
            {cart.line_items.map((item: typeof cart.line_items[number]) => (
              <div key={`${item.product_id}-${item.attributes?.join('-') ?? ''}`} className="flex items-center justify-between bg-white rounded-lg p-2 shadow-sm relative">
                <div className="relative mr-3">
                  <div className="w-14 h-14 rounded-md overflow-hidden relative bg-gray-100">
                    {/* Regular img tag with error handling and fallback */}
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        width={56}
                        height={56}
                        onError={(e) => {
                          // Replace with fallback image on error
                          e.currentTarget.onerror = null; // Prevent infinite loop
                          e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"%3E%3Crect width="120" height="120" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" font-size="14" text-anchor="middle" alignment-baseline="middle" font-family="system-ui, sans-serif" fill="%23999"%3E' + encodeURIComponent(item.name.charAt(0)) + '%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                        {item.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center border-2 border-white shadow" title="Quantity ordered">{item.quantity}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {item.name} - {(item.attributes ?? []).join(', ')}
                  </div>
                </div>
                <div className="ml-2 font-semibold text-gray-700 whitespace-nowrap">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          {/* Promo code */}
          <div className="flex mb-4">
            <input
              type="text"
              className="flex-1 rounded-l-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="Gift card or discount code"
              value={promoCode}
              onChange={e => setPromoCode(e.target.value)}
              disabled={promoApplied}
            />
            <button
              className="rounded-r-md bg-secondary text-white px-4 py-2 text-sm font-semibold hover:bg-secondary-dark transition-colors disabled:opacity-50"
              style={{backgroundColor: '#6b7280'}} // fallback secondary color
              onClick={() => setPromoApplied(true)}
              disabled={promoApplied || !promoCode}
            >
              Apply
            </button>
          </div>
          {/* Subtotal, shipping, taxes, total */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-800">Subtotal - {itemCount} items</span>
              <span className="text-gray-800">${cart.order_subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-800">Shipping</span>
              <span className={cart.order_shipping_total === 0 ? "text-green-600 font-semibold" : "text-gray-800"}>
                {cart.order_shipping_total === 0 ? "FREE" : `$${cart.order_shipping_total.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center text-gray-800">Estimated taxes
                <Tooltip text="The final tax and amount of your order will be confirmed by email after you place your order">
                  <svg className="ml-1 w-4 h-4 text-gray-400 hover:text-gray-600" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" stroke="white" strokeWidth="2"/><text x="10" y="15" textAnchor="middle" fontSize="12" fill="white">?</text></svg>
                </Tooltip>
              </span>
              <span className="text-gray-800">${cart.order_tax_total.toFixed(2)}</span>
            </div>
            {cart.order_shipping_tax_total > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-800">Shipping tax</span>
                <span className="text-gray-800">${cart.order_shipping_tax_total.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center mt-3">
              <span className="text-base font-bold text-gray-800">Total</span>
              <span className="text-base font-bold text-gray-800">${cart.order_grand_total.toFixed(2)}</span>
            </div>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}
