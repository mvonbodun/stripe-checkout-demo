'use client';

import React from 'react';
import { useHits } from 'react-instantsearch';
import { Hit } from '@algolia/client-search';
import Link from 'next/link';
import Image from 'next/image';

interface AlgoliaProduct extends Hit<{
  name: string;
  description: string;
  brand?: string;
  price: number;
  image?: string;
  slug: string;
  category: string[];
  features?: string[];
}> {}

export default function SearchResults() {
  const { hits } = useHits<AlgoliaProduct>();

  if (hits.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-500">Try adjusting your search terms or browse our categories.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {hits.map((hit) => (
        <Link
          key={hit.objectID}
          href={`/p/${hit.slug}`}
          className="group bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200"
        >
          <div className="p-6">
            {/* Product Image */}
            <div className="aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden">
              {hit.image ? (
                <Image
                  src={hit.image}
                  alt={hit.name}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              {/* Brand */}
              {hit.brand && (
                <p className="text-sm text-gray-500 mb-1">{hit.brand}</p>
              )}

              {/* Product Name */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {hit.name}
              </h3>

              {/* Price */}
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-gray-900">
                  ${hit.price.toFixed(2)}
                </span>
                
                {/* Category */}
                {hit.category && hit.category.length > 0 && (
                  <span className="text-sm text-gray-500">
                    {hit.category[hit.category.length - 1]}
                  </span>
                )}
              </div>

              {/* Description */}
              {hit.description && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {hit.description}
                </p>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
