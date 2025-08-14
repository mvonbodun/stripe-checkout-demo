'use client';

import React from 'react';
// import { InstantSearch } from 'react-instantsearch';
// import { createSearchClient } from '../../lib/algolia';
// import { SearchBox } from 'react-instantsearch';
// import AutocompleteSearch from '../search/AutocompleteSearch';
import { useRouter } from 'next/navigation';
import { useSearchBox } from 'react-instantsearch';

interface EnhancedHeaderSearchBarProps {
  className?: string;
}

function SearchBoxWithNavigation({ className = '' }: EnhancedHeaderSearchBarProps) {
  const { query, refine } = useSearchBox();
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const searchQuery = (event.target as HTMLFormElement).querySelector('input')?.value;
    if (searchQuery && searchQuery.trim()) {
      // Navigate to search page with the query
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    refine(value);
  };

  return (
    <div className={`flex-1 px-8 ${className}`}>
      <div className="relative max-w-lg mx-auto">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="search"
            placeholder="Search for products..."
            value={query}
            onChange={handleInputChange}
            className="block w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            aria-label="Search for products"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1"
            aria-label="Submit search"
          >
            <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          {query && (
            <button
              type="button"
              onClick={() => refine('')}
              className="absolute right-8 top-1/2 transform -translate-y-1/2 p-1"
              aria-label="Clear search"
            >
              <svg className="h-3 w-3 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

// This component is designed to be used within an <InstantSearch> context.
// It does not create its own search client or InstantSearch provider.
export default function EnhancedHeaderSearchBar({ className = '' }: EnhancedHeaderSearchBarProps) {
  return <SearchBoxWithNavigation className={className} />;
}
