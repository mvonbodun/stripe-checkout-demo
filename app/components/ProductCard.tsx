import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
    <div className="border rounded-lg p-4 flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
      {/* Product Image - Enlarged */}
      <Link href={`/p/${product.slug}`} className="block">
        <div className="relative mb-4 w-full h-48 flex items-center justify-center flex-shrink-0 hover:opacity-80 transition-opacity duration-200">
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
      </Link>

      {/* Product Name */}
      <Link href={`/p/${product.slug}`} className="block">
        <div className="font-bold text-lg mb-2 text-center line-clamp-2 flex-shrink-0 hover:text-blue-600 transition-colors duration-200">{product.name}</div>
      </Link>

      {/* Short Description - This can grow and wrap */}
      <div className="flex-grow flex flex-col justify-between">
        {product.shortDescription && (
          <div className="text-sm text-gray-600 mb-4 text-center">
            {product.shortDescription}
          </div>
        )}
        
        {/* Bottom section with price and button - anchored to bottom */}
        <div className="mt-auto">
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
      </div>
    </div>
  );
};

export default ProductCard;
