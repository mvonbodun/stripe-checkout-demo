import { Product } from '../models/product';
import { Item, getAvailableSpecificationValues } from '../models/item';
import { AttributeCombinationMatrix } from './attributeCombinations';

/**
 * Enhanced version of getAttributesForProduct that works with items
 * to build the complete attribute list based on actual item data
 */
export function getAttributesForProduct(product: Product, items: Item[]): Record<string, string[]> {
  const attributes: Record<string, string[]> = {};
  
  // If product has itemDefiningSpecifications, use those with actual item data
  if (product.itemDefiningSpecifications && product.itemDefiningSpecifications.length > 0) {
    product.itemDefiningSpecifications.forEach(spec => {
      const availableValues = getAvailableSpecificationValues(product.id, spec.name);
      if (availableValues.length > 0) {
        attributes[spec.name] = availableValues;
      }
    });
    return attributes;
  }
  
  // Fallback: analyze items directly if no itemDefiningSpecifications
  if (items.length > 0) {
    const specNames = new Set<string>();
    
    // Collect all specification names from items
    items.forEach(item => {
      item.itemDefiningSpecificationValues.forEach(spec => {
        specNames.add(spec.name);
      });
    });
    
    // Build attributes from actual item data
    specNames.forEach(specName => {
      const values = new Set<string>();
      items.forEach(item => {
        const spec = item.itemDefiningSpecificationValues.find(s => s.name === specName);
        if (spec) {
          values.add(spec.value);
        }
      });
      
      if (values.size > 0) {
        attributes[specName] = Array.from(values).sort();
      }
    });
    
    return attributes;
  }
  
  // Final fallback: generate attributes based on product type and categories
  // (for products without itemDefiningSpecifications and no items)
  
  // Add size options for clothing
  if (product.categoryIds.includes('2')) { // Clothing category
    attributes.Size = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  }
  
  // Add color options for applicable products
  if (product.categoryIds.includes('2') || product.categoryIds.includes('13')) { // Clothing or Mobile
    attributes.Color = ['Black', 'White', 'Gray', 'Blue', 'Red'];
  }
  
  // Add capacity for electronics
  if (product.categoryIds.includes('121') || product.categoryIds.includes('131')) { // Laptops or Smartphones
    attributes.Storage = ['128GB', '256GB', '512GB', '1TB'];
  }
  
  // Add screen size for TVs
  if (product.categoryIds.includes('111') || product.categoryIds.includes('112')) { // OLED TVs or QLED TVs
    attributes['Screen Size'] = ['55"', '65"', '75"', '85"'];
  }
  
  return attributes;
}

/**
 * Get the display name for an attribute value from item specifications
 */
export function getAttributeDisplayName(
  items: Item[],
  attributeName: string,
  attributeValue: string
): string {
  for (const item of items) {
    const spec = item.itemDefiningSpecificationValues.find(
      s => s.name === attributeName && s.value === attributeValue
    );
    if (spec && spec.displayName) {
      return spec.displayName;
    }
  }
  
  // Fallback to the value itself
  return attributeValue;
}

/**
 * Find the closest valid option when a selection becomes invalid
 * Uses simple string similarity for now, could be enhanced with more sophisticated matching
 */
export function findClosestOption(invalidValue: string, validOptions: string[]): string | null {
  if (validOptions.length === 0) return null;
  if (validOptions.length === 1) return validOptions[0];
  
  // Simple similarity check - find option with most character overlap
  let bestMatch = validOptions[0];
  let bestScore = 0;
  
  validOptions.forEach(option => {
    const similarity = calculateStringSimilarity(invalidValue.toLowerCase(), option.toLowerCase());
    if (similarity > bestScore) {
      bestScore = similarity;
      bestMatch = option;
    }
  });
  
  return bestMatch;
}

/**
 * Calculate simple string similarity (Jaccard similarity using character bigrams)
 */
function calculateStringSimilarity(str1: string, str2: string): number {
  if (str1 === str2) return 1;
  if (str1.length < 2 || str2.length < 2) return 0;
  
  const bigrams1 = getBigrams(str1);
  const bigrams2 = getBigrams(str2);
  
  const intersection = bigrams1.filter(bigram => bigrams2.includes(bigram));
  const allBigrams = bigrams1.concat(bigrams2);
  const union = Array.from(new Set(allBigrams));
  
  return intersection.length / union.length;
}

/**
 * Get character bigrams from a string
 */
function getBigrams(str: string): string[] {
  const bigrams: string[] = [];
  for (let i = 0; i < str.length - 1; i++) {
    bigrams.push(str.slice(i, i + 2));
  }
  return bigrams;
}

/**
 * Check if any items are available for the current selections
 */
export function hasAvailableItems(
  selections: Record<string, string>,
  items: Item[]
): boolean {
  if (Object.keys(selections).length === 0) return items.length > 0;
  
  return items.some(item => {
    return Object.entries(selections).every(([attrName, value]) => {
      const spec = item.itemDefiningSpecificationValues.find(s => s.name === attrName);
      return spec && spec.value === value;
    });
  });
}

/**
 * Get all attribute names from items
 */
export function getAllAttributeNames(items: Item[]): string[] {
  const attributeNames = new Set<string>();
  
  items.forEach(item => {
    item.itemDefiningSpecificationValues.forEach(spec => {
      attributeNames.add(spec.name);
    });
  });
  
  return Array.from(attributeNames).sort();
}

/**
 * Debug helper to log the combination matrix structure
 */
export function debugCombinationMatrix(matrix: AttributeCombinationMatrix): void {
  console.log('=== Attribute Combination Matrix ===');
  Object.entries(matrix).forEach(([attrName, attrData]) => {
    console.log(`\n${attrName}:`);
    Object.entries(attrData).forEach(([value, data]) => {
      console.log(`  ${value}:`);
      console.log(`    Available items: ${data.availableItems.join(', ')}`);
      console.log(`    Valid combinations:`);
      Object.entries(data.validCombinations).forEach(([otherAttr, values]) => {
        console.log(`      ${otherAttr}: ${values.join(', ')}`);
      });
    });
  });
}
