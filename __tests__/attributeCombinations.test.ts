import {
  buildAttributeCombinationMatrix,
  calculateAttributeAvailability,
  validateAndCleanSelections,
  isValidCombination,
  getValidItemsForSelections,
  AttributeCombinationMatrix
} from '../app/utils/attributeCombinations';

import {
  getAttributesForProduct,
  findClosestOption,
  hasAvailableItems,
  getAllAttributeNames
} from '../app/utils/attributeHelpers';

import { Item } from '../app/models/item';
import { Product } from '../app/models/product';
import { Status } from '../app/models/common';

// Mock data for testing - MacBook Pro scenario
const mockMacBookItems: Item[] = [
  {
    id: 'item_mbp_space_gray_512',
    productId: 'prod_macbook',
    sku: 'MBP-SG-512',
    name: 'MacBook Pro 14" Space Gray 512GB',
    price: 199900,
    inventoryQuantity: 10,
    inventoryTracking: true,
    status: Status.ACTIVE,
    itemDefiningSpecificationValues: [
      { name: 'Color', value: 'Space Gray', displayName: 'Space Gray' },
      { name: 'Storage', value: '512GB', displayName: '512 GB SSD' }
    ],
    images: [],
    position: 1,
    isInStock: true,
    isLowStock: false,
    lowStockThreshold: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'item_mbp_space_gray_1tb',
    productId: 'prod_macbook',
    sku: 'MBP-SG-1TB',
    name: 'MacBook Pro 14" Space Gray 1TB',
    price: 239900,
    inventoryQuantity: 5,
    inventoryTracking: true,
    status: Status.ACTIVE,
    itemDefiningSpecificationValues: [
      { name: 'Color', value: 'Space Gray', displayName: 'Space Gray' },
      { name: 'Storage', value: '1TB', displayName: '1 TB SSD' }
    ],
    images: [],
    position: 2,
    isInStock: true,
    isLowStock: false,
    lowStockThreshold: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'item_mbp_silver_512',
    productId: 'prod_macbook',
    sku: 'MBP-S-512',
    name: 'MacBook Pro 14" Silver 512GB',
    price: 199900,
    inventoryQuantity: 8,
    inventoryTracking: true,
    status: Status.ACTIVE,
    itemDefiningSpecificationValues: [
      { name: 'Color', value: 'Silver', displayName: 'Silver' },
      { name: 'Storage', value: '512GB', displayName: '512 GB SSD' }
    ],
    images: [],
    position: 3,
    isInStock: true,
    isLowStock: false,
    lowStockThreshold: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const mockMacBookProduct: Product = {
  id: 'prod_macbook',
  name: 'MacBook Pro 14"',
  slug: 'macbook-pro-14',
  description: 'Apple MacBook Pro 14-inch',
  brand: 'Apple',
  categoryId: '121',
  categoryIds: ['121'],
  basePrice: 199900,
  taxCode: 'P0000000',
  status: Status.ACTIVE,
  features: ['M3 Pro chip', 'Retina display'],
  productLevelSpecifications: [],
  totalInventory: 23,
  itemDefiningSpecifications: [
    { name: 'Color', group: 'Appearance' },
    { name: 'Storage', group: 'Capacity' }
  ],
  images: [],
  seoTitle: 'MacBook Pro 14"',
  seoDescription: 'Apple MacBook Pro 14-inch',
  createdAt: new Date(),
  updatedAt: new Date()
};

describe('Phase 1: Attribute Combination Logic', () => {
  
  describe('buildAttributeCombinationMatrix', () => {
    it('should build correct matrix for MacBook Pro scenario', () => {
      const matrix = buildAttributeCombinationMatrix('prod_macbook', mockMacBookItems);
      
      // Test Color -> Storage combinations
      expect(matrix.Color['Space Gray'].validCombinations.Storage).toContain('512GB');
      expect(matrix.Color['Space Gray'].validCombinations.Storage).toContain('1TB');
      expect(matrix.Color['Silver'].validCombinations.Storage).toContain('512GB');
      expect(matrix.Color['Silver'].validCombinations.Storage).not.toContain('1TB');
      
      // Test Storage -> Color combinations
      expect(matrix.Storage['512GB'].validCombinations.Color).toContain('Space Gray');
      expect(matrix.Storage['512GB'].validCombinations.Color).toContain('Silver');
      expect(matrix.Storage['1TB'].validCombinations.Color).toContain('Space Gray');
      expect(matrix.Storage['1TB'].validCombinations.Color).not.toContain('Silver');
      
      // Test available items
      expect(matrix.Color['Space Gray'].availableItems).toContain('item_mbp_space_gray_512');
      expect(matrix.Color['Space Gray'].availableItems).toContain('item_mbp_space_gray_1tb');
      expect(matrix.Color['Silver'].availableItems).toContain('item_mbp_silver_512');
      expect(matrix.Color['Silver'].availableItems).not.toContain('item_mbp_space_gray_1tb');
    });
  });
  
  describe('calculateAttributeAvailability', () => {
    let matrix: AttributeCombinationMatrix;
    let allAttributes: Record<string, string[]>;
    
    beforeEach(() => {
      matrix = buildAttributeCombinationMatrix('prod_macbook', mockMacBookItems);
      allAttributes = {
        Color: ['Space Gray', 'Silver'],
        Storage: ['512GB', '1TB']
      };
    });
    
    it('should show all options available when no selection made', () => {
      const availability = calculateAttributeAvailability(matrix, {}, allAttributes);
      
      expect(availability.Color['Space Gray'].isAvailable).toBe(true);
      expect(availability.Color['Silver'].isAvailable).toBe(true);
      expect(availability.Storage['512GB'].isAvailable).toBe(true);
      expect(availability.Storage['1TB'].isAvailable).toBe(true);
    });
    
    it('should limit storage options when Silver is selected', () => {
      const selections = { Color: 'Silver' };
      const availability = calculateAttributeAvailability(matrix, selections, allAttributes);
      
      expect(availability.Storage['512GB'].isAvailable).toBe(true);
      expect(availability.Storage['1TB'].isAvailable).toBe(false);
      expect(availability.Color['Silver'].isSelected).toBe(true);
    });
    
    it('should limit color options when 1TB is selected', () => {
      const selections = { Storage: '1TB' };
      const availability = calculateAttributeAvailability(matrix, selections, allAttributes);
      
      expect(availability.Color['Space Gray'].isAvailable).toBe(true);
      expect(availability.Color['Silver'].isAvailable).toBe(false);
      expect(availability.Storage['1TB'].isSelected).toBe(true);
    });
    
    it('should show valid combination when both attributes selected', () => {
      const selections = { Color: 'Space Gray', Storage: '512GB' };
      const availability = calculateAttributeAvailability(matrix, selections, allAttributes);
      
      expect(availability.Color['Space Gray'].isSelected).toBe(true);
      expect(availability.Storage['512GB'].isSelected).toBe(true);
    });
  });
  
  describe('validateAndCleanSelections', () => {
    let matrix: AttributeCombinationMatrix;
    
    beforeEach(() => {
      matrix = buildAttributeCombinationMatrix('prod_macbook', mockMacBookItems);
    });
    
    it('should keep valid selections unchanged', () => {
      const selections = { Color: 'Space Gray', Storage: '512GB' };
      const cleaned = validateAndCleanSelections(selections, matrix);
      
      expect(cleaned).toEqual(selections);
    });
    
    it('should remove invalid selections', () => {
      const selections = { Color: 'Silver', Storage: '1TB' }; // Invalid combination
      const cleaned = validateAndCleanSelections(selections, matrix);
      
      // Should remove one of the conflicting selections
      expect(Object.keys(cleaned).length).toBeLessThan(2);
    });
    
    it('should handle non-existent attribute values', () => {
      const selections = { Color: 'Gold', Storage: '512GB' }; // Gold doesn't exist
      const cleaned = validateAndCleanSelections(selections, matrix);
      
      expect(cleaned.Color).toBeUndefined();
      expect(cleaned.Storage).toBe('512GB');
    });
  });
  
  describe('isValidCombination', () => {
    let matrix: AttributeCombinationMatrix;
    
    beforeEach(() => {
      matrix = buildAttributeCombinationMatrix('prod_macbook', mockMacBookItems);
    });
    
    it('should return true for valid combinations', () => {
      expect(isValidCombination({ Color: 'Space Gray', Storage: '512GB' }, matrix)).toBe(true);
      expect(isValidCombination({ Color: 'Space Gray', Storage: '1TB' }, matrix)).toBe(true);
      expect(isValidCombination({ Color: 'Silver', Storage: '512GB' }, matrix)).toBe(true);
    });
    
    it('should return false for invalid combinations', () => {
      expect(isValidCombination({ Color: 'Silver', Storage: '1TB' }, matrix)).toBe(false);
    });
    
    it('should return true for empty selections', () => {
      expect(isValidCombination({}, matrix)).toBe(true);
    });
    
    it('should return true for single valid selections', () => {
      expect(isValidCombination({ Color: 'Space Gray' }, matrix)).toBe(true);
      expect(isValidCombination({ Storage: '1TB' }, matrix)).toBe(true);
    });
  });
  
  describe('getValidItemsForSelections', () => {
    let matrix: AttributeCombinationMatrix;
    
    beforeEach(() => {
      matrix = buildAttributeCombinationMatrix('prod_macbook', mockMacBookItems);
    });
    
    it('should return correct items for single selection', () => {
      const items = getValidItemsForSelections({ Color: 'Space Gray' }, matrix);
      expect(items).toContain('item_mbp_space_gray_512');
      expect(items).toContain('item_mbp_space_gray_1tb');
      expect(items).not.toContain('item_mbp_silver_512');
    });
    
    it('should return correct item for complete selection', () => {
      const items = getValidItemsForSelections({ Color: 'Silver', Storage: '512GB' }, matrix);
      expect(items).toEqual(['item_mbp_silver_512']);
    });
    
    it('should return empty array for invalid combination', () => {
      const items = getValidItemsForSelections({ Color: 'Silver', Storage: '1TB' }, matrix);
      expect(items).toEqual([]);
    });
  });
  
  describe('Helper Functions', () => {
    describe('getAttributesForProduct', () => {
      it('should extract attributes from product specifications', () => {
        const attributes = getAttributesForProduct(mockMacBookProduct, mockMacBookItems);
        
        expect(attributes.Color).toContain('Space Gray');
        expect(attributes.Color).toContain('Silver');
        expect(attributes.Storage).toContain('512GB');
        expect(attributes.Storage).toContain('1TB');
      });
    });
    
    describe('findClosestOption', () => {
      it('should find closest matching option', () => {
        const options = ['Space Gray', 'Silver', 'Gold'];
        
        expect(findClosestOption('Gray', options)).toBe('Space Gray');
        expect(findClosestOption('Silver Metallic', options)).toBe('Silver');
      });
      
      it('should return first option when no close match', () => {
        const options = ['Red', 'Blue'];
        expect(findClosestOption('Yellow', options)).toBe('Red');
      });
      
      it('should return null for empty options', () => {
        expect(findClosestOption('Any', [])).toBe(null);
      });
    });
    
    describe('hasAvailableItems', () => {
      it('should return true when items match selections', () => {
        expect(hasAvailableItems({ Color: 'Space Gray' }, mockMacBookItems)).toBe(true);
        expect(hasAvailableItems({ Color: 'Silver', Storage: '512GB' }, mockMacBookItems)).toBe(true);
      });
      
      it('should return false when no items match selections', () => {
        expect(hasAvailableItems({ Color: 'Gold' }, mockMacBookItems)).toBe(false);
        expect(hasAvailableItems({ Color: 'Silver', Storage: '1TB' }, mockMacBookItems)).toBe(false);
      });
      
      it('should return true for empty selections when items exist', () => {
        expect(hasAvailableItems({}, mockMacBookItems)).toBe(true);
      });
    });
    
    describe('getAllAttributeNames', () => {
      it('should return all unique attribute names from items', () => {
        const names = getAllAttributeNames(mockMacBookItems);
        expect(names).toContain('Color');
        expect(names).toContain('Storage');
        expect(names).toHaveLength(2);
      });
    });
  });
});

describe('Bug Fix: Bidirectional Availability Calculation', () => {
    it('should gray out Silver when Space Gray + 1TB are selected (MacBook scenario)', () => {
      const matrix = buildAttributeCombinationMatrix('prod_macbook', mockMacBookItems);
      const allAttributes = getAttributesForProduct(mockMacBookProduct, mockMacBookItems);
      
      // Select Space Gray + 1TB (valid combination)
      const selections = { Color: 'Space Gray', Storage: '1TB' };
      const availability = calculateAttributeAvailability(matrix, selections, allAttributes);
      
      // Silver should be unavailable because Silver + 1TB is not a valid combination
      expect(availability.Color.Silver.isAvailable).toBe(false);
      expect(availability.Color.Silver.isSelected).toBe(false);
      
      // Space Gray should remain available and selected
      expect(availability.Color['Space Gray'].isAvailable).toBe(true);
      expect(availability.Color['Space Gray'].isSelected).toBe(true);
      
      // 1TB should remain available and selected
      expect(availability.Storage['1TB'].isAvailable).toBe(true);
      expect(availability.Storage['1TB'].isSelected).toBe(true);
      
      // 512GB should remain available (works with both colors)
      expect(availability.Storage['512GB'].isAvailable).toBe(true);
      expect(availability.Storage['512GB'].isSelected).toBe(false);
    });

    it('should gray out 1TB when Silver + 512GB are selected (MacBook scenario)', () => {
      const matrix = buildAttributeCombinationMatrix('prod_macbook', mockMacBookItems);
      const allAttributes = getAttributesForProduct(mockMacBookProduct, mockMacBookItems);
      
      // Select Silver + 512GB (valid combination)
      const selections = { Color: 'Silver', Storage: '512GB' };
      const availability = calculateAttributeAvailability(matrix, selections, allAttributes);
      
      // 1TB should be unavailable because Silver + 1TB is not a valid combination
      expect(availability.Storage['1TB'].isAvailable).toBe(false);
      expect(availability.Storage['1TB'].isSelected).toBe(false);
      
      // Space Gray should remain available (works with both storage options)
      expect(availability.Color['Space Gray'].isAvailable).toBe(true);
      expect(availability.Color['Space Gray'].isSelected).toBe(false);
      
      // Silver should remain available and selected
      expect(availability.Color.Silver.isAvailable).toBe(true);
      expect(availability.Color.Silver.isSelected).toBe(true);
      
      // 512GB should remain available and selected
      expect(availability.Storage['512GB'].isAvailable).toBe(true);
      expect(availability.Storage['512GB'].isSelected).toBe(true);
    });

    it('should handle iPhone scenario with Natural Titanium + 512GB selection', () => {
      // Create mock iPhone data
      const mockiPhoneItems: Item[] = [
        {
          id: 'item_iphone_natural_128',
          productId: 'prod_iphone',
          sku: 'IP-NT-128',
          name: 'iPhone 15 Pro Natural Titanium 128GB',
          price: 99900,
          inventoryQuantity: 10,
          inventoryTracking: true,
          status: Status.ACTIVE,
          itemDefiningSpecificationValues: [
            { name: 'Color', value: 'Natural Titanium', displayName: 'Natural Titanium' },
            { name: 'Storage', value: '128GB', displayName: '128 GB' }
          ],
          images: [],
          position: 1,
          isInStock: true,
          isLowStock: false,
          lowStockThreshold: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'item_iphone_natural_512',
          productId: 'prod_iphone',
          sku: 'IP-NT-512',
          name: 'iPhone 15 Pro Natural Titanium 512GB',
          price: 129900,
          inventoryQuantity: 5,
          inventoryTracking: true,
          status: Status.ACTIVE,
          itemDefiningSpecificationValues: [
            { name: 'Color', value: 'Natural Titanium', displayName: 'Natural Titanium' },
            { name: 'Storage', value: '512GB', displayName: '512 GB' }
          ],
          images: [],
          position: 2,
          isInStock: true,
          isLowStock: false,
          lowStockThreshold: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'item_iphone_blue_128',
          productId: 'prod_iphone',
          sku: 'IP-BT-128',
          name: 'iPhone 15 Pro Blue Titanium 128GB',
          price: 99900,
          inventoryQuantity: 8,
          inventoryTracking: true,
          status: Status.ACTIVE,
          itemDefiningSpecificationValues: [
            { name: 'Color', value: 'Blue Titanium', displayName: 'Blue Titanium' },
            { name: 'Storage', value: '128GB', displayName: '128 GB' }
          ],
          images: [],
          position: 3,
          isInStock: true,
          isLowStock: false,
          lowStockThreshold: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      const mockiPhoneProduct: Product = {
        id: 'prod_iphone',
        name: 'iPhone 15 Pro',
        slug: 'iphone-15-pro',
        description: 'Latest iPhone',
        brand: 'Apple',
        categoryId: 'cat_phones',
        categoryIds: ['cat_phones'],
        basePrice: 99900,
        taxCode: 'P0000000',
        status: Status.ACTIVE,
        features: ['A17 Pro chip', 'Titanium design'],
        productLevelSpecifications: [],
        totalInventory: 23,
        itemDefiningSpecifications: [
          { name: 'Color', group: 'Appearance' },
          { name: 'Storage', group: 'Capacity' }
        ],
        images: [],
        seoTitle: 'iPhone 15 Pro',
        seoDescription: 'Latest iPhone',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const matrix = buildAttributeCombinationMatrix('prod_iphone', mockiPhoneItems);
      const allAttributes = getAttributesForProduct(mockiPhoneProduct, mockiPhoneItems);
      
      // Select Natural Titanium + 512GB (valid combination)
      const selections = { Color: 'Natural Titanium', Storage: '512GB' };
      const availability = calculateAttributeAvailability(matrix, selections, allAttributes);
      
      // Blue Titanium should be unavailable because Blue Titanium + 512GB is not a valid combination
      expect(availability.Color['Blue Titanium'].isAvailable).toBe(false);
      expect(availability.Color['Blue Titanium'].isSelected).toBe(false);
      
      // Natural Titanium should remain available and selected
      expect(availability.Color['Natural Titanium'].isAvailable).toBe(true);
      expect(availability.Color['Natural Titanium'].isSelected).toBe(true);
      
      // 512GB should remain available and selected
      expect(availability.Storage['512GB'].isAvailable).toBe(true);
      expect(availability.Storage['512GB'].isSelected).toBe(true);
      
      // 128GB should remain available (works with both colors)
      expect(availability.Storage['128GB'].isAvailable).toBe(true);
      expect(availability.Storage['128GB'].isSelected).toBe(false);
    });
  });
