'use client';

import React from 'react';
import { SearchBox } from 'react-instantsearch';
import SearchStats from './SearchStats';
import SearchResults from './SearchResults';
import SearchPagination from './SearchPagination';

interface SearchInterfaceProps {
  className?: string;
}

export default function SearchInterface({ className = '' }: SearchInterfaceProps) {
  return (
    <div className={`search-interface ${className}`}>
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          {/* Search Stats */}
          <SearchStats />

          {/* Main Search Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar - Phase 4 */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"></path>
                  </svg>
                  Filters
                </h3>
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14-4H3m16 8H7m12 4H9"></path>
                    </svg>
                  </div>
                  <p className="text-gray-600 text-sm font-medium mb-2">Advanced Filtering</p>
                  <p className="text-gray-500 text-xs">
                    Faceted navigation and filters will be available in Phase 4
                  </p>
                </div>
              </div>
            </div>

            {/* Search Results */}
            <div className="lg:col-span-3">
              <SearchResults />
              <SearchPagination />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
