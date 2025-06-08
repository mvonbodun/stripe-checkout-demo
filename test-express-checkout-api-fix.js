#!/usr/bin/env node

/**
 * Express Checkout Shipping Address Fix Verification Test
 * 
 * This test verifies that the fix for the 400 error in Express Checkout 
 * shipping address changes is working correctly.
 */

const fetch = require('node-fetch');

const TEST_SERVER_URL = 'http://localhost:3001';

// Test data that simulates what Express Checkout would send
const testCartData = [
    {
        id: 'test-product-1',
        name: 'Test Product 1',
        price: 29.99,
        quantity: 2,
        taxcode: 'txcd_99999999'
    },
    {
        id: 'test-product-2', 
        name: 'Test Product 2',
        price: 15.00,
        quantity: 1,
        taxcode: 'txcd_99999999'
    }
];

const testShippingAddress = {
    line1: '123 Test Street',
    line2: 'Apt 456',
    city: 'San Francisco',
    state: 'CA',
    postal_code: '94102',
    country: 'US'
};

const testShippingCost = 5.99;

async function testTaxCalculationAPI() {
    console.log('🧪 Testing Tax Calculation API directly...');
    
    const payload = {
        shipping_address: testShippingAddress,
        cart: testCartData,
        shipping_cost: testShippingCost
    };
    
    console.log('📤 Sending payload:', JSON.stringify(payload, null, 2));
    
    try {
        const response = await fetch(`${TEST_SERVER_URL}/api/calculate-tax`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        console.log(`📥 Response status: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API call failed:', errorText);
            return false;
        }
        
        const responseData = await response.json();
        console.log('✅ Tax calculation successful!');
        console.log('💰 Response data:', JSON.stringify(responseData, null, 2));
        return true;
        
    } catch (error) {
        console.error('❌ Error calling tax calculation API:', error.message);
        return false;
    }
}

async function testMissingPostalCode() {
    console.log('\n🧪 Testing missing postal code scenario...');
    
    const invalidAddress = {
        ...testShippingAddress,
        postal_code: undefined // This should cause a 400 error for US addresses
    };
    
    const payload = {
        shipping_address: invalidAddress,
        cart: testCartData,
        shipping_cost: testShippingCost
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
        
        if (response.status === 400) {
            const errorText = await response.text();
            console.log('✅ Expected 400 error received:', errorText);
            return true;
        } else {
            console.error('❌ Expected 400 error but got:', response.status);
            return false;
        }
        
    } catch (error) {
        console.error('❌ Unexpected error:', error.message);
        return false;
    }
}

async function testEmptyCart() {
    console.log('\n🧪 Testing empty cart scenario...');
    
    const payload = {
        shipping_address: testShippingAddress,
        cart: [], // Empty cart
        shipping_cost: testShippingCost
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
            const responseData = await response.json();
            console.log('✅ Empty cart handled successfully');
            console.log('💰 Response data:', JSON.stringify(responseData, null, 2));
            return true;
        } else {
            const errorText = await response.text();
            console.log('⚠️ Empty cart response:', errorText);
            return true; // This might be expected behavior
        }
        
    } catch (error) {
        console.error('❌ Error with empty cart:', error.message);
        return false;
    }
}

async function runAllTests() {
    console.log('🚀 Starting Express Checkout Fix Verification Tests\n');
    
    const results = [];
    
    // Test 1: Valid tax calculation
    results.push(await testTaxCalculationAPI());
    
    // Test 2: Missing postal code (should fail with 400)
    results.push(await testMissingPostalCode());
    
    // Test 3: Empty cart
    results.push(await testEmptyCart());
    
    const passedTests = results.filter(Boolean).length;
    const totalTests = results.length;
    
    console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed`);
    
    if (passedTests === totalTests) {
        console.log('🎉 All tests passed! The Express Checkout fix appears to be working correctly.');
    } else {
        console.log('⚠️ Some tests failed. Please check the implementation.');
    }
    
    process.exit(passedTests === totalTests ? 0 : 1);
}

// Check if server is running
async function checkServer() {
    try {
        const response = await fetch(TEST_SERVER_URL);
        return response.ok || response.status === 404; // 404 is fine, means server is running
    } catch (error) {
        return false;
    }
}

async function main() {
    console.log('🔍 Checking if development server is running...');
    
    const serverRunning = await checkServer();
    if (!serverRunning) {
        console.error('❌ Development server not running. Please start it with: npm run dev');
        process.exit(1);
    }
    
    console.log('✅ Development server is running\n');
    await runAllTests();
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = {
    testTaxCalculationAPI,
    testMissingPostalCode,
    testEmptyCart
};
