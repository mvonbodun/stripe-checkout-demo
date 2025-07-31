'use client';

import React, { useState } from 'react';
import { useAnalytics, useSearchPerformanceTracking } from '../../contexts/AnalyticsContext';

interface AnalyticsDashboardProps {
  className?: string;
}

export default function AnalyticsDashboard({ className = '' }: AnalyticsDashboardProps) {
  const { isInitialized, userToken } = useAnalytics();
  const { metrics } = useSearchPerformanceTracking();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isInitialized) {
    return (
      <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-400 rounded-full mr-3"></div>
          <span className="text-sm text-yellow-800">Analytics not initialized</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer border-b border-gray-200 hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          <h3 className="text-sm font-medium text-gray-900">Search Analytics</h3>
        </div>
        <svg 
          className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600">{metrics.searchCount}</div>
              <div className="text-xs text-blue-500 uppercase tracking-wide">Total Searches</div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-600">
                {metrics.averageSearchTime > 0 ? `${metrics.averageSearchTime.toFixed(0)}ms` : '0ms'}
              </div>
              <div className="text-xs text-green-500 uppercase tracking-wide">Avg Search Time</div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-purple-600">
                {metrics.clickThroughRate.toFixed(1)}%
              </div>
              <div className="text-xs text-purple-500 uppercase tracking-wide">Click Through Rate</div>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-orange-600">
                {metrics.conversionRate.toFixed(1)}%
              </div>
              <div className="text-xs text-orange-500 uppercase tracking-wide">Conversion Rate</div>
            </div>
          </div>

          {/* Detailed Metrics */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Views:</span>
                <span className="font-medium">{metrics.totalViews}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Clicks:</span>
                <span className="font-medium">{metrics.totalClicks}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Conversions:</span>
                <span className="font-medium">{metrics.totalConversions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">No Results:</span>
                <span className="font-medium">{metrics.noResultsCount}</span>
              </div>
            </div>

            {/* User Token (for debugging) */}
            <div className="pt-3 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                <span className="font-medium">User Token:</span> {userToken.substring(0, 20)}...
              </div>
            </div>
          </div>

          {/* Reset Button */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                localStorage.removeItem('algolia_search_performance');
                window.location.reload();
              }}
              className="text-xs text-red-600 hover:text-red-800 underline"
            >
              Reset Analytics Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
