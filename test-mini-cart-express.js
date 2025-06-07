/**
 * Test script to verify MiniCart Express Checkout order data storage
 * This script can be run in the browser console to test the fix.
 */

// Test function to verify the ExpressCheckout component has access to cart data
function testMiniCartExpressAccess() {
  console.log('🧪 Testing MiniCart Express Checkout Order Data Access');
  
  // Check if we're on a page with the MiniCart
  const cartIcon = document.querySelector('[aria-label*="cart" i], [data-testid="cart-icon"], .cart-icon, button[title*="cart" i]');
  if (!cartIcon) {
    console.log('❌ Cart icon not found. Please navigate to a page with a cart icon.');
    return false;
  }
  
  console.log('✅ Cart icon found');
  
  // Add some test items to cart first
  const addToCartButtons = document.querySelectorAll('button[data-testid="add-to-cart"], button[aria-label*="add to cart" i], .add-to-cart');
  if (addToCartButtons.length === 0) {
    console.log('❌ No "Add to Cart" buttons found. Please navigate to the home page with products.');
    return false;
  }
  
  console.log('✅ Add to cart buttons found');
  console.log('📝 Test steps:');
  console.log('1. Add items to cart by clicking "Add to Cart" buttons');
  console.log('2. Open the mini cart by clicking the cart icon');
  console.log('3. Use the Express Checkout (Apple Pay/Google Pay) if available');
  console.log('4. Verify that the order appears correctly on the order-confirmation page');
  
  return true;
}

// Function to check localStorage for order data
function checkOrderData() {
  console.log('🔍 Checking localStorage for completed order data...');
  
  const orderData = localStorage.getItem('completed-order');
  if (!orderData) {
    console.log('❌ No completed order data found in localStorage');
    return null;
  }
  
  try {
    const order = JSON.parse(orderData);
    console.log('✅ Order data found in localStorage:');
    console.log('📦 Order ID:', order.id);
    console.log('💰 Total:', order.total);
    console.log('📧 Email:', order.email);
    console.log('🛒 Items count:', order.items?.length || 0);
    console.log('🔖 Express Payment Type:', order.expressPaymentType);
    
    return order;
  } catch (error) {
    console.log('❌ Error parsing order data:', error);
    return null;
  }
}

// Function to clear test data
function clearOrderData() {
  localStorage.removeItem('completed-order');
  console.log('🧹 Cleared completed order data from localStorage');
}

// Expose functions globally for easy testing
window.testMiniCartExpress = {
  testAccess: testMiniCartExpressAccess,
  checkOrder: checkOrderData,
  clearOrder: clearOrderData
};

console.log('🚀 MiniCart Express Checkout test utilities loaded!');
console.log('📋 Available functions:');
console.log('• window.testMiniCartExpress.testAccess() - Check if mini cart express checkout is accessible');
console.log('• window.testMiniCartExpress.checkOrder() - Check localStorage for order data');
console.log('• window.testMiniCartExpress.clearOrder() - Clear order data from localStorage');
