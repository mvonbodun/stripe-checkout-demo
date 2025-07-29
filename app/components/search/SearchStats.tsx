'use client';

import React from 'react';
import { useStats, useClearRefinements } from 'react-instantsearch';

export default function SearchStats() {
  const { nbHits, processingTimeMS, query } = useStats();
  const { refine, canRefine } = useClearRefinements();

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
