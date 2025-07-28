'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface SearchState {
  query: string;
  filters: Record<string, string[]>;
  sortBy: string;
  page: number;
  resultsCount: number;
  searchTime: number;
  isLoading: boolean;
}

interface SearchContextType {
  searchState: SearchState;
  updateQuery: (query: string) => void;
  updateFilters: (filters: Record<string, string[]>) => void;
  updateSortBy: (sortBy: string) => void;
  updatePage: (page: number) => void;
  setResultsStats: (count: number, time: number) => void;
  setLoading: (loading: boolean) => void;
  clearAllFilters: () => void;
  clearSearch: () => void;
}

const initialSearchState: SearchState = {
  query: '',
  filters: {},
  sortBy: 'relevance',
  page: 0,
  resultsCount: 0,
  searchTime: 0,
  isLoading: false,
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchProviderProps {
  children: ReactNode;
}

export function SearchProvider({ children }: SearchProviderProps) {
  const [searchState, setSearchState] = useState<SearchState>(initialSearchState);

  const updateQuery = useCallback((query: string) => {
    setSearchState(prev => ({
      ...prev,
      query,
      page: 0, // Reset page when query changes
    }));
  }, []);

  const updateFilters = useCallback((filters: Record<string, string[]>) => {
    setSearchState(prev => ({
      ...prev,
      filters,
      page: 0, // Reset page when filters change
    }));
  }, []);

  const updateSortBy = useCallback((sortBy: string) => {
    setSearchState(prev => ({
      ...prev,
      sortBy,
      page: 0, // Reset page when sort changes
    }));
  }, []);

  const updatePage = useCallback((page: number) => {
    setSearchState(prev => ({
      ...prev,
      page,
    }));
  }, []);

  const setResultsStats = useCallback((count: number, time: number) => {
    setSearchState(prev => ({
      ...prev,
      resultsCount: count,
      searchTime: time,
    }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setSearchState(prev => ({
      ...prev,
      isLoading: loading,
    }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchState(prev => ({
      ...prev,
      filters: {},
      page: 0,
    }));
  }, []);

  const clearSearch = useCallback(() => {
    setSearchState(initialSearchState);
  }, []);

  const contextValue: SearchContextType = {
    searchState,
    updateQuery,
    updateFilters,
    updateSortBy,
    updatePage,
    setResultsStats,
    setLoading,
    clearAllFilters,
    clearSearch,
  };

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}

// Hook for URL persistence (to be implemented later)
export function useSearchURL() {
  const { searchState, updateQuery, updateFilters, updateSortBy, updatePage } = useSearch();
  
  // TODO: Implement URL synchronization
  // This will handle reading from and writing to URL parameters
  // for search persistence and deep linking
  
  return {
    searchState,
    updateQuery,
    updateFilters,
    updateSortBy,
    updatePage,
  };
}
