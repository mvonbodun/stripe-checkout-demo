'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Product } from '../models/product';
import { Item, getDefaultItem, findItemBySpecificationValues } from '../models/item';
import { buildAttributeCombinationMatrix, AttributeCombinationMatrix } from '../utils/attributeCombinations';
import { getAttributesForProduct } from '../utils/attributeHelpers';
import { validateAddToCartState } from '../utils/addToCartValidation';
import QuantitySelector from './QuantitySelector';
import AddToCartButton from './AddToCartButton';
import AttributeSelector from './AttributeSelector';
import ProductRatingAndQA from './ProductRatingAndQA';

interface ProductInfoProps {
  product: Product;
  items: Item[];
  // Phase 3: Enhanced props for pre-calculated data
  combinationMatrix?: AttributeCombinationMatrix;
  allAttributes?: Record<string, string[]>;
}

export default function ProductInfo({ 
  product, 
  items, 
  combinationMatrix: providedMatrix,
  allAttributes: providedAttributes 
}: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [attributeError, setAttributeError] = useState<string | null>(null);
  const [attributeState, setAttributeState] = useState<{ isLoading: boolean; hasError: boolean }>({ 
    isLoading: false, 
    hasError: false 
  });

  // Pre-calculate combination matrix and attributes (Phase 3 enhancement)
  const { combinationMatrix, allAttributes, hasValidData } = useMemo(() => {
    // Use provided data if available (Phase 3)
    if (providedMatrix && providedAttributes) {
      return { 
        combinationMatrix: providedMatrix, 
        allAttributes: providedAttributes, 
        hasValidData: Object.keys(providedAttributes).length > 0 
      };
    }

    // Fallback to original calculation for backward compatibility
    if (items.length === 0) {
      return { combinationMatrix: {}, allAttributes: {}, hasValidData: false };
    }

    try {
      const allAttributes = getAttributesForProduct(product, items);
      const combinationMatrix = buildAttributeCombinationMatrix(product.id, items);
      return { 
        allAttributes, 
        combinationMatrix, 
        hasValidData: Object.keys(allAttributes).length > 0 
      };
    } catch (error) {
      console.error('Error pre-calculating attribute data:', error);
      return { combinationMatrix: {}, allAttributes: {}, hasValidData: false };
    }
  }, [providedMatrix, providedAttributes, product, items]);

  // Enhanced options change handler
  const handleOptionsChange = useCallback((newOptions: Record<string, string>) => {
    setSelectedOptions(newOptions);
    
    // Find matching item
    if (Object.keys(newOptions).length > 0) {
      const foundItem = findItemBySpecificationValues(product.id, newOptions);
      setSelectedItem(foundItem || null);
    } else {
      const defaultItem = getDefaultItem(product.id);
      setSelectedItem(defaultItem || (items.length > 0 ? items[0] : null));
    }
  }, [product.id, items]);

  // Handle attribute selector errors
  const handleAttributeError = useCallback((error: string) => {
    setAttributeError(error);
  }, []);

  // Handle attribute selector state changes
  const handleAttributeStateChange = useCallback((state: { isLoading: boolean; hasError: boolean }) => {
    setAttributeState(state);
  }, []);

  // Legacy fallback: Get selected item based on options (for backward compatibility)
  useEffect(() => {
    if (items.length === 0) {
      setSelectedItem(null);
      return;
    }

    // Only run if not handled by enhanced callback
    if (!hasValidData && Object.keys(selectedOptions).length === 0) {
      const defaultItem = getDefaultItem(product.id);
      setSelectedItem(defaultItem || items[0]);
    }
  }, [selectedOptions, product.id, items, hasValidData]);

  // Calculate discount percentage
  const discountPercentage = product.compareAtPrice && product.compareAtPrice > product.basePrice
    ? Math.round(((product.compareAtPrice - product.basePrice) / product.compareAtPrice) * 100)
    : null;

  // Validate Add to Cart button state
  const addToCartValidation = useMemo(() => {
    return validateAddToCartState(product, items, selectedOptions);
  }, [product, items, selectedOptions]);

  // Synchronize selectedItem with validation result
  useEffect(() => {
    if (addToCartValidation.selectedItem !== selectedItem) {
      setSelectedItem(addToCartValidation.selectedItem);
    }
  }, [addToCartValidation.selectedItem, selectedItem]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Brand */}
      {product.brand && (
        <div className="text-xs sm:text-sm text-gray-600 uppercase tracking-wide font-medium">
          {product.brand}
        </div>
      )}        {/* Product Name */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
          {product.name}
        </h1>
        
        {/* Rating & Q&A */}
        <ProductRatingAndQA />
        
        {/* Price */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <span className="text-2xl sm:text-3xl font-bold text-gray-900">
          ${product.basePrice.toFixed(2)}
        </span>
        {product.compareAtPrice && product.compareAtPrice > product.basePrice && (
          <>
            <span className="text-lg sm:text-xl text-gray-500 line-through">
              ${product.compareAtPrice.toFixed(2)}
            </span>
            {discountPercentage && (
              <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">
                {discountPercentage}% OFF
              </span>
            )}
          </>
        )}
      </div>
      
      {/* Stock Status */}
      <div className="flex items-center space-x-2">
        {product.inStock && (product.totalInventory ? product.totalInventory > 0 : true) ? (
          <>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-700 font-medium">
              {product.totalInventory && product.totalInventory > 0 && product.totalInventory <= 10 
                ? `Only ${product.totalInventory} left` 
                : 'In Stock'
              }
            </span>
          </>
        ) : (
          <>
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-red-700 font-medium">Out of Stock</span>
          </>
        )}
      </div>
      
      {/* Short Description */}
      {product.shortDescription && (
        <div className="prose prose-sm sm:prose max-w-none">
          <p className="text-gray-600 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>
      )}
      
      {/* Key Features */}
      {product.features && product.features.length > 0 && (
        <div className="border-t pt-4 sm:pt-6">
          <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Key Features:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            {product.features.slice(0, 5).map((feature, index) => (
              <li key={index} className="flex items-start">
                <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Attribute Selectors (Size, Color, etc.) */}
      <div className="border-t pt-4 sm:pt-6">
        {/* Error State */}
        {attributeError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{attributeError}</p>
          </div>
        )}
        
        {/* Loading State */}
        {attributeState.isLoading && (
          <div className="mb-4 flex items-center space-x-2 text-sm text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
            <span>Loading product options...</span>
          </div>
        )}
        
        <AttributeSelector 
          product={product}
          items={items}
          selectedOptions={selectedOptions}
          onOptionsChange={handleOptionsChange}
          combinationMatrix={combinationMatrix}
          allAttributes={allAttributes}
          onError={handleAttributeError}
          onStateChange={handleAttributeStateChange}
        />
      </div>
      
      {/* Quantity & Add to Cart */}
      <div className="space-y-4 border-t pt-4 sm:pt-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity
          </label>
          <QuantitySelector
            initialQuantity={quantity}
            onChange={setQuantity}
            className="w-32"
            max={product.totalInventory || 99}
          />
        </div>
        
        <div className="sticky bottom-4 bg-white border-t pt-4 -mx-4 px-4 sm:static sm:bg-transparent sm:border-0 sm:p-0">
          <AddToCartButton
            product={product}
            selectedItem={selectedItem}
            quantity={quantity}
            selectedOptions={selectedOptions}
            className="w-full"
            disabled={!addToCartValidation.isEnabled}
          />
        </div>
        
        {/* Trust Badges */}
        <div className="flex items-center justify-center space-x-6 text-xs text-gray-500 border-t pt-4">
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Secure Checkout</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span>Free Returns</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span>Fast Shipping</span>
          </div>
        </div>
      </div>
      
      {/* Additional Product Info */}
      <div className="border-t pt-6 space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>SKU:</span>
          <span className="font-mono text-xs">{selectedItem?.sku || product.id}</span>
        </div>
        {selectedItem?.weight && (
          <div className="flex justify-between">
            <span>Weight:</span>
            <span>{selectedItem.weight.value} {selectedItem.weight.unit}</span>
          </div>
        )}
        {selectedItem?.dimensions && (
          <div className="flex justify-between">
            <span>Dimensions:</span>
            <span>{selectedItem.dimensions.length} × {selectedItem.dimensions.width} × {selectedItem.dimensions.height} {selectedItem.dimensions.unit}</span>
          </div>
        )}
      </div>
    </div>
  );
}
