#!/usr/bin/env node

/**
 * Test Express Checkout Address Validation Fix
 * 
 * This test simulates different address scenarios that could come from
 * Express Checkout and verifies that our validation prevents 400 errors.
 */

console.log('🧪 Testing Express Checkout Address Validation Fix\n');

// Test scenarios that could come from Express Checkout
const testScenarios = [
  {
    name: 'Valid Complete Address',
    address: {
      line1: '123 Main Street',
      line2: 'Apt 456',
      city: 'San Francisco',
      state: 'CA',
      postal_code: '94102',
      country: 'US'
    },
    expectedResult: 'pass'
  },
  {
    name: 'Missing line1 (should be rejected)',
    address: {
      city: 'San Francisco',
      state: 'CA',
      postal_code: '94102',
      country: 'US'
    },
    expectedResult: 'reject'
  },
  {
    name: 'Empty line1 (should be rejected)',
    address: {
      line1: '',
      city: 'San Francisco',
      state: 'CA',
      postal_code: '94102',
      country: 'US'
    },
    expectedResult: 'reject'
  },
  {
    name: 'Missing country (should be rejected)',
    address: {
      line1: '123 Main Street',
      city: 'San Francisco',
      state: 'CA',
      postal_code: '94102'
    },
    expectedResult: 'reject'
  },
  {
    name: 'US address missing postal_code (should be rejected)',
    address: {
      line1: '123 Main Street',
      city: 'San Francisco',
      state: 'CA',
      country: 'US'
    },
    expectedResult: 'reject'
  },
  {
    name: 'Non-US address without postal_code (should pass)',
    address: {
      line1: '123 Main Street',
      city: 'Toronto',
      state: 'ON',
      country: 'CA'
    },
    expectedResult: 'pass'
  }
];

function validateAddress(address) {
  // Simulate the validation logic from our Express Checkout component
  
  if (!address) {
    return { valid: false, reason: 'No address provided' };
  }
  
  const missingFields = [];
  if (!address.line1) missingFields.push('line1');
  if (!address.country) missingFields.push('country');
  
  // For US addresses, postal code is required
  if (address.country === 'US' && !address.postal_code) {
    missingFields.push('postal_code');
  }
  
  if (missingFields.length > 0) {
    return { 
      valid: false, 
      reason: `Missing required fields: ${missingFields.join(', ')}` 
    };
  }
  
  return { valid: true, reason: 'Address is valid' };
}

console.log('Running address validation tests...\n');

let passed = 0;
let failed = 0;

testScenarios.forEach((scenario, index) => {
  const result = validateAddress(scenario.address);
  const shouldPass = scenario.expectedResult === 'pass';
  const actuallyPassed = result.valid;
  
  const testPassed = (shouldPass && actuallyPassed) || (!shouldPass && !actuallyPassed);
  
  if (testPassed) {
    console.log(`✅ Test ${index + 1}: ${scenario.name}`);
    console.log(`   Expected: ${scenario.expectedResult}, Got: ${result.valid ? 'pass' : 'reject'}`);
    console.log(`   Reason: ${result.reason}\n`);
    passed++;
  } else {
    console.log(`❌ Test ${index + 1}: ${scenario.name}`);
    console.log(`   Expected: ${scenario.expectedResult}, Got: ${result.valid ? 'pass' : 'reject'}`);
    console.log(`   Reason: ${result.reason}\n`);
    failed++;
  }
});

console.log(`📊 Test Results: ${passed} passed, ${failed} failed out of ${testScenarios.length} total tests`);

if (failed === 0) {
  console.log('🎉 All tests passed! The address validation fix should prevent 400 errors.');
} else {
  console.log('⚠️ Some tests failed. The validation logic may need adjustment.');
}

console.log('\n🔍 How to test in the browser:');
console.log('1. Go to http://localhost:3001/checkout');
console.log('2. Try Express Checkout with various address scenarios');
console.log('3. Check the browser console for validation messages');
console.log('4. Incomplete addresses should be rejected before reaching the tax API');

process.exit(failed === 0 ? 0 : 1);
