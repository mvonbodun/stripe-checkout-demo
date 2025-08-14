'use client';

import React from 'react';
import { usePagination } from 'react-instantsearch';

export default function SearchPagination() {
  const {
    currentRefinement,
    nbPages,
    isFirstPage,
    isLastPage,
    refine,
  } = usePagination();

  if (nbPages <= 1) {
    return null;
  }

  const renderPageNumbers = () => {
    const pages: JSX.Element[] = [];
    const showPages = 5; // Number of page buttons to show
    const startPage = Math.max(0, Math.min(currentRefinement - Math.floor(showPages / 2), nbPages - showPages));
    const endPage = Math.min(nbPages - 1, startPage + showPages - 1);

    // Show first page if we're not at the beginning
    if (startPage > 0) {
      pages.push(
        <button
          key={0}
          onClick={() => refine(0)}
          className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
        >
          1
        </button>
      );
      if (startPage > 1) {
        pages.push(
          <span key="start-ellipsis" className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => refine(i)}
          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
            currentRefinement === i
              ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
              : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
          }`}
        >
          {i + 1}
        </button>
      );
    }

    // Show last page if we're not at the end
    if (endPage < nbPages - 1) {
      if (endPage < nbPages - 2) {
        pages.push(
          <span key="end-ellipsis" className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={nbPages - 1}
          onClick={() => refine(nbPages - 1)}
          className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
        >
          {nbPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center mt-8">
      <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
        <button
          onClick={() => refine(currentRefinement - 1)}
          disabled={isFirstPage}
          className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
        >
          <span className="sr-only">Previous</span>
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L9.06 10l3.71 3.71a.75.75 0 11-1.06 1.06l-4.24-4.25a.75.75 0 010-1.06l4.24-4.25a.75.75 0 011.06-.02z" clipRule="evenodd" />
          </svg>
        </button>

        {renderPageNumbers()}

        <button
          onClick={() => refine(currentRefinement + 1)}
          disabled={isLastPage}
          className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
        >
          <span className="sr-only">Next</span>
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L10.94 10 7.23 6.29a.75.75 0 111.06-1.06l4.24 4.25a.75.75 0 010 1.06l-4.24 4.25a.75.75 0 01-1.06.02z" clipRule="evenodd" />
          </svg>
        </button>
      </nav>
    </div>
  );
}
