'use client';

import React from 'react';
import {
  SearchBox,
  Hits,
  Stats,
  Pagination,
} from 'react-instantsearch';

interface SearchInterfaceProps {
  className?: string;
}

function Hit({ hit }: { hit: any }) {
  return (
    <article>
      <h1>{hit.name}</h1>
    </article>
  );
}

export default function SearchInterface({ className = '' }: SearchInterfaceProps) {
  // The InstantSearch provider is now in ClientLayout, so we don't need it here.
  return (
    <div className={`search-interface ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Products</h1>
          <SearchBox
            placeholder="Search for products..."
            className="w-full"
          />
        </div>

        {/* Search Stats */}
        <Stats />

        {/* Main Search Layout */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar - Coming in Phase 4 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
              <p className="text-gray-500 text-sm">Faceted navigation coming in Phase 4</p>
            </div>
          </div>

          {/* Search Results */}
          <div className="lg:col-span-3">
            <Hits hitComponent={Hit} />
            <Pagination />
          </div>
        </div>
      </div>
    </div>
  );
}
