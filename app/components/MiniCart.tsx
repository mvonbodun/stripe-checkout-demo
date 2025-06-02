'use client';
import React, { useRef, useEffect, useState } from 'react';
import { useCart } from '../cart-context';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, ExpressCheckoutElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface MiniCartProps {
  open: boolean;
  onClose: () => void;
}

const MiniCart: React.FC<MiniCartProps> = ({ open, onClose }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const { state, dispatch } = useCart();
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isCreatingPaymentIntent, setIsCreatingPaymentIntent] = useState(false);

  // Trap focus and block scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Create payment intent when mini-cart opens and has items
  useEffect(() => {
    if (open && state.line_items.length > 0 && !clientSecret && !isCreatingPaymentIntent) {
      setIsCreatingPaymentIntent(true);
      
      const payload = {
        amount: Math.round(state.order_grand_total * 100), // in cents
        cart: state.line_items.map((item) => ({
          id: String(item.product_id),
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          taxcode: item.taxcode ?? '',
          attributes: item.attributes ?? []
        })),
        tax_calculation_id: null
      };

      fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
          dispatch({ type: 'UPDATE_PAYMENT_INTENT', payment_intent: data.paymentIntentId });
          setIsCreatingPaymentIntent(false);
        })
        .catch(err => {
          console.error("Error creating payment intent for mini-cart:", err);
          setIsCreatingPaymentIntent(false);
        });
    }
  }, [open, state.line_items, state.order_grand_total, clientSecret, isCreatingPaymentIntent, dispatch]);

  // Close on overlay click
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const { line_items, order_subtotal, order_shipping_total } = state;
  const isEmpty = !line_items || line_items.length === 0;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/30 flex justify-end pointer-events-auto"
      ref={overlayRef} 
      onClick={handleOverlayClick}
    >
      <aside 
        className="bg-white w-[28vw] min-w-[320px] max-w-[420px] h-full shadow-lg flex flex-col relative animate-slide-in"
        role="dialog" 
        aria-modal="true"
      >
        <div className="flex items-center h-14 px-6 bg-transparent relative">
          <button 
            className="bg-transparent border-none text-2xl cursor-pointer text-gray-800 mr-auto hover:text-gray-600 transition-colors"
            aria-label="Close mini cart" 
            onClick={onClose}
          >
            &#10005;
          </button>
        </div>
        <div className="h-px bg-gray-200 mb-2" />
        <div className="flex-1 overflow-y-auto px-6">
          {isEmpty ? (
            <div className="text-center text-gray-500 mt-8 text-xl">Your Cart is Empty</div>
          ) : (
            <div className="flex flex-col gap-6">
              {line_items.map(item => (
                <div className="border-b-2 border-gray-200 pb-4" key={item.product_id}>
                  <div className="grid grid-cols-[100px_1fr] gap-4 min-h-[100px] relative">
                    {/* Column 1: Thumbnail */}
                    <div className="flex-shrink-0">
                      {item.image && (
                        <Image 
                          src={item.image} 
                          alt={item.name} 
                          width={100} 
                          height={100} 
                          className="rounded object-cover" 
                        />
                      )}
                    </div>
                    
                    {/* Column 2: Product info, attributes, and quantity controls */}
                    <div className="min-w-0 relative">
                      <div className="flex justify-between items-start">
                        <div className="font-semibold text-base leading-tight pr-2">{item.name}</div>
                        <button
                          className="bg-transparent border-none text-gray-500 text-lg cursor-pointer hover:text-gray-700 transition-colors flex-shrink-0"
                          aria-label={`Remove ${item.name}`}
                          onClick={() => dispatch({ type: 'REMOVE_ITEM', product_id: item.product_id })}
                        >
                          X
                        </button>
                      </div>
                      {item.attributes && item.attributes.length > 0 && (
                        <div className="text-sm text-gray-600 mt-0.5 mb-3">
                          {item.attributes.map((attr, idx) => (
                            <div key={idx} className="mb-0.5">{attr}</div>
                          ))}
                        </div>
                      )}
                      
                      {/* Quantity controls */}
                      <div className="flex items-center gap-2">
                        <button
                          className="bg-gray-100 border-none rounded w-7 h-7 text-lg cursor-pointer text-gray-800 transition-colors hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                          aria-label="Decrease quantity"
                          onClick={() => dispatch({ type: 'UPDATE_QUANTITY', product_id: item.product_id, quantity: Math.max(1, item.quantity - 1) })}
                          disabled={item.quantity <= 1}
                        >
                          –
                        </button>
                        <span className="min-w-[28px] text-center text-base">{item.quantity}</span>
                        <button
                          className="bg-gray-100 border-none rounded w-7 h-7 text-lg cursor-pointer text-gray-800 transition-colors hover:bg-gray-200 flex items-center justify-center"
                          aria-label="Increase quantity"
                          onClick={() => dispatch({ type: 'UPDATE_QUANTITY', product_id: item.product_id, quantity: item.quantity + 1 })}
                        >
                          +
                        </button>
                      </div>
                      
                      {/* Price positioned in bottom right corner */}
                      <div className="absolute bottom-0 right-0">
                        <div className="font-medium text-gray-900 text-base text-right">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-4 px-6 border-t border-gray-200 bg-gray-50">
          {!isEmpty && (
            <>
              <div className="flex justify-between mb-2 text-base">
                <span>Subtotal</span>
                <span>${order_subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2 text-base">
                <span>Shipping</span>
                <span>{order_shipping_total === 0 ? 'FREE' : `$${order_shipping_total.toFixed(2)}`}</span>
              </div>
              <button
                className="w-full py-3.5 bg-gray-900 text-white border-none rounded font-semibold text-lg mt-2 cursor-pointer transition-colors hover:bg-gray-800"
                onClick={() => {
                  onClose();
                  router.push('/checkout');
                }}
              >
                Proceed to Checkout
              </button>
              
              {/* Express Checkout Section */}
              {clientSecret && !isCreatingPaymentIntent ? (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <ExpressCheckout onClose={onClose} />
                </Elements>
              ) : (
                /* Loading skeleton that matches ExpressCheckout button height */
                <div className="mt-4">
                  <div className="h-[44px] bg-gray-100 rounded animate-pulse flex items-center justify-center">
                    <div className="flex items-center gap-2 text-gray-500 text-xs">
                      <div className="w-3 h-3 border border-gray-400 border-t-gray-600 rounded-full animate-spin"></div>
                      <span>Loading payment options...</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </aside>
    </div>
  );
};

// Express Checkout Component  
const ExpressCheckout: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { dispatch } = useCart();

  const handleExpressCheckout = async (event: {
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
  }) => {
    if (!stripe || !elements) {
      console.error('Stripe has not loaded yet');
      return;
    }

    try {
      // Confirm the payment using the express checkout event
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
        alert(`Payment failed: ${result.error.message}`);
      } else if (result.paymentIntent && (result.paymentIntent.status === 'succeeded' || result.paymentIntent.status === 'requires_capture')) {
        console.log('Express checkout payment succeeded. Payment status:', result.paymentIntent.status);
        dispatch({ type: 'CLEAR_CART' });
        onClose();
        router.push('/order-confirmation');
      } else {
        console.log('Express checkout requires further action');
        alert('Payment processing requires further action.');
      }
    } catch (error) {
      console.error('Express checkout processing error:', error);
      alert('An error occurred during express checkout');
    }
  };

  return (
    <div className="mt-4">
      <ExpressCheckoutElement 
        onConfirm={handleExpressCheckout}
        options={{
          buttonType: {
            applePay: 'buy',
            googlePay: 'buy',
          },
        }}
      />
    </div>
  );
};

export default MiniCart;