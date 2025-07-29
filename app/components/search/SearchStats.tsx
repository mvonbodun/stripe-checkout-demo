'use client';

import React from 'react';
import { useStats, useClearRefinements } from 'react-instantsearch';

export default function SearchStats() {
  const { nbHits, processingTimeMS, query } = useStats();
  const { refine, canRefine } = useClearRefinements();

  return (
    <div className="flex items-center justify-between text-sm text-gray-600 mb-6 px-1">
      <div className="flex items-center space-x-2">
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
      {canRefine && (
        <button
          onClick={() => refine()}
          className="text-blue-600 hover:text-blue-800 transition-colors font-medium text-sm px-3 py-1 rounded-md hover:bg-blue-50"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
