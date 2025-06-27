'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';

interface ProductPageContextType {
  selectedAttributes: Record<string, string>;
  updateSelectedAttributes: (attributes: Record<string, string>) => void;
}

const ProductPageContext = createContext<ProductPageContextType | undefined>(undefined);

interface ProductPageProviderProps {
  children: React.ReactNode;
}

export function ProductPageProvider({ children }: ProductPageProviderProps) {
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});

  const updateSelectedAttributes = useCallback((attributes: Record<string, string>) => {
    setSelectedAttributes(attributes);
  }, []);

  return (
    <ProductPageContext.Provider value={{ selectedAttributes, updateSelectedAttributes }}>
      {children}
    </ProductPageContext.Provider>
  );
}

export function useProductPageContext() {
  const context = useContext(ProductPageContext);
  if (context === undefined) {
    throw new Error('useProductPageContext must be used within a ProductPageProvider');
  }
  return context;
}
