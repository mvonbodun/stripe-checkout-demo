// Script to add test items to cart for testing checkout
function addTestItemsToCart() {
  const testItems = [
    {
      product_id: 1,
      name: "Test Product 1",
      price: 29.99,
      quantity: 1,
      image: "/next.svg",
      attributes: ["Size: M", "Color: Blue"],
      taxcode: "txcd_99999999"
    },
    {
      product_id: 2,
      name: "Test Product 2", 
      price: 49.99,
      quantity: 2,
      image: "/vercel.svg",
      attributes: ["Size: L"],
      taxcode: "txcd_99999999"
    }
  ];

  // Dispatch events to add items to cart
  testItems.forEach(item => {
    window.dispatchEvent(new CustomEvent('addToCart', { detail: item }));
  });
  
  console.log('✅ Added test items to cart');
}

// Auto-run when script loads
addTestItemsToCart();
