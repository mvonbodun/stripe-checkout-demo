'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { analyticsService, AnalyticsService } from '../lib/analytics';

interface AnalyticsContextType {
  analytics: AnalyticsService;
  isInitialized: boolean;
  userToken: string;
  
  // Performance tracking
  searchPerformance: SearchPerformanceMetrics;
  updateSearchPerformance: (updates: Partial<SearchPerformanceMetrics> | ((prev: SearchPerformanceMetrics) => Partial<SearchPerformanceMetrics>)) => void;
  
  // Query tracking
  currentQuery: string;
  currentQueryID: string;
  setCurrentQuery: (query: string, queryID: string) => void;
}

interface SearchPerformanceMetrics {
  searchCount: number;
  totalSearchTime: number;
  averageSearchTime: number;
  noResultsCount: number;
  clickThroughRate: number;
  totalClicks: number;
  totalViews: number;
  conversionRate: number;
  totalConversions: number;
}

const defaultPerformanceMetrics: SearchPerformanceMetrics = {
  searchCount: 0,
  totalSearchTime: 0,
  averageSearchTime: 0,
  noResultsCount: 0,
  clickThroughRate: 0,
  totalClicks: 0,
  totalViews: 0,
  conversionRate: 0,
  totalConversions: 0,
};

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

interface AnalyticsProviderProps {
  children: ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [userToken, setUserToken] = useState('');
  const [currentQuery, setCurrentQueryState] = useState('');
  const [currentQueryID, setCurrentQueryID] = useState('');
  const [searchPerformance, setSearchPerformance] = useState<SearchPerformanceMetrics>(
    defaultPerformanceMetrics
  );

  // Initialize analytics on mount
  useEffect(() => {
    const init = async () => {
      const initialized = analyticsService.init();
      setIsInitialized(initialized);
      
      if (initialized) {
        setUserToken(analyticsService.getUserToken());
        
        // Load performance metrics from localStorage
        const storedMetrics = localStorage.getItem('algolia_search_performance');
        if (storedMetrics) {
          try {
            const metrics = JSON.parse(storedMetrics);
            setSearchPerformance({ ...defaultPerformanceMetrics, ...metrics });
          } catch (error) {
            console.warn('Failed to load stored performance metrics:', error);
          }
        }
      }
    };

    init();
  }, []);

  // Save performance metrics to localStorage when they change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('algolia_search_performance', JSON.stringify(searchPerformance));
    }
  }, [searchPerformance, isInitialized]);

  const updateSearchPerformance = useCallback((updates: Partial<SearchPerformanceMetrics> | ((prev: SearchPerformanceMetrics) => Partial<SearchPerformanceMetrics>)) => {
    setSearchPerformance(prev => {
      const updateObj = typeof updates === 'function' ? updates(prev) : updates;
      const updated = { ...prev, ...updateObj };
      
      // Recalculate derived metrics
      updated.averageSearchTime = updated.searchCount > 0 
        ? updated.totalSearchTime / updated.searchCount 
        : 0;
      
      updated.clickThroughRate = updated.totalViews > 0 
        ? (updated.totalClicks / updated.totalViews) * 100 
        : 0;
      
      updated.conversionRate = updated.totalClicks > 0 
        ? (updated.totalConversions / updated.totalClicks) * 100 
        : 0;
      
      return updated;
    });
  }, []);

  const setCurrentQuery = useCallback((query: string, queryID: string) => {
    setCurrentQueryState(query);
    setCurrentQueryID(queryID);
  }, []);

  const contextValue: AnalyticsContextType = {
    analytics: analyticsService,
    isInitialized,
    userToken,
    searchPerformance,
    updateSearchPerformance,
    currentQuery,
    currentQueryID,
    setCurrentQuery,
  };

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}

// Custom hooks for specific analytics functionality

// Hook for tracking search performance
export function useSearchPerformanceTracking() {
  const { updateSearchPerformance, searchPerformance } = useAnalytics();

  const trackSearch = useCallback((searchTime: number, hasResults: boolean) => {
    updateSearchPerformance((prev) => ({
      searchCount: prev.searchCount + 1,
      totalSearchTime: prev.totalSearchTime + searchTime,
      noResultsCount: !hasResults 
        ? prev.noResultsCount + 1 
        : prev.noResultsCount,
    }));
  }, [updateSearchPerformance]);

  const trackView = useCallback(() => {
    updateSearchPerformance((prev) => ({
      totalViews: prev.totalViews + 1,
    }));
  }, [updateSearchPerformance]);

  const trackClick = useCallback(() => {
    updateSearchPerformance((prev) => ({
      totalClicks: prev.totalClicks + 1,
    }));
  }, [updateSearchPerformance]);

  const trackConversion = useCallback(() => {
    updateSearchPerformance((prev) => ({
      totalConversions: prev.totalConversions + 1,
    }));
  }, [updateSearchPerformance]);

  return {
    trackSearch,
    trackView,
    trackClick,
    trackConversion,
    metrics: searchPerformance,
  };
}

// Hook for tracking click events with automatic performance updates
export function useClickTracking() {
  const { analytics, currentQueryID } = useAnalytics();
  const { trackClick } = useSearchPerformanceTracking();

  const trackProductClick = useCallback((objectID: string, position: number, eventName?: string) => {
    if (!currentQueryID) {
      console.warn('No query ID available for click tracking');
      return;
    }

    analytics.trackClick({
      objectID,
      position,
      queryID: currentQueryID,
      eventName,
    });

    trackClick();
  }, [analytics, currentQueryID, trackClick]);

  return { trackProductClick };
}

// Hook for tracking conversion events with automatic performance updates
export function useConversionTracking() {
  const { analytics, currentQueryID } = useAnalytics();
  const { trackConversion } = useSearchPerformanceTracking();

  const trackProductConversion = useCallback((objectID: string, eventName?: string) => {
    if (!currentQueryID) {
      console.warn('No query ID available for conversion tracking');
      return;
    }

    analytics.trackConversion({
      objectID,
      queryID: currentQueryID,
      eventName,
    });

    trackConversion();
  }, [analytics, currentQueryID, trackConversion]);

  const trackAddToCart = useCallback((objectID: string, value?: number, currency?: string, quantity?: number) => {
    analytics.trackAddToCart({
      objectID,
      queryID: currentQueryID,
      value,
      currency,
      quantity,
      eventName: 'Add to Cart',
    });

    trackConversion();
  }, [analytics, currentQueryID, trackConversion]);

  const trackPurchase = useCallback((objectID: string, value?: number, currency?: string, quantity?: number) => {
    analytics.trackPurchase({
      objectID,
      queryID: currentQueryID,
      value,
      currency,
      quantity,
      eventName: 'Purchase',
    });

    trackConversion();
  }, [analytics, currentQueryID, trackConversion]);

  return {
    trackProductConversion,
    trackAddToCart,
    trackPurchase,
  };
}
