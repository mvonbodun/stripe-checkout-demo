'use client';

import React, { useState, useEffect } from 'react';
import { useSearchBox, Configure } from 'react-instantsearch';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import SearchStats from './SearchStats';
import SearchResults from './SearchResults';
import SearchPagination from './SearchPagination';
import SearchFacets from './SearchFacets';
import CategoryAwareFacets from './CategoryAwareFacets';
import SearchSort from './SearchSort';
import AnalyticsDashboard from '../analytics/AnalyticsDashboard';
import Breadcrumb from '../Breadcrumb';
import { CategoryTree } from '../../models/category';
import { getCategoryAlgoliaField, getCategoryBreadcrumbPath } from '../../utils/category-lookup';
import { useCategories } from '../../categories-context';

interface CategorySearchInterfaceProps {
  category: CategoryTree;
  className?: string;
  showCategoryHeader?: boolean;
  showSubcategoryFacets?: boolean;
}

/**
 * Component to handle initial query from URL parameters
 */
function InitialQueryHandler() {
  const { refine } = useSearchBox();
  const searchParams = useSearchParams();

  useEffect(() => {
    const queryParam = searchParams.get('query');
    if (queryParam) {
      refine(queryParam);
    }
  }, [searchParams, refine]);

  return null;
}

/**
 * Component to apply category filter without flickering
 * This prevents showing all results before filtering
 */
function CategoryFilterHandler({ category }: { category: CategoryTree }) {
  try {
    // Get the appropriate Algolia field for this category
    const algoliaField = getCategoryAlgoliaField(category.path);
    
    // Apply the category filter using Configure component
    const filter = `${algoliaField.field}:"${algoliaField.value}"`;
    console.log(`Applying category filter: ${filter}`);
    
    return <Configure filters={filter} />;
  } catch (error) {
    console.error('Failed to apply category filter:', error);
    return null;
  }
}

/**
 * Category header component with breadcrumbs, title, and description
 */
function CategoryHeader({ category }: { category: CategoryTree }) {
  const { categories, buildCategoryUrl } = useCategories();
  const [imageError, setImageError] = useState(false);
  
  // Generate breadcrumbs using proper hierarchical URLs
  const breadcrumbs = getCategoryBreadcrumbPath(category, categories).map(cat => ({
    label: cat.name,
    href: buildCategoryUrl(cat)
  }));

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbs} className="mb-4" />

        {/* Category Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                Level {category.level}
              </span>
            </div>
            
            {category.description && (
              <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">
                {category.description}
              </p>
            )}
            
            {/* Category Stats */}
            <div className="mt-6 flex items-center space-x-6 text-sm text-gray-500">
              <span>Category: {category.path}</span>
              {category.productCount && (
                <span>{category.productCount} products</span>
              )}
            </div>
          </div>

          {/* Category Image */}
          {category.imageUrl && (
            <div className="ml-8 flex-shrink-0">
              <div className="w-32 h-32 rounded-lg overflow-hidden relative">
                {!imageError ? (
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    fill
                    className="object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center text-white font-medium text-sm text-center px-2"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    }}
                  >
                    {category.name}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Category-aware SearchInterface that pre-filters results by category
 * and provides category-specific UI enhancements
 */
export default function CategorySearchInterface({ 
  category, 
  className = '',
  showCategoryHeader = true,
  showSubcategoryFacets = true 
}: CategorySearchInterfaceProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className={`category-search-interface ${className}`}>
      {/* Apply category filter immediately to prevent flickering */}
      <CategoryFilterHandler category={category} />
      
      {/* Handle initial query from URL */}
      <InitialQueryHandler />
      
      {/* Category Header Section */}
      {showCategoryHeader && <CategoryHeader category={category} />}
      
      {/* Search Interface */}
      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"></path>
              </svg>
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Main Search Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow-sm p-6 lg:sticky lg:top-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Refine {category.name}
                  </h3>
                  
                  {/* Show subcategory navigation if available */}
                  {showSubcategoryFacets && category.children && category.children.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Subcategories</h4>
                      <div className="space-y-2">
                        {category.children.map(subcategory => (
                          <a
                            key={subcategory.id}
                            href={`/c/${subcategory.slug}`}
                            className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {subcategory.name}
                            {subcategory.productCount && (
                              <span className="text-gray-500 ml-1">({subcategory.productCount})</span>
                            )}
                          </a>
                        ))}
                      </div>
                      <hr className="my-4" />
                    </div>
                  )}
                  
                  {/* Standard search facets without category hierarchy */}
                  <CategoryAwareFacets 
                    hideCategoryHierarchy={true}
                    currentCategoryLevel={category.level}
                  />
                </div>
                
                {/* Analytics Dashboard */}
                <AnalyticsDashboard className="lg:sticky lg:top-4" />
              </div>
            </div>

            {/* Search Results */}
            <div className="lg:col-span-3">
              {/* Stats and Sort Row */}
              <div className="flex items-center justify-between mb-6">
                <SearchStats />
                <SearchSort />
              </div>
              
              {/* Results */}
              <SearchResults />
              
              {/* Pagination */}
              <SearchPagination />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
