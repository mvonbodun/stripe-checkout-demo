import React from 'react';
import Image from 'next/image';
import { Product } from '../models/product';
import { formatPrice } from '../models/common';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  // Use placeholder image since the mock data has non-existent image paths
  const placeholderImage = `https://placehold.co/200x200/e5e7eb/6b7280?text=${encodeURIComponent(product.name.split(' ').slice(0, 2).join(' '))}`;

  return (
    <div className="border rounded-lg p-4 flex flex-col items-center hover:shadow-lg transition-shadow duration-200">
      {/* Product Image - Enlarged */}
      <div className="relative mb-4 w-full h-48 flex items-center justify-center">
        <Image 
          src={placeholderImage}
          alt={product.name} 
          className="rounded object-cover" 
          width={200} 
          height={200}
          priority={false}
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        />
      </div>

      {/* Product Name */}
      <div className="font-bold text-lg mb-2 text-center line-clamp-2">{product.name}</div>

      {/* Short Description */}
      {product.shortDescription && (
        <div className="text-sm text-gray-600 mb-4 text-center line-clamp-2">
          {product.shortDescription}
        </div>
      )}

      {/* Pricing */}
      <div className="mb-4 text-center">
        <span className="font-bold text-lg text-primary">
          {formatPrice(product.basePrice)}
        </span>
      </div>

      {/* Add to Cart Button */}
      <button
        className="btn btn-primary w-full"
        onClick={() => onAddToCart(product)}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
