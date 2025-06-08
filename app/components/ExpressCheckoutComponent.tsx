'use client';

import React from 'react';
import { ExpressCheckoutElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart, type CartItem } from '../cart-context';
import { useRouter } from 'next/navigation';

// Types for the express checkout events
interface ExpressCheckoutEvent {
  billingDetails?: {
    name?: string;
    email?: string;
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
  address?: {
    city?: string;
    country?: string;
    line1?: string;
    line2?: string | null;
    postal_code?: string;
    state?: string;
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
  options?: {
    buttonType?: {
      applePay?: 'buy' | 'check-out' | 'donate' | 'plain';
      googlePay?: 'buy' | 'checkout' | 'donate' | 'plain';
    };
  };
}

const ExpressCheckoutComponent: React.FC<ExpressCheckoutComponentProps> = ({
  mode,
  onProcessingStateChange,
  onSuccess,
  onError,
  onClose,
  options = {
    buttonType: {
      applePay: 'buy',
      googlePay: 'buy',
    },
  }
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { state: cart, dispatch } = useCart();

  const handleExpressCheckout = async (event: ExpressCheckoutEvent) => {
    console.log('Express checkout confirmed:', event);
    
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
            address: event.billingDetails?.address || null,
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
          email: event.expressPaymentType === 'apple_pay' ? 'Apple Pay User' : 'Express Pay User',
          address: null,
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

  return (
    <div className="mt-4">
      <ExpressCheckoutElement 
        onConfirm={handleExpressCheckout}
        options={options}
      />
    </div>
  );
};

export default ExpressCheckoutComponent;
