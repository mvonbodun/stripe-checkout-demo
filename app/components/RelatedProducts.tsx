'use client';
import { Product } from '../models/product';
import { useCart } from '../cart-context';
import { useMiniCartUI } from '../mini-cart-ui-context';
import ProductCard from './ProductCard';

interface RelatedProductsProps {
  products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const { dispatch } = useCart();
  const { openMiniCart } = useMiniCartUI();

  const handleAddToCart = (product: Product) => {
    // Create placeholder image for cart item (consistent with category page)
    const placeholderImage = `https://placehold.co/100x100/e5e7eb/6b7280?text=${encodeURIComponent(product.name.split(' ').slice(0, 2).join(' '))}`;
    
    const cartItem = {
      id: crypto.randomUUID(),
      product_id: product.id,
      name: product.name,
      price: product.basePrice,
      quantity: 1,
      image: placeholderImage,
      attributes: product.features?.slice(0, 3) || [],
      line_subtotal: product.basePrice,
      line_shipping_total: 0,
      line_tax_total: 0,
      line_shipping_tax_total: 0,
      line_grand_total: 0,
    };

    dispatch({ type: 'ADD_ITEM', item: cartItem });
    openMiniCart();
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
}
