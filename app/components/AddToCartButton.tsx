'use client';
import { useCart } from '../cart-context';
import { useMiniCartUI } from '../mini-cart-ui-context';
import { Product } from '../models/product';

interface AddToCartButtonProps {
  product: Product;
  quantity: number;
  selectedOptions?: Record<string, string>;
  className?: string;
  disabled?: boolean;
}

export default function AddToCartButton({ 
  product, 
  quantity, 
  selectedOptions = {},
  className = "",
  disabled = false
}: AddToCartButtonProps) {
  const { dispatch } = useCart();
  const { openMiniCart } = useMiniCartUI();

  const handleAddToCart = () => {
    if (disabled) return;
    
    // Create placeholder image for cart item (consistent with category page)
    const placeholderImage = `https://placehold.co/100x100/e5e7eb/6b7280?text=${encodeURIComponent(product.name.split(' ').slice(0, 2).join(' '))}`;
    
    // Convert selected options to attributes array
    const attributes = Object.entries(selectedOptions).map(([key, value]) => `${key}: ${value}`);
    
    // Create cart item
    const cartItem = {
      id: crypto.randomUUID(), // Generate unique ID for cart item
      product_id: product.id,
      name: product.name,
      price: product.basePrice,
      quantity: quantity,
      image: placeholderImage,
      attributes: attributes,
      line_subtotal: product.basePrice * quantity,
      line_shipping_total: 0,
      line_tax_total: 0,
      line_shipping_tax_total: 0,
      line_grand_total: 0, // Will be calculated in reducer
    };
    
    dispatch({ type: 'ADD_ITEM', item: cartItem });
    openMiniCart();
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={disabled}
      className={`w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium ${className}`}
    >
      Add to Cart
    </button>
  );
}
