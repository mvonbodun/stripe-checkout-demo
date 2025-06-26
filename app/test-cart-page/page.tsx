import { useCart } from '../cart-context';

export default function TestCartPage() {
  const { state: cart, dispatch } = useCart();

  const addMacBook = () => {
    const cartItem = {
      id: crypto.randomUUID(),
      item_id: "13_512gb_space_gray",
      product_id: "13",
      name: "Apple MacBook Pro 14-inch",
      price: 1999.00,
      sku: "MBA14-SG-512",
      quantity: 1,
      image: "https://via.placeholder.com/100x100?text=MacBook",
      attributes: ["Space Gray", "512GB"],
      selectedSpecifications: [
        { name: "Color", value: "Space Gray", displayName: "Space Gray" },
        { name: "Storage", value: "512GB", displayName: "512 GB SSD" }
      ],
      line_subtotal: 1999.00,
      line_shipping_total: 0,
      line_tax_total: 0,
      line_shipping_tax_total: 0,
      line_grand_total: 1999.00,
      taxcode: "txcd_99999999"
    };
    
    dispatch({ type: 'ADD_ITEM', item: cartItem });
  };

  const addiPhone = () => {
    const cartItem = {
      id: crypto.randomUUID(),
      item_id: "14_128gb_natural",
      product_id: "14",
      name: "iPhone 15 Pro",
      price: 999.00,
      sku: "IP15P-NT-128",
      quantity: 1,
      image: "https://via.placeholder.com/100x100?text=iPhone",
      attributes: ["Natural Titanium", "128GB"],
      selectedSpecifications: [
        { name: "Color", value: "Natural Titanium", displayName: "Natural Titanium" },
        { name: "Storage", value: "128GB", displayName: "128GB" }
      ],
      line_subtotal: 999.00,
      line_shipping_total: 0,
      line_tax_total: 0,
      line_shipping_tax_total: 0,
      line_grand_total: 999.00,
      taxcode: "txcd_99999999"
    };
    
    dispatch({ type: 'ADD_ITEM', item: cartItem });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Test Cart for Checkout</h1>
      <p>Use these buttons to add test items and then visit the checkout page.</p>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={addMacBook}
          style={{ 
            backgroundColor: '#007cba', 
            color: 'white', 
            border: 'none', 
            padding: '10px 20px', 
            margin: '5px', 
            borderRadius: '5px', 
            cursor: 'pointer' 
          }}
        >
          Add MacBook Pro ($1,999)
        </button>
        
        <button 
          onClick={addiPhone}
          style={{ 
            backgroundColor: '#007cba', 
            color: 'white', 
            border: 'none', 
            padding: '10px 20px', 
            margin: '5px', 
            borderRadius: '5px', 
            cursor: 'pointer' 
          }}
        >
          Add iPhone 15 Pro ($999)
        </button>
        
        <button 
          onClick={clearCart}
          style={{ 
            backgroundColor: '#dc3545', 
            color: 'white', 
            border: 'none', 
            padding: '10px 20px', 
            margin: '5px', 
            borderRadius: '5px', 
            cursor: 'pointer' 
          }}
        >
          Clear Cart
        </button>
        
        <a 
          href="/checkout"
          style={{ 
            backgroundColor: '#28a745', 
            color: 'white', 
            textDecoration: 'none',
            padding: '10px 20px', 
            margin: '5px', 
            borderRadius: '5px', 
            display: 'inline-block'
          }}
        >
          Go to Checkout
        </a>
      </div>

      <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '5px' }}>
        <h3>Current Cart Status:</h3>
        <p>Items: {cart.line_items.length}</p>
        <p>Subtotal: ${cart.order_subtotal.toFixed(2)}</p>
        <p>Total: ${cart.order_grand_total.toFixed(2)}</p>
        
        {cart.line_items.length > 0 && (
          <div>
            <h4>Items in cart:</h4>
            <ul>
              {cart.line_items.map((item, index) => (
                <li key={index}>
                  {item.name} - ${item.price.toFixed(2)} x {item.quantity}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
