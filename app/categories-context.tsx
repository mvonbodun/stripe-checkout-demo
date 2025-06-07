'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CatalogCategory } from './api/catalog-categories/route';

// Context for sharing categories data across components
interface CategoriesContextType {
  categories: CatalogCategory[];
  isLoading: boolean;
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
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/catalog-categories");
        if (response.ok) {
          const categoriesData = await response.json();
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const value: CategoriesContextType = {
    categories,
    isLoading,
  };

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
}
