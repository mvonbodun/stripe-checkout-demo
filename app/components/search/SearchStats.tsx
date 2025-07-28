'use client';

import React from 'react';
import { useStats } from 'react-instantsearch';

export default function SearchStats() {
  const { nbHits, nbPages, page, processingTimeMS, query } = useStats();

  return (
    <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg">
      <div className="flex items-center space-x-4 text-sm text-gray-600">
        {query ? (
          <>
            <span>
              <strong>{nbHits.toLocaleString()}</strong> results for "{query}"
            </span>
            <span className="text-gray-400">•</span>
            <span>
              {processingTimeMS}ms
            </span>
          </>
        ) : (
          <span>
            <strong>{nbHits.toLocaleString()}</strong> products available
          </span>
        )}
      </div>

      <div className="text-sm text-gray-500">
        Page {page + 1} of {nbPages}
      </div>
    </div>
  );
}
