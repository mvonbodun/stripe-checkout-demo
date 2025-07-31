'use client';

import React, { useEffect } from 'react';
import { useStats, useClearRefinements } from 'react-instantsearch';
import { useSearchPerformanceTracking } from '../../contexts/AnalyticsContext';

export default function SearchStats() {
  const { nbHits, processingTimeMS, query } = useStats();
  const { refine, canRefine } = useClearRefinements();
  const { trackSearch } = useSearchPerformanceTracking();

  // Track search performance when stats change
  useEffect(() => {
    if (query && processingTimeMS > 0) {
      trackSearch(processingTimeMS, nbHits > 0);
    }
  }, [query, processingTimeMS, nbHits, trackSearch]);

  return (
    <div className="flex items-center space-x-2 text-sm text-gray-600">
      {query ? (
        <>
          <span className="font-semibold text-gray-800">{nbHits.toLocaleString()}</span>
          <span>results for</span>
          <span className="font-medium text-blue-600">"{query}"</span>
          <span className="text-gray-400">•</span>
          <span>{processingTimeMS}ms</span>
        </>
      ) : (
        <>
          <span className="font-semibold text-gray-800">{nbHits.toLocaleString()}</span>
          <span>products available</span>
        </>
      )}
    </div>
  );
}
