'use client';
import { useCart } from '../cart-context';
import { useMiniCartUI } from '../mini-cart-ui-context';
import { Product } from '../models/product';
import { Item } from '../models/item';

interface AddToCartButtonProps {
  product: Product;
  selectedItem?: Item | null;
  quantity: number;
  selectedOptions?: Record<string, string>;
  className?: string;
  disabled?: boolean;
}

export default function AddToCartButton({ 
  product, 
  selectedItem,
  quantity, 
  selectedOptions = {},
  className = "",
  disabled = false
}: AddToCartButtonProps) {
  const { dispatch } = useCart();
  const { openMiniCart } = useMiniCartUI();

  const handleAddToCart = () => {
    if (disabled) return;
    
    // Use the selected item's data if available, otherwise fall back to product data
    const itemToAdd = selectedItem || {
      id: `${product.id}_default`,
      name: product.name,
      price: product.basePrice,
      sku: product.id,
      images: product.images
    };
    
    // Use item's image if available, otherwise create placeholder
    const itemImage = itemToAdd.images && itemToAdd.images.length > 0 
      ? itemToAdd.images[0].url 
      : `https://placehold.co/100x100/e5e7eb/6b7280?text=${encodeURIComponent(product.name.split(' ').slice(0, 2).join(' '))}`;
    
    // Convert selected options to attributes array
    const attributes = Object.entries(selectedOptions).map(([key, value]) => `${key}: ${value}`);
    
    // Create cart item with item reference
    const cartItem = {
      id: crypto.randomUUID(), // Generate unique ID for cart item
      item_id: selectedItem?.id, // Reference to the actual item/variant
      product_id: product.id,
      name: itemToAdd.name,
      price: itemToAdd.price,
      sku: itemToAdd.sku || product.id,
      quantity: quantity,
      image: itemImage,
      attributes: attributes,
      line_subtotal: itemToAdd.price * quantity,
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
      className={`btn btn-primary w-full ${className}`}
    >
      Add to Cart
    </button>
  );
}
