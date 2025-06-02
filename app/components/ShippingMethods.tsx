'use client';

import { useState, useEffect } from 'react';
import { useCart } from '../cart-context';
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

// Mock shipping methods - in a real app, this would come from an API
const mockShippingMethods: ShippingMethod[] = [
  {
    shipping_method_id: '1',
    shipping_method_name: 'Free Standard Shipping',
    shipping_method_description: 'Arrives Friday May 30 - Tuesday June 3',
    shipping_method_cost: 0.00
  },
  {
    shipping_method_id: '2',
    shipping_method_name: 'UPS Ground',
    shipping_method_description: 'Arrives Thursday May 29',
    shipping_method_cost: 5.99
  },
  {
    shipping_method_id: '3', 
    shipping_method_name: 'UPS 2nd Day',
    shipping_method_description: 'Arrives Tuesday May 27',
    shipping_method_cost: 12.99
  },
  {
    shipping_method_id: '4',
    shipping_method_name: 'UPS Overnight',
    shipping_method_description: 'Arrives Monday May 26',
    shipping_method_cost: 24.99
  },
];

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
    if (!shippingAddress || !shippingAddress.postal_code) {
      setAvailableMethods([]);
      return;
    }

    // Remove loading state - use global "Updating Payment Details" overlay instead
    // Simulate API call delay but don't show loading in this component
    setTimeout(() => {
      setAvailableMethods(mockShippingMethods);
      
      // Auto-select the first method if none is selected and cart doesn't have one
      if (!cart.shipping_method_id && mockShippingMethods.length > 0) {
        const firstMethod = mockShippingMethods[0];
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
    }, 500);
  }, [shippingAddress, cart.shipping_method_id, dispatch, onShippingMethodSelected]);

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

  if (availableMethods.length === 0) {
    return (
      <div className="text-sm py-2 text-gray-500 text-center">
        No shipping methods available for this address
      </div>
    );
  }

  return (
    <div className="space-y-3">
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
