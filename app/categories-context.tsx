'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';
import { CategoryTree } from './models/category';
import { 
  findCategoryBySlug, 
  findCategoryBySlugPath,
  getCategoryBreadcrumbPath,
  getCategoryChildren,
  hasChildren,
  buildCategorySlugUrl,
  AlgoliaField,
  getCategoryAlgoliaField
} from './utils/category-lookup';

// Context for sharing categories data across components
interface CategoriesContextType {
  categories: CategoryTree[];
  isLoading: boolean;
  
  // Lookup methods
  findCategoryBySlug: (slug: string) => CategoryTree | null;
  findCategoryBySlugPath: (slugPath: string[]) => CategoryTree | null;
  getCategoryBreadcrumbs: (category: CategoryTree) => CategoryTree[];
  getCategoryChildren: (category: CategoryTree) => CategoryTree[];
  hasChildren: (category: CategoryTree) => boolean;
  buildCategoryUrl: (category: CategoryTree) => string;
  getCategoryAlgoliaField: (category: CategoryTree) => AlgoliaField;
  
  // Cache and performance
  getCacheStats: () => { size: number; hitRate: number };
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export function useCategories() {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
}

interface CategoriesProviderProps {
  children: ReactNode;
}

export function CategoriesProvider({ children }: CategoriesProviderProps) {
  const [categories, setCategories] = useState<CategoryTree[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Cache for lookup performance
  const [lookupCache, setLookupCache] = useState<Map<string, CategoryTree>>(new Map());
  const [cacheHits, setCacheHits] = useState(0);
  const [cacheRequests, setCacheRequests] = useState(0);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        // Fetch category tree instead of flat categories
        const response = await fetch("/api/catalog-categories?tree=true");
        if (response.ok) {
          const categoriesData = await response.json();
          setCategories(categoriesData);
          
          // Clear cache when new data is loaded
          setLookupCache(new Map());
          setCacheHits(0);
          setCacheRequests(0);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Memoized lookup methods with caching
  const contextMethods = useMemo(() => {
    const findCategoryBySlugCached = (slug: string): CategoryTree | null => {
      setCacheRequests(prev => prev + 1);
      
      // Check cache first
      if (lookupCache.has(slug)) {
        setCacheHits(prev => prev + 1);
        return lookupCache.get(slug) || null;
      }
      
      // Perform lookup
      const result = findCategoryBySlug(slug, categories);
      
      // Cache the result (even if null)
      if (result) {
        setLookupCache(prev => new Map(prev.set(slug, result)));
      }
      
      return result;
    };

    const findCategoryBySlugPathCached = (slugPath: string[]): CategoryTree | null => {
      const slugKey = slugPath.join('/');
      setCacheRequests(prev => prev + 1);
      
      // Check cache first
      if (lookupCache.has(slugKey)) {
        setCacheHits(prev => prev + 1);
        return lookupCache.get(slugKey) || null;
      }
      
      // Perform lookup
      const result = findCategoryBySlugPath(slugPath, categories);
      
      // Cache the result
      if (result) {
        setLookupCache(prev => new Map(prev.set(slugKey, result)));
      }
      
      return result;
    };

    const getCategoryBreadcrumbs = (category: CategoryTree): CategoryTree[] => {
      return getCategoryBreadcrumbPath(category, categories);
    };

    const getCategoryChildrenMethod = (category: CategoryTree): CategoryTree[] => {
      return getCategoryChildren(category);
    };

    const hasCategoryChildren = (category: CategoryTree): boolean => {
      return hasChildren(category);
    };

    const buildCategoryUrl = (category: CategoryTree): string => {
      return buildCategorySlugUrl(category);
    };

    const getCategoryAlgoliaFieldMethod = (category: CategoryTree): AlgoliaField => {
      return getCategoryAlgoliaField(category.path);
    };

    const getCacheStats = () => ({
      size: lookupCache.size,
      hitRate: cacheRequests > 0 ? cacheHits / cacheRequests : 0
    });

    return {
      findCategoryBySlug: findCategoryBySlugCached,
      findCategoryBySlugPath: findCategoryBySlugPathCached,
      getCategoryBreadcrumbs,
      getCategoryChildren: getCategoryChildrenMethod,
      hasChildren: hasCategoryChildren,
      buildCategoryUrl,
      getCategoryAlgoliaField: getCategoryAlgoliaFieldMethod,
      getCacheStats
    };
  }, [categories, lookupCache, cacheHits, cacheRequests]);

  const value: CategoriesContextType = {
    categories,
    isLoading,
    ...contextMethods
  };

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
}
