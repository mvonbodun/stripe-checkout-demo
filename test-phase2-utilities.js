// Test script for Phase 2 utility functions
// This validates that all the new data access layer functions work correctly

const { mockProducts, searchProducts, filterProducts, filterProductsAdvanced, getProductSpecificationValues, getProductDetails, getProductWithDefaultItem } = require('./app/models/product');
const { mockItems, getItemsByProduct, getAvailableSpecificationValues, findItemBySpecificationValues, getDefaultItem, validateSpecificationValues, getItemsBySpecificationName } = require('./app/models/item');

console.log('🧪 Testing Phase 2 Utility Functions...\n');

// Test 1: Basic product and item data
console.log('✅ Test 1: Basic Data Access');
console.log(`- Total products: ${mockProducts.length}`);
console.log(`- Total items: ${mockItems.length}`);
console.log(`- First product: ${mockProducts[0].name}`);
console.log(`- First item: ${mockItems[0].name}\n`);

// Test 2: Item utility functions
console.log('✅ Test 2: Item Utility Functions');

// Test getItemsByProduct
const iphone15ProItems = getItemsByProduct('prod_3');
console.log(`- iPhone 15 Pro items: ${iphone15ProItems.length}`);

// Test getAvailableSpecificationValues
const storageOptions = getAvailableSpecificationValues('prod_3', 'Storage');
console.log(`- iPhone 15 Pro storage options: ${storageOptions.join(', ')}`);

const colorOptions = getAvailableSpecificationValues('prod_3', 'Color');
console.log(`- iPhone 15 Pro color options: ${colorOptions.join(', ')}`);

// Test findItemBySpecificationValues
const specificItem = findItemBySpecificationValues('prod_3', { 'Storage': '256GB', 'Color': 'Natural Titanium' });
console.log(`- Found specific item: ${specificItem ? specificItem.name : 'Not found'}`);

// Test getDefaultItem
const defaultItem = getDefaultItem('prod_3');
console.log(`- Default item: ${defaultItem ? defaultItem.name : 'Not found'}`);

// Test validateSpecificationValues
const validSpecs = validateSpecificationValues('prod_3', { 'Storage': '128GB', 'Color': 'Blue Titanium' });
const invalidSpecs = validateSpecificationValues('prod_3', { 'Storage': '1TB', 'Color': 'Pink' });
console.log(`- Valid spec combination: ${validSpecs}`);
console.log(`- Invalid spec combination: ${invalidSpecs}\n`);

// Test 3: Product utility functions
console.log('✅ Test 3: Product Utility Functions');

// Test searchProducts
const searchResults = searchProducts('Samsung');
console.log(`- Search results for 'Samsung': ${searchResults.length} products`);

// Test filterProducts
const electronicsProducts = filterProducts({ categoryId: '1' });
console.log(`- Electronics products: ${electronicsProducts.length}`);

// Test filterProductsAdvanced
const advancedResults = filterProductsAdvanced({ 
  categoryId: '1',
  specificationFilters: { 'Display Technology': ['OLED'] }
});
console.log(`- Advanced filter (Electronics + OLED): ${advancedResults.length} products`);

// Test getProductSpecificationValues
const displayTechValues = getProductSpecificationValues('Display Technology');
console.log(`- Display technology values: ${displayTechValues.join(', ')}\n`);

// Test 4: Async functions
console.log('✅ Test 4: Async Functions');

// Test getProductWithDefaultItem
getProductWithDefaultItem('prod_3').then(result => {
  console.log(`- Product with default item: ${result.product ? result.product.name : 'Not found'}`);
  console.log(`- Has variants: ${result.hasVariants}`);
  console.log(`- Default item: ${result.defaultItem ? result.defaultItem.name : 'Not found'}`);
}).catch(err => {
  console.error('Error testing getProductWithDefaultItem:', err);
});

// Test getProductDetails
getProductDetails('prod_3').then(result => {
  if (result) {
    console.log(`- Product details: ${result.product.name}`);
    console.log(`- Items count: ${result.items.length}`);
    console.log(`- Available specs: ${Object.keys(result.availableSpecificationValues).join(', ')}`);
    console.log(`- Has variants: ${result.hasVariants}`);
  } else {
    console.log('- Product details: Not found');
  }
}).catch(err => {
  console.error('Error testing getProductDetails:', err);
});

console.log('\n🎉 Phase 2 utility function tests completed!');
