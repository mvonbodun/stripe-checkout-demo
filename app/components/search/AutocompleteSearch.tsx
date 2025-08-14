'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import type { Root } from 'react-dom/client';
import { useRouter } from 'next/navigation';
import { useSearchBox, usePagination } from 'react-instantsearch';
import { autocomplete } from '@algolia/autocomplete-js';
import type { AutocompleteSource, AutocompleteApi } from '@algolia/autocomplete-js';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import { createSearchClient } from '../../lib/algolia';

import '@algolia/autocomplete-theme-classic';

interface SearchHit {
  objectID?: string;
  name?: string;
  slug?: string;
  level?: number;
  category?: string[];
  variants?: {
    image_urls?: string[];
    price?: { amount: number };
  }[];
  [key: string]: unknown;
}

interface SearchResult {
  hits?: SearchHit[];
  [key: string]: unknown;
}

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
  [key: string]: unknown;
}

interface QuerySuggestion {
  objectID: string;
  query: string;
  category?: string;
  popularity?: number;
}

interface CategorySuggestion {
  objectID: string;
  name: string;
  slug: string;
  level: number;
  parent?: string;
  [key: string]: unknown;
}

export default function AutocompleteSearch({ 
  className = '', 
  placeholder = 'Search for products...' 
}: AutocompleteSearchProps) {
  const autocompleteContainer = useRef<HTMLDivElement>(null);
  const panelRootRef = useRef<Root | null>(null);
  const autocompleteInstanceRef = useRef<AutocompleteApi<ProductSuggestion | CategorySuggestion> | null>(null);
  const router = useRouter();

  const { query, refine: setQuery } = useSearchBox();
  const { refine: setPage } = usePagination();

  const [instantSearchUiState, setInstantSearchUiState] = useState<SetInstantSearchUiStateOptions>({ query });

  // Get search client for autocomplete - memoize to prevent recreation
  const searchClient = useMemo(() => createSearchClient(), []);
  const indexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'stripe_demo_index';
  const querySuggestionsIndexName = process.env.NEXT_PUBLIC_ALGOLIA_QUERY_SUGGESTIONS_INDEX;

  // Use refs for callbacks to avoid dependency changes
  const handleRecentSearchSelectRef = useRef((item: { label: string }) => {
    setInstantSearchUiState({ query: item.label });
    router.push(`/search?query=${encodeURIComponent(item.label)}`);
  });

  const handleProductSelectRef = useRef((item: ProductSuggestion) => {
    router.push(`/p/${item.objectID}`);
  });

  const handleQuerySuggestionSelectRef = useRef((item: QuerySuggestion) => {
    setInstantSearchUiState({ query: item.query });
    router.push(`/search?query=${encodeURIComponent(item.query)}`);
  });

  const handleCategorySelectRef = useRef((item: CategorySuggestion) => {
    router.push(`/c/${item.slug}`);
  });

  // Update refs when router changes
  useEffect(() => {
    handleRecentSearchSelectRef.current = (item: { label: string }) => {
      setInstantSearchUiState({ query: item.label });
      router.push(`/search?query=${encodeURIComponent(item.label)}`);
    };
    
    handleProductSelectRef.current = (item: ProductSuggestion) => {
      router.push(`/p/${item.objectID}`);
    };

    handleQuerySuggestionSelectRef.current = (item: QuerySuggestion) => {
      setInstantSearchUiState({ query: item.query });
      router.push(`/search?query=${encodeURIComponent(item.query)}`);
    };

    handleCategorySelectRef.current = (item: CategorySuggestion) => {
      router.push(`/c/${item.slug}`);
    };
  }, [router]);

  useEffect(() => {
    setQuery(instantSearchUiState.query);
    setPage(0);
  }, [instantSearchUiState, setQuery, setPage]);

  // Initialize autocomplete once and keep it stable
  // We intentionally initialize Autocomplete once. Adding dependencies will re-create the instance and
  // double-bind events. The callbacks and values used inside are stabilized via refs/memo.
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
            header(params) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const { html } = params as any;
              return html`
                <span class="aa-SourceHeaderTitle">Recent searches</span>
                <span class="aa-SourceHeaderLine"></span>
              `;
            },
            item(params) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const { item, html } = params as any;
              return html`
                <div class="aa-ItemWrapper">
                  <div class="aa-ItemContent">
                    <div class="aa-ItemIcon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="M21 21l-4.35-4.35"></path>
                      </svg>
                    </div>
                    <div class="aa-ItemContentBody">
                      <div class="aa-ItemContentTitle">${item.label}</div>
                    </div>
                  </div>
                </div>
              `;
            },
          },
          onSelect({ item }) {
            handleRecentSearchSelectRef.current(item);
          },
        };
      },
    });

    // Create query suggestions plugin (only if explicitly configured)
    let querySuggestionsPlugin = null;
    
    // Only create query suggestions plugin if the index name is explicitly provided via env var
    if (querySuggestionsIndexName && searchClient) {
      console.info('Attempting to initialize query suggestions plugin with index:', querySuggestionsIndexName);
      try {
        querySuggestionsPlugin = createQuerySuggestionsPlugin({
          searchClient,
          indexName: querySuggestionsIndexName,
          getSearchParams() {
            return {
              hitsPerPage: 5,
            };
          },
          transformSource({ source }) {
            return {
              ...source,
              sourceId: 'querySuggestions',
              templates: {
                ...source.templates,
                header(params) {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const { html } = params as any;
                  return html`
                    <span class="aa-SourceHeaderTitle">Popular searches</span>
                    <span class="aa-SourceHeaderLine"></span>
                  `;
                },
                item(params) {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const { item, html } = params as any;
                  return html`
                    <div class="aa-ItemWrapper">
                      <div class="aa-ItemContent">
                        <div class="aa-ItemIcon">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M21 21l-6 -6"></path>
                            <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
                            <path d="M17 8h0.01"></path>
                            <path d="M4.05 11a8 8 0 1 1 15.9 0a8 8 0 0 1 -15.9 0"></path>
                          </svg>
                        </div>
                        <div class="aa-ItemContentBody">
                          <div class="aa-ItemContentTitle">${item.query}</div>
                          ${item.category ? (html`<div class="aa-ItemContentDescription text-xs text-gray-500">in ${item.category}</div>`) : null}
                        </div>
                      </div>
                    </div>
                  `;
                },
              },
              onSelect({ item }) {
                handleQuerySuggestionSelectRef.current(item);
              },
            };
          },
        });
        console.info('Query suggestions plugin initialized successfully');
      } catch (error) {
        console.warn('Query suggestions plugin failed to initialize:', error);
        console.info('Autocomplete will work without query suggestions. To enable, ensure the query suggestions index exists in Algolia and the NEXT_PUBLIC_ALGOLIA_QUERY_SUGGESTIONS_INDEX environment variable is set.');
        querySuggestionsPlugin = null;
      }
    } else {
      console.info('Query suggestions disabled - NEXT_PUBLIC_ALGOLIA_QUERY_SUGGESTIONS_INDEX environment variable not set');
    }

    // Create sources once
    const productSource: AutocompleteSource<ProductSuggestion> = {
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
          const searchResult = results[0] as unknown;
          const hits = (searchResult as SearchResult)?.hits || [];
          return hits.map((hit: SearchHit) => {
            const brandVal = (hit as Record<string, unknown>).brand;
            const categoryVal = (hit as Record<string, unknown>).category;
            const amount = hit.variants?.[0]?.price?.amount;
            const imageUrl = hit.variants?.[0]?.image_urls?.[0];
            return {
              objectID: hit.objectID || '',
              name: hit.name || '',
              brand: typeof brandVal === 'string' ? brandVal : undefined,
              image: typeof imageUrl === 'string' ? imageUrl : undefined,
              price: typeof amount === 'number' ? amount : undefined,
              category: Array.isArray(categoryVal) ? (categoryVal as string[]) : undefined,
            } as ProductSuggestion;
          });
        }).catch(() => []);
      },
      templates: {
        header(params) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { html } = params as any;
          return html`
            <span class="aa-SourceHeaderTitle">Products</span>
            <span class="aa-SourceHeaderLine"></span>
          `;
        },
        item(params) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { item, html } = params as any;
          return html`
            <div class="aa-ItemWrapper">
              <div class="aa-ItemContent flex items-center gap-3 py-2">
                ${item.image ? (html`
                  <div class="aa-ItemIcon flex-shrink-0">
                    <img 
                      src="${item.image}"
                      alt="${item.name}"
                      class="w-16 h-16 object-cover rounded-lg autocomplete-product-image"
                      style="width:64px !important; height:64px !important; min-width:64px; min-height:64px; max-width:64px; max-height:64px;"
                    />
                  </div>
                `) : null}
                <div class="aa-ItemContentBody flex-1 min-w-0">
                  <div class="aa-ItemContentTitle">
                    <span class="font-medium text-sm leading-tight">${item.name}</span>
                  </div>
                  ${item.brand ? (html`<div class="aa-ItemContentDescription text-xs text-gray-600 mt-0.5">by ${item.brand}</div>`) : null}
                  ${typeof item.price === 'number' ? (html`<div class="aa-ItemContentDescription text-sm font-semibold text-green-600 mt-1">$${item.price.toFixed(2)}</div>`) : null}
                </div>
              </div>
            </div>
          `;
        },
      },
      onSelect({ item }: { item: ProductSuggestion }) {
        handleProductSelectRef.current(item);
      },
    };

    // Create category suggestions source
    const categorySource: AutocompleteSource<CategorySuggestion> = {
      sourceId: 'categories',
      getItems({ query }: { query: string }) {
        if (!query) return [];
        
        return searchClient.search([{ 
          indexName,
          query,
          params: {
            hitsPerPage: 3,
            attributesToRetrieve: ['objectID', 'name', 'slug', 'level', 'category'],
            filters: 'level:1 OR level:2', // Only show top-level categories
          },
        }]).then(({ results }) => {
          const searchResult = results[0] as unknown;
          const hits = (searchResult as SearchResult)?.hits || [];
          // Filter for category-type results and transform
          return hits
            .filter((hit: SearchHit) => hit.level && hit.slug)
            .map((hit: SearchHit) => ({
              objectID: hit.objectID || '',
              name: hit.name || '',
              slug: hit.slug || '',
              level: hit.level || 0,
              parent: hit.category?.[0] || undefined,
            } as CategorySuggestion));
        }).catch(() => []);
      },
      templates: {
        header(params) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { html } = params as any;
          return html`
            <span class="aa-SourceHeaderTitle">Categories</span>
            <span class="aa-SourceHeaderLine"></span>
          `;
        },
        item(params) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { item, html } = params as any;
          return html`
            <div class="aa-ItemWrapper">
              <div class="aa-ItemContent">
                <div class="aa-ItemIcon"></div>
                <div class="aa-ItemContentBody">
                  <div class="aa-ItemContentTitle">${item.name}</div>
                  <div class="aa-ItemContentDescription text-xs text-gray-500">
                    Category ${item.parent ? `in ${item.parent}` : ''}
                  </div>
                </div>
              </div>
            </div>
          `;
        },
      },
      onSelect({ item }: { item: CategorySuggestion }) {
        handleCategorySelectRef.current(item);
      },
    };

    autocompleteInstanceRef.current = autocomplete<ProductSuggestion | CategorySuggestion>({
      container: autocompleteContainer.current!,
      placeholder,
      initialState: { query },
      openOnFocus: true,
      detachedMediaQuery: 'none', // Keep attached on all devices
      getSources(): Array<AutocompleteSource<ProductSuggestion | CategorySuggestion>> {
        return [
          productSource as AutocompleteSource<ProductSuggestion | CategorySuggestion>,
          categorySource as AutocompleteSource<ProductSuggestion | CategorySuggestion>,
        ];
      },
      plugins: querySuggestionsPlugin 
        ? [recentSearchesPlugin, querySuggestionsPlugin]
        : [recentSearchesPlugin],
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
      }
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
  }, [searchClient, indexName, querySuggestionsIndexName, router, placeholder, query]);

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
          .aa-Panel {
            z-index: 9999 !important;
            position: absolute !important;
          }
          .aa-DetachedOverlay {
            z-index: 9999 !important;
          }
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
