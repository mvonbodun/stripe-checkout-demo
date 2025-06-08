#!/usr/bin/env node

/**
 * Test Express Checkout Privacy Fix
 * 
 * This test verifies that the tax calculation API now correctly handles
 * both anonymized addresses (without line1) and complete addresses.
 */

const fetch = require('node-fetch');

const TEST_SERVER_URL = 'http://localhost:3002';

const testCartData = [
    {
        id: 'test-product-1',
        name: 'Test Product 1',
        price: 29.99,
        quantity: 1,
        taxcode: 'txcd_99999999'
    }
];

// Test 1: Anonymized address (no line1) - should work now
const anonymizedAddress = {
    city: 'San Francisco',
    state: 'CA',
    postal_code: '94102',
    country: 'US'
    // Note: line1 is intentionally missing (anonymized by Stripe)
};

// Test 2: Complete address - should still work
const completeAddress = {
    line1: '123 Test Street',
    city: 'San Francisco',
    state: 'CA',
    postal_code: '94102',
    country: 'US'
};

async function testTaxCalculation(testName, address) {
    console.log(`\n🧪 ${testName}`);
    console.log('📍 Address:', JSON.stringify(address, null, 2));
    
    const payload = {
        shipping_address: address,
        cart: testCartData,
        shipping_cost: 5.99
    };
    
    try {
        const response = await fetch(`${TEST_SERVER_URL}/api/calculate-tax`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        console.log(`📥 Response status: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Tax calculation successful');
            console.log(`💰 Tax amount: $${(data.tax_amount / 100).toFixed(2)}`);
            return { success: true, data };
        } else {
            const errorText = await response.text();
            console.log('❌ Tax calculation failed:', errorText);
            return { success: false, error: errorText };
        }
    } catch (error) {
        console.log('❌ Request failed:', error.message);
        return { success: false, error: error.message };
    }
}

async function runTests() {
    console.log('🚀 Testing Express Checkout Privacy Fix');
    console.log('==========================================');
    
    const test1 = await testTaxCalculation(
        'Test 1: Anonymized Address (no line1)',
        anonymizedAddress
    );
    
    const test2 = await testTaxCalculation(
        'Test 2: Complete Address (with line1)',
        completeAddress
    );
    
    console.log('\n📊 Test Results Summary:');
    console.log('========================');
    console.log(`Anonymized Address: ${test1.success ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Complete Address: ${test2.success ? '✅ PASS' : '❌ FAIL'}`);
    
    if (test1.success && test2.success) {
        console.log('\n🎉 All tests passed! Express Checkout privacy fix is working correctly.');
    } else {
        console.log('\n⚠️ Some tests failed. Check the implementation.');
    }
}

runTests();
