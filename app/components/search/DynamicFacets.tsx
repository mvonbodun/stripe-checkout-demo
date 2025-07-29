'use client';

import React from 'react';
import { RefinementList } from 'react-instantsearch';

interface DynamicFacetsProps {
  className?: string;
}

export default function DynamicFacets({ className = '' }: DynamicFacetsProps) {
  // Define additional attributes that might be available dynamically
  const dynamicAttributes = [
    'specifications.name',
    'features',
    'variants.attributes.storage',
    'variants.attributes.color'
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
        Specifications
      </h4>
      
      <div className="space-y-4">
        {/* Features Filter */}
        <div className="border-b border-gray-200 pb-4">
          <h5 className="text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">
            Features
          </h5>
          <RefinementList
            attribute="features"
            limit={8}
            showMore={true}
            showMoreLimit={20}
            sortBy={['count:desc', 'name:asc']}
            classNames={{
              root: '',
              noRefinementRoot: 'text-gray-500 text-sm',
              list: 'space-y-1',
              item: '',
              selectedItem: 'bg-blue-50',
              label: 'flex items-center cursor-pointer p-1 hover:bg-gray-50 rounded transition-colors text-sm',
              checkbox: 'mr-2 h-3 w-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500',
              labelText: 'flex-1 text-gray-700 truncate text-xs',
              count: 'text-gray-500 text-xs ml-1',
              showMore: 'mt-2',
              disabledShowMore: 'text-gray-400 cursor-not-allowed'
            }}
            translations={{
              showMoreButtonText({ isShowingMore }) {
                return isShowingMore ? 'Show less' : 'Show more';
              }
            }}
          />
        </div>

        {/* Storage Filter (for electronics) */}
        <div className="border-b border-gray-200 pb-4">
          <h5 className="text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">
            Storage
          </h5>
          <RefinementList
            attribute="variants.attributes.storage"
            limit={10}
            sortBy={['name:asc']}
            classNames={{
              root: '',
              noRefinementRoot: 'text-gray-500 text-sm',
              list: 'flex flex-wrap gap-2',
              item: '',
              selectedItem: '',
              label: 'cursor-pointer',
              checkbox: 'sr-only',
              labelText: 'px-3 py-1 text-xs border border-gray-300 rounded-full hover:bg-gray-50 transition-colors',
              count: 'sr-only'
            }}
          />
        </div>

        {/* Availability Filter */}
        <div className="pb-4">
          <h5 className="text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">
            Availability
          </h5>
          <RefinementList
            attribute="availability"
            limit={5}
            classNames={{
              root: '',
              noRefinementRoot: 'text-gray-500 text-sm',
              list: 'space-y-1',
              item: '',
              selectedItem: 'bg-green-50',
              label: 'flex items-center cursor-pointer p-2 hover:bg-gray-50 rounded transition-colors text-sm',
              checkbox: 'mr-2 h-3 w-3 text-green-600 border-gray-300 rounded focus:ring-green-500',
              labelText: 'flex-1 text-gray-700 text-xs',
              count: 'text-gray-500 text-xs ml-1'
            }}
          />
        </div>
      </div>
    </div>
  );
}
