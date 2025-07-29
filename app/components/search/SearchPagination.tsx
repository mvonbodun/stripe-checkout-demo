'use client';

import React from 'react';
import { usePagination } from 'react-instantsearch';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

export default function SearchPagination() {
  const {
    currentRefinement,
    nbPages,
    isFirstPage,
    isLastPage,
    refine,
    createURL,
  } = usePagination();

  if (nbPages <= 1) {
    return null;
  }

  const renderPageNumbers = () => {
    const pages = [];
    // Logic to render a subset of pages if there are too many
    const startPage = Math.max(0, currentRefinement - 2);
    const endPage = Math.min(nbPages - 1, currentRefinement + 2);

    if (startPage > 0) {
      pages.push(<span key="start-ellipsis" className="px-4 py-2">...</span>);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <a
          key={i}
          href={createURL(i)}
          onClick={(event) => {
            event.preventDefault();
            refine(i);
          }}
          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
            currentRefinement === i
              ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
              : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
          }`}
        >
          {i + 1}
        </a>
      );
    }

    if (endPage < nbPages - 1) {
      pages.push(<span key="end-ellipsis" className="px-4 py-2">...</span>);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-8">
      <div className="flex flex-1 justify-between sm:hidden">
        <a
          href={!isFirstPage ? createURL(currentRefinement - 1) : '#'}
          onClick={(event) => {
            event.preventDefault();
            if (!isFirstPage) refine(currentRefinement - 1);
          }}
          className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${isFirstPage ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          Previous
        </a>
        <a
          href={!isLastPage ? createURL(currentRefinement + 1) : '#'}
          onClick={(event) => {
            event.preventDefault();
            if (!isLastPage) refine(currentRefinement + 1);
          }}
          className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${isLastPage ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          Next
        </a>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-center">
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <a
              href={!isFirstPage ? createURL(currentRefinement - 1) : '#'}
              onClick={(event) => {
                event.preventDefault();
                if (!isFirstPage) refine(currentRefinement - 1);
              }}
              className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${isFirstPage ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </a>
            {renderPageNumbers()}
            <a
              href={!isLastPage ? createURL(currentRefinement + 1) : '#'}
              onClick={(event) => {
                event.preventDefault();
                if (!isLastPage) refine(currentRefinement + 1);
              }}
              className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${isLastPage ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
}
