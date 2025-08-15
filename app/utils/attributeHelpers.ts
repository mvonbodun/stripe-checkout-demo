import { Product } from '../models/product';
import { Item, getAvailableSpecificationValues } from '../models/item';
import { AttributeCombinationMatrix } from './attributeCombinations';

/**
 * Enhanced version of getAttributesForProduct that works with items
 * to build the complete attribute list based on actual item data
 * Now includes smart ordering: Color first, then alphabetical
 * And smart value sorting: colors alphabetical, sizes numeric if possible
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
    
    // Only return if we found some attributes, otherwise fall back to analyzing items
    if (Object.keys(attributes).length > 0) {
      return sortAttributesAndValues(attributes);
    }
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
    
    return sortAttributesAndValues(attributes);
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
  
  return sortAttributesAndValues(attributes);
}

/**
 * Sort attributes and their values for optimal UX:
 * 1. Color attribute comes first (if it exists)
 * 2. Other attributes are sorted alphabetically
 * 3. Values are sorted logically:
 *    - Colors: alphabetically
 *    - Sizes: numerically if all numeric, otherwise alphabetically
 *    - Everything else: alphabetically
 */
function sortAttributesAndValues(attributes: Record<string, string[]>): Record<string, string[]> {
  const sortedAttributes: Record<string, string[]> = {};
  
  // Step 1: Sort attribute keys with Color first, then alphabetically
  const sortedKeys = Object.keys(attributes).sort((a, b) => {
    const aIsColor = a.toLowerCase().includes('color') || a.toLowerCase().includes('colour');
    const bIsColor = b.toLowerCase().includes('color') || b.toLowerCase().includes('colour');
    
    // Color comes first
    if (aIsColor && !bIsColor) return -1;
    if (!aIsColor && bIsColor) return 1;
    
    // Otherwise alphabetical
    return a.localeCompare(b);
  });
  
  // Step 2: For each attribute, sort its values appropriately
  sortedKeys.forEach(attributeName => {
    const values = attributes[attributeName];
    const sortedValues = sortAttributeValues(attributeName, values);
    sortedAttributes[attributeName] = sortedValues;
  });
  
  return sortedAttributes;
}

/**
 * Sort attribute values based on the attribute type
 */
function sortAttributeValues(attributeName: string, values: string[]): string[] {
  const lowerAttributeName = attributeName.toLowerCase();
  
  // Color values: alphabetical
  if (lowerAttributeName.includes('color') || lowerAttributeName.includes('colour')) {
    return [...values].sort();
  }
  
  // Size values: try numeric sorting if all values are numeric
  if (lowerAttributeName.includes('size')) {
    // Check if all values are numeric (with optional units)
    const numericPattern = /^(\d+(?:\.\d+)?)\s*([a-zA-Z"']*)?$/;
    const allNumeric = values.every(value => numericPattern.test(value.trim()));
    
    if (allNumeric) {
      return [...values].sort((a, b) => {
        const numA = parseFloat(a.match(numericPattern)?.[1] || '0');
        const numB = parseFloat(b.match(numericPattern)?.[1] || '0');
        return numA - numB;
      });
    }
  }
  
  // Storage/Memory values: try to sort by numeric capacity
  if (lowerAttributeName.includes('storage') || 
      lowerAttributeName.includes('memory') || 
      lowerAttributeName.includes('capacity')) {
    
    return [...values].sort((a, b) => {
      const bytesA = parseStorageSize(a);
      const bytesB = parseStorageSize(b);
      return bytesA - bytesB;
    });
  }
  
  // Default: alphabetical sorting
  return [...values].sort();
}

/**
 * Parse storage size strings to bytes for proper sorting
 * Handles: 128GB, 1TB, 512 GB SSD, etc.
 */
function parseStorageSize(storage: string): number {
  const cleanStorage = storage.toLowerCase().replace(/[^0-9.kmgt]/g, '');
  const match = cleanStorage.match(/^(\d+(?:\.\d+)?)(k|m|g|t)?/);
  
  if (!match) return 0;
  
  const value = parseFloat(match[1]);
  const unit = match[2];
  
  switch (unit) {
    case 'k': return value * 1024;
    case 'm': return value * 1024 * 1024;
    case 'g': return value * 1024 * 1024 * 1024;
    case 't': return value * 1024 * 1024 * 1024 * 1024;
    default: return value;
  }
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

/**
 * Calculate initial attribute selections for pre-selection
 * Only pre-selects the first attribute and its first available value
 * @param allAttributes - Available attributes and their values
 * @param combinationMatrix - Attribute combination matrix for validation
 * @returns Record of pre-selected attribute -> value pairs
 */
export function calculateInitialAttributeSelections(
  allAttributes: Record<string, string[]>,
  combinationMatrix: AttributeCombinationMatrix
): Record<string, string> {
  // Return empty if no attributes available
  if (Object.keys(allAttributes).length === 0) {
    return {};
  }

  // Get the first attribute (respects ordering from allAttributes)
  const firstAttributeName = Object.keys(allAttributes)[0];
  const firstAttributeValues = allAttributes[firstAttributeName];

  // Return empty if no values available for first attribute
  if (!firstAttributeValues || firstAttributeValues.length === 0) {
    return {};
  }

  // Get the first available value for the first attribute
  const firstValue = firstAttributeValues[0];

  // Validate that this selection is available using combination matrix
  // Check if the combination matrix has this attribute and value
  if (combinationMatrix[firstAttributeName] && 
      combinationMatrix[firstAttributeName][firstValue]) {
    
    // Return the pre-selection for only the first attribute
    return {
      [firstAttributeName]: firstValue
    };
  }

  // No valid pre-selection available
  return {};
}

/**
 * Determine which item's images should be displayed based on the specified logic:
 * 1. If product has only one item, use that item's images
 * 2. If product has multiple items:
 *    - If none of the itemDefiningAttributes is "Color", use the first item's images
 *    - If "Color" is an itemDefiningAttribute, use the first item with the selected color (or first color if none selected)
 *    - When the user selects a different color, find the first item with that color and use its images
 */
export function getItemForImages(
  product: Product,
  items: Item[],
  selectedAttributes: Record<string, string> = {}
): Item | null {
  if (!items || items.length === 0) {
    return null;
  }

  // Case 1: Single item - use that item
  if (items.length === 1) {
    return items[0];
  }

  // Case 2: Multiple items - check if Color is a defining attribute
  const hasColorAttribute = product.itemDefiningSpecifications?.some(
    spec => spec.name.toLowerCase() === 'color'
  ) || false;

  if (!hasColorAttribute) {
    // Case 2a: No Color attribute - use first item (sorted by position)
    return items.sort((a, b) => a.position - b.position)[0];
  }

  // Case 2b: Has Color attribute
  const selectedColor = selectedAttributes['Color'] || selectedAttributes['color'];
  
  if (selectedColor) {
    // User has selected a color - find first item with that color
    const itemWithSelectedColor = items.find(item => 
      item.itemDefiningSpecificationValues.some(spec => 
        spec.name.toLowerCase() === 'color' && spec.value === selectedColor
      )
    );
    
    if (itemWithSelectedColor) {
      return itemWithSelectedColor;
    }
  }

  // Fall back to first item with first available color value
  const colorValues = getAvailableSpecificationValues(product.id, 'Color') || 
                     getAvailableSpecificationValues(product.id, 'color') || [];
  
  if (colorValues.length > 0) {
    const firstColor = colorValues[0];
    const itemWithFirstColor = items.find(item =>
      item.itemDefiningSpecificationValues.some(spec =>
        spec.name.toLowerCase() === 'color' && spec.value === firstColor
      )
    );
    
    if (itemWithFirstColor) {
      return itemWithFirstColor;
    }
  }

  // Final fallback - return first item by position
  return items.sort((a, b) => a.position - b.position)[0];
}

/**
 * Get images from an item, with fallback to product images if item has no images
 */
export function getImagesForDisplay(item: Item | null, product: Product) {
  // If we have an item and it has images, use those
  if (item && item.images && item.images.length > 0) {
    return item.images;
  }

  // Fallback to product images
  return product.images || [];
}
