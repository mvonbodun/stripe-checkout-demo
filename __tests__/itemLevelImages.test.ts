import { describe, test, expect } from '@jest/globals';
import { getItemForImages, getImagesForDisplay } from '../app/utils/attributeHelpers';
import { Product } from '../app/models/product';
import { Item } from '../app/models/item';

describe('Item-Level Images Logic', () => {
  // Mock product with Color as itemDefiningSpecification
  const productWithColor: Product = {
    id: 'prod_test',
    name: 'Test Product',
    slug: 'test-product',
    categoryId: 'cat_1',
    itemDefiningSpecifications: [
      { name: 'Color', displayName: 'Color' },
      { name: 'Storage', displayName: 'Storage' }
    ],
    images: [
      { id: 'prod_img_1', url: 'product-image.jpg', altText: 'Product Image', type: 'image', order: 1 }
    ]
  } as Product;

  // Mock product without Color
  const productWithoutColor: Product = {
    id: 'prod_test2',
    name: 'Test Product 2',
    slug: 'test-product-2',
    categoryId: 'cat_1',
    itemDefiningSpecifications: [
      { name: 'Size', displayName: 'Size' }
    ],
    images: [
      { id: 'prod_img_2', url: 'product-image-2.jpg', altText: 'Product Image 2', type: 'image', order: 1 }
    ]
  } as Product;

  // Mock items
  const redItem: Item = {
    id: 'item_red',
    productId: 'prod_test',
    sku: 'TEST-RED',
    name: 'Test Product - Red',
    price: 100,
    position: 1,
    itemDefiningSpecificationValues: [
      { name: 'Color', value: 'Red', displayName: 'Red' },
      { name: 'Storage', value: '128GB', displayName: '128 GB' }
    ],
    images: [
      { id: 'red_img_1', url: 'red-image.jpg', altText: 'Red Image', type: 'image', order: 1 }
    ]
  } as Item;

  const blueItem: Item = {
    id: 'item_blue',
    productId: 'prod_test',
    sku: 'TEST-BLUE',
    name: 'Test Product - Blue',
    price: 100,
    position: 2,
    itemDefiningSpecificationValues: [
      { name: 'Color', value: 'Blue', displayName: 'Blue' },
      { name: 'Storage', value: '128GB', displayName: '128 GB' }
    ],
    images: [
      { id: 'blue_img_1', url: 'blue-image.jpg', altText: 'Blue Image', type: 'image', order: 1 }
    ]
  } as Item;

  const smallItem: Item = {
    id: 'item_small',
    productId: 'prod_test2',
    sku: 'TEST2-SMALL',
    name: 'Test Product 2 - Small',
    price: 50,
    position: 1,
    itemDefiningSpecificationValues: [
      { name: 'Size', value: 'Small', displayName: 'Small' }
    ],
    images: [
      { id: 'small_img_1', url: 'small-image.jpg', altText: 'Small Image', type: 'image', order: 1 }
    ]
  } as Item;

  test('Single item: returns that item', () => {
    const result = getItemForImages(productWithColor, [redItem], {});
    expect(result).toBe(redItem);
  });

  test('Multiple items, no Color attribute: returns first item by position', () => {
    const result = getItemForImages(productWithoutColor, [smallItem], {});
    expect(result).toBe(smallItem);
  });

  test('Multiple items with Color, no selection: returns first item with first color', () => {
    // Mock the getAvailableSpecificationValues to return color values
    jest.mock('../app/models/item', () => ({
      ...jest.requireActual('../app/models/item'),
      getAvailableSpecificationValues: jest.fn(() => ['Red', 'Blue'])
    }));

    const result = getItemForImages(productWithColor, [blueItem, redItem], {});
    expect(result).toBe(redItem); // First item with first color (Red)
  });

  test('Multiple items with Color, specific color selected: returns item with that color', () => {
    const result = getItemForImages(productWithColor, [redItem, blueItem], { Color: 'Blue' });
    expect(result).toBe(blueItem);
  });

  test('getImagesForDisplay: uses item images when available', () => {
    const result = getImagesForDisplay(redItem, productWithColor);
    expect(result).toBe(redItem.images);
  });

  test('getImagesForDisplay: falls back to product images when item has no images', () => {
    const itemWithoutImages = { ...redItem, images: [] };
    const result = getImagesForDisplay(itemWithoutImages, productWithColor);
    expect(result).toBe(productWithColor.images);
  });

  test('getImagesForDisplay: handles null item', () => {
    const result = getImagesForDisplay(null, productWithColor);
    expect(result).toBe(productWithColor.images);
  });
});
