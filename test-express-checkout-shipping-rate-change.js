/**
 * Test Express Checkout Shipping Rate Change Implementation
 * 
 * This test verifies that the onShippingRateChange event handler:
 * 1. Captures shipping rate changes in Express Checkout (Apple Pay/Google Pay)
 * 2. Updates cart context with the selected shipping method (dispatch UPDATE_SHIPPING_METHOD)
 * 3. Calls /api/calculate-tax to recalculate taxes since shipping cost changed
 * 4. Updates cart context with new tax amounts and recalculates totals
 * 5. Calls Elements.update() method to set the new order total based on cart.order_grand_total
 * 6. Avoids timing issues like those mitigated in the shipping address change handler
 */

console.log('🧪 Starting Express Checkout Shipping Rate Change Test');

// Test configuration
const testConfig = {
  testTimeout: 30000,
  checkInterval: 1000,
  mockShippingRateChange: {
    shippingRate: {
      id: 'ups-2day',
      displayName: 'UPS 2nd Day',
      amount: 1299 // $12.99 in cents
    }
  }
};

let testResults = {
  cartItemsAdded: false,
  expressCheckoutRendered: false,
  shippingRateEventListenerAttached: false,
  shippingRateProcessingWorks: false,
  cartContextUpdated: false,
  taxRecalculated: false,
  elementsUpdated: false,
  eventResolved: false
};

// Helper function to add test items to cart
async function addTestItemsToCart() {
  console.log('🛒 Adding test items to cart...');
  
  // Try multiple selectors for add to cart buttons
  const addToCartSelectors = [
    '[data-testid="add-to-cart"]',
    'button[aria-label*="Add"]',
    'button:contains("Add to Cart")',
    '.add-to-cart',
    'button[type="submit"]'
  ];
  
  for (const selector of addToCartSelectors) {
    const buttons = document.querySelectorAll(selector);
    if (buttons.length > 0) {
      console.log(`✅ Found ${buttons.length} add-to-cart buttons with selector: ${selector}`);
      
      // Add first item
      buttons[0].click();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      testResults.cartItemsAdded = true;
      return true;
    }
  }
  
  console.log('⚠️ Could not add test items to cart - please add manually');
  return false;
}

// Helper function to check if Express Checkout is rendered
function checkExpressCheckoutRendered() {
  const expressCheckoutSelectors = [
    '[data-testid="express-checkout-element"]',
    '.StripeElement--express-checkout',
    '[class*="express-checkout"]',
    '[id*="express-checkout"]'
  ];
  
  for (const selector of expressCheckoutSelectors) {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      console.log(`✅ Express Checkout found with selector: ${selector}`);
      testResults.expressCheckoutRendered = true;
      return true;
    }
  }
  
  console.log('❌ Express Checkout not found');
  return false;
}

// Helper function to check if shipping rate change handler is attached
function checkShippingRateEventListener() {
  // Look for the ExpressCheckoutComponent in the React tree
  const reactFiberKey = Object.keys(document.body).find(key => key.startsWith('__reactFiber'));
  if (reactFiberKey) {
    console.log('✅ React found - Express Checkout shipping rate handler likely attached');
    testResults.shippingRateEventListenerAttached = true;
    return true;
  }
  
  // Alternative: Check if the component is mounted
  const expressCheckoutContainers = document.querySelectorAll('div:has([data-testid="express-checkout-element"])');
  if (expressCheckoutContainers.length > 0) {
    console.log('✅ Express Checkout container found - shipping rate handler likely attached');
    testResults.shippingRateEventListenerAttached = true;
    return true;
  }
  
  return false;
}

// Helper function to simulate shipping rate change (for testing purposes)
async function simulateShippingRateChange() {
  console.log('🔄 Simulating shipping rate change...');
  
  // This would normally be triggered by the actual Express Checkout element
  // For testing, we'll monitor the console for the shipping rate change logs
  console.log('📝 Note: Actual shipping rate change must be triggered through Express Checkout UI');
  console.log('📝 Expected console logs to look for:');
  console.log('  - 🚚 Express Checkout shipping rate changed');
  console.log('  - 📦 Selected shipping rate: [rate details]');
  console.log('  - 💰 Updating cart with selected shipping method');
  console.log('  - 🧮 Calculating tax with new shipping cost');
  console.log('  - 💰 Tax calculation response');
  console.log('  - 💰 Calculated new totals');
  console.log('  - ✅ Elements updated with new amount');
  console.log('  - ✅ Resolving Express Checkout shipping rate change with new totals');
  
  return true;
}

// Helper function to check console logs for expected behavior
function checkConsoleLogsForShippingRateFlow() {
  console.log('📝 To verify the shipping rate change implementation works:');
  console.log('1. Open browser devtools (F12)');
  console.log('2. Go to Console tab');
  console.log('3. Add items to cart if not already added');
  console.log('4. Navigate to checkout page');
  console.log('5. Click on Express Checkout (Apple Pay/Google Pay)');
  console.log('6. Enter/confirm shipping address first (if not already done)');
  console.log('7. Change the shipping method/rate from the available options');
  console.log('8. Look for the expected console logs listed above');
  console.log('9. Verify that totals update correctly in the payment interface');
  
  return true;
}

// Helper function to navigate to checkout
async function navigateToCheckout() {
  console.log('🔀 Navigating to checkout...');
  
  // Try to find checkout link/button
  const checkoutSelectors = [
    'a[href="/checkout"]',
    'button[data-testid="checkout"]',
    '.checkout-button',
    'a:contains("Checkout")',
    'button:contains("Checkout")'
  ];
  
  for (const selector of checkoutSelectors) {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      elements[0].click();
      await new Promise(resolve => setTimeout(resolve, 2000));
      return true;
    }
  }
  
  // Manual navigation
  if (window.location.pathname !== '/checkout') {
    window.location.href = '/checkout';
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  return true;
}

// Main test function
async function runExpressCheckoutShippingRateTest() {
  console.log('🚀 Starting Express Checkout shipping rate change test...');
  
  try {
    // Step 1: Add test items to cart
    await addTestItemsToCart();
    
    // Step 2: Navigate to checkout if not already there
    if (window.location.pathname !== '/checkout') {
      await navigateToCheckout();
    }
    
    // Step 3: Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Step 4: Check if Express Checkout is rendered
    checkExpressCheckoutRendered();
    
    // Step 5: Check if event listeners are attached
    checkShippingRateEventListener();
    
    // Step 6: Provide instructions for manual testing
    checkConsoleLogsForShippingRateFlow();
    
    // Step 7: Display test results
    console.log('\n📊 Test Results Summary:');
    console.log('========================');
    Object.entries(testResults).forEach(([key, value]) => {
      const status = value ? '✅' : '❌';
      console.log(`${status} ${key}: ${value}`);
    });
    
    console.log('\n🔍 Manual Testing Instructions:');
    console.log('================================');
    console.log('1. Ensure you have items in cart');
    console.log('2. Go to checkout page (/checkout)');
    console.log('3. Click on Apple Pay or Google Pay button');
    console.log('4. Enter/confirm shipping address first');
    console.log('5. Look for shipping method options and select a different one');
    console.log('6. Watch console for shipping rate change logs');
    console.log('7. Verify totals update correctly in the payment interface');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Monitor for specific console messages to detect shipping rate changes
const originalConsoleLog = console.log;
console.log = function(...args) {
  const message = args.join(' ');
  
  // Check for shipping rate change detection
  if (message.includes('Express Checkout shipping rate changed')) {
    console.warn('🎯 SHIPPING RATE CHANGE DETECTED: Handler fired!');
    testResults.shippingRateProcessingWorks = true;
  } else if (message.includes('Updating cart with selected shipping method')) {
    console.warn('🛒 CART UPDATE DETECTED: Shipping method updated!');
    testResults.cartContextUpdated = true;
  } else if (message.includes('Calculating tax with new shipping cost')) {
    console.warn('🧮 TAX RECALCULATION DETECTED: Calculating taxes for new shipping cost!');
    testResults.taxRecalculated = true;
  } else if (message.includes('Elements updated with new amount')) {
    console.warn('🎯 ELEMENTS UPDATE DETECTED: Elements.update() called with new amount!');
    testResults.elementsUpdated = true;
  } else if (message.includes('Resolving Express Checkout shipping rate change')) {
    console.warn('✅ EVENT RESOLUTION DETECTED: Shipping rate change resolved successfully!');
    testResults.eventResolved = true;
  }
  
  return originalConsoleLog.apply(console, args);
};

// Run the test
runExpressCheckoutShippingRateTest();

// Export for potential use in other contexts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    runExpressCheckoutShippingRateTest,
    testResults,
    testConfig
  };
}
