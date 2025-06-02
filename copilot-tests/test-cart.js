// Simple test script to populate cart in localStorage for testing
const testCart = {
  id: "test-cart-" + Date.now(),
  order_subtotal: 25.0,
  order_tax_total: 0,
  order_shipping_total: 0,
  order_grand_total: 25.0,
  line_items: [
    {
      id: "item-1",
      product_id: 1,
      name: "T-Shirt",
      attributes: ["Large", "Red"],
      image: "https://placehold.co/120x120",
      price: 25.0,
      quantity: 1,
      taxcode: "txcd_99999999",
      line_subtotal: 25.0,
      line_shipping_total: 0,
      line_tax_total: 0,
      line_grand_total: 25.0
    }
  ],
  payment_intent: null,
  shipping_method_id: null,
  shipping_method_name: null
};

console.log("Setting test cart:", testCart);
localStorage.setItem('stripe-checkout-cart', JSON.stringify(testCart));
console.log("Test cart set successfully");
