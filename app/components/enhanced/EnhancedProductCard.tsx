'use client';

import React from 'react';
import { Highlight, Snippet } from 'react-instantsearch';
import Link from 'next/link';
import Image from 'next/image';
import { CldImage } from 'next-cloudinary';
import { extractCloudinaryPublicId, isCloudinaryUrl, getFallbackImage } from '../../utils/cloudinaryHelpers';

export default function EnhancedProductCard({ hit }: { hit: any }) {
  // Console log to debug the data structure
  console.log('Hit data:', hit);
  
  // Get first variant - variants should be an array
  const firstVariant = hit.variants && Array.isArray(hit.variants) && hit.variants.length > 0 ? hit.variants[0] : null;
  
  // Debug the variant data specifically
  console.log('First variant:', firstVariant);
  
  // Image from first variant - based on actual data structure
  let imageUrl = '/next.svg'; // Default fallback
  
  if (firstVariant) {
    // Check the actual property structure: variants[0].image_urls[0]
    if (firstVariant.image_urls && Array.isArray(firstVariant.image_urls) && firstVariant.image_urls.length > 0) {
      imageUrl = firstVariant.image_urls[0];
    }
  }
  
  console.log('Final imageUrl:', imageUrl);
  
  // Extract Cloudinary public ID if it's a Cloudinary URL
  const cloudinaryPublicId = isCloudinaryUrl(imageUrl) ? extractCloudinaryPublicId(imageUrl) : null;
  console.log('Cloudinary public ID:', cloudinaryPublicId);
  
  // Price from first variant - based on actual data structure
  let price = null;
  
  if (firstVariant) {
    // Check the actual property structure: variants[0].price.amount
    if (firstVariant.price && typeof firstVariant.price.amount === 'number') {
      price = firstVariant.price.amount;
    }
  }
  
  console.log('Final price:', price);
  
  // Get color from variant attributes - based on actual data structure
  const color = firstVariant?.defining_attributes?.color;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="aspect-h-4 aspect-w-3 bg-gray-200 sm:aspect-none sm:h-96 overflow-hidden">
        {cloudinaryPublicId ? (
          <CldImage
            src={cloudinaryPublicId}
            alt={hit.name || 'Product image'}
            width={500}
            height={500}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            format="auto"
            quality="auto"
          />
        ) : (
          <Image
            src={imageUrl}
            alt={hit.name || 'Product image'}
            width={500}
            height={500}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              console.error('Image failed to load:', imageUrl);
              e.currentTarget.src = getFallbackImage(imageUrl);
            }}
          />
        )}
      </div>
      <div className="flex flex-1 flex-col space-y-2 p-4">
        {/* Brand */}
        {hit.brand && (
          <p className="text-xs text-gray-500 uppercase tracking-wide">{hit.brand}</p>
        )}
        
        {/* Product Name with Highlighting */}
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
          <Link href={hit.slug || `/p/${hit.objectID}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            <Highlight attribute="name" hit={hit} />
          </Link>
        </h3>
        
        {/* Price - moved to appear just below product name */}
        {typeof price === 'number' && (
          <p className="text-lg font-bold text-gray-900">${price.toFixed(2)}</p>
        )}
        
        {/* Color if available */}
        {color && (
          <p className="text-xs text-gray-500">
            <span className="font-medium">Color:</span> {color}
          </p>
        )}
        
        {/* Description with Highlighting */}
        {hit.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            <Snippet attribute="description" hit={hit} />
          </p>
        )}
        
        {/* Category */}
        {hit.category && Array.isArray(hit.category) && hit.category.length > 0 && (
          <p className="text-xs text-gray-400 mt-auto">
            {hit.category[hit.category.length - 1]}
          </p>
        )}
      </div>
    </div>
  );
}
