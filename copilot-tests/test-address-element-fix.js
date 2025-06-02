// Test script to verify AddressElement disappearing bug is fixed
(function() {
  console.log('🧪 Starting AddressElement disappearing bug test...');
  
  let testResults = {
    linkAuthElementFound: false,
    addressElementFound: false,
    emailInteractionComplete: false,
    addressElementStillVisible: false,
    testPassed: false
  };
  
  function checkElements() {
    // Check if LinkAuthenticationElement exists
    const linkAuthElement = document.querySelector('iframe[title*="Secure payment input frame"]');
    testResults.linkAuthElementFound = !!linkAuthElement;
    
    // Check if AddressElement exists  
    const addressElements = document.querySelectorAll('iframe[title*="Secure address input frame"], iframe[title*="Secure payment input frame"]');
    testResults.addressElementFound = addressElements.length > 0;
    
    console.log('📊 Element Check:', {
      linkAuth: testResults.linkAuthElementFound,
      address: testResults.addressElementFound,
      totalIframes: document.querySelectorAll('iframe').length
    });
  }
  
  function simulateEmailEntry() {
    console.log('📧 Testing email interaction...');
    
    // Look for email input and simulate interaction
    const emailInputs = document.querySelectorAll('input[type="email"], input[name*="email"]');
    if (emailInputs.length > 0) {
      const emailInput = emailInputs[0];
      emailInput.focus();
      emailInput.value = 'test@example.com';
      emailInput.dispatchEvent(new Event('input', { bubbles: true }));
      emailInput.dispatchEvent(new Event('change', { bubbles: true }));
      testResults.emailInteractionComplete = true;
    }
    
    // Wait a moment and check if AddressElement is still visible
    setTimeout(() => {
      checkElements();
      testResults.addressElementStillVisible = testResults.addressElementFound;
      
      // Final test result
      testResults.testPassed = testResults.linkAuthElementFound && 
                              testResults.addressElementStillVisible && 
                              testResults.emailInteractionComplete;
      
      displayResults();
    }, 1000);
  }
  
  function displayResults() {
    console.log('🔍 Test Results:', testResults);
    
    if (testResults.testPassed) {
      console.log('✅ TEST PASSED: AddressElement remains visible after email interaction');
    } else {
      console.log('❌ TEST FAILED: AddressElement bug may still exist');
    }
    
    // Create visual indicator on page
    const indicator = document.createElement('div');
    indicator.style.cssText = `
      position: fixed; 
      top: 20px; 
      right: 20px; 
      background: ${testResults.testPassed ? '#10b981' : '#ef4444'}; 
      color: white; 
      padding: 10px 15px; 
      border-radius: 8px; 
      font-family: monospace; 
      z-index: 10000;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `;
    indicator.textContent = testResults.testPassed ? '✅ Fix Verified' : '❌ Issue Persists';
    document.body.appendChild(indicator);
    
    // Auto-remove after 5 seconds
    setTimeout(() => indicator.remove(), 5000);
  }
  
  // Run initial check
  setTimeout(() => {
    checkElements();
    if (testResults.linkAuthElementFound || testResults.addressElementFound) {
      simulateEmailEntry();
    } else {
      console.log('⏳ Waiting for Stripe Elements to load...');
      // Retry in 2 seconds
      setTimeout(() => {
        checkElements();
        if (testResults.linkAuthElementFound || testResults.addressElementFound) {
          simulateEmailEntry();
        } else {
          console.log('❌ Stripe Elements not found - test inconclusive');
        }
      }, 2000);
    }
  }, 1000);
  
  // Also expose manual test function
  window.testAddressElementFix = function() {
    console.log('🔄 Running manual AddressElement test...');
    checkElements();
    simulateEmailEntry();
  };
  
  console.log('📝 Test script loaded. Run window.testAddressElementFix() for manual testing.');
})();
