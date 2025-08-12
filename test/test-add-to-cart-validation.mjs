/**
 * Test script to verify Add To Cart button validation is working correctly
 * Tests the core validation logic for different scenarios
 */

import { validateAddToCartState, requiresAttributeSelection, getMissingAttributes } from '../app/utils/addToCartValidation.ts';

// Mock data for testing
const mockProduct = {
  id: 'apple-macbook-pro-14-inch',
  name: 'Apple MacBook Pro 14"',
  basePrice: 1999.00
};

// Mock items representing different product configurations
const mockItems = [
  {
    id: 'macbook-pro-14-space-gray-512gb',
    productId: 'apple-macbook-pro-14-inch',
    name: 'MacBook Pro 14" Space Gray 512GB',
    price: 1999.00,
    sku: 'MBP14-SG-512',
    inventoryQuantity: 10,
    itemDefiningSpecificationValues: [
      { specificationName: 'Color', value: 'Space Gray' },
      { specificationName: 'Storage', value: '512GB' }
    ]
  },
  {
    id: 'macbook-pro-14-space-gray-1tb',
    productId: 'apple-macbook-pro-14-inch',
    name: 'MacBook Pro 14" Space Gray 1TB',
    price: 2299.00,
    sku: 'MBP14-SG-1TB',
    inventoryQuantity: 5,
    itemDefiningSpecificationValues: [
      { specificationName: 'Color', value: 'Space Gray' },
      { specificationName: 'Storage', value: '1TB' }
    ]
  },
  {
    id: 'macbook-pro-14-silver-512gb',
    productId: 'apple-macbook-pro-14-inch',
    name: 'MacBook Pro 14" Silver 512GB',
    price: 1999.00,
    sku: 'MBP14-SL-512',
    inventoryQuantity: 3,
    itemDefiningSpecificationValues: [
      { specificationName: 'Color', value: 'Silver' },
      { specificationName: 'Storage', value: '512GB' }
    ]
  }
];

// Single item product for testing
const singleItem = [{
  id: 'simple-product-item',
  productId: 'simple-product',
  name: 'Simple Product',
  price: 99.99,
  sku: 'SP-001',
  inventoryQuantity: 20,
  itemDefiningSpecificationValues: []
}];

console.log('🧪 Testing Add To Cart Validation Logic\n');

// Test 1: Product with no items
console.log('Test 1: Product with no items');
const test1 = validateAddToCartState(mockProduct, [], {});
console.log('Result:', {
  isEnabled: test1.isEnabled,
  selectedItem: test1.selectedItem?.name || null,
  reason: test1.disabledReason
});
console.log('Expected: disabled, no item, reason: "No items available"\n');

// Test 2: Product with single item (no attributes needed)
console.log('Test 2: Product with single item (no attributes)');
const test2 = validateAddToCartState(mockProduct, singleItem, {});
console.log('Result:', {
  isEnabled: test2.isEnabled,
  selectedItem: test2.selectedItem?.name || null,
  reason: test2.disabledReason
});
console.log('Expected: enabled, simple product item selected\n');

// Test 3: Multi-item product with no selections
console.log('Test 3: Multi-item product with no attribute selections');
const test3 = validateAddToCartState(mockProduct, mockItems, {});
console.log('Result:', {
  isEnabled: test3.isEnabled,
  selectedItem: test3.selectedItem?.name || null,
  reason: test3.disabledReason
});
console.log('Expected: disabled, no item, reason: "Missing selection for: Color, Storage"\n');

// Test 4: Multi-item product with partial selection
console.log('Test 4: Multi-item product with partial attribute selection');
const test4 = validateAddToCartState(mockProduct, mockItems, { Color: 'Space Gray' });
console.log('Result:', {
  isEnabled: test4.isEnabled,
  selectedItem: test4.selectedItem?.name || null,
  reason: test4.disabledReason
});
console.log('Expected: disabled, no item, reason: "Missing selection for: Storage"\n');

// Test 5: Multi-item product with valid complete selection
console.log('Test 5: Multi-item product with valid complete selection');
const test5 = validateAddToCartState(mockProduct, mockItems, { Color: 'Space Gray', Storage: '512GB' });
console.log('Result:', {
  isEnabled: test5.isEnabled,
  selectedItem: test5.selectedItem?.name || null,
  reason: test5.disabledReason
});
console.log('Expected: enabled, "MacBook Pro 14" Space Gray 512GB" selected\n');

// Test 6: Multi-item product with invalid combination
console.log('Test 6: Multi-item product with invalid attribute combination');
const test6 = validateAddToCartState(mockProduct, mockItems, { Color: 'Silver', Storage: '1TB' });
console.log('Result:', {
  isEnabled: test6.isEnabled,
  selectedItem: test6.selectedItem?.name || null,
  reason: test6.disabledReason
});
console.log('Expected: disabled, no item, reason: "Selected combination does not match any available item"\n');

// Test helper functions
console.log('Testing helper functions:');
console.log('requiresAttributeSelection(singleItem):', requiresAttributeSelection(singleItem));
console.log('requiresAttributeSelection(mockItems):', requiresAttributeSelection(mockItems));
console.log('getMissingAttributes with partial selection:', getMissingAttributes(mockProduct, mockItems, { Color: 'Space Gray' }));
console.log('getMissingAttributes with complete selection:', getMissingAttributes(mockProduct, mockItems, { Color: 'Space Gray', Storage: '512GB' }));

console.log('\n✅ Add To Cart Validation Test Complete');
