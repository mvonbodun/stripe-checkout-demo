'use client';

import React, { useEffect, useState } from 'react';
import { createSearchClient, ALGOLIA_INDEX_NAME } from '../lib/algolia';

export default function TestHierarchicalPage() {
  const [searchResults, setSearchResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [facetResults, setFacetResults] = useState<any>(null);

  useEffect(() => {
    async function testAlgoliaHierarchical() {
      try {
        const searchClient = createSearchClient();
        if (!searchClient) {
          setError('Search client could not be created');
          return;
        }

        const index = searchClient.initIndex(ALGOLIA_INDEX_NAME);
        
        // Test 1: Basic search to see what we get
        console.log('🔍 Testing basic search...');
        const basicSearch = await index.search('', {
          hitsPerPage: 5,
          attributesToRetrieve: ['name', 'categories', 'categories.lvl0', 'categories.lvl1', 'categories.lvl2'],
        });
        
        console.log('📊 Basic search results:', basicSearch);
        setSearchResults(basicSearch);

        // Test 2: Search with facets
        console.log('🔍 Testing faceted search...');
        const facetedSearch = await index.search('', {
          hitsPerPage: 0, // We just want facets
          facets: ['categories.lvl0', 'categories.lvl1', 'categories.lvl2'],
          maxFacetHits: 10
        });
        
        console.log('📊 Faceted search results:', facetedSearch);
        setFacetResults(facetedSearch);

        // Test 3: Test facet search specifically for hierarchical data
        console.log('🔍 Testing facet search for hierarchical categories...');
        const facetSearch = await index.searchForFacetValues('categories.lvl0', '', {
          maxFacetHits: 10
        });
        console.log('📂 Facet search results:', facetSearch);

      } catch (err) {
        console.error('❌ Error testing Algolia:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    }

    testAlgoliaHierarchical();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Hierarchical Menu Debug Test</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Basic Search Results</h2>
          <div className="bg-gray-100 p-4 rounded">
            <pre className="text-sm overflow-auto">
              {searchResults ? JSON.stringify(searchResults, null, 2) : 'Loading...'}
            </pre>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Faceted Search Results</h2>
          <div className="bg-gray-100 p-4 rounded">
            <pre className="text-sm overflow-auto">
              {facetResults ? JSON.stringify(facetResults, null, 2) : 'Loading...'}
            </pre>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Sample Data Structure Analysis</h3>
          {searchResults?.hits && searchResults.hits.length > 0 && (
            <div className="bg-blue-50 p-4 rounded">
              <h4 className="font-medium mb-2">First Hit Categories:</h4>
              <pre className="text-sm">
                {JSON.stringify(searchResults.hits[0], null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
