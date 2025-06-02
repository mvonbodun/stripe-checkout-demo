
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from './cart-context';

const PRODUCTS = [
  {
    product_id: 1,
    name: 'T-Shirt',
    price: 25.0,
    image: 'https://placehold.co/120x120',
    attributes: ['Large', 'Red'],
    taxcode: 'txcd_99999999',
  },
  {
    product_id: 2,
    name: 'Sneakers',
    price: 60.0,
    image: 'https://placehold.co/120x120',
    attributes: ['Size 10'],
    taxcode: 'txcd_99999999',
  },
];

export default function Home() {
  const { state: cart, dispatch } = useCart();

  const itemCount = cart.line_items.reduce((sum: number, item: typeof cart.line_items[number]) => sum + item.quantity, 0);

  const addToCart = (product: typeof PRODUCTS[0]) => {
    dispatch({
      type: 'ADD_ITEM',
      item: { 
        ...product,
        id: '', // Will be generated in reducer
        quantity: 1,
        line_subtotal: 0, // Will be calculated in reducer
        line_shipping_total: 0,
        line_tax_total: 0,
        line_shipping_tax_total: 0,
        line_grand_total: 0 // Will be calculated in reducer
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <main>
        <h1 className="text-3xl font-bold mb-6">Stripe Checkout Demo</h1>
        <div className="mb-4 flex gap-4">
          <Link href="/checkout" className="btn btn-primary">Go to Checkout</Link>
          <span className="text-gray-700">Cart: {itemCount} item{itemCount !== 1 ? 's' : ''}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PRODUCTS.map(product => (
            <div key={product.product_id} className="border rounded p-4 flex flex-col items-center">
              <Image src={product.image} alt={product.name} className="mb-2 rounded" width={120} height={120} />
              <div className="font-bold text-lg mb-1">{product.name}</div>
              <div className="mb-2 text-gray-600">${product.price.toFixed(2)}</div>
              <button
                className="btn btn-secondary"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
