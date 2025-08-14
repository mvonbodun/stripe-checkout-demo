'use client';

import React from 'react';
import {
  RefinementList,
  // HierarchicalMenu,
  // useHierarchicalMenu,
  // useRefinementList,
  // Slider,
  // useRange,
  // DynamicWidgets,
  CurrentRefinements,
  ClearRefinements,
  RangeInput,
} from 'react-instantsearch';
// import { useRouter } from 'next/navigation';
import DynamicFacets from './DynamicFacets';
import SearchFacets from './SearchFacets';

interface CategoryAwareFacetsProps {
  hideCategoryHierarchy?: boolean;
  currentCategoryLevel?: 1 | 2 | 3;
  className?: string;
}

/**
 * Category-aware facets component that can hide category hierarchy
 * when browsing within a specific category context
 */
export default function CategoryAwareFacets({ 
  hideCategoryHierarchy = false,
  // currentCategoryLevel,
  className = ''
}: CategoryAwareFacetsProps) {
  
  // If hiding category hierarchy, render facets without the category menu
  if (hideCategoryHierarchy) {
    return (
      <div className={`category-aware-facets ${className}`}>
        {/* Current Refinements - always show for easy removal */}
        <div className="mb-6">
          <CurrentRefinements
            classNames={{
              root: 'space-y-2',
              list: 'space-y-2',
              item: 'flex items-center justify-between text-sm',
              label: 'font-medium text-gray-700',
              category: 'text-xs text-gray-500',
              categoryLabel: 'font-medium',
              delete: 'ml-2 text-red-600 hover:text-red-800 cursor-pointer text-lg leading-none'
            }}
          />
        </div>

        {/* Clear all refinements */}
        <div className="mb-6">
          <ClearRefinements
            classNames={{
              root: '',
              button: 'w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
            }}
          />
        </div>

        {/* Brand Facet */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Brand</h3>
          <RefinementList
            attribute="brand"
            limit={8}
            showMore={true}
            showMoreLimit={20}
            searchable={true}
            searchablePlaceholder="Search brands..."
            classNames={{
              root: '',
              searchBox: 'mb-3',
              list: 'space-y-2 max-h-48 overflow-y-auto',
              item: 'flex items-center justify-between',
              label: 'flex items-center cursor-pointer flex-1 min-w-0',
              labelText: 'text-sm text-gray-700 truncate',
              checkbox: 'mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded',
              count: 'text-xs text-gray-500 ml-2 flex-shrink-0',
              showMore: 'mt-3 text-sm text-blue-600 hover:text-blue-800 cursor-pointer'
            }}
          />
        </div>

        {/* Price Range Facet (uses numeric attribute like search page) */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
          <RangeInput
            attribute="variants.price.amount"
            classNames={{
              root: '',
              form: 'flex items-center space-x-2',
              input: 'w-20 px-2 py-1 border border-gray-300 rounded text-sm',
              separator: 'text-gray-400',
              submit: 'px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
            }}
          />
        </div>

        {/* Size Facet (align with search page nested attribute) */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Size</h3>
          <RefinementList
            attribute="variants.defining_attributes.size"
            limit={12}
            classNames={{
              root: '',
              list: 'grid grid-cols-2 gap-2',
              item: 'flex items-center',
              label: 'flex items-center cursor-pointer w-full',
              labelText: 'text-sm text-gray-700 flex-1',
              checkbox: 'mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded',
              count: 'text-xs text-gray-500 ml-1'
            }}
          />
        </div>

        {/* Color Facet (align with search page nested attribute) */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Color</h3>
          <RefinementList
            attribute="variants.defining_attributes.color"
            limit={15}
            classNames={{
              root: '',
              list: 'grid grid-cols-2 gap-2',
              item: 'flex items-center',
              label: 'flex items-center cursor-pointer w-full',
              labelText: 'text-sm text-gray-700 flex-1',
              checkbox: 'mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded',
              count: 'text-xs text-gray-500 ml-1'
            }}
          />
        </div>

        {/* Dynamic Facets for additional attributes */}
        <DynamicFacets />
      </div>
    );
  }

  // Default behavior - show standard SearchFacets with category hierarchy
  return <SearchFacets />;
}
