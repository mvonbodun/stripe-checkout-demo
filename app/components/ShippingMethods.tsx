'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useCart, type Cart } from '../cart-context';
import { buildTaxCalculationPayload, calculateTax, updateCartTaxTotals, clearCartTaxTotals } from '../utils/taxCalculation';

export type ShippingMethod = {
  shipping_method_id: string;
  shipping_method_name: string;
  shipping_method_description: string;
  shipping_method_cost: number;
};

interface ShippingMethodsProps {
  shippingAddress?: {
    city?: string;
    country?: string;
    line1?: string;
    line2?: string | null;
    postal_code?: string;
    state?: string;
  } | null;
  onTaxCalculationIdChange?: (id: string | null) => void;
  onTaxCalculationStarted?: () => void;
  onTaxCalculationCompleted?: () => void;
  onShippingMethodSelected?: (selected: boolean) => void;
}

interface ShippingMethodsResponse {
  shippingMethods: ShippingMethod[];
  freeShippingApplied?: boolean;
  message?: string;
}

// Fetch shipping methods from API
const fetchShippingMethods = async (
  cart: Cart, 
  shippingAddress: {
    city?: string;
    country?: string;
    line1?: string;
    line2?: string | null;
    postal_code?: string;
    state?: string;
  }
): Promise<ShippingMethodsResponse> => {
  const response = await fetch('/api/shipping-methods', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      cart,
      shippingAddress,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch shipping methods: ${response.statusText}`);
  }

  return response.json();
};

export default function ShippingMethods({ 
  shippingAddress, 
  onTaxCalculationIdChange, 
  onTaxCalculationStarted, 
  onTaxCalculationCompleted,
  onShippingMethodSelected 
}: ShippingMethodsProps) {
  const { state: cart, dispatch } = useCart();
  const [availableMethods, setAvailableMethods] = useState<ShippingMethod[]>([]);
  const [selectedMethodId, setSelectedMethodId] = useState<string>(cart.shipping_method_id || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [freeShippingMessage, setFreeShippingMessage] = useState<string | null>(null);
  
  // Track last fetch parameters to prevent unnecessary refetches
  const lastFetchRef = useRef<{
    postal_code?: string;
    line_items_count: number;
    order_subtotal: number;
  } | null>(null);

  // Memoize the values that should trigger shipping method refetch
  const fetchTriggerValues = useMemo(() => ({
    postal_code: shippingAddress?.postal_code,
    line_items_count: cart.line_items?.length || 0,
    order_subtotal: cart.order_subtotal || 0
  }), [shippingAddress?.postal_code, cart.line_items?.length, cart.order_subtotal]);

  // Helper function to recalculate tax when shipping changes
  const recalculateTaxWithShipping = async (shippingCost: number) => {
    if (!shippingAddress) return;
    
    try {
      const payload = buildTaxCalculationPayload({
        shippingAddress,
        cart,
        shippingCost
      });
      
      const data = await calculateTax(payload);
      
      // Update cart tax totals
      updateCartTaxTotals(data, cart, dispatch, onTaxCalculationIdChange);
      
    } catch (err) {
      console.log("ShippingMethods: error calculating tax with shipping: " + err);
      // Clear tax totals for all line items
      clearCartTaxTotals(cart, dispatch, onTaxCalculationIdChange);
    }
  };

  // Load shipping methods when shipping address changes
  useEffect(() => {
    const loadShippingMethods = async () => {
      if (!shippingAddress || !shippingAddress.postal_code) {
        setAvailableMethods([]);
        setError(null);
        setFreeShippingMessage(null);
        lastFetchRef.current = null;
        return;
      }

      // Check if we need to refetch - only if relevant values changed
      const currentValues = fetchTriggerValues;
      if (lastFetchRef.current && 
          lastFetchRef.current.postal_code === currentValues.postal_code &&
          lastFetchRef.current.line_items_count === currentValues.line_items_count &&
          lastFetchRef.current.order_subtotal === currentValues.order_subtotal) {
        console.log('🚚 Skipping shipping methods fetch - no relevant changes');
        
        // Still notify parent if we have a shipping method selected but haven't notified yet
        if (cart.shipping_method_id && availableMethods.length > 0) {
          onShippingMethodSelected?.(true);
        }
        return;
      }

      setLoading(true);
      setError(null);
      setFreeShippingMessage(null);
      
      try {
        console.log('🚚 Fetching shipping methods for address:', shippingAddress);
        const data = await fetchShippingMethods(cart, shippingAddress);
        
        // Update last fetch parameters
        lastFetchRef.current = currentValues;
        
        setAvailableMethods(data.shippingMethods);
        
        if (data.freeShippingApplied && data.message) {
          setFreeShippingMessage(data.message);
        }
        
        // Auto-select the first method if none is selected and cart doesn't have one
        if (!cart.shipping_method_id && data.shippingMethods.length > 0) {
          const firstMethod = data.shippingMethods[0];
          setSelectedMethodId(firstMethod.shipping_method_id);
          
          // Dispatch the update directly here
          dispatch({
            type: 'UPDATE_SHIPPING_METHOD',
            shipping_method_id: firstMethod.shipping_method_id,
            shipping_method_name: firstMethod.shipping_method_name,
            shipping_method_cost: firstMethod.shipping_method_cost
          });
          
          // Notify parent that a shipping method is now selected
          onShippingMethodSelected?.(true);
        } else if (cart.shipping_method_id) {
          // If cart already has a shipping method, notify parent
          onShippingMethodSelected?.(true);
        }
      } catch (err) {
        console.error('Error fetching shipping methods:', err);
        setError('Failed to load shipping methods. Please try again.');
        setAvailableMethods([]);
        lastFetchRef.current = null;
      } finally {
        setLoading(false);
      }
    };

    loadShippingMethods();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchTriggerValues.postal_code, fetchTriggerValues.line_items_count, fetchTriggerValues.order_subtotal]);

  const handleMethodChange = async (methodId: string) => {
    const selectedMethod = availableMethods.find(method => method.shipping_method_id === methodId);
    
    if (selectedMethod) {
      setSelectedMethodId(methodId);
      
      console.log("🚢 Shipping method changed to:", selectedMethod.shipping_method_name, `($${selectedMethod.shipping_method_cost})`);
      
      // Notify parent that tax calculation is starting - this prevents payment intent updates
      if (onTaxCalculationStarted) {
        console.log("🧮 Starting tax calculation with shipping cost...");
        onTaxCalculationStarted();
      }
      
      // Update shipping method in cart
      dispatch({
        type: 'UPDATE_SHIPPING_METHOD',
        shipping_method_id: selectedMethod.shipping_method_id,
        shipping_method_name: selectedMethod.shipping_method_name,
        shipping_method_cost: selectedMethod.shipping_method_cost
      });
      
      // Recalculate tax with new shipping cost
      await recalculateTaxWithShipping(selectedMethod.shipping_method_cost);
      
      // Notify parent that tax calculation is complete - this allows payment intent updates
      if (onTaxCalculationCompleted) {
        console.log("✅ Tax calculation completed - payment intent updates can proceed");
        onTaxCalculationCompleted();
      }
      
      // Notify parent that a shipping method is selected
      onShippingMethodSelected?.(true);
    }
  };

  if (!shippingAddress || !shippingAddress.postal_code) {
    return (
      <div className="text-sm py-2 text-gray-400 text-center">
        Enter your shipping address to view available shipping methods
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-sm py-2 text-gray-500 text-center">
        Loading shipping methods...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm py-2 text-red-500 text-center">
        {error}
      </div>
    );
  }

  if (availableMethods.length === 0) {
    return (
      <div className="text-sm py-2 text-gray-500 text-center">
        No shipping methods available for this address
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {freeShippingMessage && (
        <div className="text-sm p-2 bg-green-50 border border-green-200 rounded-lg text-green-700">
          🎉 {freeShippingMessage}
        </div>
      )}
      {availableMethods.map((method) => (
        <label
          key={method.shipping_method_id}
          className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
            selectedMethodId === method.shipping_method_id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400 bg-white'
          }`}
        >
          <input
            type="radio"
            name="shipping_method"
            value={method.shipping_method_id}
            checked={selectedMethodId === method.shipping_method_id}
            onChange={(e) => handleMethodChange(e.target.value)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <div className="ml-3 flex-1">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium text-gray-900">
                  {method.shipping_method_name}
                </div>
                <div className="text-sm text-gray-600">
                  {method.shipping_method_description}
                </div>
              </div>
              <div className="font-semibold text-gray-900 ml-4">
                {method.shipping_method_cost === 0 
                  ? 'FREE' 
                  : `$${method.shipping_method_cost.toFixed(2)}`
                }
              </div>
            </div>
          </div>
        </label>
      ))}
    </div>
  );
}
