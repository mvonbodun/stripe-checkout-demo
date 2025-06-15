import React from 'react';
import Image from 'next/image';
import { Product } from '../models/product';
import { formatPrice } from '../models/common';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  // Get the primary image or use a placeholder
  const primaryImage = product.images && product.images.length > 0 
    ? product.images.find(img => img.order === 1) || product.images[0]
    : null;

  // Format pricing display
  const hasComparePrice = product.compareAtPrice && product.compareAtPrice > product.basePrice;
  const discountPercentage = hasComparePrice 
    ? Math.round(((product.compareAtPrice! - product.basePrice) / product.compareAtPrice!) * 100)
    : 0;

  return (
    <div className="border rounded-lg p-4 flex flex-col items-center hover:shadow-lg transition-shadow duration-200">
      {/* Product Image */}
      <div className="relative mb-3 w-full h-32 flex items-center justify-center">
        {primaryImage ? (
          <Image 
            src={primaryImage.url} 
            alt={primaryImage.altText || product.name} 
            className="rounded object-cover" 
            width={120} 
            height={120}
            priority={false}
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          />
        ) : (
          <div className="w-32 h-32 bg-gray-200 rounded flex items-center justify-center">
            <span className="text-gray-400 text-sm">No Image</span>
          </div>
        )}
        
        {/* Discount Badge */}
        {hasComparePrice && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            -{discountPercentage}%
          </div>
        )}
      </div>

      {/* Brand */}
      {product.brand && (
        <div className="text-sm text-gray-500 mb-1">{product.brand}</div>
      )}

      {/* Product Name */}
      <div className="font-bold text-lg mb-2 text-center line-clamp-2">{product.name}</div>

      {/* Short Description */}
      {product.shortDescription && (
        <div className="text-sm text-gray-600 mb-2 text-center line-clamp-2">
          {product.shortDescription}
        </div>
      )}

      {/* Key Features */}
      {product.features && product.features.length > 0 && (
        <div className="text-xs text-gray-500 mb-2 text-center">
          {product.features.slice(0, 2).join(' • ')}
        </div>
      )}

      {/* Pricing */}
      <div className="mb-3 text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="font-bold text-lg text-primary">
            {formatPrice(product.basePrice)}
          </span>
          {hasComparePrice && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.compareAtPrice!)}
            </span>
          )}
        </div>
        
        {/* Price Range for products with variants */}
        {product.priceRange && product.priceRange.min !== product.priceRange.max && (
          <div className="text-xs text-gray-500 mt-1">
            Starting at {formatPrice(product.priceRange.min)}
          </div>
        )}
      </div>

      {/* Stock Status */}
      <div className="mb-3">
        {product.inStock !== false ? (
          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
            In Stock
          </span>
        ) : (
          <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
            Out of Stock
          </span>
        )}
      </div>

      {/* Add to Cart Button */}
      <button
        className={`btn w-full ${
          product.inStock !== false 
            ? 'btn-primary' 
            : 'btn-disabled cursor-not-allowed'
        }`}
        onClick={() => onAddToCart(product)}
        disabled={product.inStock === false}
      >
        {product.inStock !== false ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  );
};

export default ProductCard;
