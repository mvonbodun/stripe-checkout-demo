'use client';

import React from 'react';
import { useHierarchicalMenu } from 'react-instantsearch';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface CategoryFacetsProps {
  className?: string;
}

export default function CategoryFacets({ className = '' }: CategoryFacetsProps) {
  const {
    items,
    refine,
    createURL,
    canRefine,
  } = useHierarchicalMenu({
    attributes: [
      'hierarchicalCategories.lvl0',
      'hierarchicalCategories.lvl1',
      'hierarchicalCategories.lvl2',
    ],
  });

  if (!canRefine) {
    return null;
  }

  const renderCategoryItem = (item: any, level: number = 0) => (
    <div key={item.value} className={`pl-${level * 4}`}>
      <div
        className={`
          flex items-center py-2 px-3 rounded-md cursor-pointer transition-colors
          ${item.isRefined 
            ? 'bg-blue-50 text-blue-700 font-medium' 
            : 'text-gray-700 hover:bg-gray-50'
          }
        `}
        onClick={() => refine(item.value)}
      >
        {item.data && item.data.length > 0 && (
          <span className="mr-2">
            {item.isRefined ? (
              <ChevronDownIcon className="w-4 h-4" />
            ) : (
              <ChevronRightIcon className="w-4 h-4" />
            )}
          </span>
        )}
        
        <span className="flex-1 text-sm">
          {item.label}
        </span>
        
        <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {item.count}
        </span>
      </div>
      
      {/* Render children if expanded */}
      {item.isRefined && item.data && item.data.length > 0 && (
        <div className="ml-4 mt-1">
          {item.data.map((child: any) => renderCategoryItem(child, level + 1))}
        </div>
      )}
    </div>
  );

  return (
    <div className={`category-facets ${className}`}>
      <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
        <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14-4H3m16 8H7m12 4H9"></path>
        </svg>
        Categories
      </h4>
      
      <div className="space-y-1">
        {items.map((item) => renderCategoryItem(item))}
      </div>
    </div>
  );
}
