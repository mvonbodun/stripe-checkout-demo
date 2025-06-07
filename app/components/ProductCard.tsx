import React from 'react';
import Image from 'next/image';

interface Product {
  product_id: number;
  name: string;
  price: number;
  image: string;
  attributes: string[];
  taxcode: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="border rounded p-4 flex flex-col items-center">
      <Image 
        src={product.image} 
        alt={product.name} 
        className="mb-2 rounded" 
        width={120} 
        height={120}
        priority={false} // Don't prioritize all product images
        loading="lazy" // Lazy load for better mobile performance
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      />
      <div className="font-bold text-lg mb-1">{product.name}</div>
      <div className="mb-2 text-gray-600">${product.price.toFixed(2)}</div>
      <button
        className="btn btn-secondary"
        onClick={() => onAddToCart(product)}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
