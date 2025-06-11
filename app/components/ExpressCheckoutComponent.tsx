'use client';

import React from 'react';
import { ExpressCheckoutElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useCart, type CartItem, type Address, AddressType } from '../cart-context';
import { useRouter } from 'next/navigation';
import { buildTaxCalculationPayload, calculateTax, updateCartTaxTotals } from '../utils/taxCalculation';
import type { ShippingMethod } from '../api/shipping-methods/route';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

/**
 * Express Checkout Component for Stripe
 * 
 * Supports Express Checkout (Apple Pay, Google Pay, etc.) with optional predefined shipping rates.
 * 
 * Usage Examples:
 * 
 * 1. Basic usage with dynamic shipping calculation:
 * <ExpressCheckoutComponent mode="checkout" />
 * 
 * 2. With predefined shipping rates:
 * <ExpressCheckoutComponent 
 *   mode="checkout"
 *   shippingRates={[
 *     { id: "standard", displayName: "Standard Shipping", amount: 599 }, // $5.99
 *     { id: "express", displayName: "Express Shipping", amount: 1299 }   // $12.99
 *   ]}
 * />
 * 
 * 3. With restricted shipping countries:
 * <ExpressCheckoutComponent 
 *   mode="mini-cart"
 *   allowedShippingCountries={["US", "CA", "MX"]}
 *   shippingRates={[
 *     { id: "standard", displayName: "Standard Shipping", amount: 799 }
 *   ]}
 * />
 */

// Types for shipping rates (based on Stripe's Express Checkout Element options)
interface ShippingRate {
  id: string;           // Unique identifier for the shipping rate
  displayName: string;  // Human-readable name (e.g., "Standard Shipping", "Next Day Air")
  amount: number;       // Amount in cents (e.g., 599 for $5.99)
}

// Types for the express checkout events
interface ExpressCheckoutEvent {
  billingDetails?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: {
      city?: string;
      country?: string;
      line1?: string;
      line2?: string | null;
      postal_code?: string;
      state?: string;
    };
  };
  shippingAddress?: {
    name?: string;
    address?: {
      city?: string;
      country?: string;
      line1?: string;
      line2?: string | null;
      postal_code?: string;
      state?: string;
    };
  };
  expressPaymentType?: string;
}

interface CompletedOrder {
  id: string;
  status: string;
  amount: number;
  currency: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  shipping_tax: number;
  total: number;
  timestamp: string;
  email?: string;
  phone?: string;
  address?: {
    city?: string;
    country?: string;
    line1?: string;
    line2?: string | null;
    postal_code?: string;
    state?: string;
  } | null;
  shippingAddress?: {
    name?: string;
    address?: {
      city?: string;
      country?: string;
      line1?: string;
      line2?: string | null;
      postal_code?: string;
      state?: string;
    };
  } | null;
  expressPaymentType?: string;
  shipping_method_id?: string | null;
  shipping_method_name?: string | null;
}

interface ExpressCheckoutComponentProps {
  mode: 'checkout' | 'mini-cart';
  onProcessingStateChange?: (isProcessing: boolean) => void;
  onSuccess?: (order: CompletedOrder) => void;
  onError?: (error: string) => void;
  onClose?: () => void; // For mini-cart to close the modal
  allowedShippingCountries?: string[]; // Array of allowed shipping country codes (e.g., ["US"])
  shippingRates?: ShippingRate[]; // Array of predefined shipping rates for Express Checkout Element (optional - can be calculated dynamically)
  options?: {
    buttonType?: {
      applePay?: 'buy' | 'check-out' | 'donate' | 'plain';
      googlePay?: 'buy' | 'checkout' | 'donate' | 'plain';
    };
    emailRequired?: boolean;
    phoneNumberRequired?: boolean;
    shippingAddressRequired?: boolean;
  };
}

const ExpressCheckoutComponent: React.FC<ExpressCheckoutComponentProps> = ({
  mode,
  onProcessingStateChange,
  onSuccess,
  onError,
  onClose,
  allowedShippingCountries = ['US'], // Default to US only
  shippingRates, // Optional array of predefined shipping rates - if not provided, rates will be calculated dynamically via onShippingAddressChange
  options = {
    buttonType: {
      applePay: 'buy',
      googlePay: 'buy',
    },
    emailRequired: true,
    phoneNumberRequired: true,
    shippingAddressRequired: true,
  }
}) => {
  const { state: cart } = useCart();

  // Task #2: Set Elements options with mode: 'payment', currency: 'usd', amount from cart
  const elementsOptions = {
    mode: 'payment' as const,
    currency: 'usd' as const,
    amount: Math.round(cart.order_grand_total * 100), // Convert to cents
  };

  return (
    <Elements stripe={stripePromise} options={elementsOptions}>
      <ExpressCheckoutInner
        mode={mode}
        onProcessingStateChange={onProcessingStateChange}
        onSuccess={onSuccess}
        onError={onError}
        onClose={onClose}
        allowedShippingCountries={allowedShippingCountries}
        shippingRates={shippingRates}
        options={options}
      />
    </Elements>
  );
};

// Inner component that uses Stripe hooks (must be inside Elements provider)
const ExpressCheckoutInner: React.FC<ExpressCheckoutComponentProps> = ({
  mode,
  onProcessingStateChange,
  onSuccess,
  onError,
  onClose,
  allowedShippingCountries = ['US'], // Default to US only
  shippingRates, // Optional array of predefined shipping rates - if not provided, rates will be calculated dynamically via onShippingAddressChange
  options = {
    buttonType: {
      applePay: 'buy',
      googlePay: 'buy',
    },
    emailRequired: true,
    phoneNumberRequired: true,
    shippingAddressRequired: true,
  }
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { state: cart, dispatch } = useCart();

  const handleExpressCheckout = async (event: ExpressCheckoutEvent) => {
    console.log('Express checkout confirmed:', event);
    
    // Store shipping address in cart context if provided
    if (event.shippingAddress) {
      const shippingAddress: Address = {
        addressType: AddressType.SHIPPING,
        name: event.shippingAddress.name,
        address: {
          line1: event.shippingAddress.address?.line1,
          line2: event.shippingAddress.address?.line2,
          city: event.shippingAddress.address?.city,
          state: event.shippingAddress.address?.state,
          postal_code: event.shippingAddress.address?.postal_code,
          country: event.shippingAddress.address?.country,
        },
        // Note: Express checkout shipping address doesn't include phone
      };
      
      console.log("💾 Storing express checkout shipping address in cart context:", shippingAddress);
      dispatch({ type: 'UPDATE_SHIPPING_ADDRESS', shipping_address: shippingAddress });
    }
    
    if (!stripe || !elements) {
      const errorMsg = 'Stripe has not loaded yet';
      console.error(errorMsg);
      onError?.(errorMsg);
      return;
    }

    // Start processing state
    onProcessingStateChange?.(true);

    try {
      let completedOrder: CompletedOrder;

      if (mode === 'mini-cart') {
        // Mini-cart mode: Use real Stripe payment confirmation
        const result = await stripe.confirmPayment({
          elements,
          confirmParams: {
            payment_method_data: {
              billing_details: {
                name: event.billingDetails?.name,
                email: event.billingDetails?.email,
                phone: event.billingDetails?.phone,
                address: event.billingDetails?.address,
              },
            },
          },
          redirect: 'if_required',
        });

        if (result.error) {
          console.error('Express checkout error:', result.error);
          const errorMsg = `Payment failed: ${result.error.message}`;
          onError?.(errorMsg);
          onProcessingStateChange?.(false);
          return;
        }

        if (result.paymentIntent && (result.paymentIntent.status === 'succeeded' || result.paymentIntent.status === 'requires_capture')) {
          console.log('Express checkout payment succeeded. Payment status:', result.paymentIntent.status);
          
          // Create order data from successful payment
          completedOrder = {
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
            email: event.billingDetails?.email || 'Express Pay User',
            phone: event.billingDetails?.phone,
            address: event.billingDetails?.address || null,
            shippingAddress: event.shippingAddress || null,
            expressPaymentType: 'express',
            shipping_method_id: cart.shipping_method_id,
            shipping_method_name: cart.shipping_method_name
          };
        } else {
          console.log('Express checkout requires further action');
          const errorMsg = 'Payment processing requires further action.';
          onError?.(errorMsg);
          onProcessingStateChange?.(false);
          return;
        }
      } else {
        // Checkout mode: Simulate express checkout (as in original implementation)
        completedOrder = {
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
          email: event.billingDetails?.email || (event.expressPaymentType === 'apple_pay' ? 'Apple Pay User' : 'Express Pay User'),
          phone: event.billingDetails?.phone,
          address: event.billingDetails?.address || null,
          shippingAddress: event.shippingAddress || null,
          expressPaymentType: event.expressPaymentType,
          shipping_method_id: cart.shipping_method_id,
          shipping_method_name: cart.shipping_method_name
        };
      }

      // Store completed order data
      try {
        localStorage.setItem('completed-order', JSON.stringify(completedOrder));
      } catch (error) {
        console.error('Error saving completed order:', error);
      }

      // Call success callback if provided
      onSuccess?.(completedOrder);

      // Clear cart and handle navigation
      dispatch({ type: 'CLEAR_CART' });
      
      if (mode === 'mini-cart') {
        onClose?.(); // Close mini-cart modal
        router.push('/order-confirmation');
      } else {
        // Checkout mode: redirect after delay (as in original implementation)
        setTimeout(() => {
          router.push('/order-confirmation');
        }, 2000);
      }

    } catch (error) {
      console.error('Express checkout processing error:', error);
      const errorMsg = 'An error occurred during express checkout';
      onError?.(errorMsg);
      onProcessingStateChange?.(false);
    }
  };

  // Handler for shipping address changes
  const handleShippingAddressChange = async (event: {
    name: string;
    address: {
      line1?: string;
      line2?: string | null;
      city?: string;
      state?: string;
      postal_code?: string;
      country?: string;
    };
    resolve: (resolveDetails?: {
      lineItems?: Array<{ name: string; amount: number; }>;
      shippingRates?: Array<{ id: string; amount: number; displayName: string; }>;
    }) => void;
    reject: () => void;
  }) => {
    console.log('🏠 Express Checkout shipping address changed:', event);
    console.log('📍 Detailed address data:', JSON.stringify(event.address, null, 2));
    
    try {
      // Extract shipping address from event
      const shippingAddress = event.address;
      
      // Validate required address fields before proceeding
      if (!shippingAddress) {
        console.log('⚠️ No shipping address provided, skipping processing');
        event.reject();
        return;
      }
      
      // Check for required fields for tax calculation
      // Note: line1 may be anonymized/missing per Stripe's privacy features
      const missingFields = [];
      if (!shippingAddress.country) missingFields.push('country');
      
      // Validate that the country is in the allowed shipping countries list
      if (shippingAddress.country && !allowedShippingCountries.includes(shippingAddress.country)) {
        console.log(`⚠️ Shipping to ${shippingAddress.country} is not allowed. Allowed countries: ${allowedShippingCountries.join(', ')}`);
        event.reject();
        return;
      }
      
      // For US addresses, postal code is required by Stripe Tax API
      if (shippingAddress.country === 'US' && !shippingAddress.postal_code) {
        missingFields.push('postal_code');
      }
      
      if (missingFields.length > 0) {
        console.log(`⚠️ Incomplete shipping address, missing required fields: ${missingFields.join(', ')}. Skipping processing.`);
        console.log('📍 Received address:', shippingAddress);
        event.reject();
        return;
      }
      
      console.log('✅ Address validation passed for tax calculation (line1 not required for anonymized addresses)');

      // Update cart context with shipping address
      const addressObj: Address = {
        addressType: AddressType.SHIPPING,
        name: event.name || 'Express Pay User',
        address: {
          line1: shippingAddress.line1,
          line2: shippingAddress.line2,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postal_code: shippingAddress.postal_code,
          country: shippingAddress.country,
        },
      };
      
      console.log("💾 Updating cart with new shipping address:", addressObj);
      dispatch({ type: 'UPDATE_SHIPPING_ADDRESS', shipping_address: addressObj });

      // Fetch shipping methods
      console.log('🚚 Fetching shipping methods for express checkout...');
      const shippingResponse = await fetch('/api/shipping-methods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart,
          shippingAddress: shippingAddress
        })
      });

      if (!shippingResponse.ok) {
        throw new Error('Failed to fetch shipping methods');
      }

      const shippingData = await shippingResponse.json();
      console.log('📦 Shipping methods received:', shippingData);

      // Auto-select cheapest shipping method
      if (shippingData.shippingMethods && shippingData.shippingMethods.length > 0) {
        const cheapestMethod = shippingData.shippingMethods.reduce((min: ShippingMethod, method: ShippingMethod) => 
          method.shipping_method_cost < min.shipping_method_cost ? method : min
        );
        
        console.log('💰 Auto-selecting cheapest shipping method:', cheapestMethod);
        
        // Update cart with shipping method
        dispatch({
          type: 'UPDATE_SHIPPING_METHOD',
          shipping_method_id: cheapestMethod.shipping_method_id,
          shipping_method_name: cheapestMethod.shipping_method_name,
          shipping_method_cost: cheapestMethod.shipping_method_cost
        });

        // Calculate tax with new shipping
        // Note: We manually construct the updated cart data since React state updates are asynchronous
        console.log('🧮 Calculating tax with shipping cost...');
        const updatedCart = {
          ...cart,
          shipping_method_id: cheapestMethod.shipping_method_id,
          shipping_method_name: cheapestMethod.shipping_method_name,
          shipping_method_cost: cheapestMethod.shipping_method_cost
        };
        
        const taxPayload = buildTaxCalculationPayload({
          shippingAddress: shippingAddress,
          cart: updatedCart,
          shippingCost: cheapestMethod.shipping_method_cost
        });

        const taxResponse = await calculateTax(taxPayload);
        console.log('💰 Tax calculation response:', taxResponse);

        // Update cart tax totals
        updateCartTaxTotals(taxResponse, updatedCart, dispatch);

        // Resolve the event with updated totals for Stripe
        // The Express Checkout Element expects lineItems and shippingRates
        const lineItems = cart.line_items.map(item => ({
          name: `${item.name} x${item.quantity}`,
          amount: Math.round((item.price * item.quantity + (item.line_tax_total || 0) + (item.line_shipping_total || 0) + (item.line_shipping_tax_total || 0)) * 100)
        }));

        const shippingRates = [{
          id: cheapestMethod.shipping_method_id,
          displayName: cheapestMethod.shipping_method_name,
          amount: Math.round(cheapestMethod.shipping_method_cost * 100)
        }];

        console.log('✅ Resolving Express Checkout with new totals:', { 
          lineItems: lineItems.length,
          shippingRates: shippingRates.length
        });

        // Resolve the address change event with updated pricing
        event.resolve({
          lineItems,
          shippingRates
        });
      }

    } catch (error) {
      console.error('❌ Error processing shipping address change:', error);
      
      // Log additional details for debugging
      if (error instanceof Error) {
        console.error('❌ Error message:', error.message);
        console.error('❌ Error stack:', error.stack);
        
        // Check if this is a tax calculation error
        if (error.message.includes('HTTP 400')) {
          console.error('❌ Tax calculation failed due to invalid address data');
          console.error('📍 Address that caused the error:', JSON.stringify(event.address, null, 2));
        }
      }
      
      // Reject the address change if there's an error
      event.reject();
    }
  };

  return (
    <div className="mt-4">
      <ExpressCheckoutElement 
        onConfirm={handleExpressCheckout}
        onShippingAddressChange={handleShippingAddressChange}
        options={{
          ...options,
          ...(shippingRates && { shippingRates })
        }}
      />
    </div>
  );
};

export default ExpressCheckoutComponent;
