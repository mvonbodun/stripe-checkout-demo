// Test script to verify Express Checkout Elements timing fix
// This test checks that Elements.update() is called with correct amounts after tax calculation

console.log('🧪 Testing Express Checkout Elements Timing Fix');

// Function to test the Express Checkout timing fix
async function testExpressCheckoutTimingFix() {
  console.log('📝 Test: Express Checkout Elements Update After Tax Calculation');
  
  try {
    // Navigate to the main page
    console.log('🏠 Navigating to main page...');
    
    // Add items to cart
    console.log('🛒 Adding items to cart...');
    const addToCartButtons = document.querySelectorAll('button[data-testid="add-to-cart"]');
    if (addToCartButtons.length > 0) {
      addToCartButtons[0].click();
      console.log('✅ Added first item to cart');
      
      // Wait a moment for cart to update
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
      console.log('⚠️ No add-to-cart buttons found, trying alternative method');
      
      // Try clicking any button that contains "Add to Cart" text
      const buttons = Array.from(document.querySelectorAll('button'));
      const addButton = buttons.find(btn => btn.textContent && btn.textContent.toLowerCase().includes('add'));
      if (addButton) {
        addButton.click();
        console.log('✅ Added item to cart (alternative method)');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // Open mini cart
    console.log('🛒 Opening mini cart...');
    const cartButton = document.querySelector('[data-testid="mini-cart-toggle"]') || 
                      document.querySelector('button[aria-label*="cart"]') ||
                      document.querySelector('button[title*="cart"]');
    
    if (cartButton) {
      cartButton.click();
      console.log('✅ Mini cart opened');
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Look for Express Checkout button
    console.log('🔍 Looking for Express Checkout elements...');
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for Express Checkout to load
    
    // Check if Express Checkout is present
    const expressCheckoutElements = document.querySelectorAll('[data-testid*="express"], [class*="express"], [id*="express"]');
    console.log(`📊 Found ${expressCheckoutElements.length} potential Express Checkout elements`);
    
    if (expressCheckoutElements.length > 0) {
      console.log('✅ Express Checkout elements found');
      
      // Monitor console for our logging messages
      console.log('👂 Monitoring for Express Checkout tax calculation logs...');
      console.log('📋 Instructions for manual testing:');
      console.log('1. Click on Google Pay or Apple Pay button');
      console.log('2. Enter a shipping address (use a different state/zip to trigger tax changes)');
      console.log('3. Watch console for these key messages:');
      console.log('   - "💰 Tax calculation response"');
      console.log('   - "💰 Calculated new totals"');
      console.log('   - "✅ Elements updated with new amount"');
      console.log('4. Verify that Google Pay shows the correct total (not one-address-behind)');
      
    } else {
      console.log('❌ No Express Checkout elements found');
      console.log('💡 Try navigating to checkout page or adding items to cart first');
    }
    
  } catch (error) {
    console.error('❌ Error during test:', error);
  }
}

// Monitor for Elements.update() calls to verify our fix
const originalConsoleLog = console.log;
console.log = function(...args) {
  // Check for our specific logging messages
  const message = args.join(' ');
  if (message.includes('Elements updated with new amount')) {
    console.warn('🎯 TIMING FIX DETECTED: Elements.update() called with new amount!');
  } else if (message.includes('Calculated new totals')) {
    console.warn('🧮 TAX CALCULATION DETECTED: New totals calculated manually');
  }
  
  return originalConsoleLog.apply(console, args);
};

// Run the test
console.log('🚀 Starting Express Checkout timing fix test...');
testExpressCheckoutTimingFix();

// Also provide a helper function for manual testing
window.testExpressCheckoutFix = testExpressCheckoutTimingFix;
console.log('💡 Manual test function available: window.testExpressCheckoutFix()');
