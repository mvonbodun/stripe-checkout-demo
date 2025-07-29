'use client';

import React, { useEffect } from 'react';
import { 
  RefinementList, 
  HierarchicalMenu, 
  RangeInput, 
  CurrentRefinements,
  ClearRefinements 
} from 'react-instantsearch';
import DynamicFacets from './DynamicFacets';

export default function SearchFacets() {
  // Add custom styles for the brand search box to match header styling
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .brand-search-box form {
        position: relative !important;
        display: flex !important;
        align-items: center !important;
      }
      
      .brand-search-box input {
        display: block !important;
        width: 100% !important;
        padding-left: 1rem !important;
        padding-right: 2.5rem !important;
        padding-top: 0.625rem !important;
        padding-bottom: 0.625rem !important;
        border: 1px solid #d1d5db !important;
        border-radius: 0.375rem !important;
        line-height: 1.25 !important;
        background-color: white !important;
        font-size: 0.875rem !important;
        font-weight: 500 !important;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
        color: #374151 !important;
      }
      
      .brand-search-box input::placeholder {
        color: #9ca3af !important;
      }
      
      .brand-search-box input:focus {
        outline: none !important;
        border-color: #3b82f6 !important;
        box-shadow: 0 0 0 1px #3b82f6 !important;
      }
      
      .brand-search-box button[type="submit"] {
        position: absolute !important;
        right: 0.75rem !important;
        top: 50% !important;
        transform: translateY(-50%) !important;
        background: none !important;
        border: none !important;
        padding: 0 !important;
        cursor: pointer !important;
      }
      
      .brand-search-box button[type="submit"] svg {
        height: 1rem !important;
        width: 1rem !important;
        color: #9ca3af !important;
      }
      
      .brand-search-box button[type="submit"]:hover svg {
        color: #6b7280 !important;
      }
      
      .brand-search-box button[type="reset"] {
        position: absolute !important;
        right: 2rem !important;
        top: 50% !important;
        transform: translateY(-50%) !important;
        background: none !important;
        border: none !important;
        padding: 0 !important;
        cursor: pointer !important;
      }
      
      .brand-search-box button[type="reset"] svg {
        height: 0.75rem !important;
        width: 0.75rem !important;
        color: #9ca3af !important;
      }
      
      .brand-search-box button[type="reset"]:hover svg {
        color: #6b7280 !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Clear All Filters */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"></path>
          </svg>
          Filters
        </h3>
        <ClearRefinements
          classNames={{
            root: 'text-sm',
            button: 'text-blue-600 hover:text-blue-800 font-medium',
            disabledButton: 'text-gray-400 cursor-not-allowed'
          }}
          translations={{
            resetButtonText: 'Clear all'
          }}
        />
      </div>

      {/* Current Active Filters */}
      <CurrentRefinements
        classNames={{
          root: 'space-y-2',
          list: 'flex flex-wrap gap-2',
          item: '',
          label: 'inline-flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full',
          category: 'font-medium',
          categoryLabel: '',
          delete: 'ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors'
        }}
        transformItems={(items) => items.slice(0, 10)} // Limit displayed refinements
      />

      {/* Category Hierarchical Navigation */}
      <div className="border-b border-gray-200 pb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
          Categories
        </h4>
        <HierarchicalMenu
          attributes={[
            'categories.lvl0',
            'categories.lvl1', 
            'categories.lvl2'
          ]}
          classNames={{
            root: '',
            noRefinementRoot: 'text-gray-500 text-sm font-medium',
            list: 'space-y-1',
            item: '',
            selectedItem: '',
            link: 'flex items-center justify-between py-1 px-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors font-medium',
            selectedItemLink: 'text-blue-600 bg-blue-50 font-semibold',
            label: 'flex-1 truncate',
            count: 'text-gray-500 text-xs ml-2 bg-gray-100 px-2 py-0.5 rounded-full font-medium'
          }}
          translations={{
            showMoreButtonText({ isShowingMore }) {
              return isShowingMore ? 'Show less' : 'Show more';
            }
          }}
          showMore={true}
          showMoreLimit={20}
        />
      </div>

      {/* Brand Filter */}
      <div className="border-b border-gray-200 pb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
          Brand
        </h4>
        <RefinementList
          attribute="brand"
          searchable={true}
          searchablePlaceholder="Search brands..."
          showMore={true}
          showMoreLimit={20}
          limit={10}
          sortBy={['count:desc', 'name:asc']}
          classNames={{
            root: '',
            noRefinementRoot: 'text-gray-500 text-sm',
            searchBox: 'mb-4 brand-search-box',
            list: 'space-y-1 max-h-64 overflow-y-auto',
            item: '',
            selectedItem: 'bg-blue-50',
            label: 'flex items-center cursor-pointer p-2 hover:bg-gray-50 rounded transition-colors',
            checkbox: 'mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500',
            labelText: 'flex-1 text-sm text-gray-700 truncate font-medium',
            count: 'text-gray-500 text-xs ml-2 bg-gray-100 px-2 py-0.5 rounded-full font-medium',
            showMore: 'mt-3 w-full text-center',
            disabledShowMore: 'text-gray-400 cursor-not-allowed'
          }}
          translations={{
            showMoreButtonText({ isShowingMore }) {
              return isShowingMore ? 'Show less brands' : 'Show more brands';
            },
            submitButtonTitle: 'Search brands',
            resetButtonTitle: 'Clear search',
            noResultsText: 'No brands found'
          }}
        />
      </div>

      {/* Price Range */}
      <div className="border-b border-gray-200 pb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
          Price Range
        </h4>
        <RangeInput
          attribute="variants.price.amount"
          classNames={{
            root: 'space-y-3',
            noRefinementRoot: 'text-gray-500 text-sm',
            form: 'flex items-center space-x-2',
            label: 'sr-only',
            input: 'flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500',
            inputMin: '',
            inputMax: '',
            separator: 'text-gray-500 text-sm font-medium',
            submit: 'px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors'
          }}
          translations={{
            separatorElementText: 'to',
            submitButtonText: 'Go'
          }}
        />
      </div>

      {/* Color Filter (if available) */}
      <div className="border-b border-gray-200 pb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
          Color
        </h4>
        <RefinementList
          attribute="variants.defining_attributes.color"
          limit={15}
          showMore={true}
          showMoreLimit={30}
          sortBy={['count:desc', 'name:asc']}
          classNames={{
            root: '',
            noRefinementRoot: 'text-gray-500 text-sm font-medium',
            list: 'grid grid-cols-2 gap-1',
            item: '',
            selectedItem: 'bg-blue-50 text-blue-700',
            label: 'flex items-center cursor-pointer p-2 hover:bg-gray-50 rounded transition-colors text-sm',
            checkbox: 'mr-2 h-3 w-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500',
            labelText: 'flex-1 text-gray-700 truncate text-xs font-medium',
            count: 'text-gray-500 text-xs ml-1 font-medium',
            showMore: 'col-span-2 mt-2',
            disabledShowMore: 'text-gray-400 cursor-not-allowed'
          }}
          translations={{
            showMoreButtonText({ isShowingMore }) {
              return isShowingMore ? 'Show less colors' : 'Show more colors';
            }
          }}
        />
      </div>

      {/* Size Filter (if available) */}
      <div className="pb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
          Screen Size
        </h4>
        <RefinementList
          attribute="variants.defining_attributes.size"
          limit={10}
          sortBy={['name:asc']}
          classNames={{
            root: '',
            noRefinementRoot: 'text-gray-500 text-sm font-medium',
            list: 'flex flex-wrap gap-2',
            item: '',
            selectedItem: '',
            label: 'cursor-pointer',
            checkbox: 'sr-only',
            labelText: 'px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium',
            count: 'sr-only'
          }}
        />
      </div>

      {/* Additional Dynamic Facets */}
      <DynamicFacets />
    </div>
  );
}
