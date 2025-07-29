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
    <div className={`flex-1 px-8 ${className}`}>
      <SearchBox
        placeholder="Search for products..."
        classNames={{
          root: 'relative max-w-lg mx-auto',
          form: 'relative flex items-center',
          input: 'block w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
          submit: 'absolute right-3 top-1/2 transform -translate-y-1/2',
          submitIcon: 'h-4 w-4 text-gray-400 hover:text-gray-600',
          reset: 'absolute right-8 top-1/2 transform -translate-y-1/2',
          resetIcon: 'h-3 w-3 text-gray-400 hover:text-gray-600',
        }}
      />
    </div>
  );
}
