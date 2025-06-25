'use client';
import { useState, useEffect, useMemo } from 'react';
import { Product } from '../models/product';
import { Item } from '../models/item';
import {
  buildAttributeCombinationMatrix,
  calculateAttributeAvailability,
  validateAndCleanSelections,
  AttributeAvailability
} from '../utils/attributeCombinations';
import { getAttributesForProduct, getAttributeDisplayName, findClosestOption } from '../utils/attributeHelpers';

interface AttributeSelectorProps {
  product: Product;
  items: Item[]; // Add items to props
  selectedOptions: Record<string, string>;
  onOptionsChange: (options: Record<string, string>) => void;
}

export default function AttributeSelector({ 
  product, 
  items,
  selectedOptions, 
  onOptionsChange 
}: AttributeSelectorProps) {
  const [isCalculating, setIsCalculating] = useState(false);
  const [recentlyChanged, setRecentlyChanged] = useState<string | null>(null);

  // Build combination matrix and attributes when items change (memoized)
  const { allAttributes, combinationMatrix } = useMemo(() => {
    if (items.length === 0) {
      return { allAttributes: {}, combinationMatrix: {} };
    }

    try {
      const allAttributes = getAttributesForProduct(product, items);
      const combinationMatrix = buildAttributeCombinationMatrix(product.id, items);
      return { allAttributes, combinationMatrix };
    } catch (error) {
      console.error('Error building attribute state:', error);
      return { allAttributes: {}, combinationMatrix: {} };
    }
  }, [items, product]);

  // Calculate current availability based on selected options (memoized)
  const currentAvailability = useMemo(() => {
    if (Object.keys(combinationMatrix).length === 0) {
      return {};
    }

    return calculateAttributeAvailability(
      combinationMatrix,
      selectedOptions,
      allAttributes
    );
  }, [combinationMatrix, selectedOptions, allAttributes]);

  // Set calculating state when items change
  useEffect(() => {
    if (items.length === 0) return;
    
    setIsCalculating(true);
    const timer = setTimeout(() => setIsCalculating(false), 100);
    return () => clearTimeout(timer);
  }, [items]);

  // Clear recently changed indicator
  useEffect(() => {
    if (recentlyChanged) {
      const timer = setTimeout(() => setRecentlyChanged(null), 1000);
      return () => clearTimeout(timer);
    }
  }, [recentlyChanged]);

  // Enhanced option change handler with validation
  const handleOptionChange = (attributeName: string, value: string) => {
    if (Object.keys(combinationMatrix).length === 0) return;
    
    const availability = currentAvailability[attributeName]?.[value];
    if (!availability?.isAvailable) return; // Don't allow selection of unavailable options
    
    setRecentlyChanged(attributeName);
    
    const newOptions = { ...selectedOptions, [attributeName]: value };
    
    // Check if this selection makes other current selections invalid
    const cleanedOptions = validateAndCleanSelections(
      newOptions,
      combinationMatrix
    );
    
    // If some selections were removed, try to find smart alternatives
    if (Object.keys(cleanedOptions).length < Object.keys(newOptions).length) {
      const removedAttrs = Object.keys(newOptions).filter(key => !cleanedOptions[key]);
      
      // Try to find closest alternatives for removed selections
      removedAttrs.forEach(removedAttr => {
        if (removedAttr !== attributeName) { // Don't replace the one we just selected
          const originalValue = newOptions[removedAttr];
          const validOptions = Object.keys(combinationMatrix[removedAttr] || {});
          const closestOption = findClosestOption(originalValue, validOptions);
          
          if (closestOption) {
            const testOptions = { ...cleanedOptions, [removedAttr]: closestOption };
            const testValidity = validateAndCleanSelections(testOptions, combinationMatrix);
            
            if (Object.keys(testValidity).length === Object.keys(testOptions).length) {
              cleanedOptions[removedAttr] = closestOption;
            }
          }
        }
      });
    }
    
    onOptionsChange(cleanedOptions);
  };

  // Get CSS classes for option buttons
  const getOptionClassName = (
    attributeName: string, 
    option: string, 
    availability: AttributeAvailability
  ) => {
    const state = availability[attributeName]?.[option];
    
    if (!state) return '';
    
    const baseClasses = 'px-4 py-2 border rounded-md text-sm font-medium transition-all duration-200';
    const isRecentlyChanged = recentlyChanged === attributeName;
    
    if (state.isSelected) {
      const selectedClasses = 'bg-blue-600 text-white border-blue-600';
      return `${baseClasses} ${selectedClasses} ${isRecentlyChanged ? 'ring-2 ring-blue-300' : ''}`;
    }
    
    if (!state.isAvailable) {
      return `${baseClasses} bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50`;
    }
    
    return `${baseClasses} bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 cursor-pointer`;
  };

  // Show loading state
  if (isCalculating) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
          <span>Loading available options...</span>
        </div>
      </div>
    );
  }

  // No attribute state available
  if (Object.keys(allAttributes).length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {Object.entries(allAttributes).map(([attributeName, options]) => (
        <div key={attributeName}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {attributeName}
          </label>
          <div className="flex flex-wrap gap-2">
            {(options as string[]).map((option) => {
              const state = currentAvailability[attributeName]?.[option];
              const displayName = getAttributeDisplayName(items, attributeName, option);
              
              return (
                <button
                  key={option}
                  onClick={() => handleOptionChange(attributeName, option)}
                  disabled={!state?.isAvailable}
                  aria-pressed={state?.isSelected}
                  aria-describedby={!state?.isAvailable ? `${attributeName}-${option}-unavailable` : undefined}
                  className={getOptionClassName(attributeName, option, currentAvailability)}
                  title={!state?.isAvailable ? 'Not available with current selection' : displayName || option}
                >
                  {displayName || option}
                  {/* Hidden description for screen readers */}
                  {!state?.isAvailable && (
                    <span 
                      id={`${attributeName}-${option}-unavailable`} 
                      className="sr-only"
                    >
                      {option} is not available with your current selection
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      
      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-gray-600">
          <details>
            <summary className="cursor-pointer">Debug Info</summary>
            <div className="mt-2 space-y-1">
              <div>Selected: {JSON.stringify(selectedOptions)}</div>
              <div>Available combinations: {Object.keys(combinationMatrix).length}</div>
              <div>Recently changed: {recentlyChanged || 'none'}</div>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}
