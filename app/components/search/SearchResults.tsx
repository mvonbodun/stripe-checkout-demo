'use client';

import React from 'react';
import { useHits } from 'react-instantsearch';
import EnhancedProductCard from '../enhanced/EnhancedProductCard';

export default function SearchResults() {
  const { hits } = useHits();

  if (hits.length === 0) {
    return (
      <div className="text-center py-20 px-6">
        <div className="mb-4">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
        <p className="text-gray-500">Try adjusting your search terms or browse our categories.</p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-2 sm:px-6 sm:py-4 lg:max-w-7xl lg:px-8">
        <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
          {hits.map((hit) => (
            <EnhancedProductCard key={hit.objectID} hit={hit} />
          ))}
        </div>
      </div>
    </div>
  );
}
