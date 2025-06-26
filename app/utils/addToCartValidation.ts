/**
 * Add To Cart Validation Utility
 * 
 * Determines when the Add To Cart button should be enabled based on:
 * - Product has only one item (no attributes) → always enabled
 * - Product has attribute selectors → enabled only when valid combination selected
 * - Product has no items or invalid state → disabled
 */

import { Product } from '../models/product';
import { Item, findItemBySpecificationValues } from '../models/item';
import { getAttributesForProduct } from './attributeHelpers';

export interface AddToCartValidationResult {
  /** Whether the Add To Cart button should be enabled */
  isEnabled: boolean;
  /** The specific item that matches current selections (if any) */
  selectedItem: Item | null;
  /** Reason for disabled state (for debugging/UX) */
  disabledReason?: string;
}

/**
 * Validates the current state and determines if Add To Cart should be enabled
 * 
 * @param product The product being displayed
 * @param items Available items for this product
 * @param selectedOptions Current attribute selections from AttributeSelector
 * @returns Validation result with enabled state and selected item
 */
export function validateAddToCartState(
  product: Product,
  items: Item[],
  selectedOptions: Record<string, string>
): AddToCartValidationResult {
  // Edge case: No items available
  if (!items || items.length === 0) {
    return {
      isEnabled: false,
      selectedItem: null,
      disabledReason: 'No items available for this product'
    };
  }

  // Case 1: Product has only one item (no attribute selection needed)
  if (items.length === 1) {
    return {
      isEnabled: true,
      selectedItem: items[0],
      disabledReason: undefined
    };
  }

  // Case 2: Product has multiple items - need valid attribute selection
  const allAttributes = getAttributesForProduct(product, items);
  const attributeNames = Object.keys(allAttributes);

  // No attributes means something is wrong with the data structure
  if (attributeNames.length === 0) {
    return {
      isEnabled: false,
      selectedItem: null,
      disabledReason: 'Product has multiple items but no attributes defined'
    };
  }

  // Check if all required attributes are selected
  const missingAttributes = attributeNames.filter(attrName => !selectedOptions[attrName]);
  
  if (missingAttributes.length > 0) {
    return {
      isEnabled: false,
      selectedItem: null,
      disabledReason: `Missing selection for: ${missingAttributes.join(', ')}`
    };
  }

  // All attributes selected - check if combination is valid
  const selectedItem = findItemBySpecificationValues(product.id, selectedOptions);

  if (selectedItem) {
    return {
      isEnabled: true,
      selectedItem,
      disabledReason: undefined
    };
  } else {
    return {
      isEnabled: false,
      selectedItem: null,
      disabledReason: 'Selected combination does not match any available item'
    };
  }
}

/**
 * Helper function to check if a product requires attribute selection
 * 
 * @param items Available items for the product
 * @returns True if user needs to make attribute selections
 */
export function requiresAttributeSelection(items: Item[]): boolean {
  return items && items.length > 1;
}

/**
 * Helper function to get missing attribute names for UX messaging
 * 
 * @param product The product being displayed
 * @param items Available items for this product
 * @param selectedOptions Current attribute selections
 * @returns Array of attribute names that still need selection
 */
export function getMissingAttributes(
  product: Product,
  items: Item[],
  selectedOptions: Record<string, string>
): string[] {
  if (!requiresAttributeSelection(items)) {
    return [];
  }

  const allAttributes = getAttributesForProduct(product, items);
  const attributeNames = Object.keys(allAttributes);

  return attributeNames.filter(attrName => !selectedOptions[attrName]);
}
