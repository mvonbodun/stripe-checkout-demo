'use client';

import React, { useEffect } from 'react';
import { useHits, useSearchBox } from 'react-instantsearch';
import { useAnalytics, useSearchPerformanceTracking } from '../../contexts/AnalyticsContext';
import EnhancedProductCard, { ProductHit } from '../enhanced/EnhancedProductCard';

export default function SearchResults() {
  const { hits, results } = useHits<ProductHit>();
  const { query } = useSearchBox();
  const { analytics, setCurrentQuery } = useAnalytics();
  const { trackView } = useSearchPerformanceTracking();

  // Track view events and set current query ID for analytics
  useEffect(() => {
    if (results && results.queryID && query) {
      // Set the current query ID for other components to use
      setCurrentQuery(query, results.queryID);
      
      // Track view events for visible products
      if (hits.length > 0) {
        const viewEvents = hits.map((hit, index) => ({
          objectID: hit.objectID,
          position: index + 1,
          queryID: results.queryID,
        }));
        
        analytics.trackView(viewEvents);
        trackView();
        
        console.debug('Tracked view events for search results:', {
          query,
          queryID: results.queryID,
          hitCount: hits.length
        });
      }
    }
  }, [hits, results, query, setCurrentQuery, trackView, analytics]);

  if (hits.length === 0) {
    return (
      <div className="text-center py-20 px-6">
        <div className="mb-6">
          <svg className="mx-auto h-20 w-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">No products found</h3>
        <p className="text-gray-500 mb-6">Try adjusting your search terms or browse our categories.</p>
        <div className="space-y-2 text-sm text-gray-400">
          <p>Search suggestions:</p>
          <ul className="space-y-1">
            <li>• Check your spelling</li>
            <li>• Try more general terms</li>
            <li>• Use fewer keywords</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Grid */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
        {hits.map((hit, index) => (
          <EnhancedProductCard 
            key={hit.objectID} 
            hit={hit} 
            position={index + 1}
            queryID={results?.queryID}
          />
        ))}
      </div>
      
      {/* Results Summary */}
      <div className="border-t border-gray-200 pt-6 mt-8">
        <p className="text-sm text-gray-500 text-center">
          Showing {hits.length} results
        </p>
      </div>
    </div>
  );
}
