'use client';

import React from 'react';
import { useStats } from 'react-instantsearch';

export default function SearchStats() {
  const { nbHits, processingTimeMS, query } = useStats();

  return (
    <div className="flex items-center justify-between py-3 text-sm text-gray-600">
      <div>
        Showing <span className="font-medium">{nbHits}</span> results in{' '}
        <span className="font-medium">{processingTimeMS}ms</span>
        {query && (
          <> for &quot;{query}&quot;</>
        )}
      </div>
    </div>
  );
}
