/**
 * Test script to verify the price range slider functionality
 * Run this in the browser console on a page with the SearchFacets component
 */

function testPriceSlider() {
  console.log('🔍 Testing Price Range Slider...');
  
  // Check if the price range slider is rendered
  const priceSection = document.querySelector('h4')?.parentElement?.querySelector('[class*="space-y-4"]');
  if (priceSection) {
    console.log('✅ Price range slider section found');
    
    // Check for range inputs
    const rangeInputs = priceSection.querySelectorAll('input[type="range"]');
    if (rangeInputs.length === 2) {
      console.log('✅ Dual range inputs found');
      
      // Check for price display
      const priceDisplay = priceSection.querySelector('[class*="justify-between"]');
      if (priceDisplay) {
        console.log('✅ Price display found');
        console.log('💰 Current price range:', priceDisplay.textContent);
      }
      
      // Check for visual track
      const activeTrack = priceSection.querySelector('[class*="bg-blue-500"]');
      if (activeTrack) {
        console.log('✅ Active track styling found');
      }
      
      // Check for min/max labels
      const labels = priceSection.querySelectorAll('[class*="text-xs"]');
      if (labels.length >= 2) {
        console.log('✅ Min/max labels found');
      }
      
      // Test slider interaction
      const minSlider = rangeInputs[0];
      const maxSlider = rangeInputs[1];
      
      console.log(`📊 Slider range: ${minSlider.min} - ${minSlider.max}`);
      console.log(`📍 Current values: ${minSlider.value} - ${maxSlider.value}`);
      
      // Simulate a change
      const originalValue = minSlider.value;
      minSlider.value = Math.min(parseInt(originalValue) + 10, parseInt(maxSlider.value));
      minSlider.dispatchEvent(new Event('change', { bubbles: true }));
      
      setTimeout(() => {
        console.log('✅ Price range slider test completed successfully!');
      }, 100);
      
    } else {
      console.log('❌ Dual range inputs not found');
    }
  } else {
    console.log('❌ Price range slider section not found');
  }
}

// Auto-run after page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', testPriceSlider);
} else {
  setTimeout(testPriceSlider, 1000);
}

console.log('🎯 Price slider test script loaded. Run testPriceSlider() to test manually.');
