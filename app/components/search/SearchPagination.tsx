'use client';

import React from 'react';
import { usePagination } from 'react-instantsearch';

export default function SearchPagination() {
  const {
    pages,
    currentRefinement,
    nbPages,
    isFirstPage,
    isLastPage,
    refine,
    createURL
  } = usePagination();

  if (nbPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      {/* Previous Button */}
      <button
        onClick={() => refine(currentRefinement - 1)}
        disabled={isFirstPage}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        Previous
      </button>

      {/* Page Numbers */}
      <div className="flex space-x-1">
        {pages.map((page) => {
          const isCurrentPage = page === currentRefinement;
          
          return (
            <button
              key={page}
              onClick={() => refine(page)}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isCurrentPage
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
              aria-label={`Go to page ${page + 1}`}
              aria-current={isCurrentPage ? 'page' : undefined}
            >
              {page + 1}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => refine(currentRefinement + 1)}
        disabled={isLastPage}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
}
