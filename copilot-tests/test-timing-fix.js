// Test script to verify payment intent timing fix
// This script monitors console logs and API calls to ensure proper timing

console.log("=== Payment Intent Timing Fix Test ===");

// Monitor fetch calls to track API timing
const originalFetch = window.fetch;
const apiCalls = [];

window.fetch = async (...args) => {
  const [url, options] = args;
  const timestamp = new Date().toISOString();
  
  if (url.includes('/api/')) {
    console.log(`🔄 API Call Start: ${url} at ${timestamp}`);
    apiCalls.push({ url, timestamp, type: 'start' });
  }
  
  const response = await originalFetch(...args);
  
  if (url.includes('/api/')) {
    const endTimestamp = new Date().toISOString();
    console.log(`✅ API Call Complete: ${url} at ${endTimestamp}`);
    apiCalls.push({ url, timestamp: endTimestamp, type: 'complete' });
    
    // Log specific timing for tax and payment intent calls
    if (url.includes('calculate-tax')) {
      console.log("🧮 Tax calculation completed");
    }
    if (url.includes('update-payment-intent')) {
      console.log("💳 Payment intent updated");
    }
  }
  
  return response;
};

// Monitor console logs for our timing messages
const originalLog = console.log;
console.log = (...args) => {
  const message = args.join(' ');
  
  if (message.includes('tax calculation in progress')) {
    console.warn("🚫 Payment intent update BLOCKED - tax calculation in progress");
  }
  if (message.includes('Updated payment intent with new total')) {
    console.warn("✅ Payment intent updated with correct total");
  }
  
  return originalLog(...args);
};

// Function to test the timing fix
window.testTimingFix = () => {
  console.log("\n=== Starting Timing Fix Test ===");
  console.log("1. Add items to cart");
  console.log("2. Go to checkout");
  console.log("3. Enter shipping address");
  console.log("4. Change shipping method");
  console.log("5. Watch console for timing coordination");
  console.log("\nExpected behavior:");
  console.log("- Tax calculation should complete BEFORE payment intent update");
  console.log("- Payment intent should include shipping tax");
  console.log("- No race conditions should occur");
};

// Log API call timeline
window.showApiTimeline = () => {
  console.log("\n=== API Call Timeline ===");
  apiCalls.forEach((call, index) => {
    const icon = call.type === 'start' ? '🔄' : '✅';
    console.log(`${index + 1}. ${icon} ${call.url} - ${call.timestamp}`);
  });
};

// Auto-run test info
window.testTimingFix();

console.log("🔧 Timing fix test utilities loaded. Use testTimingFix() and showApiTimeline() to test.");
