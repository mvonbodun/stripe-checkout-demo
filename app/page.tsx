
'use client';

import { useCart } from './cart-context';
import ProductCard from './components/ProductCard';

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
  const { dispatch } = useCart();

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PRODUCTS.map(product => (
            <ProductCard 
              key={product.product_id}
              product={product}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
