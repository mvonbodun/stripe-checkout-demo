'use client';
import { useState, useCallback } from 'react';
import { Product } from '../models/product';
import Image from 'next/image';

interface ProductImageGalleryProps {
  product: Product;
}

export default function ProductImageGallery({ product }: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const images = product.images || [];
  
  // Use placeholder if no images
  const displayImages = images.length > 0 ? images : [{
    id: 'placeholder',
    url: `https://placehold.co/600x600/e5e7eb/6b7280?text=${encodeURIComponent(product.name)}`,
    altText: product.name,
    type: 'image' as const,
    order: 1
  }];

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
    setImageError(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageLoading(false);
    setImageError(true);
  }, []);

  const handleThumbnailClick = useCallback((index: number) => {
    setSelectedImageIndex(index);
    setImageLoading(true);
    setImageError(false);
  }, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleThumbnailClick(index);
    }
  }, [handleThumbnailClick]);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">Image not available</p>
            </div>
          </div>
        ) : (
          <Image
            src={displayImages[selectedImageIndex]?.url}
            alt={displayImages[selectedImageIndex]?.altText || product.name}
            width={600}
            height={600}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
            priority
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
      </div>
      
      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
          {displayImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => handleThumbnailClick(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                selectedImageIndex === index 
                  ? 'border-blue-500 shadow-lg' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
              aria-label={`View image ${index + 1} of ${displayImages.length}`}
              aria-pressed={selectedImageIndex === index}
            >
              <Image
                src={image.url}
                alt={image.altText || `${product.name} view ${index + 1}`}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
