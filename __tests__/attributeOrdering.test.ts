import { describe, it, expect } from '@jest/globals';
import { getAttributesForProduct } from '../app/utils/attributeHelpers';
import { Product } from '../app/models/product';
import { Item } from '../app/models/item';
import { Status } from '../app/models/common';

describe('Attribute UX Ordering', () => {
  describe('Attribute ordering (Color first, then alphabetical)', () => {
    it('should place Color attribute first', () => {
      const mockProduct: Product = {
        id: 'test-product',
        name: 'Test Product',
        slug: 'test-product',
        description: 'Test',
        shortDescription: 'Test',
        sku: 'TEST',
        price: 2999,
        compareAtPrice: undefined,
        categoryIds: ['2'],
        images: [],
        status: Status.ACTIVE,
        isInStock: true,
        isLowStock: false,
        inventoryQuantity: 10,
        inventoryTracking: true,
        lowStockThreshold: 5,
        position: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        itemDefiningSpecifications: [
          { name: 'Size', group: 'Physical' },
          { name: 'Color', group: 'Appearance' },
          { name: 'Material', group: 'Physical' }
        ]
      };

      const mockItems: Item[] = [
        {
          id: 'item1',
          productId: 'test-product',
          sku: 'TEST-1',
          name: 'Test Item 1',
          price: 2999,
          status: Status.ACTIVE,
          isInStock: true,
          isLowStock: false,
          inventoryQuantity: 5,
          inventoryTracking: true,
          lowStockThreshold: 2,
          position: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          itemDefiningSpecificationValues: [
            { name: 'Size', value: 'M', displayName: 'Medium' },
            { name: 'Color', value: 'Red', displayName: 'Red' },
            { name: 'Material', value: 'Cotton', displayName: 'Cotton' }
          ],
          images: []
        }
      ];

      const attributes = getAttributesForProduct(mockProduct, mockItems);
      const attributeKeys = Object.keys(attributes);
      
      // Color should be first
      expect(attributeKeys[0]).toBe('Color');
      
      // Other attributes should be alphabetical
      const nonColorAttributes = attributeKeys.slice(1);
      const sortedNonColorAttributes = [...nonColorAttributes].sort();
      expect(nonColorAttributes).toEqual(sortedNonColorAttributes);
    });
  });

  describe('Value sorting by attribute type', () => {
    it('should sort color values alphabetically', () => {
      const mockProduct: Product = {
        id: 'test-product',
        name: 'Test Product',
        slug: 'test-product',
        description: 'Test',
        shortDescription: 'Test',
        sku: 'TEST',
        price: 2999,
        compareAtPrice: null,
        categoryIds: ['2'],
        images: [],
        status: Status.ACTIVE,
        isInStock: true,
        isLowStock: false,
        inventoryQuantity: 10,
        inventoryTracking: true,
        lowStockThreshold: 5,
        position: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        itemDefiningSpecifications: [{ name: 'Color', displayName: 'Color' }]
      };

      const mockItems: Item[] = [
        {
          id: 'item1',
          productId: 'test-product',
          sku: 'TEST-1',
          name: 'Test Item 1',
          price: 2999,
          status: Status.ACTIVE,
          isInStock: true,
          isLowStock: false,
          inventoryQuantity: 5,
          inventoryTracking: true,
          lowStockThreshold: 2,
          position: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          itemDefiningSpecificationValues: [
            { name: 'Color', value: 'Red', displayName: 'Red' }
          ],
          images: []
        },
        {
          id: 'item2',
          productId: 'test-product',
          sku: 'TEST-2',
          name: 'Test Item 2',
          price: 2999,
          status: Status.ACTIVE,
          isInStock: true,
          isLowStock: false,
          inventoryQuantity: 5,
          inventoryTracking: true,
          lowStockThreshold: 2,
          position: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          itemDefiningSpecificationValues: [
            { name: 'Color', value: 'Blue', displayName: 'Blue' }
          ],
          images: []
        },
        {
          id: 'item3',
          productId: 'test-product',
          sku: 'TEST-3',
          name: 'Test Item 3',
          price: 2999,
          status: Status.ACTIVE,
          isInStock: true,
          isLowStock: false,
          inventoryQuantity: 5,
          inventoryTracking: true,
          lowStockThreshold: 2,
          position: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
          itemDefiningSpecificationValues: [
            { name: 'Color', value: 'Green', displayName: 'Green' }
          ],
          images: []
        }
      ];

      const attributes = getAttributesForProduct(mockProduct, mockItems);
      expect(attributes.Color).toEqual(['Blue', 'Green', 'Red']);
    });

    it('should sort numeric size values by number', () => {
      const mockProduct: Product = {
        id: 'test-product',
        name: 'Test Product',
        slug: 'test-product',
        description: 'Test',
        shortDescription: 'Test',
        sku: 'TEST',
        price: 2999,
        compareAtPrice: null,
        categoryIds: ['2'],
        images: [],
        status: Status.ACTIVE,
        isInStock: true,
        isLowStock: false,
        inventoryQuantity: 10,
        inventoryTracking: true,
        lowStockThreshold: 5,
        position: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        itemDefiningSpecifications: [{ name: 'Size', displayName: 'Size' }]
      };

      const mockItems: Item[] = [
        {
          id: 'item1',
          productId: 'test-product',
          sku: 'TEST-1',
          name: 'Test Item 1',
          price: 2999,
          status: Status.ACTIVE,
          isInStock: true,
          isLowStock: false,
          inventoryQuantity: 5,
          inventoryTracking: true,
          lowStockThreshold: 2,
          position: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          itemDefiningSpecificationValues: [
            { name: 'Size', value: '12', displayName: '12' }
          ],
          images: []
        },
        {
          id: 'item2',
          productId: 'test-product',
          sku: 'TEST-2',
          name: 'Test Item 2',
          price: 2999,
          status: Status.ACTIVE,
          isInStock: true,
          isLowStock: false,
          inventoryQuantity: 5,
          inventoryTracking: true,
          lowStockThreshold: 2,
          position: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          itemDefiningSpecificationValues: [
            { name: 'Size', value: '6', displayName: '6' }
          ],
          images: []
        },
        {
          id: 'item3',
          productId: 'test-product',
          sku: 'TEST-3',
          name: 'Test Item 3',
          price: 2999,
          status: Status.ACTIVE,
          isInStock: true,
          isLowStock: false,
          inventoryQuantity: 5,
          inventoryTracking: true,
          lowStockThreshold: 2,
          position: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
          itemDefiningSpecificationValues: [
            { name: 'Size', value: '10', displayName: '10' }
          ],
          images: []
        }
      ];

      const attributes = getAttributesForProduct(mockProduct, mockItems);
      expect(attributes.Size).toEqual(['6', '10', '12']);
    });

    it('should sort storage values by capacity', () => {
      const mockProduct: Product = {
        id: 'test-product',
        name: 'Test Product',
        slug: 'test-product',
        description: 'Test',
        shortDescription: 'Test',
        sku: 'TEST',
        price: 2999,
        compareAtPrice: null,
        categoryIds: ['121'],
        images: [],
        status: Status.ACTIVE,
        isInStock: true,
        isLowStock: false,
        inventoryQuantity: 10,
        inventoryTracking: true,
        lowStockThreshold: 5,
        position: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        itemDefiningSpecifications: [{ name: 'Storage', displayName: 'Storage' }]
      };

      const mockItems: Item[] = [
        {
          id: 'item1',
          productId: 'test-product',
          sku: 'TEST-1',
          name: 'Test Item 1',
          price: 2999,
          status: Status.ACTIVE,
          isInStock: true,
          isLowStock: false,
          inventoryQuantity: 5,
          inventoryTracking: true,
          lowStockThreshold: 2,
          position: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          itemDefiningSpecificationValues: [
            { name: 'Storage', value: '1TB', displayName: '1TB' }
          ],
          images: []
        },
        {
          id: 'item2',
          productId: 'test-product',
          sku: 'TEST-2',
          name: 'Test Item 2',
          price: 2999,
          status: Status.ACTIVE,
          isInStock: true,
          isLowStock: false,
          inventoryQuantity: 5,
          inventoryTracking: true,
          lowStockThreshold: 2,
          position: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          itemDefiningSpecificationValues: [
            { name: 'Storage', value: '256GB', displayName: '256GB' }
          ],
          images: []
        },
        {
          id: 'item3',
          productId: 'test-product',
          sku: 'TEST-3',
          name: 'Test Item 3',
          price: 2999,
          status: Status.ACTIVE,
          isInStock: true,
          isLowStock: false,
          inventoryQuantity: 5,
          inventoryTracking: true,
          lowStockThreshold: 2,
          position: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
          itemDefiningSpecificationValues: [
            { name: 'Storage', value: '512GB', displayName: '512GB' }
          ],
          images: []
        }
      ];

      const attributes = getAttributesForProduct(mockProduct, mockItems);
      expect(attributes.Storage).toEqual(['256GB', '512GB', '1TB']);
    });
  });
});
