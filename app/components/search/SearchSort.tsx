'use client';

import React from 'react';
import { SortBy } from 'react-instantsearch';

export default function SearchSort() {
  // Get individual index names from environment variables
  const featuredIndex = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'stripe_demo_index';
  const priceAscIndex = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PRICE_ASC || 'stripe_demo_index_price_asc';
  const priceDescIndex = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PRICE_DESC || 'stripe_demo_index_price_desc';
  const nameAscIndex = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME_ASC || 'stripe_demo_index_name_asc';
  const nameDescIndex = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME_DESC || 'stripe_demo_index_name_desc';
  const createdDescIndex = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_CREATED_DESC || 'stripe_demo_index_created_desc';
  
  return (
    <div className="flex items-center space-x-4">
      <label htmlFor="sort-select" className="text-sm font-medium text-gray-700">
        Sort by:
      </label>
      <SortBy
        items={[
          { label: 'Relevance', value: featuredIndex },
          { label: 'Price: Low to High', value: priceAscIndex },
          { label: 'Price: High to Low', value: priceDescIndex },
          { label: 'Name: A to Z', value: nameAscIndex },
          { label: 'Name: Z to A', value: nameDescIndex },
          { label: 'Newest First', value: createdDescIndex }
        ]}
        classNames={{
          root: '',
          select: 'block w-48 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 bg-white'
        }}
      />
    </div>
  );
}
