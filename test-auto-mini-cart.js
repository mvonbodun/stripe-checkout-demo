// Test script to verify mini cart auto-open functionality
// Run this in the browser console to test the feature

console.log('🧪 Testing Mini Cart Auto-Open Functionality');

// Function to simulate adding an item to cart
function testAddToCart() {
  console.log('1. Looking for "Add to Cart" buttons...');
  
  // Look for buttons with "Add to Cart" text (case-insensitive)
  const buttons = Array.from(document.querySelectorAll('button')).filter(btn => 
    btn.textContent && btn.textContent.toLowerCase().includes('add to cart')
  );
  
  if (buttons.length === 0) {
    console.log('❌ No "Add to Cart" buttons found.');
    console.log('   Available buttons on page:');
    document.querySelectorAll('button').forEach((btn, i) => {
      console.log(`   ${i + 1}. "${btn.textContent?.trim()}" - classes: ${btn.className}`);
    });
    return;
  }
  
  console.log(`✅ Found ${buttons.length} "Add to Cart" button(s)`);
  const addToCartButton = buttons[0]; // Use the first one
  
  console.log('2. Checking initial mini cart state...');
  
  // Check if mini cart is initially visible
  // The mini cart is rendered conditionally based on the `open` prop
  const miniCartOverlay = document.querySelector('div[class*="fixed"][class*="inset-0"][class*="z-50"]');
  const isInitiallyVisible = miniCartOverlay !== null;
  console.log(`   Mini cart initially ${isInitiallyVisible ? 'visible' : 'hidden'}`);
  
  console.log('3. Clicking "Add to Cart" button...');
  addToCartButton.click();
  
  // Wait for React state update and check if mini cart opens
  setTimeout(() => {
    console.log('4. Checking if mini cart opened automatically...');
    
    const miniCartOverlayAfter = document.querySelector('div[class*="fixed"][class*="inset-0"][class*="z-50"]');
    const isNowVisible = miniCartOverlayAfter !== null;
    
    if (!isInitiallyVisible && isNowVisible) {
      console.log('✅ SUCCESS: Mini cart opened automatically after adding item!');
      
      // Check if cart content is visible
      const cartItems = document.querySelectorAll('div[class*="border-b-2"][class*="border-gray-200"]');
      console.log(`   📦 Cart now contains ${cartItems.length} item(s)`);
      
      // Check for cart total
      const subtotalElement = document.querySelector('span:contains("Subtotal")');
      if (subtotalElement) {
        const subtotalParent = subtotalElement.parentElement;
        const priceElement = subtotalParent?.querySelector('span:last-child');
        console.log(`   💰 Cart subtotal: ${priceElement?.textContent || 'Not found'}`);
      }
      
    } else if (isInitiallyVisible && isNowVisible) {
      console.log('ℹ️  Mini cart was already open');
    } else {
      console.log('❌ FAILED: Mini cart did not open automatically');
      console.log('   Expected: Mini cart to appear after clicking "Add to Cart"');
    }
  }, 500);
}

// Function to test responsive behavior  
function testResponsiveBehavior() {
  console.log('📱 Testing responsive behavior...');
  
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  
  console.log(`   Current viewport: ${viewport.width}x${viewport.height}`);
  
  if (viewport.width < 768) {
    console.log('   📱 Mobile viewport detected');
  } else {
    console.log('   💻 Desktop viewport detected');
  }
  
  // Check if mini cart styles are responsive
  const miniCart = document.querySelector('aside[role="dialog"]');
  if (miniCart) {
    const styles = window.getComputedStyle(miniCart);
    console.log(`   Mini cart width: ${styles.width}`);
    console.log(`   Mini cart max-width: ${styles.maxWidth}`);
  }
}

// Function to test multiple adds
function testMultipleAdds() {
  console.log('🔄 Testing multiple item additions...');
  
  const buttons = Array.from(document.querySelectorAll('button')).filter(btn => 
    btn.textContent && btn.textContent.toLowerCase().includes('add to cart')
  );
  
  if (buttons.length < 2) {
    console.log('ℹ️  Not enough "Add to Cart" buttons for multiple add test');
    return;
  }
  
  let addCount = 0;
  const maxAdds = Math.min(3, buttons.length);
  
  const addNextItem = () => {
    if (addCount < maxAdds) {
      console.log(`   Adding item ${addCount + 1}/${maxAdds}...`);
      buttons[addCount].click();
      addCount++;
      
      setTimeout(() => {
        const cartItems = document.querySelectorAll('div[class*="border-b-2"][class*="border-gray-200"]');
        console.log(`   Cart now has ${cartItems.length} different product(s)`);
        
        if (addCount < maxAdds) {
          setTimeout(addNextItem, 1000); // Wait 1 second between adds
        } else {
          console.log('✅ Multiple add test completed');
        }
      }, 500);
    }
  };
  
  addNextItem();
}

// Function to check cart context
function checkCartContext() {
  console.log('🔍 Checking implementation details...');
  
  // Check if React DevTools are available
  if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    console.log('✅ React DevTools detected - you can inspect CartProvider context');
  } else {
    console.log('ℹ️  React DevTools not found - install for detailed context inspection');
  }
  
  // Check for cart icon badge update
  const cartBadge = document.querySelector('span[class*="absolute"][class*="-top-2"][class*="-right-2"]');
  if (cartBadge) {
    console.log(`   🏷️  Cart badge shows: ${cartBadge.textContent}`);
  } else {
    console.log('   ❓ Cart badge not found or no items in cart');
  }
}

// Main test function
function runFullTest() {
  console.log('🚀 Starting comprehensive mini cart auto-open test...');
  console.log('================================================');
  
  // Test 1: Basic functionality
  testAddToCart();
  
  // Test 2: Responsive behavior  
  setTimeout(() => {
    testResponsiveBehavior();
  }, 1000);
  
  // Test 3: Context and implementation
  setTimeout(() => {
    checkCartContext();
  }, 1500);
  
  // Test 4: Multiple additions (if user wants it)
  setTimeout(() => {
    console.log('');
    console.log('🔄 To test multiple item additions, run: testMultipleAdds()');
  }, 2000);
}

// Helper function to close mini cart
function closeMiniCart() {
  const closeButton = document.querySelector('button[aria-label="Close mini cart"]');
  if (closeButton) {
    closeButton.click();
    console.log('🔐 Mini cart closed');
  } else {
    console.log('❌ Close button not found');
  }
}

// Export functions for manual testing
window.testMiniCart = {
  runFullTest,
  testAddToCart,
  testResponsiveBehavior,
  testMultipleAdds,
  checkCartContext,
  closeMiniCart
};

// Run the test automatically
console.log('📝 Test Functions Available:');
console.log('   testMiniCart.runFullTest() - Run all tests');
console.log('   testMiniCart.testAddToCart() - Test basic add functionality');
console.log('   testMiniCart.testMultipleAdds() - Test adding multiple items');
console.log('   testMiniCart.closeMiniCart() - Close the mini cart');
console.log('');

// Auto-run in 2 seconds
setTimeout(runFullTest, 2000);
