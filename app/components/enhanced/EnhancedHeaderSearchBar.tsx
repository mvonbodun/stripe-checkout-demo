'use client';

import React from 'react';
import { SearchBox } from 'react-instantsearch';

interface EnhancedHeaderSearchBarProps {
  className?: string;
}

// This component is designed to be used within an <InstantSearch> context.
// It does not create its own search client or InstantSearch provider.
export default function EnhancedHeaderSearchBar({ className = '' }: EnhancedHeaderSearchBarProps) {
  return (
    <div className={`enhanced-header-search-bar ${className}`}>
      <SearchBox
        placeholder="Search for products..."
        className="w-full"
        classNames={{
          root: 'relative',
          form: 'flex',
          input: 'block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
          submitIcon: 'absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400',
          resetIcon: 'absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400',
        }}
      />
    </div>
  );
}
