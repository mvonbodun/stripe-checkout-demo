'use client';

import React, { useState } from 'react';
import { SearchBox } from 'react-instantsearch';
import SearchStats from './SearchStats';
import SearchResults from './SearchResults';
import SearchPagination from './SearchPagination';
import SearchFacets from './SearchFacets';
import SearchSort from './SearchSort';

interface SearchInterfaceProps {
  className?: string;
}

export default function SearchInterface({ className = '' }: SearchInterfaceProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className={`search-interface ${className}`}>
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          {/* Search Stats */}
          <SearchStats />

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"></path>
              </svg>
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Main Search Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar - Phase 4 Faceted Navigation */}
            <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-gray-50 rounded-lg p-6 lg:sticky lg:top-4">
                <SearchFacets />
              </div>
            </div>

            {/* Search Results */}
            <div className="lg:col-span-3">
              <SearchSort />
              <SearchResults />
              <SearchPagination />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
