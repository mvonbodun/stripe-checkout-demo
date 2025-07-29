'use client';

import React from 'react';
import { useHits } from 'react-instantsearch';
import EnhancedProductCard from '../enhanced/EnhancedProductCard';

export default function SearchResults() {
  const { hits } = useHits();

  if (hits.length === 0) {
    return (
      <div className="text-center py-20 px-6">
        <div className="mb-6">
          <svg className="mx-auto h-20 w-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">No products found</h3>
        <p className="text-gray-500 mb-6">Try adjusting your search terms or browse our categories.</p>
        <div className="space-y-2 text-sm text-gray-400">
          <p>Search suggestions:</p>
          <ul className="space-y-1">
            <li>• Check your spelling</li>
            <li>• Try more general terms</li>
            <li>• Use fewer keywords</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Grid */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
        {hits.map((hit) => (
          <EnhancedProductCard key={hit.objectID} hit={hit} />
        ))}
      </div>
      
      {/* Results Summary */}
      <div className="border-t border-gray-200 pt-6 mt-8">
        <p className="text-sm text-gray-500 text-center">
          Showing {hits.length} results
        </p>
      </div>
    </div>
  );
}
