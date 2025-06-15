'use client';
import React, { createContext, useContext, useReducer, ReactNode, useEffect, useState } from 'react';

// Address type enum for billing or shipping
export enum AddressType {
  BILLING = 'billing',
  SHIPPING = 'shipping'
}

// Address type that matches Stripe AddressElement structure
export type Address = {
  addressType: AddressType;
  name?: string;
  address: {
    line1?: string;
    line2?: string | null;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
  phone?: string;
};

export type CartItem = {
  id: string;
  product_id: string;
  name: string;
  attributes?: string[];
  image?: string;
  price: number;
  quantity: number;
  taxcode?: string;
  line_subtotal: number;
  line_shipping_total: number;
  line_tax_total: number;
  line_shipping_tax_total: number;
  line_grand_total: number;
};

export type Cart = {
  id: string;
  order_subtotal: number;
  order_tax_total: number;
  order_shipping_total: number;
  order_shipping_tax_total: number;
  order_grand_total: number;
  line_items: CartItem[];
  payment_intent?: string | null;
  shipping_method_id?: string | null;
  shipping_method_name?: string | null;
  shipping_address?: Address | null;
};

type CartState = Cart;

type CartAction =
  | { type: 'ADD_ITEM'; item: CartItem }
  | { type: 'REMOVE_ITEM'; product_id: string }
  | { type: 'UPDATE_QUANTITY'; product_id: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'UPDATE_TAX_TOTAL'; tax_total: number }
  | { type: 'UPDATE_LINE_TAX_TOTAL'; product_id: string; tax_total: number }
  | { type: 'UPDATE_LINE_SHIPPING_TOTAL'; product_id: string; shipping_total: number }
  | { type: 'UPDATE_LINE_SHIPPING_TAX_TOTAL'; product_id: string; shipping_tax_total: number }
  | { type: 'UPDATE_PAYMENT_INTENT'; payment_intent: string | null }
  | { type: 'UPDATE_SHIPPING_METHOD'; shipping_method_id: string; shipping_method_name: string; shipping_method_cost: number }
  | { type: 'UPDATE_SHIPPING_ADDRESS'; shipping_address: Address | null }
  | { type: 'LOAD_FROM_STORAGE'; cart: CartState };

const initialCart: CartState = {
  id: crypto.randomUUID(),
  order_subtotal: 0,
  order_tax_total: 0,
  order_shipping_total: 0,
  order_shipping_tax_total: 0,
  order_grand_total: 0,
  line_items: [],
  payment_intent: null,
  shipping_method_id: null,
  shipping_method_name: null,
  shipping_address: null,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  // Helper to recalculate totals
  function recalcTotals(line_items: CartItem[], tax_total?: number): CartState {
    // First, update line-level totals for each item
    const updatedLineItems = line_items.map(item => {
      const line_subtotal = Math.round(item.price * item.quantity * 100) / 100;
      const line_tax_total = Math.round((item.line_tax_total || 0) * 100) / 100;
      const line_shipping_total = Math.round((item.line_shipping_total || 0) * 100) / 100;
      const line_shipping_tax_total = Math.round((item.line_shipping_tax_total || 0) * 100) / 100;
      const line_grand_total = Math.round((line_subtotal + line_tax_total + line_shipping_total + line_shipping_tax_total) * 100) / 100;
      
      return {
        ...item,
        line_subtotal,
        line_tax_total,
        line_shipping_total,
        line_shipping_tax_total,
        line_grand_total,
      };
    });

    // Calculate order-level totals by summing line-level totals
    const order_subtotal = Math.round(updatedLineItems.reduce((sum, item) => sum + item.line_subtotal, 0) * 100) / 100;
    const order_tax_total = Math.round((typeof tax_total === "number" ? tax_total : updatedLineItems.reduce((sum, item) => sum + item.line_tax_total, 0)) * 100) / 100;
    const order_shipping_total = Math.round(updatedLineItems.reduce((sum, item) => sum + item.line_shipping_total, 0) * 100) / 100;
    const order_shipping_tax_total = Math.round(updatedLineItems.reduce((sum, item) => sum + item.line_shipping_tax_total, 0) * 100) / 100;
    const order_grand_total = Math.round((order_subtotal + order_tax_total + order_shipping_total + order_shipping_tax_total) * 100) / 100;
    
    return {
      ...state, // preserve all other fields like payment_intent and id
      order_subtotal,
      order_tax_total,
      order_shipping_total,
      order_shipping_tax_total,
      order_grand_total,
      line_items: updatedLineItems,
    };
  }
  switch (action.type) {
    case 'LOAD_FROM_STORAGE': {
      return action.cart;
    }
    case 'UPDATE_PAYMENT_INTENT': {
      // Update the payment_intent field
      return {
        ...state,
        payment_intent: action.payment_intent,
      };
    }
    case 'UPDATE_TAX_TOTAL': {
      // Update the order_tax_total and recalculate grand total
      return recalcTotals(state.line_items.map(item => ({ ...item })), action.tax_total);
    }
    case 'UPDATE_LINE_TAX_TOTAL': {
      console.log('🛒 UPDATE_LINE_TAX_TOTAL:', { product_id: action.product_id, tax_total: action.tax_total });
      // Update the line_tax_total for a specific item and recalculate totals
      const updatedItems = state.line_items.map(item =>
        item.product_id === action.product_id ? { ...item, line_tax_total: action.tax_total } : item
      );
      return recalcTotals(updatedItems);
    }
    case 'UPDATE_LINE_SHIPPING_TOTAL': {
      console.log('🛒 UPDATE_LINE_SHIPPING_TOTAL:', { product_id: action.product_id, shipping_total: action.shipping_total });
      // Update the line_shipping_total for a specific item and recalculate totals
      const updatedItems = state.line_items.map(item =>
        item.product_id === action.product_id ? { ...item, line_shipping_total: action.shipping_total } : item
      );
      return recalcTotals(updatedItems);
    }
    case 'UPDATE_LINE_SHIPPING_TAX_TOTAL': {
      console.log('🛒 UPDATE_LINE_SHIPPING_TAX_TOTAL:', { product_id: action.product_id, shipping_tax_total: action.shipping_tax_total });
      // Update the line_shipping_tax_total for a specific item and recalculate totals
      const updatedItems = state.line_items.map(item =>
        item.product_id === action.product_id ? { ...item, line_shipping_tax_total: action.shipping_tax_total } : item
      );
      return recalcTotals(updatedItems);
    }
    case 'UPDATE_SHIPPING_METHOD': {
      console.log('🛒 UPDATE_SHIPPING_METHOD:', { 
        shipping_method_id: action.shipping_method_id, 
        shipping_method_name: action.shipping_method_name, 
        shipping_method_cost: action.shipping_method_cost 
      });
      // Update shipping method and distribute shipping cost among line items
      const { shipping_method_id, shipping_method_name, shipping_method_cost } = action;
      
      // Calculate the order grand total before shipping (subtotal + tax)
      const orderTotalBeforeShipping = state.order_subtotal + state.order_tax_total;
      
      let updatedItems = state.line_items;
      
      // Only distribute shipping cost if there are items and a positive shipping cost
      if (updatedItems.length > 0 && shipping_method_cost > 0 && orderTotalBeforeShipping > 0) {
        updatedItems = state.line_items.map(item => {
          // Calculate this item's proportion of the total order value (before shipping)
          const itemTotalBeforeShipping = item.line_subtotal + item.line_tax_total;
          const proportion = itemTotalBeforeShipping / orderTotalBeforeShipping;
          
          // Apply proportion to shipping cost and round to 2 decimal places
          const line_shipping_total = Math.round(proportion * shipping_method_cost * 100) / 100;
          
          return {
            ...item,
            line_shipping_total
          };
        });
      } else {
        // Clear shipping totals if no cost or items
        updatedItems = state.line_items.map(item => ({
          ...item,
          line_shipping_total: 0
        }));
      }
      
      const newState = recalcTotals(updatedItems);
      return {
        ...newState,
        shipping_method_id,
        shipping_method_name,
      };
    }
    case 'ADD_ITEM': {
      // Ensure the new item has all required line-level fields initialized
      const newItem = {
        ...action.item,
        id: crypto.randomUUID(), // Generate unique ID for each cart item
        line_subtotal: action.item.price * action.item.quantity,
        line_shipping_total: action.item.line_shipping_total || 0,
        line_tax_total: action.item.line_tax_total || 0,
        line_shipping_tax_total: action.item.line_shipping_tax_total || 0,
        line_grand_total: 0, // Will be calculated in recalcTotals
      };
      
      // Find if an item with the same product_id and attributes exists
      const existingIndex = state.line_items.findIndex(item =>
        item.product_id === newItem.product_id &&
        JSON.stringify(item.attributes ?? []) === JSON.stringify(newItem.attributes ?? [])
      );
      let updatedItems;
      if (existingIndex !== -1) {
        // Update quantity of the existing item
        updatedItems = [...state.line_items];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + newItem.quantity
        };
      } else {
        updatedItems = [...state.line_items, newItem];
      }
      return recalcTotals(updatedItems);
    }
    case 'REMOVE_ITEM':
      const updatedItems = state.line_items.filter(item => item.product_id !== action.product_id);
      return recalcTotals(updatedItems);
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.line_items.map(item =>
        item.product_id === action.product_id ? { ...item, quantity: action.quantity } : item
      );
      return recalcTotals(updatedItems);
    }
    case 'CLEAR_CART':
      // Clear localStorage when clearing cart
      try {
        localStorage.removeItem('stripe-checkout-cart');
      } catch (error) {
        console.error('Error clearing cart from localStorage:', error);
      }
      return {
        ...state,
        id: crypto.randomUUID(), // Generate new cart ID
        line_items: [],
        order_subtotal: 0,
        order_tax_total: 0,
        order_shipping_total: 0,
        order_shipping_tax_total: 0,
        order_grand_total: 0,
        payment_intent: null,
        shipping_method_id: null,
        shipping_method_name: null,
        shipping_address: null,
      };
    case 'UPDATE_SHIPPING_ADDRESS': {
      // Update the shipping_address field
      return {
        ...state,
        shipping_address: action.shipping_address,
      };
    }
    default:
      return state;
  }
}

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  isLoaded: boolean;
} | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCart);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('stripe-checkout-cart');
      if (savedCart && savedCart.trim() !== '') {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_FROM_STORAGE', cart: parsedCart });
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      // If there's an error, clear the corrupted data
      localStorage.removeItem('stripe-checkout-cart');
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem('stripe-checkout-cart', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [state]);

  return (
    <CartContext.Provider value={{ state, dispatch, isLoaded }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
