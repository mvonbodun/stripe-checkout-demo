'use client';

import React from 'react';
import { SortBy } from 'react-instantsearch';

export default function SearchSort() {
  return (
    <div className="flex items-center space-x-4 mb-6">
      <label htmlFor="sort-select" className="text-sm font-medium text-gray-700">
        Sort by:
      </label>
      <SortBy
        items={[
          { label: 'Featured', value: 'test_vtex_query_suggestions' },
          { label: 'Price: Low to High', value: 'test_vtex_query_suggestions_price_asc' },
          { label: 'Price: High to Low', value: 'test_vtex_query_suggestions_price_desc' },
          { label: 'Name: A to Z', value: 'test_vtex_query_suggestions_name_asc' },
          { label: 'Name: Z to A', value: 'test_vtex_query_suggestions_name_desc' },
          { label: 'Newest First', value: 'test_vtex_query_suggestions_created_desc' }
        ]}
        classNames={{
          root: '',
          select: 'block w-48 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 bg-white'
        }}
      />
    </div>
  );
}
