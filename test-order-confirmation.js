// Test Order Confirmation Page
// Run this in the browser console to test the order confirmation flow

console.log('🧪 Testing Order Confirmation Page');

// Create a mock completed order
const mockOrder = {
  id: 'pi_test_123456789',
  status: 'succeeded',
  amount: 4999,
  currency: 'usd',
  items: [
    {
      id: '1',
      product_id: 1,
      name: 'Test Product',
      attributes: ['Color: Blue', 'Size: Medium'],
      image: '/api/placeholder/300/300',
      price: 49.99,
      quantity: 1,
      line_subtotal: 49.99,
      line_tax_total: 4.25,
      line_shipping_total: 0,
      line_shipping_tax_total: 0,
      line_grand_total: 54.24
    }
  ],
  subtotal: 49.99,
  tax: 4.25,
  shipping: 0,
  shipping_tax: 0,
  total: 54.24,
  timestamp: new Date().toISOString(),
  email: 'test@example.com',
  address: {
    city: 'San Francisco',
    country: 'US',
    line1: '123 Test Street',
    line2: null,
    postal_code: '94102',
    state: 'CA'
  },
  expressPaymentType: null,
  shipping_method_id: null,
  shipping_method_name: null
};

// Store the mock order in localStorage
console.log('📦 Storing mock order in localStorage...');
localStorage.setItem('completed-order', JSON.stringify(mockOrder));

// Navigate to order confirmation page
console.log('🔄 Redirecting to order confirmation page...');
window.location.href = '/order-confirmation';
