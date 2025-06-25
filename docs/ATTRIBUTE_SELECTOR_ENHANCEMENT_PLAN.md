# Enhanced Interactive Attribute Selector Implementation Plan

## Overview

This document outlines a comprehensive plan to enhance the current `AttributeSelector.tsx` component to handle valid attribute combinations properly, similar to professional e-commerce sites like Dick's Sporting Goods.

## Current State Analysis

### Problems with Current Implementation

1. **Independent Attribute Display**: The current `AttributeSelector` component shows all available values for each attribute independently using `getAvailableSpecificationValues()`, without considering valid combinations.

2. **Invalid Combinations Allowed**: Users can select combinations that don't exist in the inventory. For example:
   - MacBook Pro 14" in Space Gray: available in 512GB and 1TB storage
   - MacBook Pro 14" in Silver: only available in 512GB storage
   - Currently, both storage options show regardless of color selection

3. **No Visual Feedback**: There's no indication when certain combinations are invalid or unavailable.

### Current Data Structure

```typescript
// Products have itemDefiningSpecifications that define what attributes exist
product.itemDefiningSpecifications = [
  { name: 'Color', displayName: 'Color' },
  { name: 'Storage', displayName: 'Storage' }
]

// Items have itemDefiningSpecificationValues with actual values
item.itemDefiningSpecificationValues = [
  { name: 'Storage', value: '512GB', displayName: '512 GB SSD' },
  { name: 'Color', value: 'Space Gray', displayName: 'Space Gray' }
]
```

## Implementation Plan

### Phase 1: Core Data Structure & Logic

#### 1.1 Create Attribute Combination Matrix Builder

**File**: `app/utils/attributeCombinations.ts`

```typescript
interface AttributeCombinationMatrix {
  [attributeName: string]: {
    [attributeValue: string]: {
      validCombinations: Record<string, string[]>;
      availableItems: string[]; // item IDs
    }
  }
}

interface AttributeAvailability {
  [attributeName: string]: {
    [attributeValue: string]: {
      isAvailable: boolean;
      isSelected: boolean;
    }
  }
}

interface AttributeState {
  allAttributes: Record<string, string[]>;
  combinationMatrix: AttributeCombinationMatrix;
  currentAvailability: AttributeAvailability;
}
```

#### 1.2 Build Valid Combinations Function

```typescript
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
```

#### 1.3 Dynamic Availability Calculator

```typescript
/**
 * Given current selections, calculates which options should be
 * available, disabled, or selected for each attribute
 */
export function calculateAttributeAvailability(
  matrix: AttributeCombinationMatrix,
  selectedOptions: Record<string, string>,
  allAttributes: Record<string, string[]>
): AttributeAvailability {
  const availability: AttributeAvailability = {};
  
  // Initialize all attributes as available
  Object.entries(allAttributes).forEach(([attrName, values]) => {
    availability[attrName] = {};
    values.forEach(value => {
      availability[attrName][value] = {
        isAvailable: true,
        isSelected: selectedOptions[attrName] === value
      };
    });
  });
  
  // If no selections made, all options are available
  if (Object.keys(selectedOptions).length === 0) {
    return availability;
  }
  
  // For each unselected attribute, determine availability based on selections
  Object.entries(allAttributes).forEach(([attrName, values]) => {
    if (!selectedOptions[attrName]) {
      values.forEach(value => {
        // Check if this value is compatible with all current selections
        const isCompatible = Object.entries(selectedOptions).every(([selectedAttr, selectedValue]) => {
          if (selectedAttr === attrName) return true;
          
          const matrixEntry = matrix[selectedAttr]?.[selectedValue];
          if (!matrixEntry) return false;
          
          const validValues = matrixEntry.validCombinations[attrName] || [];
          return validValues.includes(value);
        });
        
        availability[attrName][value].isAvailable = isCompatible;
      });
    }
  });
  
  return availability;
}
```

### Phase 2: Enhanced AttributeSelector Component

#### 2.1 Enhanced Props and State

```typescript
interface AttributeSelectorProps {
  product: Product;
  items: Item[]; // Add items to props
  selectedOptions: Record<string, string>;
  onOptionsChange: (options: Record<string, string>) => void;
}

interface AttributeOption {
  value: string;
  displayName?: string;
  isAvailable: boolean;
  isSelected: boolean;
}
```

#### 2.2 Component Logic Enhancement

```typescript
export default function AttributeSelector({ 
  product, 
  items,
  selectedOptions, 
  onOptionsChange 
}: AttributeSelectorProps) {
  const [attributeState, setAttributeState] = useState<AttributeState | null>(null);
  
  // Build combination matrix when component mounts or items change
  useEffect(() => {
    if (items.length === 0) {
      setAttributeState(null);
      return;
    }
    
    const allAttributes = getAttributesForProduct(product, items);
    const combinationMatrix = buildAttributeCombinationMatrix(product.id, items);
    const currentAvailability = calculateAttributeAvailability(
      combinationMatrix, 
      selectedOptions, 
      allAttributes
    );
    
    setAttributeState({
      allAttributes,
      combinationMatrix,
      currentAvailability
    });
  }, [items, product.id]);
  
  // Recalculate availability when selections change
  useEffect(() => {
    if (!attributeState) return;
    
    const newAvailability = calculateAttributeAvailability(
      attributeState.combinationMatrix,
      selectedOptions,
      attributeState.allAttributes
    );
    
    setAttributeState(prev => prev ? {
      ...prev,
      currentAvailability: newAvailability
    } : null);
  }, [selectedOptions, attributeState?.combinationMatrix, attributeState?.allAttributes]);
  
  // Enhanced option change handler with validation
  const handleOptionChange = (attributeName: string, value: string) => {
    if (!attributeState) return;
    
    const availability = attributeState.currentAvailability[attributeName]?.[value];
    if (!availability?.isAvailable) return; // Don't allow selection of unavailable options
    
    const newOptions = { ...selectedOptions, [attributeName]: value };
    
    // Check if this selection makes other current selections invalid
    const updatedOptions = validateAndCleanSelections(
      newOptions,
      attributeState.combinationMatrix,
      attributeState.allAttributes
    );
    
    onOptionsChange(updatedOptions);
  };
```

#### 2.3 Enhanced Visual States

```typescript
const getOptionClassName = (
  attributeName: string, 
  option: string, 
  availability: AttributeAvailability
) => {
  const state = availability[attributeName]?.[option];
  
  if (!state) return '';
  
  const baseClasses = 'px-4 py-2 border rounded-md text-sm font-medium transition-all duration-200';
  
  if (state.isSelected) {
    return `${baseClasses} bg-blue-600 text-white border-blue-600`;
  }
  
  if (!state.isAvailable) {
    return `${baseClasses} bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50`;
  }
  
  return `${baseClasses} bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 cursor-pointer`;
};
```

#### 2.4 Smart Selection Validation

```typescript
/**
 * Validates current selections and removes invalid ones,
 * optionally auto-selecting valid alternatives
 */
function validateAndCleanSelections(
  selections: Record<string, string>,
  matrix: AttributeCombinationMatrix,
  allAttributes: Record<string, string[]>
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
```

### Phase 3: Component Integration

#### 3.1 Enhanced ProductInfo Component

```typescript
// In ProductInfo.tsx
export default function ProductInfo({ product, items }: ProductInfoProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  
  // Build attribute state once
  const attributeState = useMemo(() => {
    if (items.length === 0) return null;
    
    const allAttributes = getAttributesForProduct(product, items);
    const combinationMatrix = buildAttributeCombinationMatrix(product.id, items);
    
    return { allAttributes, combinationMatrix };
  }, [product, items]);
  
  // Handle enhanced option changes
  const handleOptionsChange = useCallback((newOptions: Record<string, string>) => {
    setSelectedOptions(newOptions);
    
    // Find matching item
    const foundItem = findItemBySpecificationValues(product.id, newOptions);
    setSelectedItem(foundItem || null);
  }, [product.id]);
  
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* ... existing content ... */}
      
      <div className="border-t pt-4 sm:pt-6">
        <AttributeSelector 
          product={product}
          items={items}
          selectedOptions={selectedOptions}
          onOptionsChange={handleOptionsChange}
        />
      </div>
      
      {/* ... rest of component ... */}
    </div>
  );
}
```

#### 3.2 Error Handling and Edge Cases

```typescript
// Handle cases where no valid combinations exist
const getDefaultSelections = (
  matrix: AttributeCombinationMatrix,
  allAttributes: Record<string, string[]>
): Record<string, string> => {
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
};
```

### Phase 4: User Experience Enhancements

#### 4.1 Loading and Transition States

```typescript
// Add loading state while calculating combinations
const [isCalculating, setIsCalculating] = useState(false);

// Show loading indicator during complex calculations
{isCalculating && (
  <div className="flex items-center space-x-2 text-sm text-gray-500">
    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
    <span>Updating available options...</span>
  </div>
)}
```

#### 4.2 Accessibility Enhancements

```typescript
// Enhanced button with accessibility features
<button
  key={option}
  onClick={() => handleOptionChange(attributeName, option)}
  disabled={!state.isAvailable}
  aria-pressed={state.isSelected}
  aria-describedby={!state.isAvailable ? `${attributeName}-${option}-unavailable` : undefined}
  className={getOptionClassName(attributeName, option, availability)}
  title={!state.isAvailable ? 'Not available with current selection' : undefined}
>
  {option}
</button>

{/* Hidden description for screen readers */}
{!state.isAvailable && (
  <span 
    id={`${attributeName}-${option}-unavailable`} 
    className="sr-only"
  >
    {option} is not available with your current selection
  </span>
)}
```

#### 4.3 Advanced Features

```typescript
// Smart auto-selection when options become invalid
const handleInvalidSelection = useCallback((
  invalidAttr: string,
  invalidValue: string,
  matrix: AttributeCombinationMatrix
) => {
  // Find the closest valid option
  const validOptions = Object.keys(matrix[invalidAttr] || {});
  const closestOption = findClosestOption(invalidValue, validOptions);
  
  if (closestOption) {
    const newOptions = { ...selectedOptions, [invalidAttr]: closestOption };
    onOptionsChange(newOptions);
  }
}, [selectedOptions, onOptionsChange]);

// Visual feedback for selection changes
const [recentlyChanged, setRecentlyChanged] = useState<string | null>(null);

useEffect(() => {
  if (recentlyChanged) {
    const timer = setTimeout(() => setRecentlyChanged(null), 1000);
    return () => clearTimeout(timer);
  }
}, [recentlyChanged]);
```

## Implementation Priority

### High Priority (Core Functionality)
1. ✅ **Combination Matrix Builder** - COMPLETED ✅
   - Created `app/utils/attributeCombinations.ts` with core interfaces and logic
   - Implemented `buildAttributeCombinationMatrix()` function
   - Handles MacBook Pro scenario (Space Gray + 512GB/1TB, Silver + 512GB only)

2. ✅ **Dynamic Availability Calculator** - COMPLETED ✅  
   - Implemented `calculateAttributeAvailability()` function
   - Properly calculates which options are available based on current selections
   - Handles bidirectional logic (Color→Storage and Storage→Color)

3. ✅ **Selection Validation** - COMPLETED ✅
   - Implemented `validateAndCleanSelections()` function
   - Validates combinations and removes invalid selections
   - Added `isValidCombination()` helper for checking specific combinations

4. ✅ **Helper Utilities** - COMPLETED ✅
   - Created `app/utils/attributeHelpers.ts` with supporting functions
   - Enhanced `getAttributesForProduct()` to work with actual item data
   - Added similarity matching for smart selection fallbacks
   - Included debugging utilities for development

5. ⏳ **Enhanced AttributeSelector** - PENDING (Phase 2)
6. ⏳ **Integration with ProductInfo** - PENDING (Phase 2)  
7. ⏳ **Basic Visual States** - PENDING (Phase 2)

### Medium Priority (UX Improvements)
1. 🔄 **Smart Defaults & Auto-selection** - Handle invalid selections gracefully
2. 🔄 **Smooth Transitions** - Better visual feedback during changes
3. 🔄 **Error Handling** - Edge cases and no-valid-combinations scenarios
4. 🔄 **Loading States** - Show feedback during calculations

### Lower Priority (Polish & Performance)
1. ⏳ **Performance Optimizations** - Memoization, efficient re-renders
2. ⏳ **Advanced Visual Features** - Animations, enhanced transitions
3. ⏳ **Accessibility Enhancements** - Screen readers, keyboard navigation
4. ⏳ **Analytics Integration** - Track user behavior and optimize

## Testing Strategy

### Unit Tests
- Test combination matrix builder with various item configurations
- Test availability calculator with different selection scenarios
- Test selection validation and cleanup logic

### Integration Tests
- Test AttributeSelector with real product data
- Test ProductInfo integration and state synchronization
- Test edge cases (no items, single item, all combinations invalid)

### User Acceptance Tests
- Test the MacBook Pro scenario (Space Gray + 1TB, Silver + 512GB only)
- Test multi-attribute products (3+ attributes)
- Test user flow: select Color → Storage options update → select Storage → Color options update

## Expected Benefits

1. **Professional UX** - Matches industry-standard e-commerce experiences
2. **Prevents Invalid Selections** - Users can't select non-existent combinations
3. **Intuitive Behavior** - Options naturally become available/unavailable
4. **Scalable Architecture** - Works with 2, 3, or more attributes  
5. **Performance Conscious** - Efficient calculations and minimal re-renders
6. **Maintainable Code** - Clear separation of concerns and reusable utilities

## Files to Create/Modify

### New Files Created in Phase 1
- ✅ `app/utils/attributeCombinations.ts` - Core logic and data structures (155 lines)
- ✅ `app/utils/attributeHelpers.ts` - Helper functions and utilities (195 lines)  
- ✅ `__tests__/attributeCombinations.test.ts` - Comprehensive unit tests (332 lines)
- ✅ `verify-phase1.mjs` - Verification script for testing (93 lines)

### Modified Files
- ✅ `docs/ATTRIBUTE_SELECTOR_ENHANCEMENT_PLAN.md` - Updated with Phase 1 completion status

### Total Code Added: ~775 lines of production-ready TypeScript code with tests

### Modified Files
- `app/components/AttributeSelector.tsx` - Enhanced component with combination logic
- `app/components/ProductInfo.tsx` - Integration with enhanced AttributeSelector
- `app/components/ProductInfoMobile.tsx` - Mobile version updates
- `app/components/ProductInfoMobileBottom.tsx` - Mobile bottom section updates

### Test Files  
- `__tests__/attributeCombinations.test.ts` - Unit tests for core logic
- `test/attributeSelector.integration.test.ts` - Integration tests
- `__tests__/productAttributeFlow.test.ts` - End-to-end user flow tests

This comprehensive plan will transform the attribute selector into a professional, user-friendly component that prevents invalid selections and provides excellent user experience.

## ✅ Phase 1 Implementation Complete

**Status**: COMPLETED ✅  
**Date**: June 25, 2025

### What Was Implemented

#### Core Data Structures (`app/utils/attributeCombinations.ts`)
- ✅ `AttributeCombinationMatrix` interface - Maps attributes to valid combinations
- ✅ `AttributeAvailability` interface - Tracks availability and selection state
- ✅ `AttributeState` interface - Complete state management structure

#### Core Functions
- ✅ `buildAttributeCombinationMatrix()` - Analyzes items and builds combination matrix
- ✅ `calculateAttributeAvailability()` - Determines available options based on selections
- ✅ `validateAndCleanSelections()` - Validates and cleans invalid combinations
- ✅ `isValidCombination()` - Checks if a specific combination is valid
- ✅ `getValidItemsForSelections()` - Returns valid items for given selections
- ✅ `getDefaultSelections()` - Gets default valid combination

#### Helper Utilities (`app/utils/attributeHelpers.ts`)
- ✅ Enhanced `getAttributesForProduct()` - Works with actual item data
- ✅ `getAttributeDisplayName()` - Gets display names from item specifications
- ✅ `findClosestOption()` - Smart matching for invalid selections
- ✅ `hasAvailableItems()` - Checks item availability for selections
- ✅ `getAllAttributeNames()` - Extracts all attribute names from items
- ✅ `debugCombinationMatrix()` - Development debugging utility

#### Testing & Validation
- ✅ Comprehensive unit tests created (`__tests__/attributeCombinations.test.ts`)
- ✅ MacBook Pro scenario fully tested (Space Gray + 512GB/1TB vs Silver + 512GB)
- ✅ All TypeScript compilation checks pass
- ✅ Bidirectional logic verified (Color→Storage and Storage→Color)

### Key Accomplishments

1. **Solved the Core Problem**: The combination matrix properly handles the MacBook Pro scenario where:
   - Space Gray is available in 512GB and 1TB
   - Silver is only available in 512GB
   - Selecting Silver disables 1TB option
   - Selecting 1TB disables Silver option

2. **Scalable Architecture**: The system works with any number of attributes and combinations, not just the 2-attribute MacBook example.

3. **Performance Optimized**: Matrix is built once and calculations are efficient.

4. **Type Safe**: Full TypeScript support with proper interfaces and type checking.

5. **Well Tested**: Comprehensive test coverage for all core functionality.

### Ready for Phase 2

The foundation is now complete and ready for:
- Enhanced AttributeSelector component
- Integration with ProductInfo components  
- Visual state management (available/disabled/selected styling)
- User experience enhancements

All core business logic is implemented and tested. Phase 2 will focus on the user interface layer.
