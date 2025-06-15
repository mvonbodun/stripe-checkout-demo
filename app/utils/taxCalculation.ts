// Tax calculation utility functions
import type { Cart } from '../cart-context';

export interface TaxCalculationPayload {
  shipping_address: {
    city?: string;
    country?: string;
    line1?: string;
    line2?: string | null;
    postal_code?: string;
    state?: string;
  };
  cart: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    taxcode?: string;
    attributes?: string[];
  }>;
  shipping_cost?: number;
}

export interface TaxCalculationResponse {
  calculation: {
    id: string;
    line_items: {
      data: Array<{
        reference: string;
        amount_tax: number;
      }>;
    };
    shipping_cost?: {
      amount_tax: number;
    };
  };
  calculation_id: string;
  tax_amount: number;
}

/**
 * Builds the payload for the tax calculation API call
 */
export function buildTaxCalculationPayload({
  shippingAddress,
  cart,
  shippingCost = 0
}: {
  shippingAddress: {
    city?: string;
    country?: string;
    line1?: string;
    line2?: string | null;
    postal_code?: string;
    state?: string;
  };
  cart: Cart;
  shippingCost?: number;
}): TaxCalculationPayload {
  return {
    shipping_address: shippingAddress,
    cart: cart.line_items.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      taxcode: item.taxcode,
      attributes: item.attributes
    })),
    shipping_cost: shippingCost
  };
}

/**
 * Calls the tax calculation API and returns the response
 */
export async function calculateTax(payload: TaxCalculationPayload): Promise<TaxCalculationResponse> {
  const response = await fetch('/api/calculate-tax', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) {
    const text = await response.text();
    console.error("Calculate tax HTTP error:", response.status, text);
    throw new Error(`HTTP ${response.status}: ${text}`);
  }
  
  return response.json();
}

/**
 * Updates line item tax totals in the cart context
 */
export function updateCartTaxTotals(
  taxResponse: TaxCalculationResponse,
  cart: Cart,
  dispatch: (action: 
    | { type: 'UPDATE_LINE_TAX_TOTAL'; product_id: string; tax_total: number }
    | { type: 'UPDATE_LINE_SHIPPING_TAX_TOTAL'; product_id: string; shipping_tax_total: number }
  ) => void,
  onTaxCalculationIdChange?: (id: string | null) => void
) {
  console.log(' updateCartTaxTotals called with:', {
    calculation_id: taxResponse.calculation_id,
    line_items_count: taxResponse.calculation?.line_items?.data?.length || 0,
    shipping_cost_tax: taxResponse.calculation?.shipping_cost?.amount_tax || 0,
    cart_line_items_count: cart.line_items.length
  });

  // Update individual line item tax totals
  if (taxResponse.calculation && taxResponse.calculation.line_items && taxResponse.calculation.line_items.data) {
    console.log(' Debugging tax line item matching:');
    console.log('Cart line items:', cart.line_items.map(item => ({ id: item.id, product_id: item.product_id, name: item.name })));
    console.log('Tax line items:', taxResponse.calculation.line_items.data.map(item => ({ reference: item.reference, amount_tax: item.amount_tax })));
    
    taxResponse.calculation.line_items.data.forEach((taxLineItem) => {
      // Find the corresponding cart item by reference (which is the item.id)
      const cartItem = cart.line_items.find(item => item.id === taxLineItem.reference);
      console.log(` Looking for cart item with id: ${taxLineItem.reference}, found:`, cartItem ? { id: cartItem.id, product_id: cartItem.product_id } : 'NOT FOUND');
      
      if (cartItem) {
        // Dispatch UPDATE_LINE_TAX_TOTAL for each line item
        dispatch({ 
          type: 'UPDATE_LINE_TAX_TOTAL', 
          product_id: cartItem.product_id, 
          tax_total: taxLineItem.amount_tax / 100 // Convert from cents to dollars
        });
      } else {
        console.error(' Could not find cart item for tax line item reference:', taxLineItem.reference);
      }
    });
  }

  // Handle shipping tax distribution
  if (taxResponse.calculation && taxResponse.calculation.shipping_cost && taxResponse.calculation.shipping_cost.amount_tax > 0) {
    const shippingTaxAmount = taxResponse.calculation.shipping_cost.amount_tax / 100; // Convert from cents to dollars
    const orderSubtotal = cart.line_items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (orderSubtotal > 0) {
      cart.line_items.forEach((item) => {
        const lineSubtotal = item.price * item.quantity;
        const proportion = lineSubtotal / orderSubtotal;
        const lineShippingTax = Math.round(proportion * shippingTaxAmount * 100) / 100; // Round to 2 decimals
        
        dispatch({
          type: 'UPDATE_LINE_SHIPPING_TAX_TOTAL',
          product_id: item.product_id,
          shipping_tax_total: lineShippingTax
        });
      });
    }
  } else {
    // Clear shipping tax if no shipping tax returned
    cart.line_items.forEach((item) => {
      dispatch({
        type: 'UPDATE_LINE_SHIPPING_TAX_TOTAL',
        product_id: item.product_id,
        shipping_tax_total: 0
      });
    });
  }

  if (taxResponse.calculation_id) {
    if (onTaxCalculationIdChange) {
      onTaxCalculationIdChange(taxResponse.calculation_id);
    }
  }
}

/**
 * Clears tax totals for all line items in the cart
 */
export function clearCartTaxTotals(
  cart: Cart,
  dispatch: (action: 
    | { type: 'UPDATE_LINE_TAX_TOTAL'; product_id: string; tax_total: number }
    | { type: 'UPDATE_LINE_SHIPPING_TAX_TOTAL'; product_id: string; shipping_tax_total: number }
  ) => void,
  onTaxCalculationIdChange?: (id: string | null) => void
) {
  cart.line_items.forEach((item) => {
    dispatch({ 
      type: 'UPDATE_LINE_TAX_TOTAL', 
      product_id: item.product_id, 
      tax_total: 0 
    });
    
    dispatch({
      type: 'UPDATE_LINE_SHIPPING_TAX_TOTAL',
      product_id: item.product_id,
      shipping_tax_total: 0
    });
  });
  
  if (onTaxCalculationIdChange) {
    onTaxCalculationIdChange(null);
  }
}
