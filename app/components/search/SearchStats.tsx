'use client';

import React from 'react';
import { useStats, useClearRefinements } from 'react-instantsearch';

export default function SearchStats() {
  const { nbHits, processingTimeMS, query } = useStats();
  const { refine, canRefine } = useClearRefinements();

  return (
    <div className="flex items-center justify-between text-sm text-gray-600 mb-4 px-1">
      <div>
        {query && (
          <>
            <span className="font-semibold text-gray-800">{nbHits.toLocaleString()}</span> results found in{' '}
            <span className="font-semibold text-gray-800">{processingTimeMS}ms</span>
          </>
        )}
      </div>
      {canRefine && (
        <button
          onClick={() => refine()}
          className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
        >
          Clear search
        </button>
      )}
    </div>
  );
}
