// Test script to verify My Account modal functionality
// Run this in the browser console to test the feature

console.log('🧪 Testing My Account Modal Functionality');
console.log('==========================================');

// Function to test My Account modal opening
function testMyAccountModal() {
  console.log('1. Looking for My Account icon...');
  
  // Look for My Account button
  const myAccountButtons = Array.from(document.querySelectorAll('button')).filter(btn => 
    btn.getAttribute('aria-label') === 'My Account'
  );
  
  if (myAccountButtons.length === 0) {
    console.log('❌ No My Account button found.');
    console.log('   Available buttons on page:');
    document.querySelectorAll('button').forEach((btn, i) => {
      console.log(`   ${i + 1}. "${btn.textContent?.trim()}" - aria-label: ${btn.getAttribute('aria-label')} - classes: ${btn.className}`);
    });
    return;
  }
  
  console.log(`✅ Found ${myAccountButtons.length} My Account button(s)`);
  const myAccountButton = myAccountButtons[0];
  
  console.log('2. Checking initial modal state...');
  
  // Check if modal is initially visible
  const modalOverlay = document.querySelector('div[class*="fixed"][class*="inset-0"][class*="z-50"]');
  const isInitiallyVisible = modalOverlay !== null;
  console.log(`   Modal initially ${isInitiallyVisible ? 'visible' : 'hidden'}`);
  
  console.log('3. Clicking My Account button...');
  myAccountButton.click();
  
  // Wait for React state update and check if modal opens
  setTimeout(() => {
    console.log('4. Checking if modal opened...');
    
    const modalOverlayAfter = document.querySelector('div[class*="fixed"][class*="inset-0"][class*="z-50"]');
    const isNowVisible = modalOverlayAfter !== null;
    
    if (!isInitiallyVisible && isNowVisible) {
      console.log('✅ SUCCESS: My Account modal opened!');
      
      // Check modal content
      const modalTitle = document.querySelector('h2');
      if (modalTitle && modalTitle.textContent === 'My Account') {
        console.log('   ✅ Modal title found: "My Account"');
      }
      
      // Check for login form or user info
      const emailInput = document.querySelector('input[type="email"]');
      const passwordInput = document.querySelector('input[type="password"]');
      const signInButton = document.querySelector('button');
      
      if (emailInput && passwordInput) {
        console.log('   ✅ Login form detected (logged out state)');
        console.log('   📧 Email input found');
        console.log('   🔒 Password input found');
      } else {
        console.log('   ✅ User account info detected (logged in state)');
      }
      
      // Check for close button
      const closeButton = document.querySelector('button[aria-label="Close my account"]');
      if (closeButton) {
        console.log('   ✅ Close button found');
      }
      
    } else if (isInitiallyVisible && isNowVisible) {
      console.log('ℹ️  Modal was already open');
    } else {
      console.log('❌ FAILED: Modal did not open');
      console.log('   Expected: Modal to appear after clicking My Account button');
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
  
  // Check if modal styles are responsive
  const modal = document.querySelector('aside[role="dialog"]');
  if (modal) {
    const styles = window.getComputedStyle(modal);
    console.log(`   Modal width: ${styles.width}`);
    console.log(`   Modal max-width: ${styles.maxWidth}`);
  }
}

// Function to test login state toggle
function testLoginStateToggle() {
  console.log('🔄 Testing login state toggle...');
  
  const modal = document.querySelector('aside[role="dialog"]');
  if (!modal) {
    console.log('❌ Modal not open. Open modal first.');
    return;
  }
  
  // Look for sign in button (logged out state)
  const signInButton = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.textContent?.includes('Sign In')
  );
  
  if (signInButton) {
    console.log('   📝 Found Sign In button - testing login...');
    signInButton.click();
    
    setTimeout(() => {
      // Check if state changed to logged in
      const userInfo = document.querySelector('h3');
      if (userInfo && userInfo.textContent === 'John Doe') {
        console.log('   ✅ Successfully switched to logged in state');
        console.log('   👤 User info displayed: John Doe');
        
        // Test logout
        const signOutButton = Array.from(document.querySelectorAll('button')).find(btn => 
          btn.textContent?.includes('Sign Out')
        );
        
        if (signOutButton) {
          console.log('   🚪 Testing logout...');
          signOutButton.click();
          
          setTimeout(() => {
            const emailInput = document.querySelector('input[type="email"]');
            if (emailInput) {
              console.log('   ✅ Successfully switched back to logged out state');
            }
          }, 300);
        }
      }
    }, 300);
  } else {
    console.log('   👤 Already in logged in state');
  }
}

// Main test function
function runMyAccountTests() {
  console.log('🚀 Starting My Account modal tests...');
  console.log('===========================================');
  
  // Test 1: Basic functionality
  testMyAccountModal();
  
  // Test 2: Responsive behavior  
  setTimeout(() => {
    testResponsiveBehavior();
  }, 1000);
  
  // Test 3: Login state toggle (if user wants it)
  setTimeout(() => {
    console.log('');
    console.log('🔄 To test login/logout toggle, run: testLoginStateToggle()');
  }, 1500);
}

// Helper function to close modal
function closeMyAccountModal() {
  const closeButton = document.querySelector('button[aria-label="Close my account"]');
  if (closeButton) {
    closeButton.click();
    console.log('🔐 My Account modal closed');
  } else {
    console.log('❌ Close button not found');
  }
}

// Export functions for manual testing
window.testMyAccount = {
  runMyAccountTests,
  testMyAccountModal,
  testResponsiveBehavior,
  testLoginStateToggle,
  closeMyAccountModal
};

// Run the test automatically
console.log('📝 Test Functions Available:');
console.log('   testMyAccount.runMyAccountTests() - Run all tests');
console.log('   testMyAccount.testMyAccountModal() - Test modal opening');
console.log('   testMyAccount.testResponsiveBehavior() - Test responsive design');
console.log('   testMyAccount.testLoginStateToggle() - Test login/logout states');
console.log('   testMyAccount.closeMyAccountModal() - Close modal');
console.log('');
console.log('🏃‍♂️ Running automatic test...');
runMyAccountTests();
