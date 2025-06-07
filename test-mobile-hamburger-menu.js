/**
 * Test script to verify Mobile Hamburger Menu functionality
 * This script can be run in the browser console to test the mobile menu implementation.
 */

// Test function to verify mobile hamburger menu
function testMobileHamburgerMenu() {
  console.log('🧪 Testing Mobile Hamburger Menu');
  
  // Check if we can find the hamburger menu button
  const hamburgerMenus = document.querySelectorAll('[data-testid="hamburger-menu"], [aria-label*="menu" i], button.hamburger, .hamburger-menu, button[title*="menu" i]');
  
  if (hamburgerMenus.length === 0) {
    console.log('❌ Hamburger menu button not found. Looking for mobile menu indicators...');
    
    // Look for mobile-specific classes
    const mobileElements = document.querySelectorAll('.md\\:hidden, .lg\\:hidden, .block.md\\:hidden');
    console.log(`📱 Found ${mobileElements.length} mobile-specific elements`);
    
    // Check if we're on mobile view
    const isMobileView = window.innerWidth <= 768;
    console.log(`📱 Current viewport width: ${window.innerWidth}px, Mobile view: ${isMobileView}`);
    
    if (!isMobileView) {
      console.log('💡 Try resizing your browser to mobile width (< 768px) to see the hamburger menu');
    }
    
    return false;
  }
  
  console.log(`✅ Found ${hamburgerMenus.length} hamburger menu button(s)`);
  
  // Test clicking the first hamburger menu
  const hamburgerMenu = hamburgerMenus[0];
  console.log('🖱️ Attempting to click hamburger menu...');
  
  try {
    hamburgerMenu.click();
    console.log('✅ Hamburger menu clicked successfully');
    
    // Wait a bit and check if mobile menu modal appeared
    setTimeout(() => {
      const mobileMenuModal = document.querySelector('[role="dialog"][aria-labelledby*="mobile-menu"]');
      const modalOverlays = document.querySelectorAll('.fixed.inset-0, [data-testid="mobile-menu-modal"]');
      
      if (mobileMenuModal || modalOverlays.length > 0) {
        console.log('✅ Mobile menu modal appeared successfully!');
        console.log('📋 Checking modal content...');
        
        // Check for expected menu items
        const menuItems = [
          'My Account',
          'Get Help', 
          'Track Your Order',
          'Categories'
        ];
        
        menuItems.forEach(item => {
          const found = document.querySelector(`*:contains("${item}")`);
          if (found || document.body.textContent?.includes(item)) {
            console.log(`✅ Found "${item}" in mobile menu`);
          } else {
            console.log(`❌ Missing "${item}" in mobile menu`);
          }
        });
        
        console.log('🧪 Test completed! Mobile hamburger menu is working.');
        console.log('💡 Try clicking "Get Help" or "Track Your Order" to test navigation.');
        
      } else {
        console.log('❌ Mobile menu modal did not appear after clicking hamburger menu');
        console.log('🔍 Checking for any visible modals...');
        
        const anyModals = document.querySelectorAll('[role="dialog"], .modal, .overlay');
        console.log(`Found ${anyModals.length} modal elements on page`);
      }
    }, 500);
    
    return true;
    
  } catch (error) {
    console.error('❌ Error clicking hamburger menu:', error);
    return false;
  }
}

// Test function to verify navigation functionality
function testMobileMenuNavigation() {
  console.log('🧪 Testing Mobile Menu Navigation');
  
  // Check if mobile menu is open
  const mobileMenuModal = document.querySelector('[role="dialog"][aria-labelledby*="mobile-menu"]');
  if (!mobileMenuModal) {
    console.log('❌ Mobile menu is not open. Please open it first by calling testMobileHamburgerMenu()');
    return false;
  }
  
  console.log('✅ Mobile menu is open');
  
  // Test Help button
  const helpButton = document.querySelector('button:contains("Get Help"), [href="/help"]');
  if (helpButton) {
    console.log('✅ Found "Get Help" button');
  } else {
    console.log('❌ "Get Help" button not found');
  }
  
  // Test Track Order button
  const trackOrderButton = document.querySelector('button:contains("Track Your Order"), [href="/track-order"]');
  if (trackOrderButton) {
    console.log('✅ Found "Track Your Order" button');
  } else {
    console.log('❌ "Track Your Order" button not found');
  }
  
  return true;
}

// Function to simulate mobile viewport for testing
function simulateMobileViewport() {
  console.log('📱 Simulating mobile viewport...');
  
  // Add viewport meta tag if not present
  let viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) {
    viewport = document.createElement('meta');
    viewport.name = 'viewport';
    viewport.content = 'width=device-width, initial-scale=1';
    document.head.appendChild(viewport);
  }
  
  // Set mobile-like dimensions using CSS
  document.body.style.width = '375px';
  document.body.style.margin = '0 auto';
  
  console.log('📱 Mobile viewport simulation applied');
  console.log('🔄 Try running testMobileHamburgerMenu() again');
}

// Expose functions globally for easy testing
window.testMobileMenu = {
  testHamburger: testMobileHamburgerMenu,
  testNavigation: testMobileMenuNavigation,
  simulateMobile: simulateMobileViewport
};

console.log('🚀 Mobile Hamburger Menu test utilities loaded!');
console.log('📋 Available functions:');
console.log('• window.testMobileMenu.testHamburger() - Test hamburger menu click and modal appearance');
console.log('• window.testMobileMenu.testNavigation() - Test navigation buttons in mobile menu');
console.log('• window.testMobileMenu.simulateMobile() - Simulate mobile viewport for testing');
console.log('');
console.log('💡 Tip: Resize your browser to mobile width (< 768px) or call simulateMobile() first!');
