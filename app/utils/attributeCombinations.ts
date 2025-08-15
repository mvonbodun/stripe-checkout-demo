import { Item } from '../models/item';

/**
 * Core interfaces for attribute combination management
 */
export interface AttributeCombinationMatrix {
  [attributeName: string]: {
    [attributeValue: string]: {
      validCombinations: Record<string, string[]>;
      availableItems: string[]; // item IDs
    }
  }
}

export interface AttributeAvailability {
  [attributeName: string]: {
    [attributeValue: string]: {
      isAvailable: boolean;
      isSelected: boolean;
      hasStock?: boolean; // Phase 3C: Inventory awareness
      inventoryCount?: number; // Phase 3C: Total inventory for this attribute value
    }
  }
}

export interface AttributeState {
  allAttributes: Record<string, string[]>;
  combinationMatrix: AttributeCombinationMatrix;
  currentAvailability: AttributeAvailability;
}

/**
 * Analyzes all items for a product and builds a comprehensive matrix
 * of valid attribute combinations
 */
export function buildAttributeCombinationMatrix(
  productId: string,
  items: Item[]
): AttributeCombinationMatrix {
  const matrix: AttributeCombinationMatrix = {};
  
  // For each item, map its attributes to all other attributes
  items.forEach(item => {
    item.itemDefiningSpecificationValues.forEach(spec => {
      if (!matrix[spec.name]) {
        matrix[spec.name] = {};
      }
      
      if (!matrix[spec.name][spec.value]) {
        matrix[spec.name][spec.value] = {
          validCombinations: {},
          availableItems: []
        };
      }
      
      matrix[spec.name][spec.value].availableItems.push(item.id);
      
      // Map this attribute value to all other attributes in the same item
      item.itemDefiningSpecificationValues.forEach(otherSpec => {
        if (otherSpec.name !== spec.name) {
          if (!matrix[spec.name][spec.value].validCombinations[otherSpec.name]) {
            matrix[spec.name][spec.value].validCombinations[otherSpec.name] = [];
          }
          
          if (!matrix[spec.name][spec.value].validCombinations[otherSpec.name].includes(otherSpec.value)) {
            matrix[spec.name][spec.value].validCombinations[otherSpec.name].push(otherSpec.value);
          }
        }
      });
    });
  });
  
  return matrix;
}

/**
 * Given current selections, calculates which options should be
 * available, disabled, or selected for each attribute
 */
export function calculateAttributeAvailability(
  matrix: AttributeCombinationMatrix,
  selectedOptions: Record<string, string>,
  allAttributes: Record<string, string[]>
): AttributeAvailability {
  return calculateAttributeAvailabilityWithInventory(
    matrix,
    selectedOptions,
    allAttributes,
    [], // Empty items array for backward compatibility
    false // Inventory not considered
  );
}

/**
 * Enhanced version that considers inventory when determining availability
 * Phase 3C: Inventory-aware attribute selection
 */
export function calculateAttributeAvailabilityWithInventory(
  matrix: AttributeCombinationMatrix,
  selectedOptions: Record<string, string>,
  allAttributes: Record<string, string[]>,
  items: Item[],
  inventoryAware: boolean = false
): AttributeAvailability {
  const availability: AttributeAvailability = {};
  
  // Initialize all attributes as available
  Object.entries(allAttributes).forEach(([attrName, values]) => {
    availability[attrName] = {};
    values.forEach(value => {
      availability[attrName][value] = {
        isAvailable: true,
        isSelected: selectedOptions[attrName] === value,
        hasStock: true,
        inventoryCount: 0
      };
    });
  });
  
  // If no selections made, calculate availability for all options
  if (Object.keys(selectedOptions).length === 0) {
    if (inventoryAware) {
      // Calculate inventory for each attribute value
      Object.entries(allAttributes).forEach(([attrName, values]) => {
        values.forEach(value => {
          const relevantItems = items.filter(item =>
            item.itemDefiningSpecificationValues.some(spec =>
              spec.name === attrName && spec.value === value
            )
          );
          
          const totalInventory = relevantItems.reduce((sum, item) => sum + (item.inventoryQuantity || 0), 0);
          const hasStock = relevantItems.some(item => item.isInStock && (item.inventoryQuantity || 0) > 0);
          
          availability[attrName][value].hasStock = hasStock;
          availability[attrName][value].inventoryCount = totalInventory;
          availability[attrName][value].isAvailable = hasStock; // Disable if no stock
        });
      });
    }
    return availability;
  }
  
  // For ALL attributes and values, determine availability based on selections
  Object.entries(allAttributes).forEach(([attrName, values]) => {
    values.forEach(value => {
      // Check if this value is compatible with selections from OTHER attributes
      const otherSelections = Object.entries(selectedOptions).filter(([attr]) => attr !== attrName);
      
      // If no other selections exist, this value is available
      if (otherSelections.length === 0) {
        if (inventoryAware) {
          // Calculate inventory for this single attribute value
          const relevantItems = items.filter(item =>
            item.itemDefiningSpecificationValues.some(spec =>
              spec.name === attrName && spec.value === value
            )
          );
          
          const totalInventory = relevantItems.reduce((sum, item) => sum + (item.inventoryQuantity || 0), 0);
          const hasStock = relevantItems.some(item => item.isInStock && (item.inventoryQuantity || 0) > 0);
          
          availability[attrName][value].hasStock = hasStock;
          availability[attrName][value].inventoryCount = totalInventory;
          availability[attrName][value].isAvailable = hasStock;
        } else {
          availability[attrName][value].isAvailable = true;
        }
        return;
      }
      
      // Check if this value is compatible with all selections from other attributes
      const isCompatible = otherSelections.every(([selectedAttr, selectedValue]) => {
        const matrixEntry = matrix[selectedAttr]?.[selectedValue];
        if (!matrixEntry) return false;
        
        const validValues = matrixEntry.validCombinations[attrName] || [];
        return validValues.includes(value);
      });
      
      if (!isCompatible) {
        availability[attrName][value].isAvailable = false;
        availability[attrName][value].hasStock = false;
        availability[attrName][value].inventoryCount = 0;
        return;
      }
      
      // If inventory aware, check if this combination has stock
      if (inventoryAware) {
        // Find items that match this potential selection combination
        const testSelection = { ...selectedOptions, [attrName]: value };
        const matchingItems = items.filter(item => {
          return Object.entries(testSelection).every(([selAttr, selValue]) => {
            return item.itemDefiningSpecificationValues.some(spec =>
              spec.name === selAttr && spec.value === selValue
            );
          });
        });
        
        const totalInventory = matchingItems.reduce((sum, item) => sum + (item.inventoryQuantity || 0), 0);
        const hasStock = matchingItems.some(item => item.isInStock && (item.inventoryQuantity || 0) > 0);
        
        availability[attrName][value].hasStock = hasStock;
        availability[attrName][value].inventoryCount = totalInventory;
        availability[attrName][value].isAvailable = hasStock; // Only available if has stock
      } else {
        availability[attrName][value].isAvailable = true;
      }
    });
  });
  
  return availability;
}

/**
 * Validates current selections and removes invalid ones,
 * optionally auto-selecting valid alternatives
 */
export function validateAndCleanSelections(
  selections: Record<string, string>,
  matrix: AttributeCombinationMatrix
): Record<string, string> {
  const validSelections: Record<string, string> = {};
  
  // First pass: keep selections that have valid combinations
  Object.entries(selections).forEach(([attrName, value]) => {
    if (matrix[attrName]?.[value]) {
      validSelections[attrName] = value;
    }
  });
  
  // Second pass: remove selections that conflict with others
  Object.entries(validSelections).forEach(([attrName, value]) => {
    const isValid = Object.entries(validSelections).every(([otherAttr, otherValue]) => {
      if (otherAttr === attrName) return true;
      
      const matrixEntry = matrix[attrName]?.[value];
      if (!matrixEntry) return false;
      
      const validValues = matrixEntry.validCombinations[otherAttr] || [];
      return validValues.includes(otherValue);
    });
    
    if (!isValid) {
      delete validSelections[attrName];
    }
  });
  
  return validSelections;
}

/**
 * Handle cases where no valid combinations exist
 * Returns the first valid combination found
 */
export function getDefaultSelections(
  matrix: AttributeCombinationMatrix,
  allAttributes: Record<string, string[]>
): Record<string, string> {
  const defaults: Record<string, string> = {};
  
  // Find the first valid combination
  for (const [attrName, values] of Object.entries(allAttributes)) {
    for (const value of values) {
      if (matrix[attrName]?.[value]) {
        defaults[attrName] = value;
        break;
      }
    }
    
    if (defaults[attrName]) break;
  }
  
  return defaults;
}

/**
 * Check if a specific combination of attributes is valid
 */
export function isValidCombination(
  selections: Record<string, string>,
  matrix: AttributeCombinationMatrix
): boolean {
  if (Object.keys(selections).length === 0) return true;
  
  return Object.entries(selections).every(([attrName, value]) => {
    const matrixEntry = matrix[attrName]?.[value];
    if (!matrixEntry) return false;
    
    // Check if all other selected attributes are valid for this one
    return Object.entries(selections).every(([otherAttr, otherValue]) => {
      if (otherAttr === attrName) return true;
      
      const validValues = matrixEntry.validCombinations[otherAttr] || [];
      return validValues.includes(otherValue);
    });
  });
}

/**
 * Get all valid items for a given set of selections
 */
export function getValidItemsForSelections(
  selections: Record<string, string>,
  matrix: AttributeCombinationMatrix
): string[] {
  if (Object.keys(selections).length === 0) return [];
  
  // Start with items from the first selection
  const [firstAttr, firstValue] = Object.entries(selections)[0];
  let validItems = matrix[firstAttr]?.[firstValue]?.availableItems || [];
  
  // Intersect with items from other selections
  Object.entries(selections).slice(1).forEach(([attrName, value]) => {
    const itemsForSelection = matrix[attrName]?.[value]?.availableItems || [];
    validItems = validItems.filter(itemId => itemsForSelection.includes(itemId));
  });
  
  return validItems;
}
