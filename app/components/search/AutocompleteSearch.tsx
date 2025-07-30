'use client';

import React, { createElement, Fragment, useEffect, useRef, useState, useMemo } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useRouter } from 'next/navigation';
import { useSearchBox, usePagination } from 'react-instantsearch';
import { autocomplete, AutocompleteOptions } from '@algolia/autocomplete-js';
import { BaseItem } from '@algolia/autocomplete-core';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import { createSearchClient } from '../../lib/algolia';
import { CldImage } from 'next-cloudinary';
import { extractCloudinaryPublicId } from '../../utils/cloudinaryHelpers';

import '@algolia/autocomplete-theme-classic';

interface AutocompleteSearchProps {
  className?: string;
  placeholder?: string;
}

interface SetInstantSearchUiStateOptions {
  query: string;
}

interface ProductSuggestion {
  objectID: string;
  name: string;
  brand?: string;
  image?: string;
  price?: number;
  category?: string[];
}

export default function AutocompleteSearch({ 
  className = '', 
  placeholder = 'Search for products...' 
}: AutocompleteSearchProps) {
  const autocompleteContainer = useRef<HTMLDivElement>(null);
  const panelRootRef = useRef<Root | null>(null);
  const rootRef = useRef<HTMLElement | null>(null);
  const autocompleteInstanceRef = useRef<any>(null);
  const router = useRouter();

  const { query, refine: setQuery } = useSearchBox();
  const { refine: setPage } = usePagination();

  const [instantSearchUiState, setInstantSearchUiState] = useState<SetInstantSearchUiStateOptions>({ query });

  // Get search client for autocomplete - memoize to prevent recreation
  const searchClient = useMemo(() => createSearchClient(), []);
  const indexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'stripe_demo_index';

  // Use refs for callbacks to avoid dependency changes
  const handleRecentSearchSelectRef = useRef((item: any) => {
    setInstantSearchUiState({ query: item.label });
    router.push(`/search?query=${encodeURIComponent(item.label)}`);
  });

  const handleProductSelectRef = useRef((item: ProductSuggestion) => {
    router.push(`/p/${item.objectID}`);
  });

  // Update refs when router changes
  useEffect(() => {
    handleRecentSearchSelectRef.current = (item: any) => {
      setInstantSearchUiState({ query: item.label });
      router.push(`/search?query=${encodeURIComponent(item.label)}`);
    };
    
    handleProductSelectRef.current = (item: ProductSuggestion) => {
      router.push(`/p/${item.objectID}`);
    };
  }, [router]);

  useEffect(() => {
    setQuery(instantSearchUiState.query);
    setPage(0);
  }, [instantSearchUiState, setQuery, setPage]);

  // Initialize autocomplete once and keep it stable
  useEffect(() => {
    if (!autocompleteContainer.current || !searchClient || autocompleteInstanceRef.current) {
      return;
    }

    // Create plugins once
    const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
      key: 'stripe-demo-recent-searches',
      limit: 3,
      transformSource({ source }) {
        return {
          ...source,
          templates: {
            ...source.templates,
            header() {
              return (
                <Fragment>
                  <span className="aa-SourceHeaderTitle">Recent searches</span>
                  <span className="aa-SourceHeaderLine" />
                </Fragment>
              );
            },
            item({ item }) {
              return (
                <div className="aa-ItemWrapper">
                  <div className="aa-ItemContent">
                    <div className="aa-ItemIcon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="M21 21l-4.35-4.35"></path>
                      </svg>
                    </div>
                    <div className="aa-ItemContentBody">
                      <div className="aa-ItemContentTitle">{item.label}</div>
                    </div>
                  </div>
                </div>
              );
            },
          },
          onSelect({ item }) {
            handleRecentSearchSelectRef.current(item);
          },
        };
      },
    });

    // Create sources once
    const productSource = {
      sourceId: 'products',
      getItems({ query }: { query: string }) {
        if (!query) return [];
        
        return searchClient.search([{
          indexName,
          query,
          params: {
            hitsPerPage: 5,
            attributesToRetrieve: ['objectID', 'name', 'brand', 'variants.image_urls', 'variants.price.amount', 'category'],
          },
        }]).then(({ results }) => {
          const searchResult = results[0] as any;
          const hits = searchResult?.hits || [];
          return hits.map((hit: any) => ({
            ...hit,
            // Extract first image URL from variants
            image: hit.variants?.[0]?.image_urls?.[0] || null,
            // Extract first price from variants  
            price: hit.variants?.[0]?.price?.amount || null,
          }));
        }).catch(() => []);
      },
      templates: {
        header() {
          return (
            <Fragment>
              <span className="aa-SourceHeaderTitle">Products</span>
              <span className="aa-SourceHeaderLine" />
            </Fragment>
          );
        },
        item({ item }: { item: ProductSuggestion }) {
          const publicId = item.image ? extractCloudinaryPublicId(item.image) : '';
          
          return (
            <div className="aa-ItemWrapper">
              <div className="aa-ItemContent flex items-center gap-3 py-2">
                {item.image && publicId ? (
                  <div className="aa-ItemIcon flex-shrink-0">
                    <CldImage
                      src={publicId}
                      alt={item.name}
                      width={64}
                      height={64}
                      crop="fill"
                      gravity="center"
                      format="auto"
                      quality="auto"
                      className="w-16 h-16 object-cover rounded-lg autocomplete-product-image"
                      style={{ 
                        width: '64px !important', 
                        height: '64px !important',
                        minWidth: '64px',
                        minHeight: '64px',
                        maxWidth: '64px',
                        maxHeight: '64px'
                      }}
                      data-component="CldImage"
                    />
                  </div>
                ) : item.image ? (
                  <div className="aa-ItemIcon flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg autocomplete-product-image"
                      style={{ 
                        width: '64px !important', 
                        height: '64px !important',
                        minWidth: '64px',
                        minHeight: '64px',
                        maxWidth: '64px',
                        maxHeight: '64px'
                      }}
                    />
                  </div>
                ) : null}
                <div className="aa-ItemContentBody flex-1 min-w-0">
                  <div className="aa-ItemContentTitle">
                    <span className="font-medium text-sm leading-tight">{item.name}</span>
                  </div>
                  {item.brand && (
                    <div className="aa-ItemContentDescription text-xs text-gray-600 mt-0.5">
                      by {item.brand}
                    </div>
                  )}
                  {item.price && (
                    <div className="aa-ItemContentDescription text-sm font-semibold text-green-600 mt-1">
                      ${item.price.toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        },
      },
      onSelect({ item }: { item: ProductSuggestion }) {
        handleProductSelectRef.current(item);
      },
    };

    autocompleteInstanceRef.current = autocomplete({
      container: autocompleteContainer.current,
      placeholder,
      initialState: { query },
      openOnFocus: true,
      detachedMediaQuery: 'none', // Keep attached on all devices
      getSources() {
        return [productSource];
      },
      plugins: [recentSearchesPlugin],
      onReset() {
        setInstantSearchUiState({ query: '' });
      },
      onSubmit({ state }) {
        setInstantSearchUiState({ query: state.query });
        // Navigate to search page on submit
        if (state.query.trim()) {
          router.push(`/search?query=${encodeURIComponent(state.query.trim())}`);
        }
      },
      onStateChange({ prevState, state }) {
        if (prevState.query !== state.query) {
          setInstantSearchUiState({ query: state.query });
        }
      },
      renderer: { createElement, Fragment, render: () => {} },
      render({ children }, root) {
        if (!panelRootRef.current || rootRef.current !== root) {
          rootRef.current = root;
          
          // Safely unmount the previous root
          if (panelRootRef.current) {
            panelRootRef.current.unmount();
          }
          panelRootRef.current = createRoot(root);
        }
        panelRootRef.current.render(children);
      },
    });

    return () => {
      if (autocompleteInstanceRef.current) {
        autocompleteInstanceRef.current.destroy();
        autocompleteInstanceRef.current = null;
      }
      if (panelRootRef.current) {
        panelRootRef.current.unmount();
        panelRootRef.current = null;
      }
    };
  }, []); // Empty dependency array - only run once

  if (!searchClient) {
    // Fallback to basic search input if Algolia is not available
    return (
      <div className={`flex-1 px-8 ${className}`}>
        <div className="relative max-w-lg mx-auto">
          <input
            type="search"
            placeholder={placeholder}
            className="block w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            aria-label="Search for products"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 px-8 ${className}`}>
      <div className="relative max-w-lg mx-auto">
        <div ref={autocompleteContainer} />
        <style>{`
          .aa-ItemWrapper .aa-ItemContent {
            display: flex !important;
            align-items: center !important;
            gap: 12px !important;
            padding: 8px 12px !important;
            min-height: 80px !important;
          }
          .aa-ItemIcon {
            flex-shrink: 0 !important;
            width: 64px !important;
            height: 64px !important;
            margin: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            overflow: hidden !important;
          }
          .aa-ItemIcon img,
          .aa-ItemIcon > div,
          .aa-ItemIcon > div > img,
          .aa-ItemIcon [data-component="CldImage"],
          .aa-ItemIcon [data-component="CldImage"] img,
          .autocomplete-product-image {
            width: 64px !important;
            height: 64px !important;
            border-radius: 8px !important;
            object-fit: cover !important;
            display: block !important;
            max-width: 64px !important;
            max-height: 64px !important;
            min-width: 64px !important;
            min-height: 64px !important;
          }
          .aa-ItemContentBody {
            flex: 1 !important;
            min-width: 0 !important;
          }
          .aa-ItemContentTitle {
            margin-bottom: 2px !important;
          }
          .aa-ItemContentDescription {
            margin: 0 !important;
            line-height: 1.3 !important;
          }
        `}</style>
      </div>
    </div>
  );
}
