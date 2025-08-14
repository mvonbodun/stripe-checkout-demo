'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { 
  RefinementList, 
  HierarchicalMenu, 
  // CurrentRefinements,
  ClearRefinements,
  // useHierarchicalMenu,
  // useStats,
  // useHits,
  useRange,
  useConnector,
  useCurrentRefinements
} from 'react-instantsearch';
import connectRatingMenu from 'instantsearch.js/es/connectors/rating-menu/connectRatingMenu';
import * as Slider from '@radix-ui/react-slider';
import DynamicFacets from './DynamicFacets';

// Custom CurrentRefinements component to show only values (not facet names)
function CustomCurrentRefinements() {
  const { items, refine } = useCurrentRefinements();

  if (items.length === 0) {
    return null;
  }

  // Flatten all refinements from all facets into a single array
  const allRefinements = items.flatMap(item => 
    item.refinements.map(refinement => ({
      ...refinement,
      attribute: item.attribute,
      remove: () => refine(refinement)
    }))
  );

  // Limit to 10 refinements
  const limitedRefinements = allRefinements.slice(0, 10);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {limitedRefinements.map((refinement, index) => (
          <span 
            key={`${refinement.attribute}-${refinement.value}-${index}`}
            className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
          >
            {refinement.label}
            <button
              onClick={refinement.remove}
              className="ml-2 hover:bg-blue-200 rounded-full p-0.5 transition-colors cursor-pointer"
              aria-label={`Remove ${refinement.label}`}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

// Custom useRatingMenu hook
type RatingMenuProps = { attribute: string } & Record<string, unknown>;
function useRatingMenu(props: RatingMenuProps) {
  return useConnector(connectRatingMenu, props);
}

// Custom RatingMenu component
function RatingMenu({ attribute }: { attribute: string }) {
  const { items, refine } = useRatingMenu({ attribute });

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <button
          key={item.value}
          onClick={() => refine(item.value)}
          className={`w-full flex items-center justify-between p-2 text-sm rounded hover:bg-gray-50 transition-colors ${
            item.isRefined ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
          }`}
        >
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {item.stars.map((isFilled, index) => (
                <svg
                  key={index}
                  className={`w-4 h-4 ${
                    isFilled ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={isFilled ? 0 : 1.5}
                >
                  {isFilled ? (
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 00-1.96 0L7.48 8.499l-4.5.375c-.552.046-.774.74-.355 1.104L6.5 13.5l-1.094 4.593c-.129.54.461.96.923.636L12 16.5l4.671 2.73c.462.324 1.052-.096.923-.636L16.5 13.5l3.875-3.522c.419-.364.197-1.058-.355-1.104l-4.5-.375-2.04-4.5z"
                    />
                  )}
                </svg>
              ))}
            </div>
            <span className="text-sm">{item.label} & up</span>
          </div>
          <span className="text-xs text-gray-500">{item.count}</span>
        </button>
      ))}
    </div>
  );
}

// Price range slider using useRange hook
function PriceRange({ attribute = 'price' }: { attribute?: string }) {
  const { start, range, refine } = useRange({ attribute });
  const [min, setMin] = useState(start[0] ?? range.min ?? 0);
  const [max, setMax] = useState(start[1] ?? range.max ?? 0);

  useEffect(() => {
    setMin(start[0] ?? range.min ?? 0);
    setMax(start[1] ?? range.max ?? 0);
  }, [start, range]);

  const debouncedRefine = useRef<NodeJS.Timeout | null>(null);

  const onValueChange = useCallback((values: number[]) => {
    setMin(values[0]);
    setMax(values[1]);
  }, []);

  const onValueCommit = useCallback((values: number[]) => {
    if (debouncedRefine.current) clearTimeout(debouncedRefine.current);
    debouncedRefine.current = setTimeout(() => {
      // useRange refine expects a 2-length tuple [min, max]
      refine([values[0], values[1]] as [number, number]);
    }, 150);
  }, [refine]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700">${'{'}min{'}'}</span>
        <span className="text-sm text-gray-700">${'{'}max{'}'}</span>
      </div>
      <Slider.Root
        className="relative flex w-full touch-none select-none items-center"
        min={range.min ?? 0}
        max={range.max ?? 0}
        step={1}
        value={[min, max]}
        onValueChange={onValueChange}
        onValueCommit={onValueCommit}
      >
        <Slider.Track className="relative h-1.5 w-full grow rounded-full bg-gray-200">
          <Slider.Range className="absolute h-full rounded-full bg-blue-500" />
        </Slider.Track>
        <Slider.Thumb className="block h-4 w-4 rounded-full bg-white shadow border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <Slider.Thumb className="block h-4 w-4 rounded-full bg-white shadow border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </Slider.Root>
    </div>
  );
}

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
      <CustomCurrentRefinements />

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
            list: 'space-y-0',
            item: '',
            selectedItem: '',
            link: 'flex items-center justify-between p-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors font-medium',
            selectedItemLink: 'text-blue-600 bg-blue-50 font-medium',
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
            list: 'space-y-0 max-h-64 overflow-y-auto',
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
            list: 'space-y-0 max-h-64 overflow-y-auto',
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
              return isShowingMore ? 'Show less colors' : 'Show more colors';
            }
          }}
        />
      </div>

      {/* Size Filter (if available) */}
      <div className="border-b border-gray-200 pb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
          Size
        </h4>
        <RefinementList
          attribute="variants.defining_attributes.size"
          limit={10}
          sortBy={['name:asc']}
          classNames={{
            root: '',
            noRefinementRoot: 'text-gray-500 text-sm font-medium',
            list: 'flex flex-wrap -m-2',
            item: 'm-2',
            selectedItem: '',
            label: 'cursor-pointer',
            checkbox: 'sr-only',
            labelText: 'px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium',
            count: 'sr-only'
          }}
        />
      </div>

      {/* Rating Filter */}
      <div className="border-b border-gray-200 pb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
          Rating
        </h4>
        <RatingMenu attribute="reviews.rating" />
      </div>

      {/* Price Range */}
      <div className="border-b border-gray-200 pb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
          Price Range
        </h4>
        <PriceRange attribute="variants.price.amount" />
      </div>

      {/* Additional Dynamic Facets */}
      <DynamicFacets />
    </div>
  );
}
