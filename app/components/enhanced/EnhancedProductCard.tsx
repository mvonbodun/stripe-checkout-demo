'use client';

import React from 'react';
import { Highlight, Snippet } from 'react-instantsearch';
import Link from 'next/link';
import Image from 'next/image';

export default function EnhancedProductCard({ hit }: { hit: any }) {
  // Console log to debug the data structure
  console.log('Hit data:', hit);
  
  // Handle different possible variant structures
  const variants = hit.variants || hit.itemVariants || [];
  const firstVariant = Array.isArray(variants) && variants.length > 0 ? variants[0] : null;
  
  // Try multiple possible image sources
  const imageUrl = 
    firstVariant?.image || 
    firstVariant?.imageUrl || 
    firstVariant?.images?.[0] ||
    hit.image || 
    hit.imageUrl ||
    hit.images?.[0] ||
    '/next.svg';
  
  // Try multiple possible price sources
  const price = 
    firstVariant?.price || 
    firstVariant?.salePrice ||
    firstVariant?.listPrice ||
    hit.price || 
    hit.salePrice ||
    hit.listPrice;
  
  // Get color from variant attributes
  const color = 
    firstVariant?.attributes?.color || 
    firstVariant?.color ||
    firstVariant?.attributes?.Color;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="aspect-h-4 aspect-w-3 bg-gray-200 sm:aspect-none sm:h-96 overflow-hidden">
        <Image
          src={imageUrl}
          alt={hit.name || 'Product image'}
          width={500}
          height={500}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-200"
          onError={(e) => {
            console.error('Image failed to load:', imageUrl);
            e.currentTarget.src = '/next.svg';
          }}
        />
      </div>
      <div className="flex flex-1 flex-col space-y-2 p-4">
        {/* Brand */}
        {hit.brand && (
          <p className="text-xs text-gray-500 uppercase tracking-wide">{hit.brand}</p>
        )}
        
        {/* Product Name with Highlighting */}
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
          <Link href={`/p/${hit.slug || hit.objectID}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            <Highlight attribute="name" hit={hit} />
          </Link>
        </h3>
        
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
        
        <div className="flex flex-1 flex-col justify-end">
          {/* Price */}
          {typeof price === 'number' && (
            <p className="text-lg font-bold text-gray-900">${price.toFixed(2)}</p>
          )}
          
          {/* Category */}
          {hit.category && Array.isArray(hit.category) && hit.category.length > 0 && (
            <p className="text-xs text-gray-400 mt-1">
              {hit.category[hit.category.length - 1]}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
