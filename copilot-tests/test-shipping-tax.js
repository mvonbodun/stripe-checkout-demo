// Test script to verify shipping tax implementation
// This can be run in the browser console to test the functionality

console.log('🧪 Starting Shipping Tax Implementation Test');

// Test the distribution algorithm directly
function testShippingTaxDistribution() {
    console.log('\n📊 Testing Shipping Tax Distribution Algorithm');
    
    // Simulate line items
    const lineItems = [
        { product_id: 1, price: 25.00, quantity: 2 }, // $50 subtotal
        { product_id: 2, price: 15.00, quantity: 1 }  // $15 subtotal
    ];
    
    const orderSubtotal = lineItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingTaxAmount = 5.20; // $5.20 shipping tax from Stripe
    
    console.log(`Order subtotal: $${orderSubtotal}`);
    console.log(`Shipping tax to distribute: $${shippingTaxAmount}`);
    
    // Apply distribution algorithm
    lineItems.forEach((item, index) => {
        const lineSubtotal = item.price * item.quantity;
        const proportion = lineSubtotal / orderSubtotal;
        const lineShippingTax = Math.round(proportion * shippingTaxAmount * 100) / 100;
        
        console.log(`Item ${index + 1}: $${lineSubtotal} (${(proportion * 100).toFixed(1)}%) → Shipping tax: $${lineShippingTax}`);
    });
    
    console.log('✅ Distribution algorithm test complete');
}

// Test API integration
async function testAPIIntegration() {
    console.log('\n🌐 Testing API Integration');
    
    const testPayload = {
        shipping_address: {
            line1: '67 Heritage Hill Circle',
            city: 'Spring',
            state: 'TX',
            postal_code: '77381',
            country: 'US'
        },
        cart: [
            {
                id: 'test-item-1',
                name: 'Premium T-Shirt',
                price: 29.99,
                quantity: 2,
                taxcode: 'txcd_99999999'
            },
            {
                id: 'test-item-2',
                name: 'Coffee Mug',
                price: 15.99,
                quantity: 1,
                taxcode: 'txcd_99999999'
            }
        ],
        shipping_cost: 12.99
    };

    try {
        console.log('📤 Sending tax calculation request...');
        const response = await fetch('/api/calculate-tax', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testPayload)
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        }

        const data = await response.json();
        
        console.log('📥 Tax calculation response received:');
        console.log(`- Calculation ID: ${data.calculation.id}`);
        console.log(`- Total tax (exclusive): $${(data.tax_amount / 100).toFixed(2)}`);
        
        if (data.calculation.shipping_cost) {
            console.log(`- Shipping cost: $${(data.calculation.shipping_cost.amount / 100).toFixed(2)}`);
            console.log(`- Shipping tax: $${(data.calculation.shipping_cost.amount_tax / 100).toFixed(2)}`);
        }
        
        console.log('- Line items:');
        data.calculation.line_items.data.forEach((item, index) => {
            console.log(`  Item ${index + 1} (${item.reference}): $${(item.amount / 100).toFixed(2)} + $${(item.amount_tax / 100).toFixed(2)} tax`);
        });
        
        console.log('✅ API integration test successful');
        return data;
        
    } catch (error) {
        console.error('❌ API integration test failed:', error);
        return null;
    }
}

// Test cart context integration (requires being run in app context)
function testCartContextIntegration() {
    console.log('\n🛒 Testing Cart Context Integration');
    
    // This would need to be run in the actual app context
    console.log('ℹ️  To test cart context:');
    console.log('1. Add items to cart on the home page');
    console.log('2. Go to checkout');
    console.log('3. Enter shipping address');
    console.log('4. Select shipping method');
    console.log('5. Verify shipping tax appears in order summary');
    console.log('6. Check browser dev tools for console logs');
}

// Main test runner
async function runAllTests() {
    console.log('🚀 Running Comprehensive Shipping Tax Tests\n');
    
    testShippingTaxDistribution();
    await testAPIIntegration();
    testCartContextIntegration();
    
    console.log('\n🎉 All tests completed!');
    console.log('\nNext steps:');
    console.log('1. Test the full checkout flow in the browser');
    console.log('2. Verify shipping tax displays correctly');
    console.log('3. Test with different shipping methods');
    console.log('4. Verify payment processing includes shipping tax');
}

// Auto-run if this script is executed
if (typeof window !== 'undefined') {
    runAllTests();
} else {
    module.exports = {
        testShippingTaxDistribution,
        testAPIIntegration,
        testCartContextIntegration,
        runAllTests
    };
}
