// Manual Verification Script for Item-Level Images
// Run this in the browser console on product pages to test the logic

console.log('=== Item-Level Images Verification ===');

// Test case 1: Check if the utility functions are working
function testImageLogic() {
  const { getItemForImages, getImagesForDisplay } = require('../app/utils/attributeHelpers');
  
  console.log('Testing utility functions...');
  
  // This would need to be run in the actual application context
  // For now, we'll test manually through the UI
}

// Manual test instructions
console.log(`
Manual Test Instructions:

1. iPhone 15 Pro Test (Multiple Colors):
   - Visit: http://localhost:3001/p/iphone-15-pro
   - Initial state: Should show Natural Titanium images
   - Select "Blue Titanium" 
   - Expected: Images should switch to blue variant
   - Verify both desktop and mobile galleries

2. Samsung TV Test (No Color Variants):
   - Visit: http://localhost:3001/p/samsung-65-oled-4k-smart-tv
   - Expected: Should show first item's images

3. Sony Headphones Test (Single Item):
   - Visit: http://localhost:3001/p/sony-wh-1000xm5-headphones
   - Expected: Should show the single item's images

4. MacBook Pro Test (Color Variants):
   - Visit: http://localhost:3001/p/macbook-pro-14-m3-pro
   - Initial: Should show Space Gray images
   - Select "Silver"
   - Expected: Images should switch to silver variant

To verify programmatically, check:
- Image URLs in the gallery change when color selection changes
- Item IDs in the URL should match selected color
- No console errors during attribute selection
`);

// Helper function to verify current state
function verifyCurrentState() {
  const gallery = document.querySelector('[data-testid="product-image-gallery"]') || 
                  document.querySelector('.aspect-square img');
  const colorSelector = document.querySelector('[data-attribute="Color"]') ||
                       document.querySelector('select[aria-label*="Color"]');
  
  if (gallery && colorSelector) {
    const currentImage = gallery.src || gallery.getAttribute('src');
    const selectedColor = colorSelector.value;
    
    console.log('Current image:', currentImage);
    console.log('Selected color:', selectedColor);
    console.log('Image URL includes color reference:', 
                currentImage.toLowerCase().includes(selectedColor.toLowerCase().replace(' ', '')));
  } else {
    console.log('Gallery or color selector not found. Check selectors.');
  }
}

// Export verification function
window.verifyImageLogic = verifyCurrentState;

console.log('Run verifyImageLogic() after changing color selections to verify behavior');
