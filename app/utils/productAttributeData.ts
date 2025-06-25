import { Product } from '../models/product';
import { Item } from '../models/item';
import { buildAttributeCombinationMatrix, AttributeCombinationMatrix } from './attributeCombinations';
import { getAttributesForProduct } from './attributeHelpers';

/**
 * Page-level attribute data structure for Phase 3 integration
 */
export interface ProductAttributeData {
  combinationMatrix: AttributeCombinationMatrix;
  allAttributes: Record<string, string[]>;
  hasValidData: boolean;
  error?: string;
}

/**
 * Pre-calculates attribute data at the page level for optimized performance
 * This can be used server-side or client-side depending on the implementation
 */
export function buildProductAttributeData(
  product: Product, 
  items: Item[]
): ProductAttributeData {
  try {
    if (items.length === 0) {
      return {
        combinationMatrix: {},
        allAttributes: {},
        hasValidData: false,
        error: 'No items available for this product'
      };
    }

    const allAttributes = getAttributesForProduct(product, items);
    
    if (Object.keys(allAttributes).length === 0) {
      return {
        combinationMatrix: {},
        allAttributes: {},
        hasValidData: false,
        error: 'No attributes found for this product'
      };
    }

    const combinationMatrix = buildAttributeCombinationMatrix(product.id, items);

    return {
      combinationMatrix,
      allAttributes,
      hasValidData: true
    };
  } catch (error) {
    console.error('Error building product attribute data:', error);
    return {
      combinationMatrix: {},
      allAttributes: {},
      hasValidData: false,
      error: error instanceof Error ? error.message : 'Unknown error building attribute data'
    };
  }
}

/**
 * Validates that attribute data is properly structured
 */
export function validateAttributeData(data: ProductAttributeData): boolean {
  if (!data.hasValidData) {
    return false;
  }

  // Check that we have both matrix and attributes
  if (Object.keys(data.combinationMatrix).length === 0 || Object.keys(data.allAttributes).length === 0) {
    return false;
  }

  // Validate that all attributes in the matrix exist in allAttributes
  const matrixAttributes = Object.keys(data.combinationMatrix);
  const availableAttributes = Object.keys(data.allAttributes);
  
  return matrixAttributes.every(attr => availableAttributes.includes(attr));
}

/**
 * Server-side or build-time attribute data calculation
 * This would be used in Next.js getStaticProps or similar
 */
export function getProductAttributeDataStatic(
  product: Product,
  items: Item[]
): ProductAttributeData {
  // This could be enhanced with caching, memoization, or other optimizations
  return buildProductAttributeData(product, items);
}

/**
 * Error recovery for attribute data
 */
export function getDefaultAttributeData(): ProductAttributeData {
  return {
    combinationMatrix: {},
    allAttributes: {},
    hasValidData: false,
    error: 'Failed to load attribute data'
  };
}
