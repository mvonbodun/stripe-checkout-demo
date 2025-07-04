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

  // Guard: Don't render Express Checkout if cart is empty or total is invalid
  // This prevents the "amount must be greater than 0" error during checkout processing
  // when the cart gets cleared before navigation completes
  if (!cart.order_grand_total || cart.order_grand_total <= 0 || cart.line_items.length === 0) {
    console.log('🚫 ExpressCheckoutComponent: Cart is empty or invalid, not rendering Express Checkout');
    return null;
  }

  // Task #2: Set Elements options with mode: 'payment', currency: 'usd', amount from cart
  const elementsOptions = {
    mode: 'payment' as const,
    currency: 'usd' as const,
    amount: Math.round(cart.order_grand_total * 100), // Convert to cents
    captureMethod: 'manual' as const, // Must match the PaymentIntent capture_method
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

      // Create PaymentIntent and confirm payment (same logic for both mini-cart and checkout modes)
      console.log('Creating PaymentIntent for Express Checkout...');
      
      // Create PaymentIntent on the server
      const paymentIntentResponse = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(cart.order_grand_total * 100), // Convert to cents
          cart: cart.line_items,
        }),
      });

      if (!paymentIntentResponse.ok) {
        throw new Error('Failed to create PaymentIntent');
      }

      const { clientSecret } = await paymentIntentResponse.json();
      console.log('PaymentIntent created, confirming payment...');

      // Confirm payment using the client secret
      const result = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: event.billingDetails?.name,
              email: event.billingDetails?.email,
              phone: event.billingDetails?.phone,
              address: event.billingDetails?.address,
            },
          },
          return_url: `${window.location.origin}/order-confirmation`,
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
          expressPaymentType: event.expressPaymentType || 'express',
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
      
      // Close mini-cart modal if in mini-cart mode
      if (mode === 'mini-cart') {
        onClose?.();
      }
      
      // Navigate to order confirmation (same for both modes)
      router.push('/order-confirmation');

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

        // Calculate the new grand total manually to update Elements immediately
        // (React state updates are asynchronous, so we need to calculate this now)
        let newTaxTotal = 0;
        let newShippingTaxTotal = 0;

        // Calculate line item tax totals
        if (taxResponse.calculation?.line_items?.data) {
          taxResponse.calculation.line_items.data.forEach((taxLineItem) => {
            newTaxTotal += taxLineItem.amount_tax / 100; // Convert from cents to dollars
          });
        }

        // Calculate shipping tax total
        if (taxResponse.calculation?.shipping_cost?.amount_tax) {
          newShippingTaxTotal = taxResponse.calculation.shipping_cost.amount_tax / 100; // Convert from cents to dollars
        }

        // Calculate new grand total: subtotal + tax + shipping + shipping_tax
        const newGrandTotal = updatedCart.order_subtotal + newTaxTotal + updatedCart.order_shipping_total + newShippingTaxTotal;
        
        console.log('💰 Calculated new totals:', {
          subtotal: updatedCart.order_subtotal,
          tax: newTaxTotal,
          shipping: updatedCart.order_shipping_total,
          shippingTax: newShippingTaxTotal,
          grandTotal: newGrandTotal
        });

        // Resolve the event with updated totals for Stripe
        // The Express Checkout Element expects lineItems and shippingRates
        const lineItems = [
          // Product line items
          ...cart.line_items.map(item => ({
            name: `${item.name} x${item.quantity}`,
            amount: Math.round(item.line_subtotal * 100) // Product cost (price * quantity)
          })),
          // Shipping line item
          {
            name: 'Shipping',
            amount: Math.round(updatedCart.order_shipping_total * 100) // Convert to cents
          },
          // Tax line item (sum of order tax + shipping tax)
          {
            name: 'Tax',
            amount: Math.round((newTaxTotal + newShippingTaxTotal) * 100) // Convert to cents
          }
        ];

        // Include ALL shipping methods, sorted from cheapest to most expensive
        const shippingRates = shippingData.shippingMethods
          .sort((a: ShippingMethod, b: ShippingMethod) => a.shipping_method_cost - b.shipping_method_cost)
          .map((method: ShippingMethod) => ({
            id: method.shipping_method_id,
            displayName: method.shipping_method_name,
            amount: Math.round(method.shipping_method_cost * 100)
          }));

        console.log('✅ Resolving Express Checkout with new totals:', { 
          lineItems: lineItems.length,
          shippingRates: shippingRates.length,
          availableShippingOptions: shippingRates.map((rate: { displayName: string; amount: number }) => `${rate.displayName}: $${rate.amount/100}`)
        });

        // Update Elements with the new amount BEFORE resolving to fix the timing issue
        if (elements) {
          await elements.update({
            amount: Math.round(newGrandTotal * 100) // Convert to cents
          });
          console.log('✅ Elements updated with new amount:', Math.round(newGrandTotal * 100));
        }

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

  // Handler for shipping rate changes
  const handleShippingRateChange = async (event: {
    shippingRate: {
      id: string;
      amount: number;
      displayName: string;
    };
    resolve: (resolveDetails: {
      lineItems?: Array<{ name: string; amount: number; }>;
      shippingRates?: Array<{ id: string; amount: number; displayName: string; }>;
    }) => void;
    reject: () => void;
  }) => {
    console.log('🚚 Express Checkout shipping rate changed:', event);
    console.log('📦 Selected shipping rate:', JSON.stringify(event.shippingRate, null, 2));
    
    try {
      const selectedRate = event.shippingRate;
      
      // Validate the selected shipping rate
      if (!selectedRate || !selectedRate.id) {
        console.log('⚠️ No valid shipping rate selected, skipping processing');
        event.reject();
        return;
      }
      
      // Convert amount from cents to dollars for our cart system
      const shippingCostInDollars = selectedRate.amount / 100;
      
      console.log(`💰 Updating cart with selected shipping method: ${selectedRate.displayName} ($${shippingCostInDollars})`);
      
      // Update cart with the selected shipping method
      dispatch({
        type: 'UPDATE_SHIPPING_METHOD',
        shipping_method_id: selectedRate.id,
        shipping_method_name: selectedRate.displayName,
        shipping_method_cost: shippingCostInDollars
      });

      // Calculate tax with new shipping cost
      // Note: We manually construct the updated cart data since React state updates are asynchronous
      console.log('🧮 Calculating tax with new shipping cost...');
      const updatedCart = {
        ...cart,
        shipping_method_id: selectedRate.id,
        shipping_method_name: selectedRate.displayName,
        shipping_method_cost: shippingCostInDollars,
        order_shipping_total: shippingCostInDollars
      };
      
      // Build tax calculation payload with the updated cart and shipping address from current cart
      const shippingAddress = cart.shipping_address?.address;
      if (!shippingAddress) {
        console.log('⚠️ No shipping address available, cannot calculate tax for shipping rate change');
        event.reject();
        return;
      }
      
      const taxPayload = buildTaxCalculationPayload({
        shippingAddress: shippingAddress,
        cart: updatedCart,
        shippingCost: shippingCostInDollars
      });

      const taxResponse = await calculateTax(taxPayload);
      console.log('💰 Tax calculation response:', taxResponse);

      // Update cart tax totals
      updateCartTaxTotals(taxResponse, updatedCart, dispatch);

      // Calculate the new grand total manually to update Elements immediately
      // (React state updates are asynchronous, so we need to calculate this now)
      let newTaxTotal = 0;
      let newShippingTaxTotal = 0;

      // Calculate line item tax totals
      if (taxResponse.calculation?.line_items?.data) {
        taxResponse.calculation.line_items.data.forEach((taxLineItem) => {
          newTaxTotal += taxLineItem.amount_tax / 100; // Convert from cents to dollars
        });
      }

      // Calculate shipping tax total
      if (taxResponse.calculation?.shipping_cost?.amount_tax) {
        newShippingTaxTotal = taxResponse.calculation.shipping_cost.amount_tax / 100; // Convert from cents to dollars
      }

      // Calculate new grand total: subtotal + tax + shipping + shipping_tax
      const newGrandTotal = updatedCart.order_subtotal + newTaxTotal + updatedCart.order_shipping_total + newShippingTaxTotal;
      
      console.log('💰 Calculated new totals:', {
        subtotal: updatedCart.order_subtotal,
        tax: newTaxTotal,
        shipping: updatedCart.order_shipping_total,
        shippingTax: newShippingTaxTotal,
        grandTotal: newGrandTotal
      });

      // Resolve the event with updated totals for Stripe
      // The Express Checkout Element expects lineItems and shippingRates
      const lineItems = [
        // Product line items
        ...cart.line_items.map(item => ({
          name: `${item.name} x${item.quantity}`,
          amount: Math.round(item.line_subtotal * 100) // Product cost (price * quantity)
        })),
        // Shipping line item
        {
          name: 'Shipping',
          amount: Math.round(updatedCart.order_shipping_total * 100) // Convert to cents
        },
        // Tax line item (sum of order tax + shipping tax)
        {
          name: 'Tax',
          amount: Math.round((newTaxTotal + newShippingTaxTotal) * 100) // Convert to cents
        }
      ];

      // For shipping rate change, we need to provide the available shipping rates
      // In most cases, this would be the same rates that were originally provided
      // Since the user is selecting from existing options, we reconstruct based on available methods
      const shippingRates = [{
        id: selectedRate.id,
        displayName: selectedRate.displayName,
        amount: selectedRate.amount
      }];

      console.log('✅ Resolving Express Checkout shipping rate change with new totals:', { 
        lineItems: lineItems.length,
        shippingRates: shippingRates.length,
        selectedRate: selectedRate.displayName,
        newGrandTotal: newGrandTotal
      });

      // Update Elements with the new amount BEFORE resolving to fix the timing issue
      if (elements) {
        await elements.update({
          amount: Math.round(newGrandTotal * 100) // Convert to cents
        });
        console.log('✅ Elements updated with new amount:', Math.round(newGrandTotal * 100));
      }

      // Resolve the shipping rate change event with updated pricing
      event.resolve({
        lineItems,
        shippingRates
      });

    } catch (error) {
      console.error('❌ Error processing shipping rate change:', error);
      
      // Log additional details for debugging
      if (error instanceof Error) {
        console.error('❌ Error message:', error.message);
        console.error('❌ Error stack:', error.stack);
        
        // Check if this is a tax calculation error
        if (error.message.includes('HTTP 400')) {
          console.error('❌ Tax calculation failed during shipping rate change');
          console.error('📦 Shipping rate that caused the error:', JSON.stringify(event.shippingRate, null, 2));
        }
      }
      
      // Reject the shipping rate change if there's an error
      event.reject();
    }
  };

  // Handler for Express Checkout cancellation
  const handleExpressCheckoutCancel = async () => {
    console.log('🚫 Express Checkout cancelled by user');
    
    if (!elements) {
      console.log('⚠️ Elements not available for cancel handler');
      return;
    }

    try {
      // Reset Elements amount back to cart subtotal only (no shipping or tax)
      // This represents the base product cost before any Express Checkout calculations
      const baseAmount = Math.round(cart.order_subtotal * 100); // Convert to cents
      
      console.log('🔄 Resetting Elements amount to cart subtotal:', {
        order_subtotal: cart.order_subtotal,
        amount_in_cents: baseAmount
      });

      // Update Elements with the base cart subtotal amount
      await elements.update({
        amount: baseAmount
      });

      console.log('✅ Elements amount reset to cart subtotal successfully');

    } catch (error) {
      console.error('❌ Error resetting Elements amount on cancel:', error);
      
      // Log additional details for debugging
      if (error instanceof Error) {
        console.error('❌ Error message:', error.message);
        console.error('❌ Error stack:', error.stack);
      }
    }
  };

  return (
    <div className="mt-4">
      <ExpressCheckoutElement 
        onConfirm={handleExpressCheckout}
        onShippingAddressChange={handleShippingAddressChange}
        onShippingRateChange={handleShippingRateChange}
        onCancel={handleExpressCheckoutCancel}
        options={{
          ...options,
          shippingRates: shippingRates || []
        }}
      />
    </div>
  );
};

export default ExpressCheckoutComponent;
