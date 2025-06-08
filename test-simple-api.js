const fetch = require('node-fetch');

async function testBasicConnection() {
    console.log('🔍 Testing basic connection to server...');
    
    try {
        const response = await fetch('http://localhost:3001');
        console.log(`✅ Server responded with status: ${response.status}`);
        return true;
    } catch (error) {
        console.error('❌ Failed to connect to server:', error.message);
        return false;
    }
}

async function testTaxAPI() {
    console.log('🧪 Testing tax calculation API...');
    
    const testPayload = {
        shipping_address: {
            line1: '123 Test Street',
            city: 'San Francisco',
            state: 'CA',
            postal_code: '94102',
            country: 'US'
        },
        cart: [
            {
                id: 'test-1',
                name: 'Test Product',
                price: 29.99,
                quantity: 1,
                taxcode: 'txcd_99999999'
            }
        ],
        shipping_cost: 5.99
    };
    
    try {
        console.log('📤 Sending request to /api/calculate-tax...');
        const response = await fetch('http://localhost:3001/api/calculate-tax', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testPayload)
        });
        
        console.log(`📥 Response status: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API error response:', errorText);
            return false;
        }
        
        const result = await response.json();
        console.log('✅ API call successful!');
        console.log('💰 Tax calculation result:', JSON.stringify(result, null, 2));
        return true;
        
    } catch (error) {
        console.error('❌ API call failed:', error.message);
        return false;
    }
}

async function main() {
    console.log('🚀 Starting Express Checkout API Fix Test\n');
    
    const connected = await testBasicConnection();
    if (!connected) {
        console.log('❌ Cannot connect to server. Make sure it\'s running on http://localhost:3001');
        process.exit(1);
    }
    
    const taxTestPassed = await testTaxAPI();
    
    if (taxTestPassed) {
        console.log('\n🎉 Tax API test passed! The Express Checkout fix should be working.');
    } else {
        console.log('\n⚠️ Tax API test failed. There may still be issues.');
    }
    
    process.exit(taxTestPassed ? 0 : 1);
}

main().catch(error => {
    console.error('❌ Test script error:', error);
    process.exit(1);
});
